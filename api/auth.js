export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "repo,user",
  });

  res.redirect(301, `https://github.com/login/oauth/authorize?${params}`);
}
