import os
from datetime import datetime

# Ambil path direktori dari environment variable, default ke './data' jika tidak ada
log_directory = os.getenv('LOG_PATH', './data')
file_name = 'timestamp.txt'
# Gabungkan path direktori dan nama file dengan aman
file_path = os.path.join(log_directory, file_name)
content = f"File ini dibuat oleh Python pada: {datetime.now().isoformat()}\n"

print(f"--- Memulai Tugas: Menulis file ke Volume dengan Python ---")

try:
    # Buat direktori tujuan jika belum ada
    os.makedirs(log_directory, exist_ok=True)
    
    # Buka file dalam mode 'write' ('w') dan tulis kontennya.
    # 'with open' akan otomatis menutup file setelah selesai.
    with open(file_path, 'w') as f:
        f.write(content)
        
    print(f"\n[SUKSES]")
    print(f"File berhasil ditulis di: {file_path}")
    print(f"--- Tugas Selesai ---")

except Exception as e:
    print(f"\n[GAGAL] Terjadi error saat menulis file:")
    print(e)
    # Keluar dengan kode error
    exit(1)