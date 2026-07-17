import { UAParser } from 'ua-parser-js';

export interface UAResult {
  browser?: string;
  os?: string;
  device?: string;
}

export function parseUserAgent(userAgent?: string): UAResult {
  if (!userAgent) {
    return {};
  }

  const result = new UAParser(userAgent).getResult();
  return {
    browser: result.browser.name,
    os: result.os.name,
    device: result.device.type || 'desktop',
  };
}
