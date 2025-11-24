# 🎯 AR Paper Toss - Game Daur Ulang Sampah

Aplikasi AR (Augmented Reality) berbasis web untuk edukasi pemilahan sampah dengan gameplay "Paper Toss". Dibangun menggunakan teknologi **gratis** dan **open source**.

## 📱 Fitur

- ✅ **Image Tracking AR** - Scan stiker untuk memunculkan tong sampah virtual
- ✅ **Physics Engine** - Lemparan kertas realistis dengan gravitasi
- ✅ **Scoring System** - Sistem poin untuk setiap lemparan yang masuk
- ✅ **3 Tong Sampah** - Anorganik (Merah), Organik (Hijau), Kertas (Biru)
- ✅ **Mobile-Friendly** - Berjalan di browser smartphone
- ✅ **No Installation** - Tidak perlu install aplikasi

## 🛠️ Teknologi yang Digunakan

- **A-Frame** (1.4.2) - Framework AR/VR berbasis HTML
- **MindAR** (1.2.2) - Image tracking engine
- **A-Frame Physics System** (4.0.1) - Engine fisika untuk simulasi lemparan
- **CANNON.js** - Physics engine (included in A-Frame Physics)

Semua library **100% GRATIS** dan open source!

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

## 🎮 Cara Bermain

1. **Deteksi Marker**: Arahkan kamera ke stiker hingga tong sampah muncul
2. **Aim**: Posisikan kamera agar bidik tong yang diinginkan
3. **Throw**: Tap layar untuk melempar
4. **Score**: Dapatkan 10 poin per lemparan yang masuk

**Tips:**
- Jarak ideal: 30-50cm dari marker
- Pencahayaan yang baik meningkatkan tracking
- Tap dengan cepat untuk lemparan yang kuat

## 📁 Struktur Proyek

```
pah/
├── index.html              # File utama aplikasi
├── assets/
│   ├── marker-template.svg # Template marker untuk dicetak
│   └── targets.mind        # File tracking (generate sendiri)
├── models/                 # Folder untuk 3D models (opsional)
└── README.md              # Dokumentasi ini
```

## 🔧 Kustomisasi

### Mengubah Kekuatan Lemparan

Edit di `index.html` baris ~180:
```javascript
let throwPower = 5;      // Naikkan = lebih kuat
let throwAngle = 30;     // Naikkan = lebih tinggi
```

### Menambah Model 3D

1. Download model .glb dari [Sketchfab](https://sketchfab.com)
2. Simpan di folder `models/`
3. Ganti cylinder dengan model:
```html
<a-gltf-model 
    src="./models/trash-bin.glb"
    scale="0.2 0.2 0.2"
    static-body>
</a-gltf-model>
```

### Mengubah Sistem Scoring

Edit fungsi `updateScore()` di `index.html`:
```javascript
function updateScore(points) {
    score += points;
    // Tambah logika kustom di sini
}
```

## 🐛 Troubleshooting

### Kamera Tidak Muncul
- Pastikan aplikasi berjalan via HTTPS atau localhost
- Cek permission kamera di browser settings
- Gunakan browser Chrome/Firefox/Safari (terbaru)

### Marker Tidak Terdeteksi
- Pastikan file `targets.mind` sudah benar
- Cek pencahayaan ruangan (jangan terlalu gelap/terang)
- Pastikan marker tidak ada lipatan atau refleksi
- Jarak marker terlalu jauh/dekat dari kamera

### Bola Tidak Terlempar
- Buka Console (F12) untuk lihat error
- Pastikan marker terdeteksi (ada indikator hijau)
- Physics system mungkin belum load, refresh halaman

### Performance Lambat
- Tutup aplikasi lain di smartphone
- Matikan debug mode: `physics="debug: false"`
- Kurangi jumlah bola maksimal di scene

## 📱 Browser Support

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

## 🎓 Tips Untuk Presentasi Kampus

1. **Demo Video**: Rekam gameplay sebagai backup
2. **Backup Marker**: Cetak 2-3 marker cadangan
3. **Test Sebelumnya**: Coba di ruang presentasi lebih dulu
4. **PowerPoint**: Jelaskan teknologi yang dipakai
5. **Source Code**: Highlight bagian penting kode

### Poin-Poin Presentasi

- Jelaskan **kenapa Image Tracking** bukan Object Detection
- Tunjukkan **library gratis** yang dipakai
- Demo **cara kerja physics engine**
- Diskusi **aplikasi untuk edukasi lingkungan**

## 📚 Referensi & Belajar Lebih Lanjut

- [A-Frame Documentation](https://aframe.io/docs/)
- [MindAR Documentation](https://hiukim.github.io/mind-ar-js-doc/)
- [A-Frame Physics System](https://github.com/n5ro/aframe-physics-system)
- [CANNON.js Physics](https://schteppe.github.io/cannon.js/)

## 🚀 Pengembangan Lebih Lanjut

Ide fitur tambahan:
- [ ] Sistem level dengan kesulitan bertingkat
- [ ] Timer dan challenge mode
- [ ] Leaderboard dengan localStorage
- [ ] Animasi visual saat scoring
- [ ] Sound effects
- [ ] Multiple marker support
- [ ] Random waste type (organik/anorganik/kertas)

## 📄 Lisensi

Proyek ini menggunakan teknologi open source:
- A-Frame: MIT License
- MindAR: MIT License
- A-Frame Physics System: MIT License

Anda bebas menggunakan, memodifikasi, dan mendistribusikan untuk keperluan akademik maupun komersial.

## 👨‍💻 Author

Dibuat untuk tugas kampus RX - Teknologi AR Daur Ulang Sampah

---

**⭐ Selamat mengerjakan tugas kampus! Semoga dapat nilai A! ⭐**

Jika ada pertanyaan atau error, cek Console browser (F12) untuk debugging.
