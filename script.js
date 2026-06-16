const qualityEl = document.getElementById("quality");
const qualityLabel = document.getElementById("qualityLabel");
const maxWidthEl = document.getElementById("maxWidth");
const widthLabel = document.getElementById("widthLabel");
const formatEl = document.getElementById("format");
const drop = document.getElementById("drop");
const fileInput = document.getElementById("fileInput");
const pickBtn = document.getElementById("pickBtn");
const results = document.getElementById("results");
const summaryBar = document.getElementById("summaryBar");
const summaryText = document.getElementById("summaryText");
const downloadAll = document.getElementById("downloadAll");
const clearAll = document.getElementById("clearAll");

// Keep the original File objects so we can re-process when settings change
let queue = [];

// ----- Control labels -----
qualityEl.addEventListener("input", () => {
  qualityLabel.textContent = qualityEl.value + "%";
});
maxWidthEl.addEventListener("input", () => {
  widthLabel.textContent = maxWidthEl.value + "px";
});
// Re-process everything when a setting changes
[qualityEl, maxWidthEl, formatEl].forEach((el) =>
  el.addEventListener("change", () => processAll())
);

// ----- File pickers -----
pickBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => addFiles(fileInput.files));

["dragenter", "dragover"].forEach((ev) =>
  drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("dragover"); })
);
["dragleave", "drop"].forEach((ev) =>
  drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("dragover"); })
);
drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

clearAll.addEventListener("click", () => {
  queue = [];
  results.innerHTML = "";
  summaryBar.classList.add("hidden");
});

downloadAll.addEventListener("click", () => {
  document.querySelectorAll(".dl").forEach((b, i) => setTimeout(() => b.click(), i * 250));
});

// ----- Core -----
function addFiles(fileList) {
  const images = [...fileList].filter((f) => f.type.startsWith("image/"));
  if (!images.length) return;
  images.forEach((f) => queue.push(f));
  processAll();
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function processAll() {
  if (!queue.length) return;
  results.innerHTML = "";
  let totalIn = 0;
  let totalOut = 0;

  for (const file of queue) {
    const { blob, url } = await compress(file);
    totalIn += file.size;
    totalOut += blob.size;
    results.appendChild(renderItem(file, blob, url));
  }

  const pct = totalIn ? Math.round((1 - totalOut / totalIn) * 100) : 0;
  summaryText.innerHTML =
    `${queue.length} image(s): ${formatBytes(totalIn)} → ${formatBytes(totalOut)} · ` +
    `<em>${pct >= 0 ? "saved " + pct + "%" : "grew " + Math.abs(pct) + "%"}</em>`;
  summaryBar.classList.remove("hidden");
}

function compress(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxW = Number(maxWidthEl.value);
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const type = formatEl.value;
      const quality = Number(qualityEl.value) / 100;
      canvas.toBlob(
        (blob) => resolve({ blob, url: URL.createObjectURL(blob) }),
        type,
        type === "image/png" ? undefined : quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

function extFor(type) {
  return { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" }[type] || "img";
}

function renderItem(file, blob, url) {
  const pct = Math.round((1 - blob.size / file.size) * 100);
  const grew = pct < 0;
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const outName = `${baseName}-compressed.${extFor(formatEl.value)}`;

  const el = document.createElement("div");
  el.className = "item";
  el.innerHTML = `
    <img src="${url}" alt="preview" />
    <div>
      <div class="name">${outName}</div>
      <div class="sizes">${formatBytes(file.size)} → ${formatBytes(blob.size)}
        · <span class="saved ${grew ? "up" : ""}">${grew ? "+" + Math.abs(pct) : "−" + pct}%</span>
      </div>
    </div>
    <button class="dl">⬇️ Download</button>
  `;
  el.querySelector(".dl").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = outName;
    a.click();
  });
  return el;
}
