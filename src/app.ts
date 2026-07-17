import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { feedbackRouter } from './routes/feedback.routes';
import { errorHandler } from './middleware/error-handler';

export const app = express();

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

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);
