# Quick Start Guide - AR Paper Toss

## 🚀 Mulai Cepat (5 Menit)

### 1. Generate File Marker (.mind)

**WAJIB dilakukan sebelum menjalankan aplikasi!**

1. Buka browser, kunjungi: **https://hiukim.github.io/mind-ar-js-doc/tools/compile**
2. Upload file `assets/marker-template.svg` ATAU gambar apapun yang punya banyak detail
3. Tunggu proses compile (10-30 detik)
4. Download file `targets.mind`
5. Simpan file tersebut ke folder `assets/` (di folder yang sama dengan marker-template.svg)

### 2. Jalankan Server Lokal

Pilih salah satu cara:

**Python (paling mudah):**
```powershell
python -m http.server 8080
```

**Node.js:**
```powershell
npx http-server -p 8080
```

**PHP:**
```powershell
php -S localhost:8080
```

### 3. Buka di Browser

- Desktop: `http://localhost:8080`
- Mobile: Buka browser HP, ketik IP komputer Anda (contoh: `http://192.168.1.100:8080`)

### 4. Cetak Marker

1. Buka file `assets/marker-template.svg` di browser
2. Klik kanan > Print atau Save as PDF
3. Cetak di kertas A4
4. Atau tampilkan di layar monitor/tablet

### 5. Mainkan!

1. Izinkan akses kamera di browser
2. Arahkan kamera ke marker yang sudah dicetak
3. Tunggu tong sampah muncul
4. TAP layar untuk melempar bola kertas!

## 🎯 Tips Cepat

- **Jarak ideal**: 30-50 cm dari marker
- **Pencahayaan**: Terang tapi tidak kena cahaya langsung
- **Browser**: Gunakan Chrome/Firefox versi terbaru
- **Marker**: Jangan ada lipatan atau bayangan

## ❓ Error?

**Kamera tidak muncul:**
- Pastikan pakai `http://localhost` atau HTTPS
- Cek izin kamera di browser settings

**Marker tidak terdeteksi:**
- Pastikan file `targets.mind` sudah ada di folder `assets/`
- Coba jarak lebih dekat/jauh
- Tambah pencahayaan ruangan

**Halaman tidak terbuka:**
- Cek server sudah jalan di terminal
- Coba port lain (8000, 3000, 5000)

## 📱 Test di HP

1. Pastikan HP dan laptop di WiFi yang sama
2. Cari IP laptop: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux)
3. Buka browser HP, ketik: `http://[IP-LAPTOP]:8080`
   Contoh: `http://192.168.1.100:8080`

---

**Sudah siap? Selamat bermain! 🎮**

Baca `README.md` untuk instruksi lengkap dan kustomisasi.
