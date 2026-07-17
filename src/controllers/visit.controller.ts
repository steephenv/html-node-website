import { RequestHandler } from 'express';
import { Visit } from '../models/visit.model';
import { visitSchema } from '../validators/visit.validator';
import { AppError } from '../errors/app-error';
import { lookupGeo } from '../utils/geo-lookup';
import { parseUserAgent } from '../utils/parse-user-agent';

export const recordVisit: RequestHandler = async (req, res, next) => {
  try {
    const parsed = visitSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(422, parsed.error.issues.map(issue => issue.message).join(', '));
    }

    const ip = req.ip || '';
    const userAgent = req.get('user-agent');
    const [geo, ua] = await Promise.all([lookupGeo(ip), Promise.resolve(parseUserAgent(userAgent))]);

    await Visit.create({
      ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      timezone: geo.timezone,
      lat: geo.lat,
      lng: geo.lng,
      isp: geo.isp,
      geoSource: geo.source,
      browser: ua.browser,
      os: ua.os,
      device: ua.device,
      path: parsed.data.path,
      referrer: parsed.data.referrer,
      userAgent,
    });

    return res.status(201).json({ success: true });
  } catch (err) {
    return next(err);
  }
};
