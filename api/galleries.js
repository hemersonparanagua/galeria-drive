const { requireAdmin } = require("./_auth");
const { readCatalog, writeCatalog } = require("./_drive");

module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === "GET") {
      const galleries = await readCatalog();
      res.status(200).json({ galleries });
      return;
    }

    if (req.method === "PUT") {
      // O corpo é a lista completa de galerias (o admin.js mantém o estado em memória
      // e manda o array inteiro a cada alteração — simples e suficiente neste estágio).
      const body = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
      if (!Array.isArray(body.galleries)) {
        res.status(400).json({ error: "Envie { galleries: [...] }" });
        return;
      }
      await writeCatalog(body.galleries);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Método não suportado." });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
};
