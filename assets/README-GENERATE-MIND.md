# INSTRUKSI GENERATE FILE .MIND

File `.mind` adalah file yang dibutuhkan oleh MindAR untuk mendeteksi gambar marker Anda.

## Langkah-Langkah:

### 1. Persiapkan Gambar Marker

**Gunakan salah satu:**
- File `marker-template.svg` yang sudah disediakan
- Buat gambar sendiri dengan kriteria:
  - Format: JPG/PNG (jika SVG, convert dulu)
  - Resolusi minimal: 480x480px (recommended: 800x800px)
  - Banyak detail dan kontras warna
  - Hindari gambar polos/gradasi

**Contoh gambar yang BAGUS:**
- Logo dengan banyak warna
- Poster dengan teks dan gambar
- Icon dengan border dan pattern
- QR Code dengan tambahan design

**Contoh gambar yang JELEK:**
- Warna solid tanpa detail
- Gradasi/blur
- Terlalu gelap/terang
- Terlalu simple

### 2. Convert SVG ke PNG (Jika Pakai Template)

Buka `marker-template.svg` di:
- **Online**: https://cloudconvert.com/svg-to-png
- **Photoshop/GIMP**: Import SVG, Export as PNG
- **Browser**: Buka SVG, klik kanan > Save as PNG

Atau gunakan command line:
```bash
# Install Inkscape dulu
inkscape marker-template.svg --export-filename=marker.png --export-width=800
```

### 3. Generate File .mind

**CARA 1: Online Compiler (RECOMMENDED)**

1. Buka: https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. Klik "Choose File" atau drag & drop gambar marker Anda
3. Tunggu proses (5-30 detik)
4. Download file `targets.mind`
5. Pindahkan ke folder `assets/` di proyek ini

**CARA 2: MindAR CLI (Advanced)**

```bash
# Install Node.js dulu, lalu:
npm install -g mind-ar-cli

# Generate .mind file
mind-ar-compiler ./assets/marker.png ./assets/
```

### 4. Update Path di index.html (Jika Perlu)

Jika nama file berbeda, edit baris ini di `index.html`:
```html
mindar-image="imageTargetSrc: ./assets/targets.mind;"
```

Ganti `targets.mind` dengan nama file Anda.

## Troubleshooting

**"Compiler tidak bisa memproses gambar"**
- Gambar terlalu besar, resize ke max 2000x2000px
- Format tidak didukung, convert ke PNG/JPG
- Gambar terlalu simple, tambah detail

**"Marker tidak terdeteksi saat di-scan"**
- Gambar terlalu polos, ganti dengan yang lebih detail
- Generate ulang dengan resolusi lebih tinggi
- Cek pencahayaan saat scan

**"File .mind tidak ada"**
- Pastikan proses compile selesai 100%
- Download ulang jika gagal
- Coba browser lain (Chrome recommended)

## File Yang Harus Ada

Setelah generate, struktur folder:
```
assets/
├── marker-template.svg    # Template asli (opsional)
├── marker.png             # Gambar marker (opsional, untuk referensi)
└── targets.mind           # FILE INI WAJIB! (hasil generate)
```

**PENTING:** File `targets.mind` HARUS ada agar aplikasi bisa jalan!

## Alternative Markers

Jika tidak mau ribet, gunakan gambar SIAP PAKAI:
- Logo daur ulang warna-warni
- Poster kampanye lingkungan
- Stiker brand terkenal (Coca-Cola, Starbucks, dll)

Generate gambar tersebut jadi .mind file menggunakan cara di atas.

---

**Sudah generate?** Lanjut test aplikasi dengan buka `index.html`!
