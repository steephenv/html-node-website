import { Schema, model } from 'mongoose';

export interface VisitDocument {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  createdAt: Date;
}

const visitSchema = new Schema<VisitDocument>(
  {
    ip: { type: String, required: true },
    country: { type: String },
    region: { type: String },
    city: { type: String },
    timezone: { type: String },
    path: { type: String, required: true, trim: true },
    referrer: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  {
    collection: 'visits',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Visit = model<VisitDocument>('Visit', visitSchema);
