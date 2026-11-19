import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { clientIp } from '../utils/client-ip';
import { createFeedback } from '../controllers/feedback.controller';

export const feedbackRouter = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // key on the real visitor IP (Cloudflare header), not the shared proxy hop
  keyGenerator: req => clientIp(req),
  message: { success: false, message: 'Too many submissions, please try again later.' },
});

feedbackRouter.post('/', submitLimiter, createFeedback);
