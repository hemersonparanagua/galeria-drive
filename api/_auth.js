// Checagem mínima de autenticação do painel: o navegador envia o token digitado
// no header x-admin-token, e comparamos com ADMIN_TOKEN (env do Vercel).
// Troque esse valor no painel do Vercel sempre que quiser revogar o acesso.
function requireAdmin(req, res) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    res.status(500).json({ error: "ADMIN_TOKEN não configurado no Vercel." });
    return false;
  }
  const given = req.headers["x-admin-token"];
  if (given !== expected) {
    res.status(401).json({ error: "Token inválido." });
    return false;
  }
  return true;
}

module.exports = { requireAdmin };
