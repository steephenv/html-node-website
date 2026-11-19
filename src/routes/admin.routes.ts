import { Router } from 'express';
import rateLimit from 'express-rate-limit';
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
  }),
);
adminRouter.use(requireAdmin);

adminRouter.get('/visitors', listVisitors);
adminRouter.get('/visitors/:id/visits', getVisitorVisits);
