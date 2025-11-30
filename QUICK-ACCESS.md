# 🚀 Quick Start - Akses dari HP Android

Server sudah running! ✅

## 📱 Cara Akses dari HP:

### Metode 1: Via WiFi (MUDAH - Tidak perlu ADB)

#### 1. Pastikan HP dan PC terhubung WiFi yang SAMA

#### 2. Di HP Android, buka Chrome dan akses salah satu:

```
http://192.168.110.138:8080
```
atau
```
http://192.168.56.1:8080
```
atau
```
http://192.168.0.1:8080
```

**Coba satu per satu** sampai yang bisa diakses!

#### 3. Jika Firewall Block

**Opsi A: Allow via Windows Firewall Popup**
- Saat akses dari HP, Windows akan muncul popup
- Pilih **"Allow access"**

**Opsi B: Manual Allow Firewall** (Run PowerShell as Admin)
```powershell
netsh advfirewall firewall add rule name="Python HTTP Server 8080" dir=in action=allow protocol=TCP localport=8080
```

**Opsi C: Disable Firewall Sementara** (Tidak recommended)
- Windows Security → Firewall → Turn off (Private network)

#### 4. Izinkan Akses Kamera

Saat dibuka di Chrome HP:
- Tap **"Allow"** untuk camera access
- Jika tidak muncul, klik ikon 🔒 di address bar → Permissions → Camera → Allow

#### 5. Scan Marker!

- Print atau tampilkan `assets/targets.png` di layar
- Arahkan kamera HP ke marker
- Bins akan muncul dan ter-anchor!

---

## 🔌 Metode 2: Via USB + ADB (Lebih Stabil)

Jika WiFi lambat atau ingin koneksi lebih cepat:

### 1. Download ADB (Manual)

Link: https://dl.google.com/android/repository/platform-tools-latest-windows.zip

### 2. Extract dan Install

```powershell
# Extract zip ke folder, misal C:\adb
# Masuk ke folder tersebut
cd C:\adb\platform-tools

# Test ADB
.\adb.exe devices
```

### 3. Enable USB Debugging di HP

```
Settings → About Phone → Tap "Build Number" 7x
Settings → Developer Options → Enable "USB Debugging"
```

Hubungkan HP ke PC → Tap **ALLOW** di popup HP

### 4. Port Forwarding

```powershell
.\adb.exe reverse tcp:8080 tcp:8080
```

### 5. Akses di HP

Buka Chrome di HP:
```
http://localhost:8080
```

---

## ✅ Checklist

- [ ] Server running ✅ (sudah jalan)
- [ ] HP dan PC di WiFi yang sama
- [ ] Firewall allowed port 8080
- [ ] Akses http://192.168.110.138:8080 di Chrome HP
- [ ] Camera permission granted
- [ ] Marker ready untuk di-scan

---

## 🐛 Troubleshooting

### "This site can't be reached"

**Coba:**
1. Ganti IP address (coba 3 IP di atas)
2. Pastikan WiFi sama
3. Cek firewall Windows
4. Ping dari HP ke PC: `ping 192.168.110.138` (via Terminal app)

### "Camera blocked"

**Fix:**
1. Chrome Settings → Site Settings → Camera → Allow
2. Atau klik ikon 🔒 di address bar → Permissions → Camera

### "Marker not detected"

**Fix:**
1. Pastikan `assets/targets.mind` ada
2. Gunakan pencahayaan yang baik
3. Print marker dengan ukuran minimal 10x10 cm
4. Jarak kamera 30-50 cm dari marker

---

## 📊 Status Saat Ini

✅ Server: **RUNNING** di `http://0.0.0.0:8080`
✅ Port: **8080**
✅ Accessible from:
   - http://192.168.110.138:8080 (Kemungkinan besar ini yang aktif)
   - http://192.168.56.1:8080
   - http://192.168.0.1:8080

**Silakan coba akses dari HP Anda sekarang!** 🎉
