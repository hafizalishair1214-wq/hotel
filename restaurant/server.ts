import express from 'express';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

const app = express();
const PORT = 3000;
const FLASK_PORT = 5000;

let flaskProcess: ChildProcess | null = null;
let isShuttingDown = false;

// Spawn and monitor Python Flask backend
function launchFlask() {
  if (isShuttingDown) return;
  console.log(`>>> [Runner] Spawning Python Flask server on port ${FLASK_PORT}...`);
  flaskProcess = spawn('python3', ['app.py'], {
    cwd: path.resolve('.'),
    env: { ...process.env, PORT: `${FLASK_PORT}`, PYTHONUNBUFFERED: '1' },
    stdio: 'inherit'
  });

  flaskProcess.on('error', (err) => {
    console.error('Failed to start Python Flask process:', err);
  });

  flaskProcess.on('exit', (code, signal) => {
    console.log(`Python Flask process exited with code ${code} and signal ${signal}`);
    if (!isShuttingDown) {
      console.log('>>> [Runner] Auto-restarting Python Flask in 1.5s...');
      setTimeout(launchFlask, 1500);
    }
  });
}

launchFlask();

// Clean up child process on exit
process.on('SIGINT', () => {
  isShuttingDown = true;
  if (flaskProcess) flaskProcess.kill();
  process.exit();
});
process.on('SIGTERM', () => {
  isShuttingDown = true;
  if (flaskProcess) flaskProcess.kill();
  process.exit();
});

// Health check endpoints for Cloud Run / AI Studio container probes
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/ping', (_req, res) => {
  res.status(200).send('pong');
});

// Reverse proxy all incoming requests to Flask on port 5000
app.use((req, res) => {
  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: FLASK_PORT,
    path: req.originalUrl || req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${FLASK_PORT}`,
      'x-forwarded-for': req.ip,
      'x-forwarded-proto': req.protocol,
      'x-forwarded-host': req.headers.host || `localhost:${PORT}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (_err) => {
    // If Flask is briefly booting or warming up, return 200 with auto-refreshing splash
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <title>Zaiqa Royale — Connecting...</title>
  <meta http-equiv="refresh" content="1">
  <style>
    body {
      background-color: #0A0B0D;
      color: #FAF7F2;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
    }
    .loader-box {
      background: #121418;
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 14px;
      padding: 2.5rem;
      max-width: 480px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
    h1 {
      font-family: Georgia, serif;
      color: #D4AF37;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      letter-spacing: 0.1em;
    }
    p { color: #B3ABA0; font-size: 0.95rem; line-height: 1.6; }
    .spinner {
      width: 42px;
      height: 42px;
      border: 3px solid rgba(212, 175, 55, 0.2);
      border-top-color: #D4AF37;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 1.5rem auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader-box">
    <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">👑</div>
    <h1>ZAIQA ROYALE</h1>
    <p style="color: #F3E5AB; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;">A Royal Taste of Lahore</p>
    <div class="spinner"></div>
    <p>Igniting royal clay tandoors and warming spices...<br>Connecting to Python Flask & SQLite engine.</p>
  </div>
</body>
</html>`);
  });

  req.pipe(proxyReq);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> [Runner] Zaiqa Royale Gateway running on http://0.0.0.0:${PORT}`);
  console.log(`>>> [Runner] Proxied to Flask backend on http://127.0.0.1:${FLASK_PORT}`);
});
