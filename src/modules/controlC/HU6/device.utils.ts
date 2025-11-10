import UAParser from 'ua-parser-js';
import crypto from 'crypto';

export function generateDeviceId() {
  return crypto.randomBytes(16).toString('hex');
}

export function getDeviceType(userAgent: string) {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  if (device.type === 'mobile') return 'Mobile';
  if (device.type === 'tablet') return 'Tablet';
  if (device.type === 'desktop' || !device.type) return 'Desktop';
  return 'Other';
}
