const http = require('http');
const fs = require('fs');
const path = require('path');

function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/health', (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function loadAuth() {
  const envPath = path.resolve(process.cwd(), '.env');
  const content = fs.readFileSync(envPath, 'utf-8');
  const match = content.match(/^KIMO_PASSWORD_HASH=(.+)$/m);
  if (!match) {
    console.error('{"error":"KIMO_PASSWORD_HASH no encontrado en .env"}');
    process.exit(1);
  }
  return match[1].trim();
}

function parseJsonArg(arg, scriptName) {
  try {
    return JSON.parse(arg);
  } catch {
    console.error(`{"error":"JSON inválido en argumento. Uso: node ${scriptName} '{\"key\":\"value\"}'"}`);
    process.exit(1);
  }
}

function postJSON(hostname, port, pPath, body, auth) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    };
    if (auth) headers['Authorization'] = `Bearer ${auth}`;

    const req = http.request(
      { hostname, port, path: pPath, method: 'POST', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      },
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = { checkBackend, loadAuth, parseJsonArg, postJSON };
