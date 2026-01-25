import { Request } from 'express';

export class IpUtil {
  static getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
      return ips.trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  static isIpInCidr(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const mask = parseInt(bits, 10);

    if (isNaN(mask) || mask < 0 || mask > 32) return false;

    const ipLong = this.ipToLong(ip);
    const rangeLong = this.ipToLong(range);

    if (ipLong === null || rangeLong === null) return false;

    const maskLong = mask === 0 ? 0 : -1 << (32 - mask);
    return (ipLong & maskLong) === (rangeLong & maskLong);
  }

  static ipToLong(ip: string): number | null {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;

    let result = 0;
    for (const part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) return null;
      result = result * 256 + num;
    }
    return result >>> 0;
  }
}
