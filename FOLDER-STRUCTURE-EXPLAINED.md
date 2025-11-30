# 📂 Penjelasan Struktur Folder - Quick Reference

## ❓ Kenapa Ada 2 Folder CSS dan JS?

Project ini mengalami **refactoring besar** dari versi sederhana (v1.0) ke versi advanced dengan GLB models (v2.0).

### 🗂️ Visualisasi Cepat

```
final-project-rx-king/
│
├── 📁 assets/
│   ├── 📁 css/          ❌ VERSI LAMA - TIDAK DIGUNAKAN
│   ├── 📁 js/           ❌ VERSI LAMA - TIDAK DIGUNAKAN
│   └── 📁 models/       ✅ DIGUNAKAN (GLB files)
│
├── 📁 css/              ✅ VERSI BARU - AKTIF DIGUNAKAN
└── 📁 js/               ✅ VERSI BARU - AKTIF DIGUNAKAN
```

## ✅ File Mana yang Dipakai?

### Yang AKTIF di `index.html` (Line 18, 110-112):

```html
<!-- CSS -->
<link rel="stylesheet" href="./css/style.css">

<!-- JavaScript -->
<script src="./js/ui.js"></script>
<script src="./js/physics.js"></script>
<script src="./js/game.js"></script>
```

### Yang TIDAK Dipakai (folder lama):

```
❌ assets/css/style.css
❌ assets/js/game.js
❌ assets/js/physics.js
❌ assets/js/ui.js
```

## 📊 Perbandingan Detail

| Aspek | `assets/js/` (Lama) | `js/` (Baru) |
|-------|---------------------|--------------|
| **File** | 3 file terpisah | 3 file (tapi logic di game.js) |
| **Baris Kode** | ~200 total | ~400 (game.js saja) |
| **Fitur** | Paper ball basic | GLB models + selection |
| **Anchoring** | ❌ | ✅ Bins stay in place |
| **Trash Type** | ❌ | ✅ 3 jenis + preview |
| **Scoring** | Simple | Smart (cek tipe) |

## 🔍 Detail Perbedaan Per File

### 1. CSS Files

#### `assets/css/style.css` (LAMA) - 45 baris
- Styling basic
- Tidak ada animations kompleks
- Tidak ada trash selector buttons

#### `css/style.css` (BARU) - 132 baris
- Advanced styling dengan animations
- Trash selector buttons (3 tombol)
- Preview container styling
- Responsive design lebih baik

### 2. JavaScript Files

#### `assets/js/game.js` (LAMA) - 72 baris
```javascript
// Fitur sederhana:
- Basic marker detection
- Simple throw mechanism
- Minimal game state (3 variables)
```

#### `js/game.js` (BARU) - 398 baris
```javascript
// Fitur lengkap:
- Bin anchoring system
- Trash selection + preview
- Three.js GLTFLoader
- Smart collision detection
- Complex game state (10+ variables)
- Auto-cleanup system
```

#### `assets/js/physics.js` (LAMA) - 104 baris
- Simple throw dengan sphere
- Basic force calculation

#### `js/physics.js` (BARU) - 104 baris
- **SAMA** dengan versi lama
- Logic sudah pindah ke `game.js`
- File masih di-load untuk kompatibilitas

#### `assets/js/ui.js` (LAMA) - 30 baris
- Simple score update
- Basic throw indicator

#### `js/ui.js` (BARU) - 30 baris
- **SAMA** dengan versi lama
- Logic sudah pindah ke `game.js`
- File masih di-load untuk kompatibilitas

## 🎯 Kesimpulan

### File yang WAJIB Ada:
```
✅ index.html
✅ css/style.css
✅ js/game.js          (MAIN FILE - 398 baris)
✅ js/physics.js       (di-load tapi fungsi di game.js)
✅ js/ui.js            (di-load tapi fungsi di game.js)
✅ assets/models/*.glb (6 file model 3D)
✅ assets/targets.mind
```

### File yang BISA Dihapus (untuk production):
```
❌ assets/css/
❌ assets/js/
❌ README.md (jika sudah paham)
❌ QUICK-START.md
❌ assets/marker-template.svg (setelah dicetak)
```

## 🚀 Next Steps

1. **Untuk Development**: Biarkan semua file, folder lama berguna untuk referensi
2. **Untuk Production**: Hapus `assets/css/` dan `assets/js/` untuk save space
3. **Untuk Learning**: Bandingkan file lama vs baru untuk lihat evolusi kode

## 📝 Timeline Development

```
Version 1.0 (Basic)
├── assets/css/style.css (45 lines)
├── assets/js/game.js (72 lines)
├── assets/js/physics.js (104 lines)
└── assets/js/ui.js (30 lines)
Total: ~251 lines

        ⬇️ REFACTORING ⬇️
        
Version 2.0 (Advanced)
├── css/style.css (132 lines)
├── js/game.js (398 lines) ← MAIN LOGIC
├── js/physics.js (104 lines, legacy)
└── js/ui.js (30 lines, legacy)
Total: ~664 lines (2.6x lebih kompleks)
```

## 🔗 Links Terkait

- [README.md](./README.md) - Dokumentasi lengkap
- [index.html](./index.html) - File utama aplikasi
- [js/game.js](./js/game.js) - Main game logic (398 baris)

---

**Dibuat untuk memudahkan pemahaman struktur project**  
Jika masih bingung, baca [README.md](./README.md) bagian "Struktur Proyek"
