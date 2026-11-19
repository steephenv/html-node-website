import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: required('MONGODB_URI'),
  corsOrigins: (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  isProduction: process.env.NODE_ENV === 'production',
  ipinfoToken: process.env.IPINFO_TOKEN || '',
  // Optional bearer token for the read-only /api/admin endpoints. When unset they're public.
  adminToken: process.env.ADMIN_TOKEN || '',
};
