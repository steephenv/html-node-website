import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createFeedback } from '../controllers/feedback.controller';

export const feedbackRouter = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions, please try again later.' },
});

feedbackRouter.post('/', submitLimiter, createFeedback);
