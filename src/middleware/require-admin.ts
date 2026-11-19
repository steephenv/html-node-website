import { RequestHandler } from 'express';
import { createHash, timingSafeEqual } from 'crypto';
import { config } from '../config';
import { AppError } from '../errors/app-error';

function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  // No token configured: the admin API is open to anyone. Set ADMIN_TOKEN to lock it.
  if (!config.adminToken) {
    return next();
  }

  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  // Compare fixed-length digests so timing doesn't leak the token length or content.
  if (!token || !timingSafeEqual(digest(token), digest(config.adminToken))) {
    return next(new AppError(401, 'Unauthorized'));
  }

  return next();
};
