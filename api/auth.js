// Fixed, not derived from the request's Host header. This must be
// https://www.ujwalbudha.com.np (with www) - that's the domain the site
// actually serves from; Chrome's address bar elides the "www." in display,
// which is why this looked like the apex domain during earlier debugging.
const SITE_URL = 'https://www.ujwalbudha.com.np';

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    res.status(500).send('Missing GITHUB_OAUTH_CLIENT_ID environment variable');
    return;
  }

  const redirectUri = `${SITE_URL}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
  });

  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params.toString()}` });
  res.end();
}
