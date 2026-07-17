import { RequestHandler } from 'express';
import geoip from 'geoip-lite';
import { Visit } from '../models/visit.model';
import { visitSchema } from '../validators/visit.validator';
import { AppError } from '../errors/app-error';

export const recordVisit: RequestHandler = async (req, res, next) => {
  try {
    const parsed = visitSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(422, parsed.error.issues.map(issue => issue.message).join(', '));
    }

    const ip = req.ip || '';
    const geo = geoip.lookup(ip);

    await Visit.create({
      ip,
      country: geo?.country,
      region: geo?.region,
      city: geo?.city,
      timezone: geo?.timezone,
      path: parsed.data.path,
      referrer: parsed.data.referrer,
      userAgent: req.get('user-agent'),
    });

    return res.status(201).json({ success: true });
  } catch (err) {
    return next(err);
  }
};
