import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
  const frontendDirectory = path.resolve(currentDirectory, '../../frontend/dist');

  app.use(express.static(frontendDirectory));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(frontendDirectory, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
