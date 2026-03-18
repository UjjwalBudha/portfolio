# Design Document: Cloudflare GeoIP Validation Page

## Overview

A single static HTML file (`/cf-test.html`) that fetches Cloudflare's built-in `/cdn-cgi/trace` endpoint client-side and displays the results. The page confirms whether Cloudflare is actively proxying the domain (orange cloud enabled) and shows the GeoIP data Cloudflare injects per visitor.

No server-side code, no build step, no framework. The page is self-contained and matches the existing dark-theme portfolio site aesthetic.

### Key Design Decisions

- **Client-side only**: `/cdn-cgi/trace` is served by Cloudflare's edge — it only exists when Cloudflare is proxying. Fetching it from the browser is sufficient to validate proxy status.
- **Proxy detection via `ray` field**: A Cloudflare Ray ID (`ray`) is only present in the trace response when a request passes through Cloudflare's network. Its presence/absence is the definitive proxy indicator.
- **No `Cache-Control` header from static HTML**: Static files served by Cloudflare Pages/Workers cannot set response headers via HTML alone. The `<meta http-equiv="Cache-Control" content="no-store">` tag is used as a best-effort client hint; a Cloudflare Page Rule or Transform Rule should be used to enforce the actual response header.
- **Vanilla JS with Fetch API**: Consistent with the rest of the site (no framework, no build step).

---

## Architecture

```
Browser
  │
  ├─► GET /cf-test.html  ──► Cloudflare Edge ──► Origin (static file)
  │
  └─► GET /cdn-cgi/trace ──► Cloudflare Edge (handled entirely by CF, never reaches origin)
                                    │
                                    └─► plain-text key=value response
```

The `/cdn-cgi/trace` endpoint is handled entirely by Cloudflare's edge network. It never reaches the origin server. If Cloudflare is not proxying (grey cloud), the endpoint returns a 404 or is unreachable, which the page handles as a "not proxied" state.

---

## Components and Interfaces

### 1. `cf-test.html` — Page Structure

```
┌─────────────────────────────────────────┐
│  [Navbar — shared via navbar.js]        │
├─────────────────────────────────────────┤
│  Page Title: "Cloudflare Proxy Check"   │
│  Subtitle: diagnostic tool description  │
├─────────────────────────────────────────┤
│  Status Badge: [✓ Proxied] / [✗ Not Proxied] │
├─────────────────────────────────────────┤
│  Data Cards:                            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Country  │  │    IP    │            │
│  │   loc    │  │    ip    │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐                          │
│  │  Ray ID  │                          │
│  │   ray    │                          │
│  └──────────┘                          │
├─────────────────────────────────────────┤
│  [Loading spinner while fetching]       │
│  [Error message if fetch fails]         │
└─────────────────────────────────────────┘
```

### 2. `GeoIP_Validator` — Client-side JS (inline in `cf-test.html`)

**`parseTrace(text: string): object`**
Parses the plain-text `key=value\n` response from `/cdn-cgi/trace` into a plain JS object.

```
Input:  "fl=123abc\nip=1.2.3.4\nloc=US\nray=abc123\n..."
Output: { fl: "123abc", ip: "1.2.3.4", loc: "US", ray: "abc123", ... }
```

**`getProxyStatus(trace: object): "proxied" | "not-proxied"`**
Returns `"proxied"` if `trace.ray` is a non-empty string, otherwise `"not-proxied"`.

**`renderResults(trace: object): void`**
Updates the DOM with parsed trace data. Handles three `loc` cases:
- Present and not `"XX"` → display the country code as-is
- `"XX"` → display `"XX"` with label "undetermined"
- Absent/undefined → display `"N/A"`

**`init(): void`**
Entry point called on `DOMContentLoaded`. Fetches `/cdn-cgi/trace`, calls `parseTrace`, `getProxyStatus`, and `renderResults`. On fetch failure, shows the error state.

### 3. Visual States

| State | UI |
|---|---|
| Loading | Spinner visible, cards hidden |
| Proxied | Green badge "✓ Cloudflare Proxied", all data cards shown |
| Not proxied | Yellow warning badge "⚠ Not Proxied", cards shown with N/A values |
| Fetch error | Red error message "Unable to reach /cdn-cgi/trace", cards hidden |

---

## Data Models

### TraceData (parsed object)

```js
{
  fl:  string,   // Cloudflare data center
  ip:  string,   // visitor IP address
  ts:  string,   // timestamp
  visit_scheme: string,
  uag: string,   // user agent
  colo: string,  // Cloudflare colo
  sliver: string,
  http: string,
  loc: string,   // ISO 3166-1 alpha-2 country code, or "XX", or absent
  tls: string,
  sni: string,
  warp: string,
  gateway: string,
  rbi: string,
  kex: string,
  ray: string    // Cloudflare Ray ID — present only when proxied
}
```

Only `ip`, `loc`, `ray` are displayed. All other fields are parsed but not rendered.

### ProxyStatus

