# 📱 Cara Menjalankan AR App di HP Android

Ada **3 cara** untuk menjalankan aplikasi AR ini di HP Android Anda:

## 🔌 Cara 1: USB Debugging + Port Forwarding (PALING MUDAH)

### Prerequisites:
- ✅ HP Android sudah terhubung dengan kabel USB Type-C
- ✅ USB Debugging enabled
- ✅ ADB (Android Debug Bridge) terinstall

### Step-by-Step:

#### 1. Enable USB Debugging di HP Android

```
Settings → About Phone → Tap "Build Number" 7x
Settings → System → Developer Options → Enable "USB Debugging"
```

Saat HP dihubungkan ke PC, akan muncul popup **"Allow USB Debugging?"** → Tap **ALLOW**

#### 2. Install ADB di PC (Pilih salah satu)

**Opsi A: Manual Download (Tercepat)**
1. Download: https://dl.google.com/android/repository/platform-tools-latest-windows.zip
2. Extract ke folder, misal: `C:\adb\`
3. Add ke PATH atau langsung jalankan dari folder tersebut

**Opsi B: Via Chocolatey**
```powershell
choco install adb
```

**Opsi C: Download Android Studio** (Jika sudah punya)
- ADB sudah included di Android Studio

#### 3. Verify ADB Connection

```powershell
# Test koneksi ADB
adb devices
```

**Expected Output:**
```
List of devices attached
ABC123XYZ    device
```

Jika muncul `unauthorized`, cek HP Anda ada popup "Allow USB Debugging" → tap **ALLOW**

#### 4. Start Local Server di PC

```powershell
# Jalankan server di port 8080
python -m http.server 8080
```

**Expected Output:**
```
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

#### 5. Forward Port dari PC ke HP

Buka PowerShell/CMD baru (jangan close yang server):

```powershell
# Forward port 8080 dari PC ke HP
adb reverse tcp:8080 tcp:8080
```

**Expected Output:**
```
8080
```

#### 6. Buka di Browser HP

Di HP Android, buka **Chrome** dan akses:
```
http://localhost:8080
```

**DONE!** Aplikasi AR seharusnya sudah berjalan di HP! 🎉

---

## 📶 Cara 2: Akses via IP Address (Tanpa Kabel)

### Step-by-Step:

#### 1. Cek IP Address PC

```powershell
ipconfig
```

Cari **IPv4 Address** di bagian **Wi-Fi** atau **Ethernet**, contoh:
```
IPv4 Address: 192.168.1.100
```

#### 2. Allow Firewall di PC

```powershell
# Allow port 8080 di Windows Firewall
netsh advfirewall firewall add rule name="Python HTTP Server" dir=in action=allow protocol=TCP localport=8080
```

#### 3. Start Server dengan IP Bind

```powershell
# Jalankan server yang listen ke semua IP
python -m http.server 8080 --bind 0.0.0.0
```

#### 4. Connect HP ke WiFi yang Sama

Pastikan HP dan PC terhubung ke **WiFi yang sama**

#### 5. Buka di Browser HP

Di HP, buka Chrome dan akses:
```
http://192.168.1.100:8080
```
*(Ganti `192.168.1.100` dengan IP PC Anda)*

---

## ☁️ Cara 3: Deploy Online (GRATIS, Paling Praktis)

Tidak perlu kabel atau WiFi yang sama! Deploy ke hosting gratis:

### Opsi A: GitHub Pages (Recommended)

#### 1. Push ke GitHub

