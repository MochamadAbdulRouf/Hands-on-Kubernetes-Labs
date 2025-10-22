// app.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080; // Port default yang umum digunakan

// === MEMBACA IDENTITAS DARI KUBERNETES ===
// Membaca nama Pod yang disuntikkan oleh Downward API melalui env var.
const podName = process.env.POD_NAME || 'local-dev-pod';

// === LOKASI PENYIMPANAN STATE ===
// Path ini cocok dengan 'mountPath' di file StatefulSet.yaml Anda.
const dataDir = '/app/data';
const stateFilePath = path.join(dataDir, 'state.json');
let visitCounter = 0;

// === FUNGSI UNTUK MEMBACA STATE DARI FILE ===
function loadState() {
  try {
    // Pastikan direktori ada sebelum membaca.
    if (fs.existsSync(stateFilePath)) {
      const data = fs.readFileSync(stateFilePath, 'utf8');
      const state = JSON.parse(data);
      visitCounter = state.visits || 0;
      console.log(`State berhasil dimuat. Jumlah kunjungan sebelumnya: ${visitCounter}`);
    } else {
      console.log('File state tidak ditemukan. Memulai dari awal.');
    }
  } catch (err) {
    console.error('Gagal memuat state:', err);
  }
}

// === FUNGSI UNTUK MENYIMPAN STATE KE FILE ===
function saveState() {
  const state = { visits: visitCounter };
  try {
    // Pastikan direktori ada sebelum menulis.
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(stateFilePath, JSON.stringify(state));
  } catch (err) {
    console.error('Gagal menyimpan state:', err);
  }
}

// === ROUTE UTAMA APLIKASI ===
app.get('/', (req, res) => {
  // Tambah nilai penghitung setiap kali halaman diakses.
  visitCounter++;
  
  // Simpan state baru ke file.
  saveState();

  // Tampilkan hasilnya di halaman web.
  const htmlResponse = `
    <html>
      <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
        <h1>Aplikasi Stateful Node.js</h1>
        <h2>Halo dari Pod: <strong>${podName}</strong></h2>
        <p style="font-size: 1.5em;">Halaman ini telah dikunjungi <strong>${visitCounter}</strong> kali.</p>
      </body>
    </html>
  `;
  res.send(htmlResponse);
});


// === MEMULAI SERVER ===
app.listen(port, () => {
  // Muat state yang ada saat server pertama kali dimulai.
  loadState();
  console.log(`Server untuk Pod ${podName} berjalan di port ${port}`);
});