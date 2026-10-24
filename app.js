/* TCP Decision Tree Trainer: application logic (no build step, no framework) */
(function(){
'use strict';

// ---------- helpers ----------
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => (n<0?'-':'') + Math.abs(Math.round(n)).toLocaleString('en-US');
const pct = (a,b) => b ? Math.round(100*a/b) : 0;
const pad = n => String(n).padStart(2,'0');
const localISO = (d=new Date()) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const shuffle = a => { const x=a.slice(); for(let i=x.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; };
const LETTERS = ['A','B','C','D'];
const ENTITY_CLASS = {'C Corp':'c','S Corp':'s','Partnership':'p','Comparison':'x','Individual':'i','Property':'r'};
const TREE_META = {
  c_contrib_owner:['C Corp','Contribution','Owner'], c_contrib_entity:['C Corp','Contribution','Entity'],
  c_nonliq_owner:['C Corp','Nonliquidating','Owner'], c_nonliq_entity:['C Corp','Nonliquidating','Entity'],
  c_liq_owner:['C Corp','Liquidation','Owner'], c_liq_entity:['C Corp','Liquidation','Entity'],
  s_contrib_owner:['S Corp','Contribution','Owner'], s_contrib_entity:['S Corp','Contribution','Entity'],
  s_nonliq_owner:['S Corp','Nonliquidating','Owner'], s_nonliq_entity:['S Corp','Nonliquidating','Entity'],
  s_liq_owner:['S Corp','Liquidation','Owner'], s_liq_entity:['S Corp','Liquidation','Entity'],
  p_contrib_owner:['Partnership','Contribution','Owner'], p_contrib_entity:['Partnership','Contribution','Entity'],
  p_nonliq_owner:['Partnership','Nonliquidating','Owner'], p_nonliq_entity:['Partnership','Nonliquidating','Entity'],
  p_liq_owner:['Partnership','Liquidation','Owner'], p_liq_entity:['Partnership','Liquidation','Entity']
};
const treeLabel = k => TREE_META[k] ? `${TREE_META[k][0]} · ${TREE_META[k][1]} · ${TREE_META[k][2]} side` : k;

// ---------- data ----------
const BANK = (window.TCP_QUESTIONS || []).filter(q => q && q.id);
const BY_ID = Object.fromEntries(BANK.map(q => [q.id, q]));
const MODULES = [...new Set(BANK.map(q => q.module))].sort();
const TOPICS = [...new Set(BANK.map(q => q.topic))];
const PLAN = window.TCP_PLAN || {days:[], ranking:[], traps:[]};

// ---------- store ----------
const KEY = 'tcp.trainer.v1';
const DEFAULT_SETTINGS = {examDate:'2026-10-29', setSize:25, timer:true, secPerQ:90, apiKey:'', model:'claude-sonnet-5-5', effort:'medium', includeCheatSheet:true, recall:false, shuffleChoices:false};
const store = {
  data: null,
  load(){
    let d = null; try{ d = JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){}
    d = d || {};
    d.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings||{});
    d.attempts = d.attempts || [];
    d.missLog = d.missLog || [];
    d.planDone = d.planDone || {};
    d.session = d.session || null;
    this.data = d; return d;
  },
  save(){ try{ localStorage.setItem(KEY, JSON.stringify(this.data)); }catch(e){ toast('Could not save progress (storage blocked).'); } }
};
store.load();
const S = () => store.data.settings;

// ---------- stats ----------
function groupStats(keyFn){
  const m = {};
  for(const a of store.data.attempts){ const q = BY_ID[a.id]; if(!q) continue; const k = keyFn(q); if(k==null) continue; (m[k] = m[k] || {n:0,c:0}); m[k].n++; if(a.correct) m[k].c++; }
  return m;
}
function lastAttempt(id){ for(let i=store.data.attempts.length-1;i>=0;i--){ if(store.data.attempts[i].id===id) return store.data.attempts[i]; } return null; }
function topicStatus(st){ if(!st || !st.n) return 'untested'; const p = pct(st.c, st.n); return p<70 ? 'weak' : p<85 ? 'mid' : 'good'; }
function weakTopics(){
  const ts = groupStats(q => q.topic);
  return TOPICS.map(t => ({topic:t, st: ts[t]||{n:0,c:0}, status: topicStatus(ts[t])}))
    .filter(x => x.status==='weak' || x.status==='mid')
    .sort((a,b) => pct(a.st.c,a.st.n) - pct(b.st.c,b.st.n) || b.st.n - a.st.n);
}
function missedIds(){ const seen = new Set(); const out = []; for(let i=store.data.attempts.length-1;i>=0;i--){ const a = store.data.attempts[i]; if(seen.has(a.id)) continue; seen.add(a.id); if(!a.correct && BY_ID[a.id]) out.push(a.id); } return out; }
function openMisses(){ return missedIds().length; }
function streakDays(){
  const days = new Set(store.data.attempts.map(a => a.ts.slice(0,10)));
  let n = 0; const d = new Date(); if(!days.has(localISO(d))) d.setDate(d.getDate()-1);
  while(days.has(localISO(d))){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function daysToExam(){
  const [y,m,d] = S().examDate.split('-').map(Number);
  const exam = new Date(y, m-1, d); const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((exam - today)/86400000);
}
function progressSummary(){
  const total = store.data.attempts.length, correct = store.data.attempts.filter(a=>a.correct).length;
  const weak = weakTopics().slice(0,6).map(w => `${w.topic} (${pct(w.st.c,w.st.n)}% of ${w.st.n})`);
  const ms = groupStats(q => q.module);
  const mods = Object.keys(ms).sort().map(k => `${k} ${pct(ms[k].c, ms[k].n)}% of ${ms[k].n}`);
  return `Zach's progress in the trainer: ${total} questions answered, ${pct(correct,total)}% correct, ${openMisses()} open misses, ${daysToExam()} days to the exam.` +
    (mods.length ? `\nBy module: ${mods.join('; ')}.` : '') +
    (weak.length ? `\nWeakest topics: ${weak.join('; ')}.` : '\nNo weak topics identified yet.');
}

// ---------- grading ----------
function parseNum(s){
  s = String(s).trim().replace(/[$,\s]/g,''); if(!s) return null;
  let neg = false;
  if(/^\(.*\)$/.test(s)){ neg = true; s = s.slice(1,-1); }
  if(s.startsWith('-')){ neg = !neg; s = s.slice(1); }
  s = s.replace(/%$/,'');
  if(/^\d+(\.\d+)?k$/i.test(s)) s = String(parseFloat(s)*1000);
  const v = parseFloat(s); if(isNaN(v)) return null; return neg ? -v : v;
}
function norm(s){ return String(s).toLowerCase().replace(/[^a-z0-9%$ ]+/g,' ').replace(/\b(a|an|the|is|are|it|of|to|as|be)\b/g,' ').replace(/\s+/g,' ').trim(); }
function gradeText(given, q){
  const g = norm(given); if(!g) return false;
  const cands = [q.answer, ...(q.accept||[])].map(norm).filter(Boolean);
  return cands.some(c => g===c || (c.length>=4 && g.includes(c)) || (c.length>=6 && c.includes(g) && g.length >= Math.ceil(c.length*0.6)));
}
function grade(q, given){
  if(q.type==='mcq') return given === q.answer;
  if(q.type==='numeric'){ const v = parseNum(given); if(v==null) return false; const tol = q.tolerance ?? 0; const cands = [q.answer, ...(q.accept||[])]; return cands.some(c => Math.abs(v - c) <= tol + 1e-9); }
  return gradeText(given, q);
}
function answerText(q){
  if(q.type==='mcq') return LETTERS[q.answer]+'. '+q.choices[q.answer];
  if(q.type==='numeric') return (q.unit==='$'?'$':'') + fmt(q.answer) + (q.unit==='%'?'%':'');
  return q.answer;
}

// ---------- miss log ----------
function logMiss(q, given, session){
  const entry = { ts: new Date().toISOString(), date: localISO(), module: q.module, qid: q.id, topic: q.topic, why: q.trap || '', rule: q.rule || '', given: String(given ?? ''), answer: answerText(q), source:'trainer', mode: session ? session.label : '' };
  store.data.missLog.push(entry); store.save();
}
function missCountFor(id){ return store.data.missLog.filter(m => m.qid===id).length; }

// ---------- toast ----------
let toastT; function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('show'), 2600); }

// ---------- router ----------
const view = () => $('#view');
function route(){
  const hash = location.hash.replace(/^#/,'') || 'dashboard';
  const [path, query] = hash.split('?');
  const [name, arg] = path.split('/');
  const params = Object.fromEntries(new URLSearchParams(query||''));
  if(name==='start'){ startPreset(decodeURIComponent(arg||'mixed')); return; }
  $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.nav===name || (name==='quiz'||name==='results') && a.dataset.nav==='practice' || name==='cheatsheet' && a.dataset.nav==='plan'));
  const crumbs = {dashboard:'Dashboard', trees:'Decision Trees', practice:'Practice', quiz:'Practice <b>· set in progress</b>', results:'Practice <b>· results</b>', misslog:'Miss Log', plan:'Study Plan', cheatsheet:'Study Plan <b>· cheat sheet</b>', settings:'Settings'};
  $('#crumbs').innerHTML = crumbs[name] || 'Dashboard';
  const views = {dashboard:renderDashboard, trees:renderTrees, practice:renderPractice, quiz:renderQuiz, results:renderResults, misslog:renderMissLog, plan:renderPlan, cheatsheet:renderCheatSheet, settings:renderSettings};
  (views[name] || renderDashboard)(arg, params);
  updateChrome();
  window.scrollTo({top:0});
}
function updateChrome(){
  const d = daysToExam();
  $('#countdown-num').textContent = d;
  $('#countdown-label').textContent = d===1 ? 'day to exam' : d<0 ? 'days since exam' : 'days to exam';
  const chip = $('#exam-chip'); if(chip) chip.textContent = `${d} day${d===1?'':'s'} to exam`;
  const mb = $('#nav-miss-badge'); const om = openMisses(); mb.hidden = !om; mb.textContent = om;
  const pb = $('#nav-practice-badge'); const ses = store.data.session; pb.hidden = !(ses && !ses.done); pb.textContent = 'resume';
  if(window.TCPChat) window.TCPChat.updateBadge();
}

// ---------- dashboard ----------
function renderDashboard(){
  const total = store.data.attempts.length, correct = store.data.attempts.filter(a=>a.correct).length;
  const ms = groupStats(q => q.module);
  const ts = groupStats(q => q.topic);
  const weak = weakTopics().slice(0,8);
  const today = PLAN.days.find(d => d.date === localISO());
  const d = daysToExam();
  const ses = store.data.session;
  const recentMisses = missedIds().slice(0,5).map(id => BY_ID[id]);
  view().innerHTML = `
  <div class="hero">
    <div>
      <div class="eyebrow">TCP · Becker 1.4 · 2026 law</div>
      <h1>${d>0 ? `${d} day${d===1?'':'s'} to Thursday` : d===0 ? 'Exam day' : 'After the exam'}</h1>
      <p>Entity transaction decision trees, an original Becker-style bank of ${BANK.length} questions, a miss log in your format, and a Claude tutor that sees the question you are working on.</p>
    </div>
    <div class="row">
      ${ses && !ses.done ? `<a class="btn btn-accent btn-lg" href="#quiz">Resume set (${ses.i+1}/${ses.ids.length})</a>` : `<button class="btn btn-accent btn-lg" data-start="mixed">Start a 25-question set</button>`}
      <a class="btn btn-lg" href="#trees">Open the trees</a>
    </div>
  </div>

  <div class="grid grid-4" style="margin-bottom:16px">
    <div class="card pad-sm stat"><span class="stat-num">${total}</span><span class="stat-label">questions answered</span><span class="stat-sub">${correct} correct</span></div>
    <div class="card pad-sm stat"><span class="stat-num">${total?pct(correct,total)+'%':'–'}</span><span class="stat-label">overall accuracy</span><span class="stat-sub">target 75% first attempt</span></div>
    <div class="card pad-sm stat"><span class="stat-num">${openMisses()}</span><span class="stat-label">open misses</span><span class="stat-sub">${store.data.missLog.length} miss log entries</span></div>
    <div class="card pad-sm stat"><span class="stat-num">${streakDays()}</span><span class="stat-label">day streak</span><span class="stat-sub">${BANK.length - new Set(store.data.attempts.map(a=>a.id)).size} questions unseen</span></div>
  </div>

  ${beckerSignalHtml(false)}

  <div class="grid grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-head"><h3>Quick start</h3><span class="faint">sets of 25 or fewer</span></div>
      <div class="quick-grid">
        <button class="quick" data-start="mixed"><span class="q-ico">◆</span><strong>Mixed set</strong><span>${S().setSize} questions across every topic</span></button>
        <button class="quick" data-start="weak"><span class="q-ico">⚑</span><strong>Weak topics</strong><span>${weak.length ? weak.length+' weak or shaky topics' : 'Builds from untested topics until you have data'}</span></button>
        <button class="quick" data-start="missed" ${openMisses()?'':'disabled'}><span class="q-ico">↺</span><strong>Redo misses</strong><span>${openMisses()} open misses</span></button>
        <button class="quick" data-start="writein"><span class="q-ico">✎</span><strong>Write-in drill</strong><span>Numeric and short-answer only</span></button>
        <button class="quick entity-c" data-start="C Corp"><span class="q-ico">C</span><strong>C corporation trees</strong><span>T2 M2 formation, E&amp;P, redemptions, liquidation</span></button>
        <button class="quick entity-s" data-start="S Corp"><span class="q-ico">S</span><strong>S corporation trees</strong><span>T3 M1 basis order, AAA, property distributions</span></button>
        <button class="quick entity-p" data-start="Partnership"><span class="q-ico">P</span><strong>Partnership trees</strong><span>T3 M2 and M3 outside basis, distributions, 751, 754</span></button>
        <button class="quick" data-start="Comparison"><span class="q-ico">⇄</span><strong>Entity comparison</strong><span>T3 M4 side-by-side rows</span></button>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h3>Today's plan</h3><a class="btn btn-sm btn-ghost" href="#plan">Full plan</a></div>
      ${today ? `<div class="stack" style="gap:8px">${today.blocks.map((b,i)=>{ const k=today.date+':'+i; const done=!!store.data.planDone[k]; return `<label class="task ${done?'done':''}"><input type="checkbox" data-plan="${k}" ${done?'checked':''}><span class="t">${esc(b.t)}${b.sub?`<small>${esc(b.sub)}</small>`:''}</span>${b.link?`<a class="btn btn-sm" href="${esc(b.link)}">Go</a>`:''}</label>`; }).join('')}</div>`
             : `<div class="empty">No plan item for ${localISO()}. The plan runs ${PLAN.days[0]?.date || ''} to ${PLAN.days[PLAN.days.length-1]?.date || ''}.</div>`}
    </div>
  </div>

  <div class="grid grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-head"><h3>Accuracy by module</h3><span class="faint">${Object.keys(ms).length} of ${MODULES.length} modules attempted</span></div>
      ${MODULES.length ? `<div class="bar-list">${MODULES.map(m => { const st = ms[m]; const p = st ? pct(st.c, st.n) : 0; const cls = !st ? '' : p<70?'bad':p<85?'warn':'ok'; return `<div class="bar-item"><span class="lbl" title="${esc(m)}">${esc(m)} <span class="faint">${moduleName(m)}</span></span><div class="progress ${cls}"><span style="width:${st?p:0}%"></span></div><span class="val">${st?`${p}% · ${st.n}`:'–'}</span></div>`; }).join('')}</div>` : '<div class="empty">No questions loaded.</div>'}
    </div>
    <div class="card">
      <div class="card-head"><h3>Weak topics</h3><span class="faint">under 85% first</span></div>
      ${weak.length ? `<div class="list">${weak.map(w => `<div class="list-item"><div><div class="ttl">${esc(w.topic)}</div><div class="sub">${pct(w.st.c,w.st.n)}% of ${w.st.n} · ${esc(moduleFor(w.topic))}</div></div><button class="btn btn-sm" data-topic="${esc(w.topic)}">Drill</button></div>`).join('')}</div>`
                   : `<div class="empty">Answer a few sets and the weakest topics surface here, ranked by accuracy.</div>`}
    </div>
  </div>

  <div class="card">
    <div class="card-head"><h3>Topic heat map</h3><span class="faint">${TOPICS.length} topics · green 85%+, amber 70 to 84, red under 70</span></div>
    <div class="heat">${TOPICS.map(t => { const st = ts[t]; const status = topicStatus(st); return `<button class="heat-cell ${status}" data-topic="${esc(t)}" title="${esc(t)}"><b>${esc(shortTopic(t))}</b><span class="faint">${st ? `${pct(st.c,st.n)}% · ${st.n}` : 'untested'}</span></button>`; }).join('')}</div>
  </div>

  ${recentMisses.length ? `<div class="card" style="margin-top:16px"><div class="card-head"><h3>Recent misses</h3><a class="btn btn-sm btn-ghost" href="#misslog">Miss log</a></div><div class="list">${recentMisses.map(q => `<div class="list-item"><div><div class="ttl">${esc(q.id)} · ${esc(q.topic)}</div><div class="sub">${esc(q.rule)}</div></div><button class="btn btn-sm" data-redo="${esc(q.id)}">Retry</button></div>`).join('')}</div></div>` : ''}
  `;
  bindStarts(view());
}
function moduleName(m){ const names = {'T1 M1':'Compliance & planning','T1 M2':'Loss limitations','T1 M3':'Gift tax & charity','T1 M4':'Financial planning','T2 M1':'NOLs & capital losses','T2 M2':'Entity/owner transactions','T2 M3':'Consolidated returns','T2 M4':'International','T2 M5':'Corporate planning','T3 M1':'S corporations','T3 M2':'Partnerships','T3 M3':'Partnership liquidation','T3 M4':'Entity choice','T3 M5':'Trusts','T3 M6':'Exempt organizations','T4 M1':'Nontaxable dispositions','T4 M2':'Business property','T4 M3':'Related parties'}; return names[m] || ''; }
function moduleFor(topic){ const q = BANK.find(x => x.topic===topic); return q ? q.module : ''; }
function shortTopic(t){ return t.length > 34 ? t.slice(0,32)+'…' : t; }
function bindStarts(root){
  root.addEventListener('click', e => {
    const s = e.target.closest('[data-start]'); if(s){ startPreset(s.dataset.start); return; }
    const t = e.target.closest('[data-topic]'); if(t){ startSession({label:'Topic: '+t.dataset.topic, filter:q => q.topic===t.dataset.topic}); return; }
    const r = e.target.closest('[data-redo]'); if(r){ startSession({label:'Retry '+r.dataset.redo, ids:[r.dataset.redo]}); return; }
    const tr = e.target.closest('[data-tree]'); if(tr){ startSession({label:treeLabel(tr.dataset.tree), filter:q => q.tree===tr.dataset.tree}); return; }
  });
  root.addEventListener('change', e => { const c = e.target.closest('[data-plan]'); if(c){ store.data.planDone[c.dataset.plan] = c.checked; store.save(); c.closest('.task').classList.toggle('done', c.checked); } });
}
const PRESET_ALIAS = {ccorp:'C Corp', scorp:'S Corp', partnership:'Partnership', comparison:'Comparison', property:'Property', individual:'Individual'};
function startPreset(kind){
  kind = PRESET_ALIAS[kind] || kind;
  const n = S().setSize;
  if(kind==='mixed') return startSession({label:'Mixed set', filter:()=>true, n});
  if(kind==='writein') return startSession({label:'Write-in drill', filter:q=>q.type!=='mcq', n});
  if(kind==='missed') return startSession({label:'Redo misses', ids: missedIds().slice(0,n)});
  if(kind==='weak'){
    const weak = new Set(weakTopics().map(w=>w.topic));
    let pool = BANK.filter(q => weak.has(q.topic));
    if(pool.length < n){ const seen = new Set(store.data.attempts.map(a=>a.id)); pool = pool.concat(BANK.filter(q => !seen.has(q.id) && !weak.has(q.topic))); }
    return startSession({label:'Weak topics', ids: pool.slice(0,n).map(q=>q.id), prefer:'weak'});
  }
  return startSession({label: kind, filter:q => q.entity===kind, n});
}

// ---------- practice setup ----------
let setup = {source:'all', entity:'', module:'', tree:'', types:'both', diff:'', n:S().setSize, timer:S().timer};
function renderPractice(arg, params){
  if(params.tree) setup = Object.assign({}, setup, {source:'tree', tree:params.tree});
  const pool = poolFor(setup);
  const trees = Object.keys(TREE_META);
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Practice</div><h1>Build a set</h1><p>Pick a source and a size. Keep sets at 25 or fewer so accuracy does not slide late in a session, and write a note for every miss.</p></div>
  ${store.data.session && !store.data.session.done ? `<a class="btn btn-accent" href="#quiz">Resume set in progress (${store.data.session.i+1}/${store.data.session.ids.length})</a>` : ''}</div>
  <div class="grid grid-2">
    <div class="card stack">
      <div><div class="eyebrow">Source</div>
        <div class="seg" id="src-seg">${[['all','Everything'],['entity','Entity'],['module','Module'],['tree','Decision tree'],['weak','Weak topics'],['missed','My misses']].map(([k,l])=>`<button type="button" data-src="${k}" class="${setup.source===k?'active':''}">${l}</button>`).join('')}</div>
      </div>
      ${setup.source==='entity' ? `<label class="field">Entity<select class="select" id="f-entity"><option value="">Any</option>${['C Corp','S Corp','Partnership','Comparison','Individual','Property'].map(e=>`<option ${setup.entity===e?'selected':''}>${e}</option>`).join('')}</select></label>` : ''}
      ${setup.source==='module' ? `<label class="field">Becker module<select class="select" id="f-module"><option value="">Any</option>${MODULES.map(m=>`<option value="${m}" ${setup.module===m?'selected':''}>${m} ${moduleName(m)}</option>`).join('')}</select></label>` : ''}
      ${setup.source==='tree' ? `<label class="field">Flow<select class="select" id="f-tree"><option value="">Any flow</option>${trees.map(t=>`<option value="${t}" ${setup.tree===t?'selected':''}>${treeLabel(t)}</option>`).join('')}</select></label>` : ''}
      <div class="field-row">
        <label class="field">Question types<select class="select" id="f-types">${[['both','MCQ and write-in'],['mcq','MCQ only'],['writein','Write-in only (numeric and short answer)']].map(([k,l])=>`<option value="${k}" ${setup.types===k?'selected':''}>${l}</option>`).join('')}</select></label>
        <label class="field">Difficulty<select class="select" id="f-diff"><option value="">All levels</option><option value="1" ${setup.diff==='1'?'selected':''}>1 · Recall</option><option value="2" ${setup.diff==='2'?'selected':''}>2 · Application</option><option value="3" ${setup.diff==='3'?'selected':''}>3 · Analysis</option></select></label>
        <label class="field">Set size<select class="select" id="f-n">${[5,10,15,20,25].map(n=>`<option ${setup.n===n?'selected':''}>${n}</option>`).join('')}</select></label>
      </div>
      <label class="toggle"><input type="checkbox" id="f-timer" ${setup.timer?'checked':''}><span class="tk"></span>Timer (${S().secPerQ} seconds per question, exam pace)</label>
      <div class="row between"><span class="muted">${pool.length} matching question${pool.length===1?'':'s'}</span><button class="btn btn-accent btn-lg" id="btn-start" ${pool.length?'':'disabled'}>Start ${Math.min(setup.n, pool.length)} questions</button></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>What is in the bank</h3><span class="faint">${BANK.length} original questions</span></div>
      <div class="bar-list">${['C Corp','S Corp','Partnership','Comparison','Individual','Property'].map(e => { const n = BANK.filter(q=>q.entity===e).length; return n ? `<div class="bar-item"><span class="lbl">${e}</span><div class="progress"><span style="width:${pct(n,BANK.length)}%"></span></div><span class="val">${n}</span></div>` : ''; }).join('')}</div>
      <hr style="border:0;border-top:1px solid var(--border);margin:14px 0">
      <div class="row"><span class="chip">MCQ ${BANK.filter(q=>q.type==='mcq').length}</span><span class="chip">Numeric ${BANK.filter(q=>q.type==='numeric').length}</span><span class="chip">Short answer ${BANK.filter(q=>q.type==='text').length}</span></div>
      <p class="faint" style="margin-top:12px">Every question maps to a decision tree node where one applies, carries a one-line rule for your miss log, and names the trap it is built around. Explanations follow the Becker chain: answer line, sourced arithmetic, ordering rule, remainder, check.</p>
    </div>
  </div>`;
  const rerender = () => renderPractice();
  $('#src-seg').addEventListener('click', e => { const b = e.target.closest('[data-src]'); if(b){ setup.source = b.dataset.src; rerender(); } });
  const bind = (id, key, fn) => { const el = $(id); if(el) el.addEventListener('change', () => { setup[key] = fn ? fn(el) : el.value; rerender(); }); };
  bind('#f-entity','entity'); bind('#f-module','module'); bind('#f-tree','tree'); bind('#f-types','types'); bind('#f-diff','diff');
  bind('#f-n','n', el => Number(el.value)); bind('#f-timer','timer', el => el.checked);
  $('#btn-start').addEventListener('click', () => startSession({label: labelFor(setup), ids: pool.map(q=>q.id), n: setup.n, timer: setup.timer}));
}
function labelFor(s){ return s.source==='all'?'Mixed set': s.source==='entity'?(s.entity||'All entities'): s.source==='module'?(s.module||'All modules'): s.source==='tree'?(s.tree?treeLabel(s.tree):'All flows'): s.source==='weak'?'Weak topics':'My misses'; }
function poolFor(s){
  let pool = BANK;
  if(s.source==='entity' && s.entity) pool = pool.filter(q=>q.entity===s.entity);
  if(s.source==='module' && s.module) pool = pool.filter(q=>q.module===s.module);
  if(s.source==='tree') pool = pool.filter(q => s.tree ? q.tree===s.tree : !!q.tree);
  if(s.source==='weak'){ const w = new Set(weakTopics().map(x=>x.topic)); pool = pool.filter(q=>w.has(q.topic)); }
  if(s.source==='missed'){ const m = new Set(missedIds()); pool = pool.filter(q=>m.has(q.id)); }
  if(s.types==='mcq') pool = pool.filter(q=>q.type==='mcq'); if(s.types==='writein') pool = pool.filter(q=>q.type!=='mcq');
  if(s.diff) pool = pool.filter(q=>String(q.difficulty)===s.diff);
  return pool;
}

// ---------- session ----------
function startSession(opts){
  let ids = opts.ids ? opts.ids.filter(id=>BY_ID[id]) : BANK.filter(opts.filter||(()=>true)).map(q=>q.id);
  if(!ids.length){ toast('No questions match that selection yet.'); return; }
  const n = opts.n || S().setSize;
  // prefer unseen questions, then least recently seen
  const lastTs = {}; for(const a of store.data.attempts) lastTs[a.id] = a.ts;
  ids = shuffle(ids).sort((a,b) => (lastTs[a]?1:0) - (lastTs[b]?1:0) || (lastTs[a]||'').localeCompare(lastTs[b]||''));
  if(opts.ids && opts.label && /Retry|Redo/.test(opts.label)) ids = shuffle(opts.ids.filter(id=>BY_ID[id]));
  ids = ids.slice(0, n);
  const timer = opts.timer ?? S().timer;
  store.data.session = { label: opts.label || 'Set', ids, i: 0, answers: {}, started: Date.now(), timer, deadline: timer ? Date.now() + ids.length*S().secPerQ*1000 : null, done:false };
  store.save(); location.hash = '#quiz';
}

let timerInt = null;
function renderQuiz(){
  const ses = store.data.session;
  if(!ses || ses.done){ location.hash = ses && ses.done ? '#results' : '#practice'; return; }
  const q = BY_ID[ses.ids[ses.i]];
  if(!q){ ses.done = true; store.save(); location.hash = '#results'; return; }
  const a = ses.answers[q.id];
  const answered = !!a;
  const ec = ENTITY_CLASS[q.entity] || '';
  const prior = missCountFor(q.id);
  view().innerHTML = `
  <div class="quiz-top">
    <div class="quiz-meta">
      <span class="chip chip-accent">${esc(ses.label)}</span>
      <span class="chip">${ses.i+1} / ${ses.ids.length}</span>
      <span class="chip chip-${ec}">${esc(q.entity)}</span>
      <span class="chip chip-soft">${esc(q.module)} ${esc(moduleName(q.module))}</span>
      <span class="chip chip-soft">${q.type==='mcq'?'MCQ':q.type==='numeric'?'Numeric write-in':'Short answer'} · level ${q.difficulty}</span>
      ${prior ? `<span class="chip chip-bad" title="Times missed before">missed ${prior}x</span>` : ''}
    </div>
    <div class="row">${ses.timer ? `<span class="timer" id="timer">--:--</span>` : ''}<button class="btn btn-sm btn-ghost" id="btn-quit">End set</button></div>
  </div>
  <div class="progress" style="margin-bottom:18px"><span style="width:${pct(ses.i, ses.ids.length)}%"></span></div>
  <div class="card qcard">
    <div class="stem">${renderStem(q.stem)}</div>
    ${q.type==='mcq' ? `<div class="choices" id="choices">${q.choices.map((c,i)=>`<button class="choice ${answered ? (i===q.answer?'correct': i===a.given?'wrong':'dim') : ''}" data-i="${i}" ${answered?'disabled':''}><span class="letter">${LETTERS[i]}</span><span>${esc(c)}</span></button>`).join('')}</div>`
      : `<form class="writein" id="writein">${q.type==='numeric' && q.unit==='$' ? '<span class="unit">$</span>' : ''}<input class="input" id="wi" ${q.type==='numeric'?'inputmode="decimal"':''} placeholder="${q.type==='numeric' ? (q.unit==='%'?'e.g. 25':'e.g. 45,000 or (5,000) for a loss') : 'type the result, e.g. capital gain'}" ${answered?`value="${esc(a.given)}" disabled`:''} autocomplete="off">${q.type==='numeric' && q.unit==='%' ? '<span class="unit">%</span>' : ''}${answered?'':'<button class="btn btn-accent" type="submit">Check</button>'}</form>`}
    ${answered ? renderFeedback(q, a) : `<div class="quiz-actions"><span class="faint">${q.type==='mcq' ? 'Keys 1 to 4 or A to D select, Enter confirms' : 'Enter checks your answer'}</span><button class="btn btn-ghost btn-sm" id="btn-skip">Skip</button></div>`}
  </div>`;
  if(ses.timer) startTimer();
  // interactions
  $('#btn-quit').addEventListener('click', () => { if(confirm('End this set now? Answered questions are kept.')){ finishSession(); } });
  if(!answered){
    if(q.type==='mcq'){
      let sel = null;
      const choose = i => { sel = i; $$('.choice').forEach((c,j)=>c.classList.toggle('selected', j===i)); };
      $('#choices').addEventListener('click', e => { const b = e.target.closest('.choice'); if(!b) return; if(sel===Number(b.dataset.i)) submit(q, sel); else choose(Number(b.dataset.i)); });
      keyHandler = e => {
        if(e.target.matches('input,textarea')) return;
        const k = e.key.toLowerCase(); const idx = ['1','2','3','4'].indexOf(k) >= 0 ? Number(k)-1 : ['a','b','c','d'].indexOf(k);
        if(idx>=0 && idx<q.choices.length){ e.preventDefault(); choose(idx); }
        if(e.key==='Enter' && sel!=null){ e.preventDefault(); submit(q, sel); }
      };
    } else {
      $('#writein').addEventListener('submit', e => { e.preventDefault(); const v = $('#wi').value.trim(); if(!v) return; submit(q, v); });
      setTimeout(()=>{ const i=$('#wi'); if(i) i.focus(); }, 50);
      keyHandler = null;
    }
    $('#btn-skip').addEventListener('click', () => next());
  } else {
    keyHandler = e => { if(e.target.matches('input,textarea')) return; if(e.key==='Enter' || e.key.toLowerCase()==='n'){ e.preventDefault(); next(); } };
    const ask = $('#btn-ask'); if(ask) ask.addEventListener('click', () => openChatFor(q, a));
    const nx = $('#btn-next'); if(nx) nx.addEventListener('click', next);
    const ov = $('#btn-override'); if(ov) ov.addEventListener('click', () => { overrideCorrect(q); });
    const tr = $('#btn-tree'); if(tr) tr.addEventListener('click', () => { location.hash = '#trees/'+q.tree; });
    const why = $('#miss-why'); if(why) why.addEventListener('change', () => { const m = [...store.data.missLog].reverse().find(x=>x.qid===q.id); if(m){ m.why = why.value; store.save(); toast('Miss log updated'); } });
  }
}
let keyHandler = null;
document.addEventListener('keydown', e => { if(keyHandler && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e); });

function renderStem(stem){
  const lines = String(stem).split('\n');
  let html = '', facts = [];
  const flush = () => { if(facts.length){ html += `<span class="facts">${facts.map(esc).join('<br>')}</span>`; facts = []; } };
  for(const ln of lines){
    const isFact = /\d/.test(ln) && ln.length < 110 && /[:,]/.test(ln) && !/[?]$/.test(ln.trim()) && ln.trim().split(/\s+/).length <= 14 && !/^(what|which|how|compute|determine|calculate|assume|if|the |a |an |in |on |during|after|before|at |for |as |when)/i.test(ln.trim());
    if(isFact) facts.push(ln); else { flush(); html += esc(ln) + '\n'; }
  }
  flush();
  return html.replace(/\n+$/,'');
}
function renderFeedback(q, a){
  const ok = a.correct;
  const exp = String(q.explanation||'');
  const firstBreak = exp.indexOf('\n');
  const ansLine = firstBreak>0 ? exp.slice(0, firstBreak) : exp;
  const rest = firstBreak>0 ? exp.slice(firstBreak+1) : '';
  const latest = [...store.data.missLog].reverse().find(x=>x.qid===q.id);
  return `
  <div class="feedback ${ok?'ok':'bad'}">
    <div class="feedback-head"><span>${ok ? '✓ Correct' : '✕ Not quite'}${q.type!=='mcq' ? ` · your answer: <span class="mono">${esc(a.given)}</span> · correct: <span class="mono">${esc(answerText(q))}</span>` : ''}</span>
      <span class="row">${!ok && q.type==='text' ? '<button class="btn btn-sm btn-ok" id="btn-override">My answer was right</button>' : ''}</span></div>
    <div class="feedback-body">
      <div class="explanation"><span class="ans-line">${esc(ansLine)}</span>${esc(rest)}</div>
      <dl class="rule-box">
        <dt>Rule</dt><dd>${esc(q.rule)}</dd>
        <dt>Trap</dt><dd>${esc(q.trap)}</dd>
        ${q.tree ? `<dt>Tree</dt><dd>${esc(treeLabel(q.tree))} <button class="btn btn-sm btn-ghost" id="btn-tree">Open flow</button></dd>` : ''}
        ${!ok && latest ? `<dt>Why missed</dt><dd><input class="input" id="miss-why" value="${esc(latest.why)}" placeholder="In your own words: why did you miss it?"></dd>` : ''}
      </dl>
      <div class="quiz-actions">
        <button class="btn" id="btn-ask">✦ Ask Claude about this</button>
        <button class="btn btn-accent" id="btn-next">${store.data.session.i+1 >= store.data.session.ids.length ? 'See results' : 'Next question'} <span class="kbd">Enter</span></button>
      </div>
    </div>
  </div>`;
}
function submit(q, given){
  const ses = store.data.session;
  const correct = grade(q, given);
  ses.answers[q.id] = {given, correct, ts: new Date().toISOString()};
  store.data.attempts.push({id:q.id, correct, ts: new Date().toISOString(), mode: ses.label});
  if(!correct) logMiss(q, q.type==='mcq' ? LETTERS[given] : given, ses);
  store.save(); renderQuiz(); updateChrome();
}
function overrideCorrect(q){
  const ses = store.data.session; const a = ses.answers[q.id]; if(!a) return;
  a.correct = true;
  for(let i=store.data.attempts.length-1;i>=0;i--){ if(store.data.attempts[i].id===q.id){ store.data.attempts[i].correct = true; break; } }
  const idx = [...store.data.missLog].map((m,i)=>[m,i]).reverse().find(([m])=>m.qid===q.id); if(idx) store.data.missLog.splice(idx[1],1);
  store.save(); toast('Marked correct'); renderQuiz(); updateChrome();
}
function next(){
  const ses = store.data.session; if(!ses) return;
  if(ses.i+1 >= ses.ids.length) return finishSession();
  ses.i++; store.save(); renderQuiz();
}
function finishSession(){ const ses = store.data.session; if(!ses) return; ses.done = true; ses.finished = Date.now(); store.save(); stopTimer(); location.hash = '#results'; }
function startTimer(){
  stopTimer();
  const tick = () => { const el = $('#timer'); const ses = store.data.session; if(!el || !ses || !ses.deadline) return stopTimer(); const left = Math.round((ses.deadline - Date.now())/1000); const neg = left<0; const t = Math.abs(left); el.textContent = (neg?'-':'')+pad(Math.floor(t/60))+':'+pad(t%60); el.classList.toggle('low', left < 120); };
  tick(); timerInt = setInterval(tick, 1000);
}
function stopTimer(){ if(timerInt){ clearInterval(timerInt); timerInt = null; } }
function openChatFor(q, a){
  const text = [
    `Question ${q.id} (${q.module}, ${q.entity}, topic: ${q.topic}, type: ${q.type}, difficulty ${q.difficulty}${q.tree?`, decision tree flow: ${treeLabel(q.tree)}`:''}).`,
    `Stem:\n${q.stem}`,
    q.type==='mcq' ? `Choices:\n${q.choices.map((c,i)=>LETTERS[i]+'. '+c).join('\n')}` : '',
    `Correct answer: ${answerText(q)}`,
    `Zach's answer: ${q.type==='mcq' ? LETTERS[a.given]+'. '+q.choices[a.given] : a.given} (${a.correct ? 'correct' : 'incorrect'})`,
    `Trainer explanation:\n${q.explanation}`,
    `Rule: ${q.rule}\nTrap: ${q.trap}`,
    `Times missed before in the trainer: ${missCountFor(q.id)}`
  ].filter(Boolean).join('\n\n');
  window.TCPChat.open({label:`${q.id} · ${q.topic}`, text});
}

