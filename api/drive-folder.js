const { requireAdmin } = require("./_auth");
const { listFolderImages } = require("./_drive");

module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método não suportado." });
    return;
  }

  const folderId = req.query.folderId;
  if (!folderId) {
    res.status(400).json({ error: "Informe ?folderId=..." });
    return;
  }

  try {
    const photos = await listFolderImages(folderId);
    res.status(200).json({ photos });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
};
