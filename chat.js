/* Claude tutor panel. Calls the Anthropic Messages API directly from the browser with the user's own key.
   The key lives only in this browser's localStorage and is sent only to api.anthropic.com. */
(function(){
'use strict';
const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
const MODELS = {
  'claude-sonnet-5-5': {label:'Claude Sonnet 5.5', fallbacks:true},
  'claude-opus-5-5':   {label:'Claude Opus 5.5',   fallbacks:true},
  'claude-haiku-5-5':  {label:'Claude Haiku 5.5',  fallbacks:false}
};
const STORE_KEY = 'tcp.chat.v1';

const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ---------- static system prompt (cached by the API across turns) ----------
function keyNumbers(){
  return [
    'Key 2026 numbers (checked against Becker TCP 1.4 unless marked confirm):',
    'Standard deduction 16,100 single, 24,150 HOH, 32,200 MFJ; extra 2,050 unmarried or 1,650 married for 65 or blind. Dependent standard deduction greater of 1,350 or earned income plus 450.',
    'Kiddie tax: first 1,350 untaxed, next 1,350 at the child rate, unearned income over 2,700 at the parents rate. SALT cap 40,400. Medical floor 7.5% of AGI. Charitable floor 0.5% of AGI for individuals.',
    'HSA 4,400 self, 8,750 family, 1,000 catch-up at 55; HDHP minimum deductible 1,700 self, 3,400 family; 20% penalty on nonmedical withdrawals before 65. Health FSA carryover 680.',
    'Estimated tax: required when 1,000 or more is due; safe harbors 90% current year, 100% prior year, 110% if prior AGI over 150,000. Corporations: 500 threshold; lesser of 100% current or 100% prior; large corporation (1,000,000 taxable income in any of 3 prior years) may use prior year only for the first installment.',
    'Excess business loss 256,000 single, 512,000 MFJ. Rental allowance 25,000, phased out 50 cents per dollar of MAGI from 100,000 to 150,000. Real estate professional: more than 50% of services and more than 750 hours. NIIT 3.8% over 200,000 single, 250,000 MFJ.',
    'Below-market loans: 10,000 de minimis; gift loans of 100,000 or less limited to borrower net investment income, zero if that income is 1,000 or less.',
    'Gifts: annual exclusion 19,000 per donee, 38,000 with gift splitting; lifetime exclusion 15,000,000; 529 five-year election 95,000 or 190,000; direct tuition and medical payments unlimited; charitable carryforward 5 years; Form 8283 over 500, qualified appraisal over 5,000; vehicle proceeds limit when claimed value exceeds 500.',
    'Retirement: 401(k) deferral 24,500, catch-up 8,000 at 50 and 11,250 at 60 to 63, total additions 72,000; SIMPLE 17,000 with 4,000 catch-up (5,250 at 60 to 63); SEP lesser of 25% of pay or 72,000 (about 20% of net SE earnings); IRA 7,500; traditional IRA phase-out 81,000 to 91,000 single and 129,000 to 149,000 MFJ when covered, 242,000 to 252,000 when only the spouse is covered; Roth phase-out 153,000 to 168,000 single, 242,000 to 252,000 MFJ; 10% early withdrawal penalty before 59.5; RMD age 73 (confirm). Trump account 5,000 per year, 2,500 employer portion, 1,000 federal seed, no withdrawals before the year the child turns 18. 529 to Roth rollover 35,000 lifetime, 529 open 15 years.',
    'Corporations: 21% rate; post-2017 NOL limited to 80% of taxable income, pre-2018 NOL 100% and used first; capital losses back 3 forward 5 as short term and only against capital gains; DRD 50% under 20% ownership, 65% at 20 to under 80, 100% at 80 or more; charitable 10% ceiling and 1% floor; 351 control 80%; affiliated group 80% vote and value; 1244 ordinary loss 50,000 or 100,000 MFJ; 1202 gross asset limit 50,000,000 or 75,000,000 for stock issued after July 4, 2025; 30% withholding on passive US income of foreign persons; CFC more than 50% owned by 10% US shareholders.',
    'S corporations: 100 shareholder limit; built-in gains tax 21% for 5 years, lesser of net unrealized built-in gain, recognized built-in gain, or taxable income as a C corporation; passive investment income test 25% of gross receipts, 3 consecutive years ends the election; 5 year wait to re-elect; more than 2% shareholder taxed on fringe benefits; QBI deduction 20%; SE tax 15.3% on 92.35% of net earnings.',
    'Partnerships: mandatory 743(b) or 734(b) adjustment when the built-in loss exceeds 250,000; contributed property distributed to another partner within 7 years triggers the contributor gain; contributed inventory stays ordinary for 5 years; related partner loss disallowed over 50% ownership; disguised sale presumed within 2 years.',
    'Trusts: exemption 300 simple, 100 complex, 600 estate; 65 day election. Exempt organizations: UBI specific deduction 1,000; UBI tax at 21%.',
    'Property: home sale exclusion 250,000 or 500,000 MFJ, own and use 2 of 5 years; involuntary conversion replacement 2 years, 3 years for condemned business real estate; like-kind 45 days to identify and 180 days to close, related party 2 year holding; 1231 holding period more than 12 months, 5 year lookback; unrecaptured 1250 gain taxed up to 25% for individuals; Section 291 20% for C corporations; related party test more than 50%.'
  ].join('\n');
}

function compareTable(){
  const ref = window.TCP_REFERENCE && window.TCP_REFERENCE.compare;
  if(!ref) return '';
  const strip = s => String(s).replace(/<[^>]+>/g,'');
  const lines = ['Entity side-by-side (C corporation | S corporation | Partnership or LLC):'];
  for(const r of ref.rows){ lines.push(strip(r[0])+': '+strip(r[1])+' | '+strip(r[2])+' | '+strip(r[3])); }
  return lines.join('\n');
}

function cheatSheetText(){
  const cs = window.TCP_CHEATSHEET;
  if(!cs) return '';
  const out = ['Zach\'s own cheat sheet (some dollar figures on it are 2025 amounts; the 2026 corrections follow):'];
  for(const p of cs.pages){ out.push('[Page '+p.page+'] '+p.lines.join(' / ')); }
  out.push('2026 corrections to the cheat sheet:');
  for(const c of cs.corrections){ out.push(c.item+': sheet says '+c.sheet+'; use '+c.now); }
  return out.join('\n');
}

function staticSystem(includeCheatSheet){
  const parts = [
`You are Zach's TCP tutor. Zach is studying for the TCP (Tax Compliance and Planning) section of the CPA exam, scheduled for Thursday, October 29, 2026, using Becker CPA Review version 1.4 (2026 tax law). You are embedded in his study site, the TCP Decision Tree Trainer, which holds entity transaction decision trees (C corporation, S corporation, partnership), an original Becker-style question bank, and his miss log.

How to answer:
- Answer from 2026 law and the key numbers below first. If the numbers conflict with your own knowledge, say so instead of choosing silently. Flag any dollar amount not marked as a checked 2026 figure.
- Teach with worked numeric examples. Most of the exam is application and analysis.
- When quizzing, ask one question at a time, wait for the answer, then explain. Write practice questions yourself. Never reproduce Becker questions, answer explanations, or simulations.
- Refer to Becker modules by code (for example T3 M2).
- Keep answers short unless asked for depth. For a practice MCQ, give the letter and a brief explanation only.
- No em dashes or en dashes. Write arithmetic in words or with x and =.
- When he reports a miss, help him state why he missed it and the rule in one line for his miss log: date, module, question ID, topic, why missed, rule in one line.
- Known weaknesses: calculation heavy simulations, accuracy dropping in long sessions, repeating the same misses. Suggest sets of 25 questions or fewer and a written note for every miss.

Explanation format (build explanations like Becker's own, in original words):
1. Answer line first (letter and amount for an MCQ; one line per column for a grid).
2. One short paragraph per entity or shareholder, in the same order every time; keep parallel items parallel.
3. Start from the total with its source shown inline, for example "Total to A is 100,000 (400,000 x 25%)".
4. State the ordering rule at the moment it is used, in one plain sentence.
5. Fill each layer with the arithmetic in parentheses.
6. Get the remainder as an explicit subtraction chain.
7. Say where the remainder goes and why, then any ending balance.
8. Close with a check that the layers add back to the total.
For a leading walkthrough (he has not answered yet), use the same chain with ? in place of the computed numbers and do not give the answer unless he asks.`,
    keyNumbers(),
    compareTable()
  ];
  if(includeCheatSheet) parts.push(cheatSheetText());
  return parts.join('\n\n');
}

// ---------- state ----------
let state = load();
function load(){ try{ const s = JSON.parse(localStorage.getItem(STORE_KEY)||'null'); if(s && Array.isArray(s.messages)) return s; }catch(e){} return {messages:[], context:null}; }
function save(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify({messages: state.messages.slice(-40), context: state.context})); }catch(e){} }
let streaming = false;
let abortCtl = null;

