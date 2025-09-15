# Cara Melakukan deployment di kubernetes

## 1. Membuat Deployment
kita akan mendeploy sebuah webserver Nginx. yang kita deploy adalah file bernama nginx-deployment.yaml
```bash
vim nginx-deployment.yaml
```

## 2. Melakukan Deployment
Eksekusi command berikut
```bash
kubectl apply -f nginx-deployment.yaml
```

## 3. Memeriksa deployment dan pod
Command melihat status deployment :
```bash
kubectl get deployment
```
Command melihat pod yang dibuat oleh deployment
```bash
kubectl get pods
```

# Cara  mengekspos Aplikasi dengan service

## 1. Buat file bernama nginx-service.yml
```bash
vim nginx-service.yaml
```

## 2. Terapkan konfigurasi service
Eksekusi command berikut :
```bash
kubectl apply -f nginx-service.yaml
```
## 3. Mengakses Aplikasi Nginx
Cek service yang baru saja kita buat untuk melihat port mana yang dibuka
```bash
kubectl get service
```
## 4. Menghapus deployment dan service
Kita bisa menghapus deployment dan service berdasarkan file konfigurasinya. commandnya :

```bash
kubectl delete -f nginx-service.yaml
```

```bash
kubectl delete -f nginx-deployment.yaml
```

