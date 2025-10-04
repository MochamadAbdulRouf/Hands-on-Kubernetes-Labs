// Aplikasi Node JS untuk menulis sebuah file dan memasukannya ke volume didalam Container

const fs = require('fs');
const path = require('path');

// Tentukan direktori dan nama file secara permanen di dalam kode.
const outputDir = '/data';
const outputFile = 'log.txt';
const fullPath = path.join(outputDir, outputFile);
const content = `Tugas dieksekusi oleh Node.js pada: ${new Date().toISOString()}\n`;

console.log(`--- Memulai Aplikasi Writer ---`);

try {
  // Pastikan direktori tujuan ada.
  fs.mkdirSync(outputDir, { recursive: true });

  // Tulis konten ke file.
  fs.writeFileSync(fullPath, content);

  console.log(`[SUKSES] File berhasil ditulis di lokasi: ${fullPath}`);
  
  // Keluar dengan sukses.
  process.exit(0);

} catch (err) {
  console.error(`[GAGAL] Terjadi error:`, err);
  process.exit(1);
}