function settings(){ return (window.TCPApp && window.TCPApp.settings()) || {}; }

// ---------- rendering ----------
function md(src){
  // minimal, safe markdown: code fences, inline code, bold, italics, headings, lists, tables, paragraphs
  let s = esc(src);
  s = s.replace(/```[a-z]*\n([\s\S]*?)```/g, (m, code) => '<span class="md-code">'+code.replace(/\n$/,'')+'</span>');
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  const blocks = s.split(/\n{2,}/);
  const html = blocks.map(b => {
    const lines = b.split('\n');
    if(lines.every(l => /^\s*[-*•]\s+/.test(l))) return '<ul>'+lines.map(l=>'<li>'+l.replace(/^\s*[-*•]\s+/,'')+'</li>').join('')+'</ul>';
    if(lines.every(l => /^\s*\d+[.)]\s+/.test(l))) return '<ol>'+lines.map(l=>'<li>'+l.replace(/^\s*\d+[.)]\s+/,'')+'</li>').join('')+'</ol>';
    if(lines.length>=2 && lines.every(l=>/\|/.test(l))){
      const rows = lines.filter(l=>!/^\s*\|?\s*:?-{2,}/.test(l)).map(l=>l.replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|').map(c=>c.trim()));
      return '<table>'+rows.map((r,i)=>'<tr>'+r.map(c=>(i===0?'<th>':'<td>')+c+(i===0?'</th>':'</td>')).join('')+'</tr>').join('')+'</table>';
    }
    if(/^#{1,3}\s/.test(lines[0]) && lines.length===1) return '<h3>'+lines[0].replace(/^#{1,3}\s+/,'')+'</h3>';
    if(b.startsWith('<span class="md-code">')) return b;
    return '<p>'+lines.join('<br>')+'</p>';
  }).join('');
  return html;
}

