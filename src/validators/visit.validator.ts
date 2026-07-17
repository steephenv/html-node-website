import { z } from 'zod';

export const visitSchema = z.object({
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(500).optional(),
});

export type VisitInput = z.infer<typeof visitSchema>;
