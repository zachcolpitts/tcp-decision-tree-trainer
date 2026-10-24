// Render host for the TCP Decision Tree Trainer.
// Serves the static site and relays the tutor chat to the Anthropic Messages API
// with the key held in the ANTHROPIC_API_KEY environment variable, so the key never
// reaches the browser. Optional APP_PIN gates the relay. No dependencies: Node 22 fetch.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 10000);
const ROOT = __dirname;
const API_KEY = (process.env.ANTHROPIC_API_KEY || '').trim();
const APP_PIN = (process.env.APP_PIN || '').trim();
const DEFAULT_MODEL = (process.env.CLAUDE_MODEL || 'claude-sonnet-5-5').trim();
const ALLOWED_MODELS = new Set(['claude-sonnet-5-5', 'claude-opus-5-5', 'claude-haiku-5-5', DEFAULT_MODEL]);
const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
const MAX_BODY = 2 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.map': 'application/json'
};

function send(res, status, body, headers) {
  const h = Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, headers || {});
  res.writeHead(status, h);
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { reject(new Error('body too large')); req.destroy(); return; } chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function pinOk(req) {
  if (!APP_PIN) return true;
  return String(req.headers['x-app-pin'] || '') === APP_PIN;
}

async function relay(req, res) {
  if (!API_KEY) return send(res, 503, { error: { type: 'no_key', message: 'ANTHROPIC_API_KEY is not set on this host.' } });
  if (!pinOk(req)) return send(res, 401, { error: { type: 'pin', message: 'Tutor PIN missing or wrong. Enter it in Settings.' } });
  let body;
  try { body = JSON.parse(await readBody(req) || '{}'); } catch (e) { return send(res, 400, { error: { type: 'bad_json', message: 'Request body must be JSON.' } }); }
  if (!body || !Array.isArray(body.messages)) return send(res, 400, { error: { type: 'bad_request', message: 'messages[] is required.' } });
  const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
  const payload = Object.assign({}, body, { model, max_tokens: Math.min(Number(body.max_tokens) || 4096, 8192) });
  const useFallback = String(req.headers['x-use-fallback'] || '') === '1' && model !== 'claude-haiku-5-5';
  const headers = { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': API_VERSION };
  if (useFallback) { headers['anthropic-beta'] = FALLBACK_BETA; payload.fallbacks = 'default'; } else { delete payload.fallbacks; }

  let upstream;
  try {
    upstream = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!upstream.ok && useFallback && upstream.status === 400) {
      const text = await upstream.text();
      if (/fallback|beta|unexpected|not supported/i.test(text)) {
        delete headers['anthropic-beta']; delete payload.fallbacks;
        upstream = await fetch(API_URL, { method: 'POST', headers, body: JSON.stringify(payload) });
      } else {
        return send(res, 400, text, { 'content-type': 'application/json; charset=utf-8' });
      }
    }
  } catch (e) {
    return send(res, 502, { error: { type: 'upstream', message: 'Could not reach the Anthropic API: ' + e.message } });
  }
  if (!upstream.ok) {
    const text = await upstream.text();
    return send(res, upstream.status, text, { 'content-type': upstream.headers.get('content-type') || 'application/json' });
  }
  const ct = upstream.headers.get('content-type') || 'application/json';
  res.writeHead(200, { 'content-type': ct, 'cache-control': 'no-store', 'x-accel-buffering': 'no' });
  if (!upstream.body) return res.end();
  try {
    for await (const chunk of upstream.body) { res.write(chunk); }
  } catch (e) { /* client went away or upstream ended */ }
  res.end();
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const file = path.join(ROOT, safe);
  if (!file.startsWith(ROOT) || path.basename(file).startsWith('.') || /^(server\.js|package\.json|render\.yaml)$/.test(path.basename(file))) {
    return send(res, 404, { error: 'not found' });
  }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, { error: 'not found' });
    const ext = path.extname(file).toLowerCase();
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=300';
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'content-length': st.size, 'cache-control': cache });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/api/health') return send(res, 200, { ok: true, chat: !!API_KEY, pin: !!APP_PIN, model: DEFAULT_MODEL });
  if (url === '/api/chat') {
    if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
    return relay(req, res).catch(e => send(res, 500, { error: { type: 'server', message: e.message } }));
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'GET only' });
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`TCP trainer listening on ${PORT}; chat relay ${API_KEY ? 'enabled' : 'disabled (no ANTHROPIC_API_KEY)'}; pin ${APP_PIN ? 'required' : 'off'}`);
});
