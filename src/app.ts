import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { feedbackRouter } from './routes/feedback.routes';
import { visitRouter } from './routes/visit.routes';
import { adminRouter } from './routes/admin.routes';
import { errorHandler } from './middleware/error-handler';

export const app = express();

// Render sits behind exactly one proxy; trusting more lets clients spoof X-Forwarded-For.
app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins.length ? config.corsOrigins : true,
  }),
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/feedback', feedbackRouter);
app.use('/api/visits', visitRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);
