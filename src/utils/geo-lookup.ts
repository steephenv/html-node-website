import geoip from 'geoip-lite';
import { config } from '../config';

export interface GeoResult {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  lat?: number;
  lng?: number;
  isp?: string;
  source: 'ipinfo' | 'geoip-lite';
}

interface IpinfoResponse {
  bogon?: boolean;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  loc?: string;
  org?: string;
}

async function lookupIpinfo(ip: string): Promise<GeoResult | null> {
  if (!config.ipinfoToken) {
    return null;
  }

  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${config.ipinfoToken}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as IpinfoResponse;
    if (data.bogon) {
      return null;
    }

    const [lat, lng] = typeof data.loc === 'string' ? data.loc.split(',').map(Number) : [undefined, undefined];

    return {
      country: data.country,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      lat,
      lng,
      isp: data.org,
      source: 'ipinfo',
    };
  } catch {
    return null;
  }
}

function lookupGeoipLite(ip: string): GeoResult {
  const geo = geoip.lookup(ip);
  return {
    country: geo?.country,
    region: geo?.region,
    city: geo?.city,
    timezone: geo?.timezone,
    lat: geo?.ll?.[0],
    lng: geo?.ll?.[1],
    source: 'geoip-lite',
  };
}

export async function lookupGeo(ip: string): Promise<GeoResult> {
  const ipinfoResult = await lookupIpinfo(ip);
  return ipinfoResult || lookupGeoipLite(ip);
}