// ---------- results ----------
function renderResults(){
  const ses = store.data.session;
  if(!ses){ location.hash = '#practice'; return; }
  const answered = ses.ids.filter(id => ses.answers[id]);
  const correct = answered.filter(id => ses.answers[id].correct);
  const p = pct(correct.length, answered.length);
  const byTopic = {};
  for(const id of answered){ const q = BY_ID[id]; (byTopic[q.topic] = byTopic[q.topic] || {n:0,c:0}); byTopic[q.topic].n++; if(ses.answers[id].correct) byTopic[q.topic].c++; }
  const mins = Math.round(((ses.finished||Date.now()) - ses.started)/60000);
  const misses = answered.filter(id => !ses.answers[id].correct);
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Results · ${esc(ses.label)}</div><h1>${p>=75 ? 'On target' : p>=60 ? 'Close' : 'Keep drilling'}: ${p}%</h1><p>${correct.length} of ${answered.length} correct in ${mins} minute${mins===1?'':'s'}. ${misses.length ? misses.length+' miss'+(misses.length===1?'':'es')+' added to your miss log with the rule line filled in.' : 'Nothing added to the miss log.'}</p></div>
    <div class="row">${misses.length ? `<button class="btn btn-accent" id="btn-redo">Redo the ${misses.length} miss${misses.length===1?'':'es'}</button>` : ''}<a class="btn" href="#practice">New set</a><a class="btn btn-ghost" href="#dashboard">Dashboard</a></div></div>
  <div class="grid grid-3" style="margin-bottom:16px">
    <div class="card" style="display:grid;place-items:center"><div class="ring" style="--pct:${p}"><span>${p}%</span></div></div>
    <div class="card"><div class="card-head"><h3>By topic</h3></div><div class="bar-list">${Object.entries(byTopic).sort((a,b)=>pct(a[1].c,a[1].n)-pct(b[1].c,b[1].n)).map(([t,s])=>{const q=pct(s.c,s.n); return `<div class="bar-item"><span class="lbl" title="${esc(t)}">${esc(shortTopic(t))}</span><div class="progress ${q<70?'bad':q<85?'warn':'ok'}"><span style="width:${q}%"></span></div><span class="val">${s.c}/${s.n}</span></div>`;}).join('')}</div></div>
    <div class="card"><div class="card-head"><h3>Next step</h3></div><p class="muted">${p>=75 ? 'Accuracy is at the readiness target for this set. Move to the next weak topic or a timed mixed set.' : 'Rework each miss on paper before the retry: write the chain, state the ordering rule, then check against the explanation.'}</p><div class="row" style="margin-top:12px"><button class="btn" id="btn-ask-results">✦ Ask Claude to review this set</button></div></div>
  </div>
  <div class="card"><div class="card-head"><h3>Review</h3><span class="faint">misses first</span></div>
    <div class="stack" style="gap:10px">${[...misses, ...correct].map(id => { const q = BY_ID[id], a = ses.answers[id]; return `<details class="review-item ${a.correct?'ok':'bad'}"><summary style="cursor:pointer;display:flex;justify-content:space-between;gap:10px"><span><b>${esc(q.id)}</b> · ${esc(q.topic)}</span><span class="faint">${a.correct?'correct':'missed'} · ${esc(q.module)}</span></summary><div style="margin-top:10px" class="stack"><div class="stem" style="font-size:14px">${renderStem(q.stem)}</div>${q.type==='mcq' ? `<div class="muted">Your answer: ${LETTERS[a.given]}. ${esc(q.choices[a.given])}<br>Correct: ${esc(answerText(q))}</div>` : `<div class="muted">Your answer: <span class="mono">${esc(a.given)}</span> · Correct: <span class="mono">${esc(answerText(q))}</span></div>`}<div class="explanation" style="font-size:13.5px">${esc(q.explanation)}</div><div class="row"><span class="chip chip-soft">Rule: ${esc(q.rule)}</span></div></div></details>`; }).join('')}</div>
  </div>`;
  const redo = $('#btn-redo'); if(redo) redo.addEventListener('click', () => startSession({label:'Redo misses', ids: misses}));
  $('#btn-ask-results').addEventListener('click', () => {
    const text = `Set just finished: ${ses.label}. Score ${correct.length}/${answered.length} (${p}%).\n` + answered.map(id => { const q = BY_ID[id], a = ses.answers[id]; return `${q.id} ${a.correct?'correct':'MISSED'} · ${q.module} · ${q.topic} · rule: ${q.rule}${a.correct?'':' · trap: '+q.trap}`; }).join('\n');
    window.TCPChat.open({label:`Set review · ${p}%`, text});
  });
}

// ---------- decision trees ----------
let treeTab = 'ccorp';
function renderTrees(arg){
  const REF = window.TCP_REFERENCE; const T = window.TCP_TREES || {};
  if(arg && TREE_META[arg]) treeTab = arg[0]==='c' ? 'ccorp' : arg[0]==='s' ? 'scorp' : 'partnership';
  else if(arg && ['ccorp','scorp','partnership','compare'].includes(arg)) treeTab = arg;
  const recall = S().recall;
  const tabs = [['ccorp','C Corporation','t-c'],['scorp','S Corporation','t-s'],['partnership','Partnership / LLC','t-p'],['compare','Side by side','t-x']];
  let body = '';
  if(treeTab==='compare'){
    const c = REF.compare;
    body = `<p class="muted" style="margin-bottom:14px">${c.lede}</p><div class="compare-wrap"><table class="compare"><thead><tr>${c.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${c.rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="row" style="margin-top:16px"><button class="btn btn-accent" data-start="Comparison">Quiz me on the comparison</button></div>`;
  } else {
    const e = REF.entities[treeTab];
    const ec = treeTab==='ccorp'?'c':treeTab==='scorp'?'s':'p';
    body = `<p class="muted" style="margin-bottom:14px;max-width:80ch">${e.lede}</p>
    <details class="acc" ${treeTab==='ccorp'?'open':''}><summary>What is what: definitions and formulas</summary><div class="acc-body"><div class="gloss">${e.gloss.map(g=>`<div class="gbox ${g.cls}"><h4>${g.title}</h4>${g.html}</div>`).join('')}</div></div></details>
    ${e.sections.map(sec => `
      <section class="tx" id="${sec.id}">
        <div class="tx-head"><div><h3>${sec.title}</h3><p class="sub">${sec.sub}</p></div>
          <div class="row"><button class="btn btn-sm btn-${ec}" data-tree="${sec.owner}">Quiz: owner side</button><button class="btn btn-sm btn-${ec}" data-tree="${sec.entity}">Quiz: entity side</button></div></div>
        <div class="two">
          <div class="side"><div class="side-head"><span class="side-tag owner">${sec.ownerLabel}</span><span class="faint">${BANK.filter(q=>q.tree===sec.owner).length} questions</span></div><div class="flow ${recall?'recall':''}">${renderFlow(T[sec.owner])}</div></div>
          <div class="side"><div class="side-head"><span class="side-tag entity">${sec.entityLabel}</span><span class="faint">${BANK.filter(q=>q.tree===sec.entity).length} questions</span></div><div class="flow ${recall?'recall':''}">${renderFlow(T[sec.entity])}</div></div>
        </div>
      </section>`).join('')}`;
  }
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Decision trees · T2 M2, T3 M1, T3 M2, T3 M3, T3 M4</div><h1>Entity transaction decision trees</h1><p>Each transaction from the owner side and the entity side. Recall mode blurs every result node so you say the rule before you see it.</p></div>
    <label class="toggle"><input type="checkbox" id="recall-toggle" ${recall?'checked':''}><span class="tk"></span>Recall mode</label></div>
  <div class="tree-tabs">${tabs.map(([k,l,c])=>`<button type="button" data-tab="${k}" class="${treeTab===k?'active '+c:''}">${l}</button>`).join('')}</div>
  ${treeTab!=='compare' ? `<div class="legend"><span class="lg-q">? Decision</span><span class="lg-ok">No gain or tax free</span><span class="lg-tax">Gain, income, or loss recognized</span><span class="lg-calc">Formula</span><span class="lg-end">Result, basis and holding period</span></div>` : ''}
  ${body}`;
  $('.tree-tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if(b){ treeTab = b.dataset.tab; location.hash = '#trees/'+treeTab; } });
  $('#recall-toggle').addEventListener('change', e => { S().recall = e.target.checked; store.save(); renderTrees(treeTab); });
  view().addEventListener('click', e => { const n = e.target.closest('.recall .node'); if(n && !n.classList.contains('start') && !n.classList.contains('q')) n.classList.toggle('revealed'); });
  bindStarts(view());
  if(arg && TREE_META[arg]){ const sec = REF.entities[treeTab].sections.find(s => s.owner===arg || s.entity===arg); if(sec){ setTimeout(()=>{ const el = document.getElementById(sec.id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }, 60); } }
}
function nodeHtml(n){
  const cls = n.k; let h = `<div class="node ${cls}">`;
  if(n.h) h += `<h5>${n.h}</h5>`;
  if(n.b) h += `<div class="nb">${n.b}</div>`;
  return h + '</div>';
}
function renderFlow(items){
  if(!items) return '<div class="node">Missing flow</div>';
  let h = '';
  items.forEach((it, i) => {
    if(i>0) h += '<div class="arr"></div>';
    const hasNext = i < items.length-1;
    if(it.k==='q' && it.legs){
      const n = it.legs.length;
      h += nodeHtml(it) + `<div class="arr"></div><div class="branch c${n}">`;
      it.legs.forEach(l => {
        h += `<div class="leg"><span class="lbl ${l.c||''}">${l.l}</span>`;
        if(l.f && l.f.length) h += '<div class="arr"></div>' + renderFlow(l.f);
        if(hasNext) h += l.end ? '<span class="endchip">end</span>' : '<div class="line"></div>';
        h += '</div>';
      });
      h += '</div>';
      if(hasNext) h += '<div class="merge"></div>';
    } else h += nodeHtml(it);
  });
  return h;
}

// ---------- miss log ----------
function renderMissLog(){
  const log = [...store.data.missLog].reverse();
  const repeats = {}; for(const m of store.data.missLog) repeats[m.qid] = (repeats[m.qid]||0)+1;
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Miss log</div><h1>Every miss, one line each</h1><p>Format: date, module, question ID, topic, why missed, rule in one line. Trainer misses are added automatically; add Becker misses by hand so the log is complete.</p></div>
    <div class="row"><button class="btn" id="btn-copy">Copy as text</button><button class="btn" id="btn-csv">Download CSV</button><button class="btn btn-ghost" id="btn-add">+ Add a Becker miss</button></div></div>
  <div id="add-form" class="card" hidden style="margin-bottom:16px">
    <div class="card-head"><h3>Add a Becker miss</h3><button class="btn btn-sm btn-ghost" id="btn-add-cancel">Cancel</button></div>
    <div class="field-row">
      <label class="field">Date<input class="input" id="am-date" type="date" value="${localISO()}"></label>
      <label class="field">Module<select class="select" id="am-module">${['T1 M1','T1 M2','T1 M3','T1 M4','T2 M1','T2 M2','T2 M3','T2 M4','T2 M5','T3 M1','T3 M2','T3 M3','T3 M4','T3 M5','T3 M6','T4 M1','T4 M2','T4 M3'].map(m=>`<option>${m}</option>`).join('')}</select></label>
      <label class="field">Becker question ID<input class="input" id="am-id" placeholder="MCQ-12345 or TBS name"></label>
      <label class="field">Topic<input class="input" id="am-topic" placeholder="e.g. E&amp;P ordering"></label>
    </div>
    <div class="field-row" style="margin-top:12px">
      <label class="field">Why missed<input class="input" id="am-why" placeholder="one line"></label>
      <label class="field">Rule in one line<input class="input" id="am-rule" placeholder="one line"></label>
    </div>
    <div class="row" style="margin-top:12px"><button class="btn btn-accent" id="btn-add-save">Save to log</button><button class="btn" id="btn-add-ask">✦ Ask Claude to draft the why and rule</button></div>
  </div>
  ${log.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Module</th><th>ID</th><th>Topic</th><th>Why missed</th><th>Rule</th><th></th></tr></thead><tbody>
    ${log.map((m,i) => `<tr><td class="mono">${esc(m.date)}</td><td>${esc(m.module)}</td><td class="mono">${esc(m.qid)}${repeats[m.qid]>1?` <span class="chip chip-bad" title="repeat miss">x${repeats[m.qid]}</span>`:''}</td><td>${esc(m.topic)}</td><td contenteditable="true" data-edit="why" data-i="${store.data.missLog.length-1-i}" class="muted">${esc(m.why)}</td><td contenteditable="true" data-edit="rule" data-i="${store.data.missLog.length-1-i}" class="muted">${esc(m.rule)}</td><td><div class="row" style="flex-wrap:nowrap">${BY_ID[m.qid]?`<button class="icon-btn icon-btn-sm" title="Retry" data-redo="${esc(m.qid)}">↺</button>`:''}<button class="icon-btn icon-btn-sm" title="Delete" data-del="${store.data.missLog.length-1-i}">✕</button></div></td></tr>`).join('')}
  </tbody></table></div>` : `<div class="empty">No misses logged yet. Misses from practice sets land here automatically.</div>`}`;
  const lines = () => store.data.missLog.map(m => [m.date, m.module, m.qid, m.topic, m.why, m.rule].map(x=>String(x||'').replace(/\s+/g,' ').trim()).join(' | '));
  $('#btn-copy').addEventListener('click', () => { navigator.clipboard.writeText(lines().join('\n')).then(()=>toast('Copied '+lines().length+' lines')); });
  $('#btn-csv').addEventListener('click', () => { const csv = ['date,module,question_id,topic,why_missed,rule'].concat(store.data.missLog.map(m => [m.date,m.module,m.qid,m.topic,m.why,m.rule].map(x=>'"'+String(x||'').replace(/"/g,'""')+'"').join(','))).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = `tcp-miss-log-${localISO()}.csv`; a.click(); });
  $('#btn-add').addEventListener('click', () => { $('#add-form').hidden = false; });
  $('#btn-add-cancel').addEventListener('click', () => { $('#add-form').hidden = true; });
  $('#btn-add-save').addEventListener('click', () => { const e = {ts:new Date().toISOString(), date:$('#am-date').value||localISO(), module:$('#am-module').value, qid:$('#am-id').value.trim()||'Becker', topic:$('#am-topic').value.trim(), why:$('#am-why').value.trim(), rule:$('#am-rule').value.trim(), source:'becker'}; store.data.missLog.push(e); store.save(); toast('Added'); renderMissLog(); updateChrome(); });
  $('#btn-add-ask').addEventListener('click', () => { window.TCPChat.open({label:'Draft a miss log line', text:`Zach wants a miss log line for a Becker question he missed. Module ${$('#am-module').value}, ID ${$('#am-id').value||'(not given)'}, topic ${$('#am-topic').value||'(not given)'}. Ask him in one sentence what the question tested and what he answered, then produce the line: date ${$('#am-date').value||localISO()}, module, ID, topic, why missed, rule in one line.`}); });
  view().addEventListener('blur', e => { const c = e.target.closest('[data-edit]'); if(c){ const m = store.data.missLog[Number(c.dataset.i)]; if(m){ m[c.dataset.edit] = c.textContent.trim(); store.save(); } } }, true);
  view().addEventListener('click', e => { const d = e.target.closest('[data-del]'); if(d){ store.data.missLog.splice(Number(d.dataset.del),1); store.save(); renderMissLog(); updateChrome(); } });
  bindStarts(view());
}

// ---------- plan ----------
function renderPlan(){
  const today = localISO();
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Study plan · ${esc(PLAN.title||'')}</div><h1>${esc(PLAN.headline||'The week to Thursday')}</h1><p>${esc(PLAN.intro||'')}</p></div>
    <div class="row"><a class="btn" href="#cheatsheet">Cheat sheet</a><button class="btn btn-ghost" id="btn-plan-ask">✦ Adjust with Claude</button></div></div>
  ${PLAN.note ? `<div class="notice info" style="margin-bottom:16px">${esc(PLAN.note)}</div>` : ''}
  <div class="grid grid-2" style="margin-bottom:16px">
    <div class="card"><div class="card-head"><h3>Focus ranking</h3><span class="faint">highest payoff first</span></div>
      <div class="stack" style="gap:8px">${(PLAN.ranking||[]).map((r,i)=>`<div class="rank"><span class="n">${i+1}</span><div><div class="ttl"><b>${esc(r.module)}</b> · ${esc(r.topic)}</div><div class="why">${esc(r.why)}</div></div>${r.start?`<button class="btn btn-sm" data-start="${esc(r.start)}">Drill</button>`:r.tree?`<button class="btn btn-sm" data-tree="${esc(r.tree)}">Drill</button>`:r.topic_drill && TOPICS.includes(r.topic_drill)?`<button class="btn btn-sm" data-topic="${esc(r.topic_drill)}">Drill</button>`:''}</div>`).join('')}</div></div>
    <div class="card"><div class="card-head"><h3>Traps to say out loud before each set</h3></div>
      <ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;color:var(--text-2)">${(PLAN.traps||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ol></div>
  </div>
  ${beckerSignalHtml(true)}
  <div class="stack">${(PLAN.days||[]).map(d => { const past = d.date < today, isToday = d.date===today; const done = d.blocks.filter((b,i)=>store.data.planDone[d.date+':'+i]).length; return `
    <div class="day ${isToday?'today':past?'past':''}"><div class="day-head"><div><strong>${esc(d.label)}</strong> <span class="faint">${esc(d.date)}${isToday?' · today':''}</span></div><div class="row"><span class="chip ${done===d.blocks.length?'chip-ok':'chip-soft'}">${done}/${d.blocks.length}</span>${d.minutes?`<span class="chip chip-soft">${d.minutes} min</span>`:''}</div></div>
    <div class="day-body">${d.blocks.map((b,i)=>{ const k = d.date+':'+i; const dn = !!store.data.planDone[k]; return `<label class="task ${dn?'done':''}"><input type="checkbox" data-plan="${k}" ${dn?'checked':''}><span class="t">${esc(b.t)}${b.sub?`<small>${esc(b.sub)}</small>`:''}</span>${b.link?`<a class="btn btn-sm" href="${esc(b.link)}">Go</a>`:''}</label>`; }).join('')}</div></div>`; }).join('')}</div>`;
  $('#btn-plan-ask').addEventListener('click', () => window.TCPChat.open({label:'Study plan', text:'Zach is looking at his study plan for the days before the exam. Plan ranking: '+(PLAN.ranking||[]).map(r=>r.module+' '+r.topic).join('; ')+'. Help him adjust today\'s blocks based on his progress summary.'}));
  bindStarts(view());
}

// ---------- Becker signal ----------
function beckerSignalHtml(full){
  const B = window.TCP_BECKER; if(!B) return '';
  const mods = B.modules.slice().sort((a,b) => a.pct - b.pct || b.uniqueMisses - a.uniqueMisses);
  const se1 = B.exams.SE1 || [];
  const se1Line = se1.map(a => `attempt ${a.attempt} ${a.score}`).join(', ');
  const me1 = (B.exams.ME1||[]).map(a=>a.score).join(' then '), me2 = (B.exams.ME2||[]).map(a=>a.score).join(' then ');
  if(!full){
    return `<div class="card" style="margin-bottom:16px"><div class="card-head"><h3>Becker signal</h3><span class="faint">pulled ${esc(B.capturedAt)}</span></div>
      <div class="row" style="margin-bottom:12px"><span class="chip chip-soft">Simulated Exam 1: ${esc(se1Line)}</span><span class="chip chip-soft">Mini Exam 1: ${esc(me1)}</span><span class="chip chip-soft">Mini Exam 2: ${esc(me2)}</span><span class="chip chip-soft">EDR ${esc(B.edr)}</span><span class="chip chip-bad">${B.repeatMisses.length} IDs missed twice</span></div>
      <div class="bar-list">${mods.slice(0,6).map(m => `<div class="bar-item"><span class="lbl" title="${esc(m.title)}">${esc(m.module)} <span class="faint">${esc(moduleName(m.module))}</span></span><div class="progress ${m.pct<70?'bad':m.pct<85?'warn':'ok'}"><span style="width:${m.pct}%"></span></div><span class="val" title="${m.uniqueMisses} unique missed IDs">${m.pct}% · ${m.uniqueMisses}</span></div>`).join('')}</div>
      <div class="row" style="margin-top:12px"><a class="btn btn-sm" href="#plan">Full ranking and the 123 missed IDs</a></div></div>`;
  }
  return `
  <div class="card" style="margin-top:16px"><div class="card-head"><h3>Becker signal by module</h3><span class="faint">practice-test accuracy pooled over 12 attempts · exam misses over 6 attempts</span></div>
    <div class="table-wrap" style="max-height:none"><table class="table"><thead><tr><th>Module</th><th>Practice tests</th><th>Unique misses</th><th>Missed twice</th><th>Exam misses</th><th>TBS scores</th></tr></thead><tbody>
    ${mods.map(m => `<tr><td><b>${esc(m.module)}</b> <span class="faint">${esc(m.title)}</span></td><td><span class="chip ${m.pct<70?'chip-bad':m.pct<85?'':'chip-ok'}">${m.pct}%</span> <span class="faint">${m.correct}/${m.attempted}</span></td><td>${m.uniqueMisses}</td><td>${m.repeatMisses||''}</td><td>${m.examMisses||''}</td><td class="faint" style="font-size:12px">${m.tbs.map(esc).join('<br>')}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="faint" style="margin-top:10px">${esc(B.note)}</p>
  </div>
  <div class="card" style="margin-top:16px"><div class="card-head"><h3>Missed question IDs</h3><span class="faint">${Object.values(B.missedByModule).reduce((n,l)=>n+l.length,0)} unique · look each up in Becker with Find Question</span></div>
    <div class="stack" style="gap:8px">${Object.keys(B.missedByModule).sort().map(mod => `<details class="acc"><summary><span><b>${esc(mod)}</b> <span class="faint">${esc(moduleName(mod))}</span></span><span class="faint">${B.missedByModule[mod].length} IDs · ${B.missedByModule[mod].filter(x=>x.times>=2).length} repeats</span></summary><div class="acc-body"><div class="list">${B.missedByModule[mod].map(x => `<div class="list-item"><div><div class="ttl mono">${esc(x.id)} ${x.times>=2?`<span class="chip chip-bad">x${x.times}</span>`:''}</div><div class="sub">${x.sentence ? esc(x.sentence) : (x.group ? esc(x.group) : 'Bank item outside the homework set')}</div></div><span class="faint" style="font-size:12px;text-align:right;max-width:40%">${x.where.map(esc).join('<br>')}</span></div>`).join('')}</div></div></details>`).join('')}</div>
  </div>`;
}

// ---------- cheat sheet ----------
function renderCheatSheet(){
  const cs = window.TCP_CHEATSHEET;
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Reference</div><h1>Your TCP cheat sheet</h1><p>Your six-page sheet, embedded. Several dollar figures on it are 2025 amounts; the corrections below carry the 2026 figures Becker 1.4 uses. The tutor sees both.</p></div>
    <div class="row"><a class="btn" href="${esc(cs.pdf)}" target="_blank" rel="noopener">Open PDF</a><a class="btn btn-ghost" href="#plan">Back to plan</a></div></div>
  <details class="acc" open style="margin-bottom:16px"><summary>2026 corrections to the sheet (${cs.corrections.length})</summary><div class="acc-body"><div class="table-wrap" style="max-height:none"><table class="table"><thead><tr><th>Item</th><th>Sheet says</th><th>Use instead</th></tr></thead><tbody>${cs.corrections.map(c=>`<tr><td><b>${esc(c.item)}</b></td><td class="muted">${esc(c.sheet)}</td><td>${esc(c.now)}</td></tr>`).join('')}</tbody></table></div></div></details>
  <div class="seg" id="cs-seg" style="margin-bottom:14px"><button type="button" data-cs="pdf" class="active">PDF</button><button type="button" data-cs="text">Text</button></div>
  <div id="cs-pdf"><iframe class="pdf-frame" src="${esc(cs.pdf)}#view=FitH" title="TCP cheat sheet PDF"></iframe></div>
  <div id="cs-text" hidden class="stack">${cs.pages.map(p=>`<div><div class="eyebrow">Page ${p.page}</div><h3 style="margin-bottom:10px">${esc(p.title)}</h3><div class="cs-page">${p.lines.map(l=>`<p class="${/^[A-Z][^.]{0,48}$/.test(l)&&!/\d/.test(l)?'h':''}">${esc(l)}</p>`).join('')}</div></div>`).join('')}</div>`;
  $('#cs-seg').addEventListener('click', e => { const b = e.target.closest('[data-cs]'); if(!b) return; $$('#cs-seg button').forEach(x=>x.classList.toggle('active', x===b)); $('#cs-pdf').hidden = b.dataset.cs!=='pdf'; $('#cs-text').hidden = b.dataset.cs!=='text'; });
}

// ---------- settings ----------
function renderSettings(){
  const s = S();
  const models = window.TCPChat ? window.TCPChat.MODELS : {};
  view().innerHTML = `
  <div class="hero"><div><div class="eyebrow">Settings</div><h1>Tutor, timing, data</h1><p>Your API key is stored only in this browser (localStorage) and sent only to api.anthropic.com. It is never written to the repository.</p></div></div>
  <div class="grid grid-2">
    <div class="card stack">
      <h3>Claude tutor</h3>
      <label class="field">Anthropic API key<div class="row" style="flex-wrap:nowrap"><input class="input mono" id="s-key" type="password" value="${esc(s.apiKey)}" placeholder="sk-ant-…" autocomplete="off" spellcheck="false"><button class="btn" id="s-key-show" type="button">Show</button></div></label>
      <div class="field-row">
        <label class="field">Model<select class="select" id="s-model">${Object.entries(models).map(([k,v])=>`<option value="${k}" ${s.model===k?'selected':''}>${v.label} (${k})</option>`).join('')}</select></label>
        <label class="field">Effort<select class="select" id="s-effort">${['low','medium','high'].map(e=>`<option ${s.effort===e?'selected':''}>${e}</option>`).join('')}</select></label>
      </div>
      <label class="toggle"><input type="checkbox" id="s-cs" ${s.includeCheatSheet?'checked':''}><span class="tk"></span>Give the tutor my cheat sheet text (cached by the API; adds context, costs a little more)</label>
      <div class="row"><button class="btn btn-accent" id="s-test">Test connection</button><span class="muted" id="s-test-out"></span></div>
      <p class="faint">Default model is Claude Sonnet 5.5 as requested. Opus 5.5 is stronger on long multi-entity chains; Haiku 5.5 is cheapest for quick lookups. Refusal fallback is on for Sonnet and Opus.</p>
    </div>
    <div class="card stack">
      <h3>Practice</h3>
      <div class="field-row">
        <label class="field">Exam date<input class="input" id="s-exam" type="date" value="${esc(s.examDate)}"></label>
        <label class="field">Default set size<select class="select" id="s-size">${[10,15,20,25].map(n=>`<option ${s.setSize===n?'selected':''}>${n}</option>`).join('')}</select></label>
        <label class="field">Seconds per question<select class="select" id="s-sec">${[60,75,90,105,120].map(n=>`<option ${s.secPerQ===n?'selected':''}>${n}</option>`).join('')}</select></label>
      </div>
      <label class="toggle"><input type="checkbox" id="s-timer" ${s.timer?'checked':''}><span class="tk"></span>Timer on by default</label>
      <h3 style="margin-top:8px">Data</h3>
      <div class="row"><button class="btn" id="s-export">Export progress (JSON)</button><label class="btn" for="s-import">Import progress<input id="s-import" type="file" accept="application/json" hidden></label><button class="btn btn-bad" id="s-reset">Reset all progress</button></div>
      <p class="faint">${store.data.attempts.length} attempts, ${store.data.missLog.length} miss log entries, ${Object.values(store.data.planDone).filter(Boolean).length} plan items checked.</p>
    </div>
  </div>`;
  const saveS = () => { store.save(); updateChrome(); };
  $('#s-key').addEventListener('input', e => { s.apiKey = e.target.value.trim(); saveS(); });
  $('#s-key-show').addEventListener('click', e => { const i = $('#s-key'); i.type = i.type==='password' ? 'text' : 'password'; e.target.textContent = i.type==='password' ? 'Show' : 'Hide'; });
  $('#s-model').addEventListener('change', e => { s.model = e.target.value; saveS(); });
  $('#s-effort').addEventListener('change', e => { s.effort = e.target.value; saveS(); });
  $('#s-cs').addEventListener('change', e => { s.includeCheatSheet = e.target.checked; saveS(); });
  $('#s-exam').addEventListener('change', e => { if(e.target.value) s.examDate = e.target.value; saveS(); });
  $('#s-size').addEventListener('change', e => { s.setSize = Number(e.target.value); saveS(); });
  $('#s-sec').addEventListener('change', e => { s.secPerQ = Number(e.target.value); saveS(); });
  $('#s-timer').addEventListener('change', e => { s.timer = e.target.checked; saveS(); });
  $('#s-test').addEventListener('click', async () => { const out = $('#s-test-out'); out.textContent = 'Testing…'; try{ const r = await window.TCPChat.testKey(s.apiKey, s.model); out.textContent = 'Connected. Model replied: '+r; }catch(err){ out.textContent = err.message; } });
  $('#s-export').addEventListener('click', () => { const d = JSON.parse(JSON.stringify(store.data)); d.settings.apiKey = ''; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:'application/json'})); a.download = `tcp-trainer-progress-${localISO()}.json`; a.click(); });
  $('#s-import').addEventListener('change', e => { const f = e.target.files[0]; if(!f) return; f.text().then(t => { try{ const d = JSON.parse(t); if(!Array.isArray(d.attempts)) throw new Error('bad file'); const key = s.apiKey; store.data = d; store.load(); store.data.settings.apiKey = store.data.settings.apiKey || key; store.save(); toast('Progress imported'); renderSettings(); updateChrome(); }catch(err){ toast('Could not import that file'); } }); });
  $('#s-reset').addEventListener('click', () => { if(confirm('Delete all attempts, miss log entries and plan checkmarks? Your API key stays.')){ const key = s.apiKey; localStorage.removeItem(KEY); store.load(); store.data.settings.apiKey = key; store.save(); toast('Progress reset'); renderSettings(); updateChrome(); } });
}

// ---------- boot ----------
window.TCPApp = { settings: () => S(), progressSummary, bank: BANK };
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', () => { route(); });
})();
