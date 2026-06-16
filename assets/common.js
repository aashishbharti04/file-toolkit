// ===== Shared helpers used by every tool =====

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Wire a drop zone + hidden file input. Calls onFiles(FileList).
function setupDrop({ drop, input, onFiles, accept }) {
  drop.addEventListener("click", () => input.click());
  input.addEventListener("change", () => { if (input.files.length) onFiles(input.files); });

  ["dragenter", "dragover"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("dragover"); })
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("dragover"); })
  );
  drop.addEventListener("drop", (e) => {
    const files = [...e.dataTransfer.files];
    const ok = accept ? files.filter((f) => accept(f)) : files;
    if (ok.length) onFiles(ok);
  });
}

// Load a File into an HTMLImageElement
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

// Draw an image onto a canvas, optionally scaling to a max width
function imageToCanvas(img, maxWidth) {
  const scale = maxWidth ? Math.min(1, maxWidth / img.width) : 1;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), type, type === "image/png" ? undefined : quality)
  );
}

function extFor(type) {
  return { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" }[type] || "img";
}
