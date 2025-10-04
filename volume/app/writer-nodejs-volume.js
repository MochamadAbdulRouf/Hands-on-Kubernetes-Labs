// 1. Impor modul bawaan Node.js
const fs = require('fs');       // Modul untuk berinteraksi dengan file system (membaca/menulis file).
const path = require('path');   // Modul untuk menangani path direktori dengan aman.

// 2. Tentukan lokasi penyimpanan file
// Ambil path dari environment variable 'HTML_LOCATION'
let location = process.env.HTML_LOCATION;

// Jika environment variable tidak ada, gunakan path default '/app/html'
if (!location) {
  location = "/app/html";
}

console.log(`File akan ditulis secara berkala ke direktori: ${location}`);

// 3. Fungsi utama yang akan dijalankan berulang kali
const handler = () => {
  const date = new Date();
  // Buat konten HTML sederhana yang berisi tanggal dan waktu saat ini
  const htmlContent = `<html><body>${date}</body></html>`;
  // Gabungkan path direktori dan nama file dengan aman menggunakan 'path.join'
  const filePath = path.join(location, "index.html");

  // 4. Tulis file ke filesystem secara asynchronous
  fs.writeFile(filePath, htmlContent, (err) => {
    // Callback ini akan dijalankan setelah operasi tulis selesai atau gagal
    if (err) {
      // Jika ada error, tampilkan di log
      console.error("Gagal menulis file:", err);
    } else {
      // Jika berhasil, tampilkan pesan sukses
      console.log("Sukses menulis file");
    }
  });
};

// 5. Jalankan fungsi 'handler' setiap 5 detik (5000 milidetik)
setInterval(handler, 5000);