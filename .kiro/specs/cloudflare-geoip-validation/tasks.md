# Implementation Plan: Cloudflare GeoIP Validation Page

## Overview

Build a single self-contained static HTML file (`cf-test.html`) with inline vanilla JS that fetches `/cdn-cgi/trace`, parses the response, and renders proxy status and GeoIP data. Includes a Vitest-based test file for unit and property-based tests using fast-check.

## Tasks

- [x] 1. Create `cf-test.html` with page structure and dark-theme styling
  - Create `cf-test.html` at the repo root
  - Add `<meta http-equiv="Cache-Control" content="no-store">` as best-effort cache hint
  - Include navbar via `assets/js/navbar.js` (same pattern as blog pages)
  - Add Bootstrap and shared `assets/css/style.css` links
  - Scaffold the three visual states in HTML: loading spinner, data cards (country, IP, Ray ID), proxy status badge, and error banner — all hidden/shown via JS
  - Element IDs required: `#loading`, `#results`, `#error-banner`, `#proxy-status`, `#loc-value`, `#ip-value`, `#ray-value`
  - Match dark-theme aesthetic: `background: rgba(255,255,255,0.08)` cards, `#18d26e` accent color, `#040404` background
  - _Requirements: 1.1, 1.2, 1.3, 5.2, 5.3_

- [ ] 2. Implement `parseTrace` and `getProxyStatus` inline JS functions
  - [x] 2.1 Implement `parseTrace(text: string): object`
    - Split on newlines, split each line on first `=`, skip lines without `=`
    - Return plain object mapping keys to string values
    - `parseTrace("")` must return `{}`
    - _Requirements: 2.2, 2.4_

  - [ ]* 2.2 Write property test for `parseTrace` — Property 1
    - **Property 1: Trace parsing round-trip**
    - **Validates: Requirements 2.2, 2.4**

  - [x] 2.3 Implement `getProxyStatus(trace: object): "proxied" | "not-proxied"`
    - Return `"proxied"` iff `trace.ray` is a non-empty string
    - Return `"not-proxied"` for absent, `undefined`, or empty-string `ray`
    - _Requirements: 3.1, 3.2_

  - [ ]* 2.4 Write property test for `getProxyStatus` — Property 2
    - **Property 2: Proxy status determined solely by ray field**
    - **Validates: Requirements 3.1, 3.2**

- [ ] 3. Implement `renderResults` inline JS function
  - [x] 3.1 Implement `renderResults(trace: object): void`
    - Set `#ip-value` to `trace.ip` or `"N/A"` if absent
    - Set `#ray-value` to `trace.ray` or `"N/A"` if absent
    - Set `#loc-value`: non-empty non-`"XX"` → display as-is; `"XX"` → display `"XX"` with "undetermined" label; absent/undefined → `"N/A"`
    - Call `getProxyStatus` and update `#proxy-status`: green badge `"✓ Cloudflare Proxied"` or yellow badge `"⚠ Not Proxied"`
    - Show `#results`, hide `#loading`
    - _Requirements: 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 3.2 Write property test for `renderResults` — Property 3
    - **Property 3: loc field display correctness**
    - **Validates: Requirements 3.4, 4.1, 4.2, 4.3**

  - [ ]* 3.3 Write property test for `renderResults` — Property 4
    - **Property 4: All required fields rendered**
    - **Validates: Requirements 4.4, 4.5, 4.6**

- [ ] 4. Implement `init` function and wire everything together
  - [x] 4.1 Implement `init(): void`
    - Call on `DOMContentLoaded`
    - Show `#loading`, hide `#results` and `#error-banner`
    - `fetch('/cdn-cgi/trace')`, check `response.ok`, call `response.text()`
    - On success: call `parseTrace` → `renderResults`
    - On fetch rejection or non-OK status: hide `#loading`, show `#error-banner` with message `"Unable to reach /cdn-cgi/trace — Cloudflare may not be proxying this domain."`
    - No exceptions should propagate to the browser console (wrap in try/catch)
    - _Requirements: 2.1, 2.3, 3.3_

  - [ ]* 4.2 Write unit tests for `init` error path
    - Mock `fetch` to reject; assert `#error-banner` is visible and `#results` is hidden
    - Mock `fetch` to return non-OK status; assert same error state
    - _Requirements: 2.3_

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Create test file with unit tests and property-based tests
  - [x] 6.1 Create `cf-test.spec.js` (or `.test.js`) using Vitest + fast-check
    - Import/export `parseTrace`, `getProxyStatus`, `renderResults` for testing (extract to a module or use inline script export pattern compatible with Vitest)
    - Set up jsdom environment for DOM-dependent tests (`renderResults`)
    - Write unit tests:
      - `parseTrace` with standard trace string → correct object
      - `parseTrace("")` → `{}`
      - `parseTrace` with lines missing `=` → those lines skipped
      - `getProxyStatus({ ray: "abc123" })` → `"proxied"`
      - `getProxyStatus({ ray: "" })` → `"not-proxied"`
      - `getProxyStatus({})` → `"not-proxied"`
      - `renderResults({ loc: "US", ip: "1.2.3.4", ray: "abc" })` → `#loc-value` shows `"US"`
      - `renderResults({ loc: "XX", ip: "1.2.3.4", ray: "abc" })` → `#loc-value` includes `"XX"` and undetermined label
      - `renderResults({ ip: "1.2.3.4", ray: "abc" })` (no loc) → `#loc-value` shows `"N/A"`
    - _Requirements: 2.2, 2.4, 3.1, 3.2, 3.4, 4.1, 4.2, 4.3_

  - [ ]* 6.2 Write property-based tests using fast-check (Properties 1–4)
    - Property 1: `fc.array(fc.tuple(fc.string(), fc.string()))` → round-trip check
    - Property 2: `fc.record({ ray: fc.oneof(...) })` → status iff non-empty ray
    - Property 3: `fc.record({ loc: fc.oneof(fc.constant(undefined), fc.constant('XX'), fc.string({ minLength: 1 })) })` → loc display correctness
    - Property 4: `fc.record({ ip, ray, loc: fc.string() })` → all DOM elements present after render
    - Each property runs minimum 100 iterations (`numRuns: 100`)
    - _Requirements: 2.2, 2.4, 3.1, 3.2, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 7. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `parseTrace`, `getProxyStatus`, and `renderResults` must be extractable/importable for testing — consider a thin module wrapper or inline export
- Run tests with: `npx vitest run` (single-pass, no watch mode)
- The `<meta http-equiv="Cache-Control">` tag is a client hint only; enforce the actual `Cache-Control: no-store` header via a Cloudflare Transform Rule
- Property tests validate universal correctness; unit tests cover concrete edge cases — both are needed
