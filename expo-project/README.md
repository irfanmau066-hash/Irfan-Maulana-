# Aplikasi Input Data & Laporan Konsumen (Expo React Native)

Aplikasi mobile Expo (React Native) yang diadaptasi dari aplikasi Streamlit Python ke platform Android/iOS dengan fitur lengkap:

### Fitur Utama:
1. **Menu Utama & Grafik (Dashboard Ringkasan & Performa)**:
   - Metrik `Total Konsumen` & `Total Pinjaman` (Format Rupiah IDR).
   - Grafik performa pinjaman bulanan (Visual bar chart).
   - Rincian performa tim marketing.

2. **Input Data Konsumen (Formulir Input Data Konsumen)**:
   - `Tanggal` (Format YYYY-MM-DD).
   - `Nama Konsumen` (Wajib diisi).
   - `Jumlah Pinjaman (Rp)` (Input numerik dengan kelipatan 100.000).
   - `No. HP` / WhatsApp.
   - `Nama Marketing`.
   - `Nomor Kontrak` (Wajib diisi).
   - `Note / Catatan`.
   - Validasi data & pesan sukses/gagal.

3. **Laporan Harian & Ekspor Data**:
   - Tampilan daftar dan tabel data konsumen (DataFrame).
   - Filter tanggal laporan harian dan pencarian cepat.
   - Tombol **Unduh Laporan ke Excel** (`laporan_konsumen.xlsx`) dengan sheet bernama **Laporan**.
   - Integrasi `expo-sharing` untuk langsung membuka file di Microsoft Excel, Google Spreadsheet, atau mengirim via WhatsApp.

---

## Cara Menjalankan dengan Expo Go:

1. **Buat project Expo baru**:
   ```bash
   npx create-expo-app@latest aplikasi-konsumen-laporan --template blank-typescript
   cd aplikasi-konsumen-laporan
   ```

2. **Install dependency yang diperlukan**:
   ```bash
   npx expo install expo-file-system expo-sharing xlsx
   ```

3. **Salin isi `App.tsx`**:
   Salin seluruh kode dari file `expo-project/App.tsx` ke dalam `App.tsx` di project Anda.

4. **Jalankan aplikasi**:
   ```bash
   npx expo start
   ```

5. **Buka di HP Android / iPhone**:
   Install aplikasi **Expo Go** dari Google Play Store / Apple App Store, lalu scan QR Code yang tampil di terminal.
