// app-configmap.js

// === 1. IMPOR MODUL YANG DIBUTUHKAN ===
// Mengimpor 'express' untuk membuat server web.
const express = require('express'); 
// Mengimpor 'fs' (File System) untuk membaca file dari disk.
const fs = require('fs');
// Mengimpor 'path' untuk membantu mengelola path direktori dengan aman.
const path = require('path');


// === 2. INISIALISASI APLIKASI & KONFIGURASI ===
// Membuat instance dari aplikasi Express.
const app = express();
// Menentukan port di mana server akan berjalan.
const port = 2122; 

// Menentukan path absolut di dalam container tempat kita mengharapkan file konfigurasi.
// Path ini akan disediakan oleh 'volumeMounts' di Kubernetes.
const configPath = '/etc/config/app.properties';
// Membuat objek kosong untuk menyimpan hasil parsing konfigurasi.
const config = {};


// === 3. FUNGSI UNTUK MEMBACA DAN PARSING KONFIGURASI ===
/**
 * Membaca file konfigurasi dari 'filePath', mem-parsing isinya,
 * dan menyimpannya ke dalam objek 'config'.
 * @param {string} filePath - Path menuju file konfigurasi.
 */
function parseConfig(filePath) {
  console.log(`Mencoba membaca konfigurasi dari: ${filePath}`);
  try {
    // Membaca seluruh isi file secara sinkron (synchronous).
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Memecah isi file menjadi baris-baris terpisah.
    fileContent.split('\n').forEach(line => {
      // Abaikan baris kosong atau baris yang diawali dengan '#' (komentar).
      if (line && !line.startsWith('#')) {
        // Memecah setiap baris menjadi kunci dan nilai berdasarkan tanda '='.
        const [key, value] = line.split('=');
        // Simpan ke dalam objek 'config' setelah membersihkan spasi ekstra.
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });
    console.log('Konfigurasi berhasil dimuat:', config);
  } catch (err) {
    // Jika file tidak ditemukan atau ada error lain, cetak pesan error.
    console.error('Gagal membaca atau mem-parsing file konfigurasi:', err.message);
  }
}


// === 4. EKSEKUSI & PENGGUNAAN KONFIGURASI ===
// Panggil fungsi parseConfig sekali saat aplikasi pertama kali dimulai.
parseConfig(configPath);

// Ambil nilai-nilai dari objek 'config'.
// Gunakan '||' untuk memberikan nilai default jika kunci tidak ditemukan di file.
const appVersion = config.APP_VERSION || 'Tidak Ditemukan'
const nodeEnv = config.NODE_ENV || 'development';


// === 5. DEFINISI ROUTE (ENDPOINT) UNTUK WEB SERVER ===
// Menangani permintaan HTTP GET yang masuk ke alamat root ('/').
app.get('/', (req, res) => {
  
  // Membuat konten HTML dinamis untuk dikirim sebagai respons.
  const htmlResponse = `
    <html>
      <head>
        <title>Info ConfigMap</title>
        <style>body { font-family: sans-serif; padding: 20px; }</style>
      </head>
      <body>
        <h1>Konfigurasi Dimuat dari File (ConfigMap Volume)</h1>
        <p><strong>Versi Aplikasi (APP_VERSION):</strong> ${appVersion}</p>
        <p><strong>Lingkungan (NODE_ENV):</strong> ${nodeEnv}</p>
      </body>
    </html>
  `;
  
  // Mengirim respons HTML ke browser klien.
  res.send(htmlResponse);
});


// === 6. MENJALANKAN SERVER ===
// Memulai server dan membuatnya "mendengarkan" permintaan di port yang telah ditentukan.
app.listen(port, () => {
  console.log(`Server berjalan dan siap menerima permintaan di http://localhost:${port}`);
});