/**
 * cf-test.js — pure JS functions for Cloudflare GeoIP validation
 * Extracted from cf-test.html for testability.
 */

/**
 * parseTrace(text) — parses the plain-text key=value response from /cdn-cgi/trace
 * @param {string} text
 * @returns {object}
 */
export function parseTrace(text) {
  if (!text) return {};
  const result = {};
  const lines = text.split('\n');
  for (const line of lines) {
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.substring(0, eqIdx);
    const value = line.substring(eqIdx + 1);
    result[key] = value;
  }
  return result;
}

/**
 * getProxyStatus(trace) — returns "proxied" iff trace.ray is a non-empty string
 * @param {object} trace
 * @returns {"proxied"|"not-proxied"}
 */
export function getProxyStatus(trace) {
  return (typeof trace.ray === 'string' && trace.ray.length > 0)
    ? 'proxied'
    : 'not-proxied';
}

/**
 * renderResults(trace) — updates the DOM with parsed trace data
 * @param {object} trace
 */
export function renderResults(trace) {
  // IP
  const ipEl = document.getElementById('ip-value');
  ipEl.textContent = trace.ip || 'N/A';

  // Ray ID
  const rayEl = document.getElementById('ray-value');
  rayEl.textContent = trace.ray || 'N/A';

  // Country / loc
  const locEl = document.getElementById('loc-value');
  if (!trace.loc) {
    locEl.textContent = 'N/A';
  } else if (trace.loc === 'XX') {
    locEl.innerHTML = 'XX<span class="undetermined-label">undetermined</span>';
  } else {
    locEl.textContent = trace.loc;
  }

  // Proxy status badge
  const statusEl = document.getElementById('proxy-status');
  const status = getProxyStatus(trace);
  if (status === 'proxied') {
    statusEl.textContent = '✓ Cloudflare Proxied';
    statusEl.className = 'proxied';
  } else {
    statusEl.textContent = '⚠ Not Proxied';
    statusEl.className = 'not-proxied';
  }

  // Show results, hide loading
  document.getElementById('results').style.display = 'block';
  document.getElementById('loading').style.display = 'none';
}

/**
 * renderBackendResults(data) — updates backend validation values from /api/cf-geoip
 * @param {object} data
 */
export function renderBackendResults(data) {
  const rayMatch = document.getElementById('ray-match-value');
  const originProxy = document.getElementById('origin-proxy-value');
  const country = document.getElementById('origin-country-value');
  const continent = document.getElementById('origin-continent-value');
  const region = document.getElementById('origin-region-value');
  const city = document.getElementById('origin-city-value');
  const ip = document.getElementById('origin-ip-value');

  if (!data || !data.network || !data.geo) {
    rayMatch.textContent = 'N/A';
    originProxy.textContent = 'N/A';
    country.textContent = 'N/A';
    continent.textContent = 'N/A';
    region.textContent = 'N/A';
    city.textContent = 'N/A';
    ip.textContent = 'N/A';
    return;
  }

  const isProxied = Boolean(data.network.proxiedByCloudflare);
  const rayId = data.network.rayId || 'N/A';
  const traceRay = document.getElementById('ray-value').textContent;
  const hasRayMatch = traceRay && traceRay !== 'N/A' && rayId !== 'N/A' && traceRay === rayId;

  rayMatch.textContent = hasRayMatch ? 'Yes' : 'No';
  originProxy.textContent = isProxied ? 'Yes (Cloudflare)' : 'No';
  country.textContent = data.geo.country || 'N/A';
  continent.textContent = data.geo.continent || 'N/A';
  region.textContent = data.geo.region || data.geo.regionCode || 'N/A';
  city.textContent = data.geo.city || 'N/A';
  ip.textContent = data.network.clientIp || 'N/A';
}
