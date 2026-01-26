# Canary Deployment
Canary Deployment adalah strategi rilis aplikasi dimana versi baru (canary) hanya diberikan ke sebagian kecil user atau traffic terlebih dahulu, sementara mayoritas user masih menggunakan versi lama (stable).Tujuan untuk menguji versi baru langsung ke production dengan risiko minimal.

## Topologi
[topologi canary](./image/tp-canary-deployment.gif)

## Keuntungan menggunakan Canary Deployment
1. Risiko jauh lebih kecil seperti bug berdampak ke sedikit user
2. Data & Traffic real, lebih akurat dibanding testing di staging
3. Rollback cepat dan aman
4. Tidak perlu infrastructure Ganda, lebih hemat dibanding blue-green deployment

## Kekurangan Canary Deployment
1. Setup lebih kompleks
2. Perlu monitoring & observability
3. Butuh load balancer / ingress yang mendukung traffic split

## SetUp Canary Deployment

- optional bisa membuat namespace khusus untuk canary deployment.
example:
```bash
kubectl create namespace canary
```

lalu untuk selanjutnya bisa menggunakan `-n canary` pada saat membuat service atau deployment. 

1. Buat sebuah deployment utama dengan replica 3
```bash
kubectl create deployment main --image nginx --replicas 3
```

2. Expose service menggunakan NodePort supaya bisa di akses
```bash
kubectl expose deployment main --name main-service --port 80 --target-port 80 --type NodePort
```

3. Lihat berapa port NodePort di service
```bash
kubectl get svc main-service -o wide
```

4. Cek apakah aplikasi bisa diakses menggunakan NodePort
example:
```bash
curl 192.168.1.1:30081
```
```bash
curl IP:NodePort
```

5. Create canary deployment
```bash
kubectl create deployment canary --image httpd --replicas 1 --dry-run -oyaml > canary.yaml 
```
note: `--dry-run` digunakan supaya kubernetes hanya membuat file manifest deployment dan tidak deploy apa apa

6. Edit file `canary.yaml` lihat file manifest `canary-example.yaml` yang aku buat.
```bash
vim canary.yaml
```

7. Lakukan deployment menggunakan file manifest yang sudah di edit
```bash
kubectl create -f canary.yaml
```

8. Cek deployment
```bash
kubectl get deploy -o wide
```

9. Jalankan command ini untuk monitoring hasil canary / load balancing secara real-time
```bash
watch -n 1 curl IP:NodePort
```
example:
```bash
watch -n 1 curl 192.168.1.1:30081
```

10. Membuat 90% traffic user masuk ke main utama dan 10% ke deployment canary
```bash
kubectl scale deployment main --replicas 9
```

11. Cek Deployment
```bash
kubectl get deploy -o wide
```
12. Cek real-time traffic yang akan masuk
```bash
watch -n 1 curl IP:NodePort
```
example:
```bash
watch -n 1 curl 192.168.1.1:30081
```

note: dengan menambahkan replica pod maka traffic bisa dibagi, saat diakses simulasinya nanti 90% user mengakses aplikasi nginx dan hanya 10% user yang mengakses apache
