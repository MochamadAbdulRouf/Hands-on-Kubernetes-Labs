# Implementation

1. apply file confignya
```bash
k apply -f app-api.yml
```
2. menemukan error
```bash
ubuntu@master-node:~/app-testing$ k logs pod/app-api-56ffd597b4-g5r4c
[2026-04-09 14:56:09 +0000] [7] [INFO] Starting gunicorn 23.0.0
[2026-04-09 14:56:09 +0000] [7] [INFO] Listening at: http://0.0.0.0:5000 (7)
[2026-04-09 14:56:09 +0000] [7] [INFO] Using worker: sync
[2026-04-09 14:56:09 +0000] [7] [ERROR] Unhandled exception in main loop
Traceback (most recent call last):
  File "/usr/local/lib/python3.9/site-packages/gunicorn/arbiter.py", line 201, in run
    self.manage_workers()
  File "/usr/local/lib/python3.9/site-packages/gunicorn/arbiter.py", line 570, in manage_workers
    self.spawn_workers()
  File "/usr/local/lib/python3.9/site-packages/gunicorn/arbiter.py", line 641, in spawn_workers
    self.spawn_worker()
  File "/usr/local/lib/python3.9/site-packages/gunicorn/arbiter.py", line 588, in spawn_worker
    worker = self.worker_class(self.worker_age, self.pid, self.LISTENERS,
  File "/usr/local/lib/python3.9/site-packages/gunicorn/workers/base.py", line 65, in __init__
    self.tmp = WorkerTmp(cfg)
  File "/usr/local/lib/python3.9/site-packages/gunicorn/workers/workertmp.py", line 23, in __init__
    fd, name = tempfile.mkstemp(prefix="wgunicorn-", dir=fdir)
  File "/usr/local/lib/python3.9/tempfile.py", line 345, in mkstemp
    prefix, suffix, dir, output_type = _sanitize_params(prefix, suffix, dir)
  File "/usr/local/lib/python3.9/tempfile.py", line 122, in _sanitize_params
    dir = gettempdir()
  File "/usr/local/lib/python3.9/tempfile.py", line 307, in gettempdir
    tempdir = _get_default_tempdir()
  File "/usr/local/lib/python3.9/tempfile.py", line 223, in _get_default_tempdir
    raise FileNotFoundError(_errno.ENOENT,
FileNotFoundError: [Errno 2] No usable temporary directory found in ['/tmp', '/var/tmp', '/usr/tmp', '/app']
```

3. Fix, gunakan file `app-api-fix.yml`, error disebabkan oleh setting pada bagian security. dimana kita set false pada file-system menjadi hanya read-only, namun libary aplikasi yang digunakan yaitu Gunicorn butuh akses membuat file pada `/tmp`. jadi fix nya `readOnlyRootFilesystem: true`. 
 


solusi 1. lalu Ini cara paling proper. /tmp tetap writable tapi tidak persisten (hilang kalau pod restart).
```bash
# Di bagian spec.containers, tambah volumeMounts:
containers:
  - name: k8s-demo-app
    # ... config lain tetap sama ...
    volumeMounts:
      - name: tmp-dir
        mountPath: /tmp

# Di bagian spec (sejajar dengan containers), tambah volumes:
volumes:
  - name: tmp-dir
    emptyDir: {}
```



solusi 2. Matikan readOnlyRootFilesystem (Quick fix)
```bash
securityContext:
  readOnlyRootFilesystem: false  # ubah ke false
```


4. Test App

Lihat IP Node
```bash
k get node -o wide
```

export IP NODE dan API_KEY menjadi environment
```bash
NODE_IP="<IP-NODE-KAMU>"
API_KEY="your-secret-api-key"  
```

lalu pertama testing pada path `healthz` dan `readyz`
```bash
curl http://$NODE_IP:30010/healthz
curl http://$NODE_IP:30010/readyz
```

Dengan API key yang benar → harus 200
```bash
curl -H "X-API-KEY: $API_KEY" http://$NODE_IP:30010/data
```
Dengan API key salah → harus 401
```bash
curl -H "X-API-KEY: wrong-key" http://$NODE_IP:30010/data
```

example:
```bash
ubuntu@master-node:~/app-testing$ curl -H "X-API-KEY: $API_KEY" http://$NODE_IP:30010/data
{"data":{"app":"k8s-demo-app","namespace":"default","node_name":"node-1","pod_name":"app-api-7dd87d69d6-ftkw9","uptime_seconds":404.36,"version":"1.0.0"},"message":"Authenticated! Welcome to the K8s demo app.","status":"success"}
```
