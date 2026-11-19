import { Request } from 'express';
import { isIP } from 'net';

/**
 * Real client IP on Render.
 *
 * Every request to *.onrender.com passes Cloudflare, which sets CF-Connecting-IP /
 * True-Client-IP to the connecting client and overwrites any value the client sent,
 * so these can't be spoofed. Behind Cloudflare there are one or more private Render
 * hops, so req.ip alone resolves to an internal 10.x address.
 *
 * Fallback (local dev, other hosts): req.ip, with Express trusting private-network hops.
 */
export function clientIp(req: Request): string {
  for (const header of ['cf-connecting-ip', 'true-client-ip']) {
    const value = req.get(header)?.trim();
    if (value && isIP(value)) {
      return value;
    }
  }
  return req.ip || '';
}
