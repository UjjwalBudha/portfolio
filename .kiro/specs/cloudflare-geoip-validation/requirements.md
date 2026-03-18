# Requirements Document

## Introduction

This feature validates that Cloudflare is acting as a proxy (orange cloud enabled) in front of the portfolio site, and that Cloudflare GeoIP data is readable by the browser. The feature consists of a static HTML diagnostic page that fetches Cloudflare's built-in `/cdn-cgi/trace` endpoint and displays the results — no server-side component required.

## Glossary

- **Diagnostic_Page**: The static HTML page at `/cf-test.html` that fetches and displays Cloudflare trace data.
- **Trace_Endpoint**: Cloudflare's built-in endpoint at `/cdn-cgi/trace` that returns plain-text visitor metadata when Cloudflare is proxying the domain.
- **Trace_Response**: The plain-text key=value response returned by the Trace_Endpoint, containing fields such as `ip`, `loc`, `ray`, and `uag`.
- **Proxy_Status**: The determined state of whether Cloudflare is actively proxying requests, derived from the presence of a non-empty `ray` field in the Trace_Response.
- **GeoIP_Validator**: The client-side JavaScript logic within the Diagnostic_Page responsible for fetching, parsing, and displaying Trace_Response data.

---

## Requirements

### Requirement 1: Static Diagnostic Page

**User Story:** As a developer, I want a publicly accessible static HTML page, so that I can verify Cloudflare proxy and GeoIP data without any server-side infrastructure.

#### Acceptance Criteria

1. THE Diagnostic_Page SHALL be served at the public route `/cf-test.html` with no authentication required.
2. THE Diagnostic_Page SHALL include a `Cache-Control: no-store` directive to prevent caching of visitor-specific data.
3. THE Diagnostic_Page SHALL be a self-contained static HTML file with no server-side rendering or serverless function dependencies.

---

### Requirement 2: Cloudflare Trace Fetch

**User Story:** As a developer, I want the diagnostic page to fetch Cloudflare's trace endpoint, so that I can retrieve visitor geo and proxy data injected by Cloudflare.

#### Acceptance Criteria

1. WHEN the Diagnostic_Page loads, THE GeoIP_Validator SHALL fetch `/cdn-cgi/trace` using the Fetch API.
2. WHEN the Trace_Endpoint responds, THE GeoIP_Validator SHALL parse the plain-text `key=value` response into a structured object.
3. IF the fetch request fails or returns a non-OK status, THEN THE GeoIP_Validator SHALL display an error message indicating the trace endpoint is unreachable.
4. THE GeoIP_Validator SHALL extract the following fields from the Trace_Response: `ip`, `loc`, `ray`, and `uag`.

---

### Requirement 3: Cloudflare Proxy Validation

**User Story:** As a developer, I want to confirm that Cloudflare is actively proxying requests, so that I know the orange cloud is enabled and GeoIP data will be present.

#### Acceptance Criteria

1. WHEN the `ray` field in the Trace_Response is present and non-empty, THE GeoIP_Validator SHALL set Proxy_Status to `proxied`.
2. WHEN the `ray` field in the Trace_Response is absent or empty, THE GeoIP_Validator SHALL set Proxy_Status to `not-proxied`.
3. WHILE Proxy_Status is `not-proxied`, THE GeoIP_Validator SHALL display a visible warning indicating Cloudflare proxy is not detected.
4. THE GeoIP_Validator SHALL distinguish between a missing `loc` field due to Cloudflare not being in the path versus Cloudflare being present but the country being undetermined (value `XX`).

---

### Requirement 4: GeoIP Data Display

**User Story:** As a developer, I want the diagnostic page to display Cloudflare-provided geo and connection data, so that I can visually confirm what Cloudflare is injecting.

#### Acceptance Criteria

1. WHEN the Trace_Response contains a valid `loc` value, THE GeoIP_Validator SHALL display the ISO 3166-1 alpha-2 country code in the UI.
2. WHEN the `loc` value is `XX`, THE GeoIP_Validator SHALL display `XX` and label it as undetermined.
3. IF the `loc` field is absent from the Trace_Response, THEN THE GeoIP_Validator SHALL display `N/A` for the country field.
4. THE GeoIP_Validator SHALL display the `ip` field value as the visitor's connecting IP address.
5. THE GeoIP_Validator SHALL display the `ray` field value as the Cloudflare Ray ID.
6. THE GeoIP_Validator SHALL display a `cloudflare_proxied` status indicator derived from Proxy_Status.

---

### Requirement 5: Security and Privacy

**User Story:** As a site owner, I want the diagnostic page to be safe to expose publicly, so that it does not leak sensitive infrastructure details.

#### Acceptance Criteria

1. THE Diagnostic_Page SHALL set a `Cache-Control: no-store` response header to prevent caching of visitor-specific data.
2. THE GeoIP_Validator SHALL only display fields sourced from the Trace_Response — it SHALL NOT expose any server environment variables or internal configuration.
3. THE Diagnostic_Page SHALL NOT require or collect any user credentials or personally identifiable information beyond what Cloudflare provides in the Trace_Response.
