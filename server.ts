import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const FLASK_PORT = 5000;

  let flaskProcess: ChildProcess | null = null;
  let isShuttingDown = false;

  // Launch Python Flask backend in background
  function launchFlask() {
    if (isShuttingDown) return;
    try {
      flaskProcess = spawn('python3', ['app.py'], {
        cwd: path.resolve('.'),
        env: { ...process.env, PORT: `${FLASK_PORT}`, PYTHONUNBUFFERED: '1' },
        stdio: 'inherit'
      });

      flaskProcess.on('error', (err) => {
        console.error('Python Flask error:', err);
      });

      flaskProcess.on('exit', (code, signal) => {
        console.log(`Python Flask process exited with code ${code} and signal ${signal}`);
        if (!isShuttingDown) {
          setTimeout(launchFlask, 2000);
        }
      });
    } catch (e) {
      console.error('Could not spawn flask:', e);
    }
  }

  launchFlask();

  // Clean up on exit
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

  // Health check endpoints
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.get('/ping', (_req, res) => {
    res.status(200).send('pong');
  });

  // Proxy /flask/* routes to Python backend if desired
  app.use('/flask', (req, res) => {
    const options: http.RequestOptions = {
      hostname: '127.0.0.1',
      port: FLASK_PORT,
      path: req.originalUrl.replace(/^\/flask/, '') || '/',
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${FLASK_PORT}`,
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Flask backend starting up...');
    });

    req.pipe(proxyReq);
  });

  // Mount Vite development middlewares to serve React SPA
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> [Runner] React SPA & Zaiqa Royale Gateway running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