function renderMessages(){
  const box = $('#chat-messages'); if(!box) return;
  if(!state.messages.length){
    box.innerHTML = '<div class="msg system">Ask anything about TCP. Open a question first and the tutor sees it automatically.</div>';
    return;
  }
  box.innerHTML = state.messages.map((m,i) => {
    if(m.role==='user') return '<div class="msg user">'+esc(m.content)+'</div>';
    if(m.role==='error') return '<div class="msg error">'+esc(m.content)+'</div>';
    const last = (i===state.messages.length-1) && streaming;
    return '<div class="msg assistant'+(last?' streaming':'')+'">'+md(m.content)+'</div>';
  }).join('');
  box.scrollTop = box.scrollHeight;
}

function renderContext(){
  const wrap = $('#chat-context'); if(!wrap) return;
  if(state.context){
    wrap.hidden = false;
    $('#chat-context-text').textContent = state.context.label;
  } else wrap.hidden = true;
  renderQuick();
}

function renderQuick(){
  const q = $('#chat-quick'); if(!q) return;
  const chips = state.context ? [
    ['Why is my answer wrong?', 'Explain why my answer was wrong and what the right chain of reasoning is, step by step, in the Becker format.'],
    ['Walk the chain', 'Walk me through the computation chain for this question with every number sourced in parentheses, then close with a check.'],
    ['Similar problem', 'Give me one similar original problem on the same rule with different numbers. Do not give the answer until I respond.'],
    ['Miss log line', 'Write my miss log line for this question: date, module, question ID, topic, why missed, rule in one line.']
  ] : [
    ['Quiz me', 'Quiz me with one original Becker-style question on the entity decision trees (C corp, S corp, or partnership distributions). One question at a time; wait for my answer.'],
    ['E&P ordering example', 'Give me a worked example of the four E&P combinations for a C corporation distribution using the Becker explanation format.'],
    ['Partnership liquidation', 'Explain the partnership liquidating distribution basis rules (cash, hot assets, other property) with one worked example.'],
    ['What should I study today?', 'Given my weak topics in the context, what should I study today and in what order? Keep it to a short plan with sets of 25 questions or fewer.']
  ];
  q.innerHTML = chips.map(([l,p]) => '<button type="button" data-prompt="'+esc(p)+'">'+esc(l)+'</button>').join('');
}

