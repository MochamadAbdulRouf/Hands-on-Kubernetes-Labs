# Basic Of GKE (Google Kubernetes Engine)

1. Set default compute region
```bash
gcloud config set compute/region REGION
```
example region:
- us-central1
- us-east1
- us-west2

2. set default compute zone
```bash
gcloud config set compute/zone ZONE
```
example zone:
- us-cental1-a
- us-east1-b
- us-west2-a


3. Membuat sebuah GKE Cluster dengan name `lab-cluster`
```bash
gcloud container clusters create --machine-type=e2-medium --zone=us-central1-a lab-cluster
```

4. Mendapatkan credentials autentikasi dari cluster
```bash
gcloud container clusters get-credentials lab-cluster
```

5. Mencoba menggunakan service deployment pada cluster, untuk menguji apakah berhasil membuat sebuah cluster menggunakan service GKE
```bash
kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:1.0
```

6. Expose aplikasi supaya mendapatkan ip public dengan service Load Balancer pada port 8080
```bash
kubectl expose deployment hello-server --type=LoadBalancer --port 8080
```

7. Melihat apakah service berjalan
```bash
kubectl get service
```

8. Melihat aplikasi jika sudah mendapatkan public ip dari service, di browser. 
```bash
http://[EXTERNAL-IP]:8080
```

9. Menghapus sebuah cluster 
```bash
gcloud container clusters delete lab-cluster
```