```powershell
# Init git (jika belum)
git init
git add .
git commit -m "Deploy AR Trash Sorting Game"

# Push ke GitHub
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

#### 2. Enable GitHub Pages

1. Buka repo di GitHub
2. Settings → Pages
3. Source: **Deploy from branch**
4. Branch: **main** → Folder: **/ (root)**
5. Save

#### 3. Akses dari HP

Tunggu 1-2 menit, lalu akses:
```
https://USERNAME.github.io/REPO-NAME/
```

### Opsi B: Netlify (Paling Cepat)

#### 1. Install Netlify CLI

```powershell
npm install -g netlify-cli
```

#### 2. Deploy

```powershell
# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod
```

Pilih folder: `.` (current directory)

#### 3. Akses dari HP

Netlify akan berikan URL, contoh:
```
https://your-app-name.netlify.app
```

### Opsi C: Vercel

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 🐛 Troubleshooting

### "This site can't be reached"

**Problem:** HP tidak bisa connect ke `localhost:8080`

**Solution:**
1. Pastikan `adb reverse` sudah dijalankan
2. Cek `adb devices` - pastikan device connected
3. Restart ADB: `adb kill-server` → `adb start-server`
4. Re-run: `adb reverse tcp:8080 tcp:8080`

### "Camera Access Denied"

**Problem:** Browser tidak bisa akses kamera

**Solution:**
1. Akses via **HTTPS** atau **localhost** (bukan IP address HTTP)
2. Chrome Settings → Site Settings → Camera → Allow
3. Refresh halaman dan izinkan camera access

### "ADB not found"

**Problem:** Command `adb` tidak dikenali

**Solution:**
```powershell
# Cek apakah ADB sudah di PATH
where adb

# Jika tidak ada, add ke PATH atau jalankan dari folder ADB
cd C:\path\to\adb
.\adb.exe devices
```

### Port 8080 Already in Use

**Problem:** Port sudah dipakai aplikasi lain

**Solution:**
```powershell
# Gunakan port lain, misal 8000
python -m http.server 8000

# Jangan lupa update port forwarding
adb reverse tcp:8000 tcp:8000

# Akses di HP: http://localhost:8000
```

### ADB Unauthorized

**Problem:** `adb devices` menampilkan `unauthorized`

**Solution:**
1. Cek HP, ada popup "Allow USB Debugging?"
2. Centang **"Always allow from this computer"**
3. Tap **ALLOW**
4. Run `adb devices` lagi

---

## ✅ Checklist Sebelum Testing

- [ ] HP Android sudah terhubung USB Type-C
- [ ] USB Debugging enabled di HP
- [ ] ADB terinstall di PC
- [ ] `adb devices` menampilkan device
- [ ] Server running (`python -m http.server 8080`)
- [ ] Port forwarding aktif (`adb reverse tcp:8080 tcp:8080`)
- [ ] Browser HP sudah buka `http://localhost:8080`
- [ ] Camera permission granted
- [ ] Marker sudah dicetak dan siap di-scan

---

## 🎯 Recommended Method

**Untuk Development/Testing:**
- ✅ **Cara 1** (USB + Port Forwarding) - Paling cepat, no lag

**Untuk Demo/Sharing:**
- ✅ **Cara 3** (GitHub Pages/Netlify) - Bisa diakses siapa saja, kapan saja

---

## 📝 Quick Commands Reference

```powershell
# 1. Check USB connection
adb devices

# 2. Start server
python -m http.server 8080

# 3. Forward port (di PowerShell/CMD baru)
adb reverse tcp:8080 tcp:8080

# 4. Akses di HP
# http://localhost:8080

# Troubleshooting:
adb kill-server          # Kill ADB
adb start-server         # Restart ADB
adb reverse --list       # Cek port forwarding aktif
adb reverse --remove-all # Remove semua forwarding
```

---

## 🚀 Pro Tips

1. **Auto-reload saat development:**
   ```powershell
   # Install live-server
   npm install -g live-server
   
   # Jalankan dengan auto-reload
   live-server --port=8080
   
   # Forward port
   adb reverse tcp:8080 tcp:8080
   ```

2. **Check IP via command:**
   ```powershell
   # Quick get IP
   (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*"}).IPAddress
   ```

3. **Test marker tanpa print:**
   - Tampilkan `targets.png` di monitor/tablet
   - Scan dengan HP
   - Lebih eco-friendly untuk testing!

---

**Pilih cara yang paling sesuai dengan kebutuhan Anda!** 🎉
