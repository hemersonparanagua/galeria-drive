const SAMPLE_URL = "data/demo-gallery.json";
const DRIVE_PHOTOS_URL = "data/drive-photos.json";
const DRIVE_IMAGE = (id, width = 1800) => `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}=w${width}`;
let photos = [];
let activeIndex = 0;
const $ = (id) => document.getElementById(id);

function decodeGallery(value) {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(normalized))));
  } catch { return null; }
}
async function init() {
  try {
    const params = new URLSearchParams(location.search);
    let gallery = params.get("g") ? decodeGallery(params.get("g")) : null;
    if (!gallery) gallery = await (await fetch(SAMPLE_URL)).json();
    const library = await (await fetch(DRIVE_PHOTOS_URL)).json();
    if (!gallery.photos?.length) gallery.photos = library.photos;
    if (!gallery.coverId) gallery.coverId = gallery.photos[0]?.id;
    document.title = `${gallery.title} — Hemerson Paranaguá`;
    $("title").textContent = gallery.title || "Galeria fotográfica";
    $("description").textContent = gallery.description || "";
    $("client-label").textContent = gallery.sessionLabel || "SESSÃO FOTOGRÁFICA";
    $("section-title").textContent = gallery.photoSectionTitle || "Fotos";
    $("eyebrow").textContent = gallery.kind === "selection" ? "ESCOLHA SUAS FOTOS" : "GALERIA PARA COMPARTILHAR";
    const coverId = gallery.coverId || gallery.photos[0]?.id;
    $("cover").src = coverId ? imageUrl(coverId, 2200) : "assets/cover-placeholder.svg";
    $("cover").alt = gallery.coverAlt || gallery.title || "Capa da galeria";
    $("download-all").href = gallery.folderUrl || "";
    $("download-all").hidden = !gallery.folderUrl;
    photos = [...(gallery.photos || [])].sort((a,b) => new Intl.Collator("pt-BR",{numeric:true}).compare(a.name || "",b.name || ""));
    renderPhotos();
  } catch (error) {
    $("title").textContent = "Galeria indisponível";
    $("description").textContent = "Confira o endereço ou tente novamente mais tarde.";
    console.error(error);
  }
}
function imageUrl(photo, width = 1800) {
  if (typeof photo === "string") return DRIVE_IMAGE(photo, width);
  return photo?.url || DRIVE_IMAGE(photo?.id || photo?.driveFileId, width);
}
function renderPhotos() {
  const grid = $("photo-grid"); grid.replaceChildren();
  $("photo-count").textContent = `${photos.length} ${photos.length === 1 ? "foto" : "fotos"}`;
  if (!photos.length) {
    const empty = document.createElement("p"); empty.className = "empty-gallery"; empty.textContent = "Esta galeria ainda não tem fotos."; grid.append(empty); return;
  }
  photos.forEach((photo,index) => {
    const button=document.createElement("button"); button.type="button"; button.className="photo-card"; button.setAttribute("aria-label",`Ver ${photo.name || `foto ${index+1}`}`);
    const img=document.createElement("img"); img.loading=index<6?"eager":"lazy"; img.src=imageUrl(photo,1200); img.alt=photo.alt||photo.name||`Foto ${index+1}`; button.append(img);
    const cap=document.createElement("span"); cap.textContent=photo.caption||photo.name||""; button.append(cap);
    button.addEventListener("click",()=>openPhoto(index)); grid.append(button);
  });
}
function openPhoto(index){activeIndex=index;showActivePhoto();$("lightbox").showModal()}
function showActivePhoto(){const photo=photos[activeIndex];$("lightbox-image").src=imageUrl(photo);$("lightbox-image").alt=photo.alt||photo.name||`Foto ${activeIndex+1}`;$("lightbox-caption").textContent=photo.name||`${activeIndex+1} / ${photos.length}`}
$("lightbox-close").addEventListener("click",()=>$("lightbox").close());
$("prev").addEventListener("click",()=>{activeIndex=(activeIndex-1+photos.length)%photos.length;showActivePhoto()});
$("next").addEventListener("click",()=>{activeIndex=(activeIndex+1)%photos.length;showActivePhoto()});
init();
