const { getAccessToken } = require("./_googleAuth");

const DRIVE_SCOPE = ["https://www.googleapis.com/auth/drive"];

// --- Catálogo de galerias: um único arquivo JSON privado no Drive, dono = conta de serviço.
// Isso substitui o localStorage do admin.js como fonte de verdade, sem precisar de Supabase
// nem de Google Sheets. O ID desse arquivo fica em GOOGLE_CATALOG_FILE_ID (env do Vercel).

async function readCatalog() {
  const fileId = process.env.GOOGLE_CATALOG_FILE_ID;
  if (!fileId) throw new Error("GOOGLE_CATALOG_FILE_ID não configurado no Vercel.");
  const token = await getAccessToken(DRIVE_SCOPE);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Falha ao ler catálogo: ${res.status} ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function writeCatalog(galleries) {
  const fileId = process.env.GOOGLE_CATALOG_FILE_ID;
  if (!fileId) throw new Error("GOOGLE_CATALOG_FILE_ID não configurado no Vercel.");
  const token = await getAccessToken(DRIVE_SCOPE);
  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(galleries, null, 2),
    }
  );
  if (!res.ok) throw new Error(`Falha ao salvar catálogo: ${res.status} ${await res.text()}`);
}

// --- Listagem de uma pasta específica do Drive (nunca varre o Drive inteiro).
// Recebe um folderId (extraído do link que Hemerson cola no painel) e devolve
// apenas arquivos de imagem, para preencher a galeria automaticamente.

async function listFolderImages(folderId) {
  const token = await getAccessToken(DRIVE_SCOPE);
  const q = encodeURIComponent(
    `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
  );
  const fields = encodeURIComponent("files(id,name,mimeType,imageMediaMetadata)");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=200&orderBy=name`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Falha ao listar pasta: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.files || []).map((f) => ({ id: f.id, name: f.name }));
}

module.exports = { readCatalog, writeCatalog, listFolderImages };
