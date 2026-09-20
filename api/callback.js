function renderPopup(status, payload) {
  // Escape "<" so a maliciously-shaped value can't prematurely close the
  // <script> tag this gets embedded in.
  const safeJson = JSON.stringify(payload).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:${status}:${safeJson}',
      e.origin
    );
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;
}

export default async function handler(req, res) {
  const { code, error, error_description: errorDescription } = req.query;
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  res.setHeader('Content-Type', 'text/html');

  if (error) {
    res.status(400).send(renderPopup('error', errorDescription || error));
    return;
  }

  if (!code) {
    res.status(400).send('Missing code');
    return;
  }

  if (!clientId || !clientSecret) {
    res.status(500).send('Missing GITHUB_OAUTH_CLIENT_ID or GITHUB_OAUTH_CLIENT_SECRET environment variable');
    return;
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    res.status(400).send(renderPopup('error', tokenData.error_description || tokenData.error));
    return;
  }

  res.status(200).send(renderPopup('success', { token: tokenData.access_token, provider: 'github' }));
}