function status(kind, text){
  const dot = $('#api-dot'), t = $('#api-status-text');
  if(dot){ dot.className = 'dot'+(kind==='on'?' on':kind==='busy'?' busy':''); }
  if(t) t.textContent = text;
}

function updateBadge(){
  const s = settings();
  const badge = $('#chat-model-badge'); if(badge) badge.textContent = s.model || 'claude-sonnet-5-5';
  if(!s.apiKey) status('off','No API key'); else status('on', (MODELS[s.model]||{}).label || s.model);
}

// ---------- API ----------
function buildSystem(){
  const s = settings();
  const blocks = [{type:'text', text: staticSystem(s.includeCheatSheet !== false), cache_control:{type:'ephemeral'}}];
  const dyn = [];
  dyn.push('Today is '+new Date().toDateString()+'.');
  if(window.TCPApp && window.TCPApp.progressSummary) dyn.push(window.TCPApp.progressSummary());
  if(state.context && state.context.text) dyn.push('Current question context:\n'+state.context.text);
  blocks.push({type:'text', text: dyn.join('\n\n')});
  return blocks;
}

async function request(body, withFallback, signal){
  const s = settings();
  const headers = {
    'content-type':'application/json',
    'x-api-key': s.apiKey,
    'anthropic-version': API_VERSION,
    'anthropic-dangerous-direct-browser-access':'true'
  };
  const payload = Object.assign({}, body);
  if(withFallback){ headers['anthropic-beta'] = FALLBACK_BETA; payload.fallbacks = 'default'; }
  return fetch(API_URL, {method:'POST', headers, body: JSON.stringify(payload), signal});
}

async function send(text){
  const s = settings();
  if(!s.apiKey){ state.messages.push({role:'error', content:'Add your Anthropic API key in Settings first. It stays in this browser and is sent only to api.anthropic.com.'}); renderMessages(); return; }
  if(streaming) return;
  state.messages.push({role:'user', content:text});
  const history = state.messages.filter(m=>m.role==='user'||m.role==='assistant').slice(-30).map(m=>({role:m.role, content:m.content}));
  state.messages.push({role:'assistant', content:''});
  streaming = true; save(); renderMessages(); status('busy','Thinking…');
  abortCtl = new AbortController();
  const model = s.model || 'claude-sonnet-5-5';
  const body = {
    model,
    max_tokens: 8192,
    system: buildSystem(),
    messages: history,
    stream: true,
    output_config: {effort: s.effort || 'medium'}
  };
  const useFallback = !!(MODELS[model] && MODELS[model].fallbacks);
  try{
    let res = await request(body, useFallback, abortCtl.signal);
    if(!res.ok && useFallback && res.status===400){
      const errText = await res.text();
      if(/fallback|beta|unexpected|not supported/i.test(errText)) res = await request(body, false, abortCtl.signal);
      else throw new Error(describeError(res.status, errText));
    }
    if(!res.ok){ throw new Error(describeError(res.status, await res.text())); }
    await readStream(res);
  }catch(err){
    const last = state.messages[state.messages.length-1];
    if(last && last.role==='assistant' && !last.content) state.messages.pop();
    if(err.name!=='AbortError') state.messages.push({role:'error', content: err.message || String(err)});
  }finally{
    streaming = false; abortCtl = null; save(); renderMessages(); updateBadge();
  }
}

function describeError(status, text){
  let msg = '';
  try{ const j = JSON.parse(text); msg = (j.error && (j.error.message||j.error.type)) || text; }catch(e){ msg = text; }
  if(status===401) return 'The API rejected the key (401). Check it in Settings.';
  if(status===429) return 'Rate limited (429). Wait a moment and try again.';
  if(status===529 || status>=500) return 'The API is overloaded or unavailable ('+status+'). Try again shortly.';
  return 'API error '+status+': '+msg;
}

