// Fixed, not derived from the request's Host header: Vercel redirects the
// apex domain to www at the edge before this function runs, so trusting
// req.headers.host produces a redirect_uri that doesn't match the one
// registered on the GitHub OAuth App (which only allows one canonical URL).
const SITE_URL = 'https://ujwalbudha.com.np';

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
