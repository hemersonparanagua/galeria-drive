const TOKEN_KEY = "hemerson-admin-token-v1"; // sessionStorage: some ao fechar a aba, não é persistido como localStorage
const $ = (id) => document.getElementById(id);
const imageUrl = (id, width = 500) =>
  id ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}=w${width}` : "assets/cover-placeholder.svg";

let adminToken = sessionStorage.getItem(TOKEN_KEY) || "";
let galleries = [];
let editingId = null;

function api(path, options = {}) {
  return fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", "x-admin-token": adminToken, ...(options.headers || {}) },
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || `Erro ${r.status}`);
    return data;
  });
}

async function boot() {
  if (!adminToken) {
    showLoginGate();
    return;
  }
  try {
    const data = await api("/api/galleries");
    galleries = data.galleries || [];
    showAdminPanel();
    renderList();
  } catch (err) {
    sessionStorage.removeItem(TOKEN_KEY);
    adminToken = "";
    showLoginGate(err.message);
  }
}

function showLoginGate(message) {
  $("login-gate").hidden = false;
  $("admin-layout").hidden = true;
  if (message) $("login-feedback").textContent = message;
}
function showAdminPanel() {
  $("login-gate").hidden = true;
  $("admin-layout").hidden = false;
}

$("admin-token-submit").onclick = async () => {
  const value = $("admin-token-input").value.trim();
  if (!value) return;
  adminToken = value;
  sessionStorage.setItem(TOKEN_KEY, value);
  $("login-feedback").textContent = "Verificando...";
  await boot();
};

async function saveCatalog() {
  await api("/api/galleries", { method: "PUT", body: JSON.stringify({ galleries }) });
}

function renderList() {
  const list = $("gallery-list");
  list.replaceChildren();
  if (!galleries.length) {
    list.innerHTML = '<div class="empty-state">Nenhuma galeria cadastrada ainda.</div>';
    return;
  }
  galleries.forEach((g) => {
    const row = document.createElement("article");
    row.className = "gallery-row";
    row.dataset.id = g.id;
    const img = document.createElement("img");
    img.src = imageUrl(g.coverId || g.photoIds[0]);
    img.alt = "";
    const meta = document.createElement("div");
    meta.className = "gallery-meta";
    const title = document.createElement("strong");
    title.textContent = g.title;
    const small = document.createElement("small");
    small.textContent = `${g.photoIds.length} fotos • ${g.sessionLabel || "Sessão"}`;
    const status = document.createElement("small");
    status.className = "gallery-status";
    status.textContent = g.active ? "No catálogo" : "Arquivada";
    meta.append(title, small, status);

    const actions = document.createElement("div");
    actions.className = "row-actions";
    const edit = document.createElement("button");
    edit.textContent = "Editar";
    edit.onclick = () => showEditor(g);
    const link = document.createElement("a");
    link.href = shareUrl(g);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Abrir";
    const copy = document.createElement("button");
    copy.textContent = "Copiar link";
    copy.onclick = async () => {
      await navigator.clipboard.writeText(shareUrl(g));
      copy.textContent = "Copiado";
      setTimeout(() => (copy.textContent = "Copiar link"), 1500);
    };
    const toggle = document.createElement("button");
    toggle.textContent = g.active ? "Arquivar" : "Reativar";
    toggle.onclick = async () => {
      g.active = !g.active;
      await saveCatalog();
      renderList();
    };
    actions.append(edit, link, copy, toggle);
    row.append(img, meta, actions);
    list.append(row);
  });
}

// NOTA: igual à versão anterior, o link do cliente ainda embute os dados em Base64 na URL.
// Isso é um item do ROADMAP (P3 — slug curto lido do catálogo persistente); mantido por ora
// para não aumentar o escopo desta etapa além do que foi pedido (persistência + import de pasta).
function shareUrl(g) {
  const payload = { ...g, photos: g.photoIds.map((id) => ({ id, name: id })) };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const encoded = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return `${location.origin}${location.pathname.replace(/admin\.html$/, "index.html")}?g=${encoded}`;
}

function showEditor(g = null) {
  editingId = g?.id || null;
  const form = $("editor");
  form.reset();
  form.classList.add("open");
  $("form-heading").textContent = g ? "Editar galeria" : "Nova galeria";
  if (g) {
    form.elements.title.value = g.title;
    form.elements.sessionLabel.value = g.sessionLabel || "";
    form.elements.description.value = g.description || "";
    form.elements.folderUrl.value = g.folderUrl || "";
    form.elements.photoIds.value = g.photoIds.join("\n");
    form.elements.coverId.value = g.coverId || "";
    form.elements.kind.value = g.kind || "delivery";
  }
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function extractFolderId(urlOrId) {
  if (!urlOrId) return "";
  const match = urlOrId.match(/[-\w]{25,}/);
  return match ? match[0] : urlOrId.trim();
}

$("new-gallery").onclick = () => showEditor();
$("cancel-edit").onclick = () => $("editor").classList.remove("open");

$("import-default").onclick = async () => {
  const folderUrl = $("editor").elements.folderUrl.value.trim();
  const folderId = extractFolderId(folderUrl);
  if (!folderId) {
    $("save-feedback").textContent = "Cole o link da pasta do Drive antes de importar.";
    return;
  }
  $("save-feedback").textContent = "Importando fotos da pasta...";
  try {
    const data = await api(`/api/drive-folder?folderId=${encodeURIComponent(folderId)}`);
    const photos = data.photos || [];
    if (!photos.length) {
      $("save-feedback").textContent = "Nenhuma imagem encontrada nessa pasta.";
      return;
    }
    $("editor").elements.photoIds.value = photos.map((p) => p.id).join("\n");
    $("editor").elements.coverId.value = photos[0].id;
    $("save-feedback").textContent = `${photos.length} fotos importadas.`;
  } catch (err) {
    $("save-feedback").textContent = `Erro ao importar: ${err.message}`;
  }
};

$("editor").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const photoIds = [...new Set(form.elements.photoIds.value.split(/[\n,\s]+/).map((x) => x.trim()).filter(Boolean))];
  if (!photoIds.length) {
    $("save-feedback").textContent = "Adicione ao menos um ID de foto.";
    return;
  }
  const data = {
    id: editingId || crypto.randomUUID(),
    title: form.elements.title.value.trim(),
    sessionLabel: form.elements.sessionLabel.value.trim(),
    description: form.elements.description.value.trim(),
    folderUrl: form.elements.folderUrl.value.trim(),
    photoIds,
    coverId: form.elements.coverId.value.trim() || photoIds[0],
    kind: form.elements.kind.value,
    active: true,
    createdAt: new Date().toISOString(),
  };
  const index = galleries.findIndex((g) => g.id === editingId);
  if (index >= 0) galleries[index] = { ...galleries[index], ...data };
  else galleries.unshift(data);

  $("save-feedback").textContent = "Salvando...";
  try {
    await saveCatalog();
    renderList();
    $("save-feedback").textContent = "Galeria salva. O link foi gerado na lista.";
    $("editor").classList.remove("open");
  } catch (err) {
    $("save-feedback").textContent = `Erro ao salvar: ${err.message}`;
  }
});

boot();
