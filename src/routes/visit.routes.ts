import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { clientIp } from '../utils/client-ip';
import { recordVisit } from '../controllers/visit.controller';

export const visitRouter = Router();

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  // key on the real visitor IP (Cloudflare header), not the shared proxy hop
  keyGenerator: req => clientIp(req),
});

visitRouter.post('/', trackLimiter, recordVisit);
