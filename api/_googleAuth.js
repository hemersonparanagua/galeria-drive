// Troca as credenciais de uma conta de serviço do Google por um access token,
// sem depender de nenhuma biblioteca externa (usa apenas o módulo "crypto" do Node,
// já disponível nas Serverless Functions do Vercel).
//
// Variáveis de ambiente esperadas (configurar no painel do Vercel, nunca no repositório):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  -> client_email do JSON da conta de serviço
//   GOOGLE_SERVICE_ACCOUNT_KEY    -> private_key do JSON da conta de serviço, em base64
//                                     (gere com: base64 -w0 service-account.json | pegue só o campo private_key,
//                                      ou salve o private_key puro e rode: echo -n "$PRIVATE_KEY" | base64 -w0)

const crypto = require("crypto");

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getAccessToken(scopes) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const encodedKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!email || !encodedKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_KEY não configuradas no Vercel."
    );
  }
  const privateKey = Buffer.from(encodedKey, "base64").toString("utf8");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: email,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer
    .sign(privateKey)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const assertion = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Falha ao obter access token do Google: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

module.exports = { getAccessToken };
