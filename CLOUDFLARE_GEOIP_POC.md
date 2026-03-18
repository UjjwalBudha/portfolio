# Cloudflare GeoIP + Proxy Validation

This project now includes:

- Browser diagnostic page: `/cf-test.html`
- Origin diagnostic API: `/api/cf-geoip`

Traffic path being validated:

`Browser -> Cloudflare Edge -> Vercel Origin`

## What `/api/cf-geoip` returns

`/api/cf-geoip` reads Cloudflare headers at origin and returns:

- `network.proxiedByCloudflare` (true when `cf-ray` exists)
- `network.rayId` (`cf-ray`)
- `network.clientIp` (`cf-connecting-ip` fallback to `x-forwarded-for`)
- `geo.country` (`cf-ipcountry`)
- `geo.continent`, `geo.region`, `geo.city`, `geo.timezone`
- optional extended location headers (`cf-latitude`, `cf-longitude`, etc.) if available

## How to test in production

1. Open:
   - `https://www.ujwalbudha.com.np/cf-test.html`
2. Confirm:
   - Top badge says `Cloudflare Proxied`
   - `Origin Header Validation -> Proxied at Origin` is `Yes (Cloudflare)`
   - `Trace Ray = Origin Ray` is `Yes`
   - `Origin Country` is populated (for example `NP`)

## CLI validation

Run:

```bash
curl -s https://www.ujwalbudha.com.np/api/cf-geoip | jq
```

Expected:

- `network.proxiedByCloudflare: true`
- `headerPresence.cfRay: true`
- `headerPresence.cfIpCountry: true` (unless Cloudflare returns `XX`/unknown)

Check Cloudflare trace directly:

```bash
curl -s https://www.ujwalbudha.com.np/cdn-cgi/trace
```

Expected keys include `ray`, `ip`, and `loc`.
