import { Schema, model } from 'mongoose';

export interface VisitDocument {
  ip: string;
  visitorId?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  lat?: number;
  lng?: number;
  isp?: string;
  geoSource?: 'ipinfo' | 'geoip-lite';
  browser?: string;
  os?: string;
  device?: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  createdAt: Date;
}

const visitSchema = new Schema<VisitDocument>(
  {
    ip: { type: String, required: true },
    visitorId: { type: String, index: true },
    country: { type: String },
    region: { type: String },
    city: { type: String },
    timezone: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    isp: { type: String },
    geoSource: { type: String, enum: ['ipinfo', 'geoip-lite'] },
    browser: { type: String },
    os: { type: String },
    device: { type: String },
    path: { type: String, required: true, trim: true },
    referrer: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  {
    collection: 'visits',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

visitSchema.index({ createdAt: -1 });

export const Visit = model<VisitDocument>('Visit', visitSchema);
