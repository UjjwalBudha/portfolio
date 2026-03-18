import { describe, it, expect } from 'vitest';
import { buildCloudflareGeoData } from './cf-geoip.js';

describe('buildCloudflareGeoData', () => {
  it('marks request as proxied when cf-ray exists', () => {
    const result = buildCloudflareGeoData({
      'cf-ray': '90f56e0f1f9a2e53-KTM',
      'cf-connecting-ip': '203.0.113.11',
      'cf-ipcountry': 'NP',
      'cf-continent': 'AS',
      'cf-region': 'Bagmati Province',
      'cf-city': 'Kathmandu',
    });

    expect(result.network.proxiedByCloudflare).toBe(true);
    expect(result.network.rayId).toBe('90f56e0f1f9a2e53-KTM');
    expect(result.network.clientIp).toBe('203.0.113.11');
    expect(result.geo.country).toBe('NP');
    expect(result.geo.continent).toBe('AS');
    expect(result.headerPresence.cfIpCountry).toBe(true);
  });

  it('falls back to x-forwarded-for and non-proxied when cf headers are missing', () => {
    const result = buildCloudflareGeoData({
      'x-forwarded-for': '198.51.100.9, 10.0.0.2',
    });

    expect(result.network.proxiedByCloudflare).toBe(false);
    expect(result.network.clientIp).toBe('198.51.100.9');
    expect(result.geo.country).toBe(null);
    expect(result.headerPresence.cfRay).toBe(false);
  });

  it('accepts mixed-case header keys', () => {
    const result = buildCloudflareGeoData({
      'CF-RAY': 'abc123',
      'Cf-IpCountry': 'US',
      'CF-Connecting-IP': '1.2.3.4',
    });

    expect(result.network.proxiedByCloudflare).toBe(true);
    expect(result.network.rayId).toBe('abc123');
    expect(result.geo.country).toBe('US');
    expect(result.network.clientIp).toBe('1.2.3.4');
  });
});
