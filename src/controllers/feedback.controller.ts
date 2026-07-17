import { RequestHandler } from 'express';
import { Feedback } from '../models/feedback.model';
import { feedbackSchema } from '../validators/feedback.validator';
import { AppError } from '../errors/app-error';

export const createFeedback: RequestHandler = async (req, res, next) => {
  try {
    const parsed = feedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(422, parsed.error.issues.map(issue => issue.message).join(', '));
    }

    await Feedback.create(parsed.data);

    return res.status(201).json({ success: true });
  } catch (err) {
    return next(err);
  }
};
