import express, { Express, Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

export async function createApp(): Promise<Express> {
  const app = express();

  app.use(express.json());

  // Handle Root POST request (e.g., Cloud Shell / gcloud curl pings)
  app.post('/', (req: Request, res: Response) => {
    const name = req.body?.name || 'Developer';
    res.status(200).json({
      success: true,
      message: `Hello ${name}! Welcome to CashBridge Hyperlocal Cash ↔ UPI Exchange platform backend.`,
      status: 'online',
      service: 'CashBridge Real-Time API Engine',
      documentation: '/api/info',
      health: '/api/health',
      timestamp: new Date().toISOString()
    });
  });

  // Mount modular REST API routes
  app.use('/api', apiRouter);

  // Error handling middleware
  app.use(errorHandler);

  // Vite development middlewares or production static assets for SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  return app;
}