async function readStream(res){
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const last = () => state.messages[state.messages.length-1];
  let refusal = null, fellBack = null;
  for(;;){
    const {value, done} = await reader.read();
    if(done) break;
    buf += dec.decode(value, {stream:true});
    let idx;
    while((idx = buf.indexOf('\n\n')) >= 0){
      const chunk = buf.slice(0, idx); buf = buf.slice(idx+2);
      const dataLine = chunk.split('\n').find(l=>l.startsWith('data:'));
      if(!dataLine) continue;
      let ev; try{ ev = JSON.parse(dataLine.slice(5).trim()); }catch(e){ continue; }
      if(ev.type==='content_block_delta' && ev.delta && ev.delta.type==='text_delta'){
        last().content += ev.delta.text; renderMessages();
      } else if(ev.type==='message_start' && ev.message){
        if(ev.message.model && ev.message.model !== (settings().model||'claude-sonnet-5-5')) fellBack = ev.message.model;
      } else if(ev.type==='message_delta' && ev.delta){
        if(ev.delta.stop_reason==='refusal') refusal = ev.delta.stop_details || {};
        if(ev.delta.stop_reason==='max_tokens') last().content += '\n\n[Reached the length limit. Ask me to continue.]';
      } else if(ev.type==='error'){
        throw new Error((ev.error && ev.error.message) || 'Stream error');
      }
    }
  }
  if(refusal){ last().content += (last().content?'\n\n':'')+'[The model declined this request'+(refusal.category?' ('+refusal.category+')':'')+'. Try rephrasing.]'; }
  if(fellBack){ state.messages.push({role:'error', content:'Note: the request was served by '+fellBack+' through the server-side fallback.'}); }
}

async function testKey(key, model){
  const headers = {'content-type':'application/json','x-api-key':key,'anthropic-version':API_VERSION,'anthropic-dangerous-direct-browser-access':'true'};
  const res = await fetch(API_URL, {method:'POST', headers, body: JSON.stringify({model: model||'claude-sonnet-5-5', max_tokens: 20, messages:[{role:'user', content:'Reply with the single word OK.'}]})});
  if(!res.ok) throw new Error(describeError(res.status, await res.text()));
  const j = await res.json();
  return (j.content||[]).map(c=>c.text||'').join('').trim();
}

// ---------- panel controls ----------
function open(ctx){
  if(ctx) setContext(ctx);
  document.getElementById('app').classList.add('chat-open');
  const c = $('#chat'); c.setAttribute('aria-hidden','false');
  $('#btn-chat').setAttribute('aria-expanded','true');
  renderContext(); renderMessages(); updateBadge();
  setTimeout(()=>{ const i=$('#chat-input'); if(i) i.focus(); }, 120);
}
function close(){
  document.getElementById('app').classList.remove('chat-open');
  $('#chat').setAttribute('aria-hidden','true');
  $('#btn-chat').setAttribute('aria-expanded','false');
}
function toggle(){ document.getElementById('app').classList.contains('chat-open') ? close() : open(); }
function setContext(ctx){ state.context = ctx; save(); renderContext(); }
function clearContext(){ state.context = null; save(); renderContext(); }
function clearAll(){ state.messages = []; save(); renderMessages(); }

function autosize(ta){ ta.style.height='auto'; ta.style.height = Math.min(160, ta.scrollHeight)+'px'; }

document.addEventListener('DOMContentLoaded', () => {
  $('#btn-chat').addEventListener('click', toggle);
  const sb = $('#btn-sidebar-chat'); if(sb) sb.addEventListener('click', ()=>open());
  $('#chat-close').addEventListener('click', close);
  $('#scrim').addEventListener('click', close);
  $('#chat-clear').addEventListener('click', ()=>{ if(streaming && abortCtl) abortCtl.abort(); clearAll(); });
  $('#chat-context-clear').addEventListener('click', clearContext);
  $('#chat-quick').addEventListener('click', e => { const b = e.target.closest('button[data-prompt]'); if(b) send(b.dataset.prompt); });
  const form = $('#chat-form'), input = $('#chat-input');
  form.addEventListener('submit', e => { e.preventDefault(); const t = input.value.trim(); if(!t) return; input.value=''; autosize(input); send(t); });
  input.addEventListener('input', ()=>autosize(input));
  input.addEventListener('keydown', e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); form.requestSubmit(); } });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && document.getElementById('app').classList.contains('chat-open')) close(); });
  renderContext(); renderMessages(); updateBadge();
});

window.TCPChat = { open, close, toggle, setContext, clearContext, clearAll, send, testKey, updateBadge, MODELS };
})();
