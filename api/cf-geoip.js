function getHeader(headers, name) {
  if (!headers || !name) return undefined;
  const direct = headers[name];
  if (direct !== undefined) return Array.isArray(direct) ? direct[0] : direct;

  const lower = name.toLowerCase();
  const key = Object.keys(headers).find((headerName) => headerName.toLowerCase() === lower);
  if (!key) return undefined;
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
}

function getFirstIp(value) {
  if (!value || typeof value !== 'string') return null;
  const first = value.split(',')[0].trim();
  return first || null;
}

export function buildCloudflareGeoData(headers = {}, requestMeta = {}) {
  const cfRay = getHeader(headers, 'cf-ray') || null;
  const cfConnectingIp = getFirstIp(getHeader(headers, 'cf-connecting-ip'));
  const xForwardedFor = getFirstIp(getHeader(headers, 'x-forwarded-for'));

  const geo = {
    country: getHeader(headers, 'cf-ipcountry') || null,
    continent: getHeader(headers, 'cf-continent') || null,
    region: getHeader(headers, 'cf-region') || null,
    regionCode: getHeader(headers, 'cf-region-code') || null,
    city: getHeader(headers, 'cf-city') || null,
    postalCode: getHeader(headers, 'cf-postal-code') || null,
    metroCode: getHeader(headers, 'cf-metro-code') || null,
    timezone: getHeader(headers, 'cf-timezone') || null,
    latitude: getHeader(headers, 'cf-latitude') || null,
    longitude: getHeader(headers, 'cf-longitude') || null,
  };

  return {
    timestamp: new Date().toISOString(),
    request: {
      method: requestMeta.method || null,
      path: requestMeta.path || null,
      userAgent: getHeader(headers, 'user-agent') || null,
    },
    network: {
      proxiedByCloudflare: Boolean(cfRay),
      rayId: cfRay,
      clientIp: cfConnectingIp || xForwardedFor || null,
      cfConnectingIp,
      xForwardedFor: xForwardedFor || null,
    },
    geo,
    headerPresence: {
      cfRay: Boolean(cfRay),
      cfConnectingIp: Boolean(cfConnectingIp),
      cfIpCountry: Boolean(geo.country),
      cfContinent: Boolean(geo.continent),
      cfRegion: Boolean(geo.region),
      cfCity: Boolean(geo.city),
      cfTimezone: Boolean(geo.timezone),
      cfLatitudeLongitude: Boolean(geo.latitude && geo.longitude),
    },
  };
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const payload = buildCloudflareGeoData(req.headers, {
    method: req.method,
    path: req.url,
  });

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json(payload);
}