```
"proxied"     — ray field is present and non-empty
"not-proxied" — ray field is absent or empty string
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Trace parsing round-trip

*For any* valid `/cdn-cgi/trace` response string (one or more `key=value` lines separated by newlines), parsing it with `parseTrace` should produce an object where every key maps to its corresponding value exactly as it appeared in the input string.

**Validates: Requirements 2.2, 2.4**

### Property 2: Proxy status is determined solely by ray field

*For any* parsed trace object, `getProxyStatus` returns `"proxied"` if and only if `trace.ray` is a non-empty string; it returns `"not-proxied"` for any trace object where `ray` is absent, `undefined`, or an empty string.

**Validates: Requirements 3.1, 3.2**

### Property 3: loc field display correctness

*For any* parsed trace object, `renderResults` displays the country field as follows: if `loc` is a non-empty string other than `"XX"`, it is shown as-is; if `loc` is `"XX"`, it is shown as `"XX"` with an "undetermined" label; if `loc` is absent or `undefined`, it is shown as `"N/A"`.

**Validates: Requirements 3.4, 4.1, 4.2, 4.3**

### Property 4: All required fields are rendered

*For any* parsed trace object, after `renderResults` runs, the DOM must contain the `ip` value, the `ray` value (or `"N/A"` if absent), and a proxy status indicator derived from `getProxyStatus`.

**Validates: Requirements 4.4, 4.5, 4.6**

---

## Error Handling

| Scenario | Behavior |
|---|---|
| `fetch('/cdn-cgi/trace')` rejects (network error) | Show red error banner: "Unable to reach /cdn-cgi/trace — Cloudflare may not be proxying this domain." |
| Response status is not 2xx | Same error banner as above |
| Response body is empty | `parseTrace("")` returns `{}` — all fields render as `"N/A"`, proxy status is `"not-proxied"` |
| `loc` field absent | Rendered as `"N/A"` per Property 3 |
| `ray` field absent | Proxy status is `"not-proxied"`, warning badge shown |

No exceptions should propagate to the browser console. All errors are caught and surfaced in the UI.

---

## Testing Strategy

### Unit Tests

Unit tests cover specific examples and edge cases for the pure JS functions (`parseTrace`, `getProxyStatus`, `renderResults`). These can be run with any test runner (e.g., Vitest or Jest) without a browser.

- `parseTrace` with a standard trace response → correct object
- `parseTrace` with an empty string → empty object
- `parseTrace` with lines missing `=` → those lines are skipped
- `getProxyStatus` with a populated `ray` → `"proxied"`
- `getProxyStatus` with `ray: ""` → `"not-proxied"`
- `getProxyStatus` with no `ray` key → `"not-proxied"`
- `renderResults` with `loc: "US"` → displays `"US"`
- `renderResults` with `loc: "XX"` → displays `"XX"` + undetermined label
- `renderResults` with no `loc` → displays `"N/A"`
- `init()` when fetch rejects → error banner visible, cards hidden

### Property-Based Tests

Property tests use [fast-check](https://github.com/dubzzz/fast-check) (JavaScript PBT library). Each test runs a minimum of 100 iterations.

**Property 1 — Trace parsing round-trip**
```
// Feature: cloudflare-geoip-validation, Property 1: trace parsing round-trip
fc.assert(fc.property(
  fc.array(fc.tuple(fc.string(), fc.string())),  // arbitrary key-value pairs
  (pairs) => {
    const input = pairs.map(([k, v]) => `${k}=${v}`).join('\n');
    const result = parseTrace(input);
    return pairs.every(([k, v]) => result[k] === v);
  }
), { numRuns: 100 });
```

**Property 2 — Proxy status determined by ray field**
```
// Feature: cloudflare-geoip-validation, Property 2: proxy status determined by ray field
fc.assert(fc.property(
  fc.record({ ray: fc.oneof(fc.constant(''), fc.constant(undefined), fc.string({ minLength: 1 })) }),
  (trace) => {
    const status = getProxyStatus(trace);
    const hasRay = typeof trace.ray === 'string' && trace.ray.length > 0;
    return status === (hasRay ? 'proxied' : 'not-proxied');
  }
), { numRuns: 100 });
```

**Property 3 — loc display correctness**
```
// Feature: cloudflare-geoip-validation, Property 3: loc field display correctness
fc.assert(fc.property(
  fc.record({ loc: fc.oneof(fc.constant(undefined), fc.constant('XX'), fc.string({ minLength: 1 })) }),
  (trace) => {
    renderResults(trace);
    const displayed = document.getElementById('loc-value').textContent;
    if (!trace.loc) return displayed === 'N/A';
    if (trace.loc === 'XX') return displayed.includes('XX');
    return displayed === trace.loc;
  }
), { numRuns: 100 });
```

**Property 4 — All required fields rendered**
```
// Feature: cloudflare-geoip-validation, Property 4: all required fields rendered
fc.assert(fc.property(
  fc.record({
    ip: fc.string(),
    ray: fc.string(),
    loc: fc.string()
  }),
  (trace) => {
    renderResults(trace);
    const ipEl = document.getElementById('ip-value');
    const rayEl = document.getElementById('ray-value');
    const statusEl = document.getElementById('proxy-status');
    return ipEl !== null && rayEl !== null && statusEl !== null;
  }
), { numRuns: 100 });
```

Both unit tests and property tests are complementary: unit tests catch concrete bugs in specific cases, property tests verify general correctness across the input space.
