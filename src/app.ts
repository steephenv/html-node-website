import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { feedbackRouter } from './routes/feedback.routes';
import { visitRouter } from './routes/visit.routes';
import { adminRouter } from './routes/admin.routes';
import { errorHandler } from './middleware/error-handler';
import { clientIp } from './utils/client-ip';

export const app = express();

// Trust only private-network proxy hops (Render's internal load balancers), so req.ip skips
// them but a client can't spoof its address via X-Forwarded-For. See utils/client-ip.ts.
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
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

// Echoes the caller's own IP as the API sees it (useful to verify proxy setup).
app.get('/whoami', (req, res) => {
  res.json({ ip: clientIp(req) });
});

app.use('/api/feedback', feedbackRouter);
app.use('/api/visits', visitRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);
