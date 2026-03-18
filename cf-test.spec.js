/**
 * cf-test.spec.js — unit tests for parseTrace, getProxyStatus, renderResults
 * Uses Vitest with jsdom environment for DOM-dependent tests.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { parseTrace, getProxyStatus, renderResults, renderBackendResults } from './cf-test.js';

// ─── parseTrace ──────────────────────────────────────────────────────────────

describe('parseTrace', () => {
  it('parses a standard trace string into the correct object', () => {
    const input = 'fl=123abc\nip=1.2.3.4\nloc=US\nray=abc123\n';
    const result = parseTrace(input);
    expect(result).toEqual({ fl: '123abc', ip: '1.2.3.4', loc: 'US', ray: 'abc123' });
  });

  it('returns {} for an empty string', () => {
    expect(parseTrace('')).toEqual({});
  });

  it('skips lines that have no "=" character', () => {
    const input = 'valid=yes\nnoequalssign\nalso=good\n';
    const result = parseTrace(input);
    expect(result).toEqual({ valid: 'yes', also: 'good' });
    expect(Object.keys(result)).not.toContain('noequalssign');
  });
});

// ─── getProxyStatus ───────────────────────────────────────────────────────────

describe('getProxyStatus', () => {
  it('returns "proxied" when ray is a non-empty string', () => {
    expect(getProxyStatus({ ray: 'abc123' })).toBe('proxied');
  });

  it('returns "not-proxied" when ray is an empty string', () => {
    expect(getProxyStatus({ ray: '' })).toBe('not-proxied');
  });

  it('returns "not-proxied" when ray key is absent', () => {
    expect(getProxyStatus({})).toBe('not-proxied');
  });
});

// ─── renderResults ────────────────────────────────────────────────────────────

function buildDOM() {
  document.body.innerHTML = `
    <div id="loading"></div>
    <div id="results"></div>
    <div id="error-banner"></div>
    <div id="proxy-status"></div>
    <div id="loc-value"></div>
    <div id="ip-value"></div>
    <div id="ray-value"></div>
    <div id="ray-match-value"></div>
    <div id="origin-proxy-value"></div>
    <div id="origin-country-value"></div>
    <div id="origin-continent-value"></div>
    <div id="origin-region-value"></div>
    <div id="origin-city-value"></div>
    <div id="origin-ip-value"></div>
  `;
}

describe('renderResults', () => {
  beforeEach(() => {
    buildDOM();
  });

  it('displays the country code as-is when loc is a normal code', () => {
    renderResults({ loc: 'US', ip: '1.2.3.4', ray: 'abc' });
    expect(document.getElementById('loc-value').textContent).toBe('US');
  });

  it('displays "XX" and includes undetermined label when loc is "XX"', () => {
    renderResults({ loc: 'XX', ip: '1.2.3.4', ray: 'abc' });
    const locEl = document.getElementById('loc-value');
    expect(locEl.textContent).toContain('XX');
    expect(locEl.textContent).toContain('undetermined');
  });

  it('displays "N/A" when loc is absent', () => {
    renderResults({ ip: '1.2.3.4', ray: 'abc' });
    expect(document.getElementById('loc-value').textContent).toBe('N/A');
  });
});

describe('renderBackendResults', () => {
  beforeEach(() => {
    buildDOM();
  });

  it('renders proxied origin metadata from backend endpoint', () => {
    document.getElementById('ray-value').textContent = 'abc123';
    renderBackendResults({
      network: { proxiedByCloudflare: true, rayId: 'abc123', clientIp: '1.2.3.4' },
      geo: { country: 'NP', continent: 'AS', region: 'Bagmati', city: 'Kathmandu' },
    });

    expect(document.getElementById('origin-proxy-value').textContent).toBe('Yes (Cloudflare)');
    expect(document.getElementById('ray-match-value').textContent).toBe('Yes');
    expect(document.getElementById('origin-country-value').textContent).toBe('NP');
  });

  it('renders N/A values when backend payload is missing', () => {
    renderBackendResults(null);
    expect(document.getElementById('origin-country-value').textContent).toBe('N/A');
    expect(document.getElementById('origin-ip-value').textContent).toBe('N/A');
  });
});
