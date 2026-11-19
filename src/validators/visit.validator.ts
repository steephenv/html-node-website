import { z } from 'zod';

export const visitSchema = z.object({
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(500).optional(),
  visitorId: z
    .string()
    .regex(/^[A-Za-z0-9-]{8,64}$/, 'Invalid visitorId')
    .optional(),
});

export type VisitInput = z.infer<typeof visitSchema>;
