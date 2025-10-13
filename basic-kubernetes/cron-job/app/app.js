// app.js

/**
 * Fungsi untuk memeriksa apakah sebuah angka adalah bilangan prima.
 * @param {number} num - Angka yang akan diperiksa.
 * @returns {boolean} - True jika prima, false jika tidak.
 */
function isPrime(num) {
  // Bilangan prima harus lebih besar dari 1
  if (num <= 1) {
    return false;
  }
  // 2 adalah satu-satunya bilangan prima genap
  if (num === 2) {
    return true;
  }
  // Semua bilangan genap lain bukan prima
  if (num % 2 === 0) {
    return false;
  }
  // Periksa pembagi ganjil dari 3 hingga akar kuadrat dari angka tersebut
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

/**
 * Fungsi utama untuk menjalankan tugas.
 */
function main() {
  const limit = 20000;
  const primesFound = [];

  console.log(`--- Memulai Tugas: Menghitung Bilangan Prima hingga ${limit} ---`);
  
  const startTime = Date.now();

  for (let i = 0; i <= limit; i++) {
    if (isPrime(i)) {
      primesFound.push(i);
    }
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // dalam detik

  console.log(`\n[HASIL]`);
  console.log(`Ditemukan ${primesFound.length} bilangan prima.`);
  console.log(`Tugas selesai dalam ${duration.toFixed(2)} detik.`);
  console.log(`--- Tugas Berhasil Diselesaikan ---`);
  
  // Keluar dengan kode 0 untuk memberitahu Kubernetes bahwa Pod sukses
  process.exit(0);
}

// Jalankan fungsi utama
main();