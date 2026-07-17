import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { recordVisit } from '../controllers/visit.controller';

export const visitRouter = Router();

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

visitRouter.post('/', trackLimiter, recordVisit);
