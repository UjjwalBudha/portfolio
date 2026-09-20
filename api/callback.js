function renderPopup(status, payload) {
  // Escape "<" so a maliciously-shaped value can't prematurely close the
  // <script> tag this gets embedded in.
  const safeJson = JSON.stringify(payload).replace(/</g, '\\u003c');
  const message =
    status === 'success'
      ? 'Login successful. This window should close automatically — if not, you can close it yourself.'
      : 'Login failed. See details below.';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 2rem; color: #222;">
<p id="status">${message}</p>
<pre id="error" style="color: #c00; white-space: pre-wrap;"></pre>
<script>
(function () {
  function showError(err) {
    document.getElementById('status').textContent = 'Something went wrong finishing login — see details below.';
    document.getElementById('error').textContent = String((err && err.stack) || err);
  }
  try {
    if (!window.opener) {
      showError('window.opener is missing. This page must be opened as a popup from /admin, not visited directly.');
      return;
    }
    var authMessage = 'authorization:github:${status}:${safeJson}';
    function send() {
      window.opener.postMessage(authMessage, '*');
    }
    // Some Decap CMS builds don't reliably reply to the initial
    // "authorizing:github" handshake ping before this popup closes, which
    // leaves the opener stuck waiting forever. Rather than depend on that
    // reply, send the ping for compatibility but also send the real
    // success/error payload unconditionally shortly after - this is the
    // fix documented in https://github.com/decaporg/decap-cms/issues/7872
    // for the same "stuck after a working OAuth exchange" symptom.
    window.addEventListener('message', function () { send(); }, false);
    window.opener.postMessage('authorizing:github', '*');
    setTimeout(send, 200);
    setTimeout(function () { window.close(); }, 1000);
  } catch (err) {
    showError(err);
  }
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
