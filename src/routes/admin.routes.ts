import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { clientIp } from '../utils/client-ip';
import { requireAdmin } from '../middleware/require-admin';
import { listVisitors, getVisitorVisits } from '../controllers/admin.controller';

export const adminRouter = Router();

// Throttle before auth so token guessing is rate limited too.
adminRouter.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    // key on the real visitor IP (Cloudflare header), not the shared proxy hop
    keyGenerator: req => clientIp(req),
  }),
);
adminRouter.use(requireAdmin);

adminRouter.get('/visitors', listVisitors);
adminRouter.get('/visitors/:id/visits', getVisitorVisits);
