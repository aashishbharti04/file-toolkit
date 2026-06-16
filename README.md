<div align="center">

# 🗜️ Image Compressor

### Compress, resize & convert images — 100% in your browser. Private, fast, free.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Upload](https://img.shields.io/badge/100%25-Client--side-4ade80?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

⭐ **If this saves you time, drop a star!**

</div>

---

## ❓ The problem it solves
Images from phones and cameras are **huge** — they slow down websites, fill up storage, and get rejected by upload limits. Most "compress image" sites make you **upload your private photos to their servers**. 😬

**Image Compressor does it all locally in your browser** — your images never leave your device.

## ✨ Features
- 🗜️ **Compress** with an adjustable quality slider
- 📐 **Resize** by setting a max width
- 🔄 **Convert** between **JPG · WebP · PNG**
- 📦 **Batch** — drop many images at once
- 📊 See **before → after size** and **% saved** per image
- ⬇️ Download one or **download all**
- 🔒 **100% private** — pure client-side, nothing is uploaded
- ⚡ **Zero dependencies** — just HTML, CSS & JS

## 🚀 Usage
Open `index.html` in any browser, or use the live version on GitHub Pages.
1. Drag & drop (or choose) your images
2. Tweak quality / max width / format
3. Download the optimized results

## 🛠️ How it works
Uses the browser's **Canvas API** to redraw each image at the target size, then
`canvas.toBlob()` re-encodes it at your chosen format and quality — all in memory,
on your machine.

## 🤝 Contributing
PRs welcome! Ideas: drag-to-reorder, EXIF strip toggle, target-filesize mode, ZIP download.

## 📄 License
[MIT](LICENSE) — free for personal and commercial use.

---

<div align="center">

Made with 💙 by [Aashish](https://github.com/aashishbharti04) · ⭐ Star if it helped you!

</div>
