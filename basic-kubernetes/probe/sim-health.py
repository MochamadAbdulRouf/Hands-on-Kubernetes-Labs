# Ini adalah kode aplikasi untuk praktek sederhana memahami probe kubernetes

from flask import Flask, make_response
import time
import threading

# --- STATE FLAGS ---
# is_ready akan menjadi true setelah startup delay selesai
is_ready = False
# is_healthy bisa diubah menjadi False dnegan memanggil enpoint /break
is_healthy = True

# -- Startup Delay Simulation ---
def simulate_long_startup():
    """Fungsi ini mensimulasikan startup yang lama"""
    print("Aplikasi sedang dalam proses startup...")
    time.sleep(25) # aplikasi dalam kondisi sleep selama 25 detik
    global is_ready
    is_ready = True
    print("Startup selesai. Aplikasi sekarang siap!")

# Jalankan simulasi startup di thread terpisah agar tidak memblokir server
startup_thread = threading.Thread(target=simulate_long_startup)
startup_thread.start()

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# -- Endpoints ---
@app.route('/')
def index():
    """endpoint utama"""
    if is_ready and is_healthy:
        return "Aplikasi sehat dan siap!", 200
    else:
        return "Aplikasi belum siap dan tidak sehat", 503

@app.route('/health')
def health_check():
    """endpont untuk liveness dan startup probe"""
    if is_healthy:
        response = make_response("Sehat!", 200)
    else:
        response = make_response("Tidak sehat!", 500)
    return response

@app.route("/ready")
def ready_check():
    """Endpoint untuk readiness"""
    if is_ready:
        response = make_response("Siap!", 200)
    else:
        response = make_response("Tidak siap!", 503)
    return response

@app.route('/break')
def break_app():
    """Endpoint untuk merusak liveness probe"""
    global is_healthy
    is_healthy = False
    print("Aplikasi sekarang dalam kondisi tidak sehat.")
    return "Aplikasi telah di setel ke kondisi tidak sehat", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

