import { RequestHandler } from 'express';
import { z } from 'zod';
import { Visit } from '../models/visit.model';
import { AppError } from '../errors/app-error';

const listQuery = z.object({
  days: z.coerce.number().int().min(0).max(3650).default(30), // 0 = all time
  minVisits: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(500),
});

const IP_PREFIX = 'ip:';

/**
 * Visitors are grouped by the anonymous visitorId the site stores in the browser.
 * Older visits recorded before visitorId existed are grouped by IP instead.
 */
const visitorKey = { $ifNull: ['$visitorId', { $concat: [IP_PREFIX, '$ip'] }] };

export const listVisitors: RequestHandler = async (req, res, next) => {
  try {
    const parsed = listQuery.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(422, parsed.error.issues.map(issue => issue.message).join(', '));
    }
    const { days, minVisits, limit } = parsed.data;
    const match = days > 0 ? { createdAt: { $gte: new Date(Date.now() - days * 86_400_000) } } : {};

    const [result] = await Visit.aggregate([
      { $match: match },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: visitorKey,
          visits: { $sum: 1 },
          firstSeen: { $first: '$createdAt' },
          lastSeen: { $last: '$createdAt' },
          ips: { $addToSet: '$ip' },
          paths: { $addToSet: '$path' },
          referrers: { $addToSet: '$referrer' },
          days: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
          locations: {
            $addToSet: {
              lat: '$lat',
              lng: '$lng',
              city: '$city',
              region: '$region',
              country: '$country',
            },
          },
          last: { $last: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          visits: 1,
          firstSeen: 1,
          lastSeen: 1,
          activeDays: { $size: '$days' },
          ips: 1,
          paths: 1,
          referrers: { $filter: { input: '$referrers', cond: { $gt: ['$$this', null] } } },
          locations: { $filter: { input: '$locations', cond: { $isNumber: '$$this.lat' } } },
          country: '$last.country',
          region: '$last.region',
          city: '$last.city',
          timezone: '$last.timezone',
          lat: '$last.lat',
          lng: '$last.lng',
          isp: '$last.isp',
          browser: '$last.browser',
          os: '$last.os',
          device: '$last.device',
        },
      },
      { $match: { visits: { $gte: minVisits } } },
      {
        $facet: {
          visitors: [{ $sort: { lastSeen: -1 } }, { $limit: limit }],
          totals: [
            {
              $group: {
                _id: null,
                visitors: { $sum: 1 },
                visits: { $sum: '$visits' },
                returning: { $sum: { $cond: [{ $gte: ['$activeDays', 2] }, 1, 0] } },
                countries: { $addToSet: '$country' },
              },
            },
          ],
        },
      },
    ]);

    const totals = result?.totals?.[0];
    return res.json({
      success: true,
      range: { days, minVisits },
      totals: {
        visitors: totals?.visitors ?? 0,
        visits: totals?.visits ?? 0,
        returning: totals?.returning ?? 0,
        countries: (totals?.countries ?? []).filter(Boolean).length,
      },
      visitors: result?.visitors ?? [],
    });
  } catch (err) {
    return next(err);
  }
};

const idParam = z.string().min(1).max(100);

export const getVisitorVisits: RequestHandler = async (req, res, next) => {
  try {
    const parsed = idParam.safeParse(req.params.id);
    if (!parsed.success) {
      throw new AppError(422, 'Invalid visitor id');
    }
    const id = parsed.data;
    const filter = id.startsWith(IP_PREFIX)
      ? { ip: id.slice(IP_PREFIX.length), visitorId: { $exists: false } }
      : { visitorId: id };

    const visits = await Visit.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .select('-__v')
      .lean();

    return res.json({ success: true, id, visits });
  } catch (err) {
    return next(err);
  }
};
