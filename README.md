# AR Paper Toss - Game Daur Ulang Sampah

Aplikasi AR (Augmented Reality) berbasis web untuk edukasi pemilahan sampah dengan gameplay "Paper Toss". Dibangun menggunakan teknologi **gratis** dan **open source**.

> **IMPORTANT:** Project ini memiliki 2 versi kode (v1.0 di `assets/` dan v2.0 di root). Yang aktif digunakan adalah **versi 2.0** dengan fitur GLB models lengkap! Lihat bagian [Struktur Proyek](#-struktur-proyek) untuk detail.

## Daftar Isi

- [Teknologi yang Digunakan](#️-teknologi-yang-digunakan)
- [Fitur Terbaru (Update)](#-fitur-terbaru-update)
- [Cara Menggunakan](#-cara-menggunakan)
- [Cara Bermain](#-cara-bermain)
- [Struktur Proyek](#-struktur-proyek)
  - [Penjelasan Struktur Folder Ganda](#️-penjelasan-struktur-folder-ganda)
  - [Perbandingan Versi Lama vs Baru](#-perbandingan-versi-lama-vs-baru)
  - [Detail Perubahan Kode](#-detail-perubahan-kode)
- [Kustomisasi](#-kustomisasi)
- [Troubleshooting](#-troubleshooting)
- [Changelog & Development History](#-changelog--development-history)
- [TL;DR - Quick Summary](#-tldr---quick-summary)

---

## Teknologi yang Digunakan

- **A-Frame** (1.4.2) - Framework AR/VR berbasis HTML
- **MindAR** (1.2.2) - Image tracking engine untuk deteksi marker
- **A-Frame Physics System** (4.0.1) - Engine fisika untuk simulasi lemparan realistis
- **CANNON.js** - Physics engine (included in A-Frame Physics)
- **Three.js** (0.132.2) - GLTFLoader untuk preview model 3D
- **GLB/GLTF Models** - Format 3D model untuk tong sampah dan objek sampah

Semua library **100% GRATIS** dan open source!

## Fitur Terbaru (Update)

### 1. **Model 3D GLB untuk Realism**
- Tong sampah menggunakan **model 3D realistis** (`.glb` format)
- Objek sampah juga pakai model 3D:
  - **Organik** → Tissue paper 🧻
  - **Anorganik** → Botol plastik 🥤
  - **Hazardous (B3)** → Baterai 🔋

### 2. **Trash Selection System**
- **3 Tombol pilihan sampah** (Organic, Inorganic, Hazardous)
- **Preview model 3D** sampah yang dipilih sebelum dilempar
- Visual feedback: tombol yang dipilih ter-highlight
- Tidak perlu scan ulang marker untuk ganti jenis sampah

### 3. **Bin Anchoring (Marker-Independent)** 🌟
- ✅ **Tong sampah di-anchor ke dunia fisik** saat pertama kali scan
- ✅ Setelah anchor, tong sampah **TETAP DIAM di posisi** meski marker digerakkan/hilang
- ✅ Bins **tidak ikut gerak** kanan-kiri/atas-bawah saat marker bergerak
- ✅ Pemain bisa **bebas gerak** tanpa harus selalu lihat marker
- ✅ **Bins original di marker disembunyikan** setelah di-clone ke world space
- ✅ Gameplay lebih smooth dan user-friendly

**Cara Kerja Anchoring:**
1. Scan marker pertama kali → Bins muncul
2. System **clone bins ke world coordinate** (bukan marker coordinate)
3. Bins original di marker **otomatis hidden**
4. Bins anchored **stay fixed** di posisi dunia
5. Marker bisa hilang/gerak → Bins tetap diam!

### 4. **Smart Scoring System**
- **+10 poin** jika sampah masuk ke tong yang BENAR
- **Feedback visual** berbeda untuk correct vs wrong throw
- **Collision detection** mengecek jenis sampah vs jenis tong
- Pesan error jika salah sorting

### 5. **Improved Physics**
- Setiap jenis sampah punya **ukuran berbeda**:
  - Tissue (organik) = kecil
  - Botol (anorganik) = besar
  - Baterai (hazardous) = sedang
- Physics realistic dengan `dynamic-body` CANNON.js
- Auto-remove trash setelah 10 detik untuk performa

## 📋 Cara Menggunakan

### Langkah 1: Persiapan Marker (Stiker Target)

1. **Buat Gambar Marker**:
   - Cetak file `assets/marker-template.svg` atau buat desain sendiri
   - Gunakan gambar dengan **detail tinggi** dan **banyak kontras warna**
   - Ukuran minimal: 10cm x 10cm (lebih besar lebih baik)

2. **Generate File .mind**:
   - Buka website MindAR Compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile
   - Upload gambar marker Anda
   - Download file `targets.mind`
   - Simpan file tersebut ke folder `assets/`

3. **Cetak dan Tempel**:
   - Cetak marker pada kertas tebal/stiker
   - Tempelkan di tempat sampah atau dinding yang terang

### Langkah 2: Menjalankan Aplikasi

#### Opsi A: Menggunakan Local Server (Recommended)

Aplikasi AR memerlukan protokol HTTPS atau server lokal untuk akses kamera.

**Dengan Python:**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Dengan Node.js:**
```bash
npx http-server -p 8080
```

**Dengan PHP:**
```bash
php -S localhost:8080
```

Kemudian buka browser dan akses: `http://localhost:8080`

#### Opsi B: Deploy ke GitHub Pages (GRATIS)

1. Buat repository GitHub baru
2. Upload semua file proyek
3. Aktifkan GitHub Pages di Settings
4. Akses via: `https://username.github.io/nama-repo`

#### Opsi C: Deploy ke Netlify (GRATIS)

1. Daftar di netlify.com
2. Drag & drop folder proyek
3. Dapatkan URL otomatis

### Langkah 3: Bermain

1. Buka aplikasi di smartphone
2. **Izinkan akses kamera** saat diminta
3. Arahkan kamera ke marker/stiker
4. Tunggu hingga 3 tong sampah muncul
5. **TAP layar** untuk melempar bola kertas
6. Dapatkan poin saat bola masuk ke tong!

## Cara Bermain

1. **Scan Marker**: Arahkan kamera ke stiker marker
2. **Auto-Anchor**: Tunggu hingga 3 tong sampah muncul dan ter-anchor
3. **Select Trash**: Pilih jenis sampah dengan tombol di bawah layar
   - ORGANIC (hijau) - untuk tissue, sisa makanan
   - INORGANIC (merah) - untuk botol plastik, kaleng
   - HAZARDOUS (biru) - untuk baterai, limbah B3
4. **Preview**: Lihat preview 3D model sampah yang dipilih di pojok kanan atas
5. **Aim & Throw**: Bidik tong yang SESUAI, lalu TAP layar untuk lempar
6. **Score**: Dapatkan **+10 poin** jika masuk ke tong yang BENAR!

### Aturan Scoring
- **BENAR**: Sampah organik → Tong hijau = +10 poin ✨
- **BENAR**: Sampah anorganik → Tong merah = +10 poin ✨
- **BENAR**: Sampah hazardous → Tong biru = +10 poin ✨
- **SALAH**: Sampah ke tong yang salah = 0 poin (ada pesan error)

**Tips Pro:**
- Marker cukup di-scan 1x di awal, selanjutnya bins tetap stay!
- Ganti-ganti jenis sampah tanpa scan ulang
- Lempar dengan sudut yang tepat agar masuk
- Pencahayaan yang baik = tracking lebih stabil

## Struktur Proyek

```
final-project-rx-king/
├── index.html              # File utama aplikasi AR
├── assets/
│   ├── targets.mind        # File tracking marker (generate dari compiler)
│   ├── marker-template.svg # Template marker untuk dicetak
│   ├── models/             # Model 3D GLB
│   │   ├── trash-organik.glb      # Model sampah organik (tissue)
│   │   ├── trash-anorganik.glb    # Model sampah anorganik (botol)
│   │   ├── trash-kertas.glb       # Model sampah B3/hazardous (baterai)
│   │   ├── bin-organik.glb        # Model tong sampah hijau
│   │   ├── bin-anorganik.glb      # Model tong sampah merah
│   │   └── bin-kertas.glb         # Model tong sampah biru
│   ├── css/                # TIDAK DIGUNAKAN (versi lama)
│   │   └── style.css
│   └── js/                 # TIDAK DIGUNAKAN (versi lama)
│       ├── game.js
│       ├── physics.js
│       └── ui.js
├── css/                    # CSS AKTIF (versi terbaru)
│   └── style.css           # Styling UI untuk game
├── js/                     # JS AKTIF (versi terbaru)
│   ├── game.js             # Logic utama game (anchor, trash selection, collision)
│   ├── physics.js          # TIDAK DIGUNAKAN (digabung ke game.js)
│   └── ui.js               # TIDAK DIGUNAKAN (digabung ke game.js)
└── README.md               # Dokumentasi ini
```

### Penjelasan Struktur Folder Ganda

Ada **2 set folder css/js** dalam proyek ini:

```
📦 Project Structure
│
├── 📁 assets/
│   ├── 📁 css/          VERSI LAMA (tidak digunakan)
│   │   └── style.css     45 baris, styling basic
│   └── 📁 js/           VERSI LAMA (tidak digunakan)
│       ├── game.js       72 baris, fitur basic
│       ├── physics.js    104 baris, simple throw
│       └── ui.js         30 baris, minimal UI
│
├── 📁 css/              ✅ VERSI BARU (AKTIF)
│   └── style.css        ✅ 132 baris, advanced styling
│
└── 📁 js/                VERSI BARU (AKTIF)
    ├── game.js           398 baris, MAIN LOGIC
    ├── physics.js        104 baris (logic pindah ke game.js)
    └── ui.js             30 baris (logic pindah ke game.js)
```

**File yang AKTIF digunakan di `index.html`:**
```html
<!-- Line 18: CSS Import -->
<link rel="stylesheet" href="./css/style.css">

<!-- Line 110-112: JavaScript Import -->
<script src="./js/ui.js"></script>        <!-- Loaded tapi logic di game.js -->
<script src="./js/physics.js"></script>   <!-- Loaded tapi logic di game.js -->
<script src="./js/game.js"></script>      <!--  MAIN FILE -->
```

**Mengapa ada folder ganda?**
- Folder di `assets/` adalah **versi awal development** sebelum ada fitur GLB models
- Folder di root (`css/`, `js/`) adalah **versi refactored** dengan fitur lengkap
- Folder lama dibiarkan untuk backup/referensi perkembangan kode

**Ringkasan Cepat:**
| Lokasi | Status | Keterangan |
|--------|--------|------------|
| `assets/css/style.css` |  Tidak digunakan | Versi lama |
| `assets/js/*.js` |  Tidak digunakan | Versi lama |
| `css/style.css` |  **AKTIF** | Styling terbaru |
| `js/game.js` |  **AKTIF** | Logic utama (398 baris) |
| `js/physics.js` |  Di-load tapi kosong fungsi | Logic sudah pindah ke game.js |
| `js/ui.js` |  Di-load tapi kosong fungsi | Logic sudah pindah ke game.js |

### 🔄 Perbandingan Versi Lama vs Baru

| Aspek | Versi 1.0 (`assets/`) | Versi 2.0 (`root`) |
|-------|----------------------|-------------------|
| **Objek Dilempar** | Bola kertas sederhana (`<a-sphere>`) | Model 3D GLB (tissue/botol/baterai) |
| **Tong Sampah** | Silinder polos (`<a-cylinder>`) | Model 3D GLB realistis |
| **Pilih Sampah** | ❌ Tidak ada | ✅ 3 tombol + preview |
| **Bin Anchoring** | ❌ Harus selalu lihat marker | ✅ Auto-anchor, bebas gerak |
| **Scoring Logic** | Masuk tong = dapat poin | Cek jenis sampah vs tong |
| **File Structure** | Terpisah (3 file JS) | Consolidated (1 file utama) |
| **UI Preview** | ❌ Tidak ada | ✅ Three.js preview 3D |
| **Physics Shape** | `sphere` body | `box` body (lebih akurat) |
| **Auto-cleanup** | ❌ Manual remove | ✅ Auto-remove 10 detik |

### Detail Perubahan Kode

**1. Game State (Versi Baru Lebih Kompleks)**
```javascript
// LAMA (assets/js/game.js) - 3 variabel saja
const gameState = {
    score: 0,
    isMarkerVisible: false,
    sceneReady: false
};

// BARU (js/game.js) - 10+ variabel untuk fitur baru
const gameState = {
    score: 0,
    isMarkerVisible: false,
    sceneReady: false,
    currentTrashType: 'organik',        // NEW
    binsAnchored: false,                 // NEW
    anchoredBinsPosition: null,          // NEW
    trashPreviewScene: null,             // NEW (Three.js)
    trashPreviewCamera: null,            // NEW
    trashPreviewRenderer: null,          // NEW
    currentTrashModel: null              // NEW
};
```

**2. Throwing Mechanism**
```javascript
// LAMA - Simple paper ball
function createPaperBall() {
    const ball = document.createElement('a-sphere');
    ball.setAttribute('radius', 0.05);
    ball.setAttribute('dynamic-body', 'shape: sphere');
    // ... lempar langsung
}

// BARU - GLB model dengan trash type
function createPhysicsTrash() {
    const trash = document.createElement('a-entity');
    trash.setAttribute('gltf-model', `#trash-${gameState.currentTrashType}`);
    trash.setAttribute('dynamic-body', 'shape: box'); // Box lebih akurat
    trash.setAttribute('data-trash-type', gameState.currentTrashType);
    // ... collision detection yang lebih smart
}
```

**3. Collision Detection**
```javascript
// LAMA - Sederhana, masuk = dapat poin
ball.addEventListener('collide', function(e) {
    if (collidedEl.classList.contains('goal-zone')) {
        updateScore(10); // Langsung dapat poin
    }
});

// BARU - Cek jenis sampah vs jenis tong
trash.addEventListener('collide', (e) => {
    const trashType = trash.getAttribute('data-trash-type');
    const binType = collidedEl.getAttribute('data-bin-type');
    
    if (trashType === binType) {
        updateScore(10); // BENAR
    } else {
        // SALAH - ada feedback error
        updateThrowIndicator('❌ WRONG BIN!', 'red');
    }
});
```

**4. File Imports di `index.html`**
```html
<!-- LAMA (tidak digunakan lagi) -->
<!-- <script src="./assets/js/game.js"></script> -->
<!-- <script src="./assets/js/physics.js"></script> -->
<!-- <script src="./assets/js/ui.js"></script> -->

<!-- BARU (aktif digunakan) -->
<link rel="stylesheet" href="./css/style.css">
<script src="./js/ui.js"></script>        <!-- Masih ada tapi logic pindah ke game.js -->
<script src="./js/physics.js"></script>   <!-- Masih ada tapi logic pindah ke game.js -->
<script src="./js/game.js"></script>      <!-- File utama 398 baris -->
```

**5. Bin Anchoring System (FITUR UTAMA)**
```javascript
// System Anchoring - Bins tetap diam di world space
function anchorBinsToWorld() {
    // 1. Ambil posisi world dari marker saat pertama scan
    const markerWorldPosition = new THREE.Vector3();
    marker.object3D.getWorldPosition(markerWorldPosition);
    
    // 2. Buat container baru di scene (bukan di marker)
    const anchoredContainer = document.createElement('a-entity');
    anchoredContainer.setAttribute('id', 'anchored-bins');
    anchoredContainer.object3D.position.copy(markerWorldPosition);
    
    // 3. Clone semua bins dari marker ke container
    const binEntities = marker.querySelectorAll('a-entity');
    binEntities.forEach((binEntity) => {
        const binClone = binEntity.cloneNode(true);
        anchoredContainer.appendChild(binClone);
        
        // 4. PENTING: Sembunyikan bin original agar tidak duplikat
        binEntity.setAttribute('visible', 'false');
    });
    
    // 5. Tambahkan container ke scene (world space, bukan marker space)
    scene.appendChild(anchoredContainer);
}
```

**Kenapa Bins Tidak Ikut Gerak?**
- Bins di-clone dari **marker coordinate** (lokal) ke **world coordinate** (global)
- Marker = relative space (ikut gerak)
- World = absolute space (tetap diam)
- Bins original di marker di-**hidden** setelah clone
- Hanya bins di world space yang visible → **TETAP DIAM**!

## Kustomisasi

### Mengubah Model 3D

File model 3D berada di `assets/models/`. Untuk mengganti model:

1. **Download model GLB** dari [Sketchfab](https://sketchfab.com) atau buat sendiri
2. **Simpan** di folder `assets/models/`
3. **Edit** `index.html` di bagian `<a-assets>`:

```html
<a-assets>
    <!-- Ganti model tong sampah -->
    <a-asset-item id="bin-organik" src="./assets/models/YOUR-BIN-MODEL.glb"></a-asset-item>
    
    <!-- Ganti model sampah -->
    <a-asset-item id="trash-organik" src="./assets/models/YOUR-TRASH-MODEL.glb"></a-asset-item>
</a-assets>
```

4. **Atur scale** di bagian `<a-gltf-model>`:
```html
<a-gltf-model src="#bin-organik" scale="0.5 0.5 0.5"></a-gltf-model>
```

### Mengubah Ukuran Trash yang Dilempar

Edit di `js/game.js` fungsi `createPhysicsTrash()`:

```javascript
// Baris ~265-275
let trashScale = '0.3 0.3 0.3'; // Default
if (gameState.currentTrashType === 'organik') {
    trashScale = '0.2 0.2 0.2'; // Tissue lebih kecil
} else if (gameState.currentTrashType === 'anorganik') {
    trashScale = '0.35 0.35 0.35'; // Botol lebih besar
}
```

### Mengubah Kekuatan Lemparan

Edit di `js/game.js` fungsi `createPhysicsTrash()`:

```javascript
// Baris ~295-298
const forceX = (Math.random() - 0.5) * 2; // Spread horizontal
const forceY = 5;  // Naikkan = lebih tinggi
const forceZ = 8;  // Naikkan = lebih jauh
```

### Mengubah Sistem Scoring

Edit di `js/game.js` fungsi `handleTrashCollision()`:

```javascript
// Baris ~320-330
if (trashType === binType) {
    updateScore(10); // Ganti angka untuk ubah poin
    // Tambah logic bonus, combo, dll
}
```

### Mengubah Warna Tombol Trash Selector

Edit di `css/style.css`:

```css
/* Baris ~100-116 */
#btn-organik { background: #4CAF50; } /* Hijau */
#btn-anorganik { background: #f44336; } /* Merah */
#btn-hazardous { background: #2196F3; } /* Biru */
```

### Menambah Jenis Sampah Baru

1. Tambah model GLB di `assets/models/trash-kertas.glb`
2. Tambah asset di `index.html`:
```html
<a-asset-item id="trash-kertas" src="./assets/models/trash-kertas.glb"></a-asset-item>
```
3. Tambah tombol di `index.html`:
```html
<button id="btn-kertas" class="trash-button" data-trash-type="kertas">
     PAPER
</button>
```
4. Tambah bin baru dengan collision zone
5. Update array di `js/game.js`:
```javascript
const TRASH_TYPES = ['organik', 'anorganik', 'hazardous', 'kertas'];
```

## Troubleshooting

### Kamera Tidak Muncul
- Pastikan aplikasi berjalan via HTTPS atau localhost
- Cek permission kamera di browser settings
- Gunakan browser Chrome/Firefox/Safari (terbaru)

### Marker Tidak Terdeteksi
- Pastikan file `targets.mind` sudah benar
- Cek pencahayaan ruangan (jangan terlalu gelap/terang)
- Pastikan marker tidak ada lipatan atau refleksi
- Jarak marker terlalu jauh/dekat dari kamera

### Trash/Bola Tidak Terlempar
- Buka Console (F12) untuk lihat error
- Pastikan marker sudah di-scan minimal 1x (bins anchored)
- Pilih jenis sampah dengan tombol terlebih dahulu
- Physics system mungkin belum load, refresh halaman

### Model 3D Tidak Muncul
- Cek Console untuk error loading model GLB
- Pastikan path file model benar di `index.html`
- File GLB harus ada di folder `assets/models/`
- Ukuran file GLB terlalu besar? Compress dengan [glTF-Transform](https://gltf-transform.donmccurdy.com/)

### Tombol Trash Selector Tidak Muncul
- Scan marker terlebih dahulu
- Cek apakah `#trash-selector` memiliki class `.hidden`
- Refresh halaman dan scan ulang

### Preview Sampah Tidak Muncul
- Three.js GLTFLoader mungkin gagal load
- Cek Console untuk error
- Model GLB terlalu kompleks? Gunakan model yang lebih sederhana

### Bins Tidak Ter-Anchor / Hilang Saat Marker Lost
- Ini adalah fitur! Bins hanya ter-anchor **setelah deteksi pertama**
- Jika bins hilang, scan marker sekali lagi untuk re-anchor
- Cek Console log: `🔗 Anchoring bins to world position`

### Performance Lambat / Lag
- Tutup aplikasi lain di smartphone
- Matikan debug mode: `physics="debug: false"` di `<a-scene>`
- Kurangi jumlah trash maksimal (auto-remove setelah 10 detik)
- Gunakan model GLB dengan polygon count rendah
- Test di device yang lebih powerful

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅      | ✅     |
| Firefox | ✅      | ✅     |
| Safari  | ✅      | ✅     |
| Edge    | ✅      | ✅     |

**Minimum Requirements:**
- WebGL support
- Camera API support
- Modern JavaScript (ES6+)

## Referensi & Belajar Lebih Lanjut

- [A-Frame Documentation](https://aframe.io/docs/)
- [MindAR Documentation](https://hiukim.github.io/mind-ar-js-doc/)
- [A-Frame Physics System](https://github.com/n5ro/aframe-physics-system)
- [CANNON.js Physics](https://schteppe.github.io/cannon.js/)


## Changelog & Development History

### Version 2.0 (Current - With GLB Models)
**Location:** `css/`, `js/` (root folder)

**New Features:**
- GLB/GLTF 3D models untuk bins dan trash
- Trash selection system dengan 3 tombol
- Three.js preview untuk model yang dipilih
- Bin anchoring system (marker-independent)
- Smart collision detection (jenis sampah vs tong)
- Improved UI/UX dengan animations
- Different trash sizes (tissue kecil, botol besar, baterai sedang)
- Auto-remove trash setelah 10 detik
- Better error handling dan console feedback

**Technical Changes:**
- Consolidated `physics.js` dan `ui.js` logic ke `game.js`
- Added Three.js GLTFLoader dependency
- Refactored CSS dengan lebih banyak animations
- Physics body shape: `sphere` → `box` untuk trash

### Version 1.0 (Legacy - Basic Paper Toss)
**Location:** `assets/css/`, `assets/js/`

**Features:**
- Basic paper ball throwing
- Simple cylinder bins (no 3D models)
- Direct tap-to-throw (no trash selection)
- Marker-dependent gameplay
- Basic collision detection

**Files:**
- `assets/js/game.js` - Simple game loop
- `assets/js/physics.js` - Basic throw mechanics
- `assets/js/ui.js` - Minimal UI updates
- `assets/css/style.css` - Basic styling
