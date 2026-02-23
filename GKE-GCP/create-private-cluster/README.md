# Setting up a Private Cluster

1. Setup Region dan Zone menggunakan gcloud console
  - Export Region
```bash
export REGION=region
```
  - Setup ZONE 
```bash
gcloud config set compute/zone ZONE
```


2. Membuat sebuah private cluster 
Ketika membuat sebuah private cluster, Harus specifik CIDR pada `/28` untuk VM yang menjalankan kubernetes cluster component dan perlu mengaktifkan IP alias. Selanjutnya membuat sebuah cluster dengan nama `private-cluster`, dan spesifik CIDR range nya adalah `172.16.0.16/28` untuk node master. ketika mengaktifkan IP alias, Kubernetes Engine auto create subnetwork untuk anda.

```bash
gcloud beta container cluster create private-cluster \
    --enable-private-nodes \
    --master-ip4-cidr 172.16.0.16/28 \
    --enable-ip-alias \
    --create-subnetwork ""
```
3. Lihat subnet dan ip address yang dibuat oleh kubernetes
  - List subnet dari default network
```bash
gcloud compute networks subnets list --network default 
```
  - di outputnya nanti, ada sebuah subnetwork baru yang otomatis dibuat untuk cluster. contoh name subnetwork `gke-private-cluster-subnet-xxxx`, lalu copy subnet yg dibuat cluster.
  - melihat informasi lengkap subnet yang otomatis dibuat, replacing [SUBNET_NAME] dengan nama subnet yg di copy tadi
  ```bash
  gcloud compute networks subnets describe [SUBNET_NAME] --region=$REGION 
  ```
  example output:
  ```bash
  ...
  ipCidrRange: 10.0.0.0/22
  kind: compute#subnetwork
  name: gke-private-cluster-subnet-163e3c97
  ...
  privateIpGoogleAccess: true
  ...
  secondaryIpRanges:
  - ipCidrRange: 10.40.0.0/14
    rangeName: gke-private-cluster-pods-163e3c97
  - ipCidrRange: 10.0.16.0/20
    rangeName: gke-private-cluster-services-163e3c97
  ...
  ```
  di outputnya itu terdapat secondary range ip pertama dan kedua, untuk pods dan services. jika notice dengan privateIpGoogleAccess yg di set true, ini mengaktifkan cluster hosts yang punya private ip address saja, untuk bisa connect dengan Google APIs dan services.
  
  
  
4. Mengaktifkan master authorized networks
  - saat ini, IP Address yang hanya punya akses ke master node adalah ip range berikut
  - Primary ip range dari subnet, untuk range ip nodes 
  - Second ip range dari subnet, untuk range ip pods 

  untuk memberikan tambahan akses ip range ke master, harus Menghubungkan koneksi ke kubernetes cluster

5. Menghubungkan koneksi sebuah vm instance ke kubernetes cluster
```bash
gcloud compute instances create source-instance --zone=$ZONE --scopes 'https://www.googleapis.com/auth/cloud-platform'
```
  
6. Mendapatkan ip ekternal dari `source-instance` 
```bash
gcloud compute instances describe source-instance --zone=$ZONE | grep natIP 
```
example output:
```bash
natIP: 35.192.107.237
```
  - copy natIP 
  - jalankan command berikut untuk menghubungkan external ip instance ke kubernetes cluster private ip, dari natIP yang keluar dari output sebelumnya CIDR nya yaitu `35.192.107.237/32` atau `natIP/32`, replace `EXTERNAL_IP_RANGE` dengan natIp range dari hasil output.
  ```bash
  gcloud container clusters update private-cluster \ 
    ---enable-master-authorized-networks \
    ---master-authorized-networks [EXTERNAL_IP_RANGE]
  ```

7. SSH ke `source-instance` 
```bash
gcloud compute ssh source-instance --zone=$ZONE 
```
  - press Y untuk melanjutkan autentikasi, dan kosongkan passphrase question

8. install kubectl component dari Cloud-SDK 
```bash
sudo apt-get install kubectl
```

9. Konfigurasi access ke kubernetes cluster via SSH shell
```bash
sudo apt-get install google-cloud-sdk-gke-gcloud-auth-plugin
gcloud container clusters get-credentials private-cluster --zone=$ZONE
```

10. Verify bahwa cluster node tidak memiliki ip ekternal
```bash
kubectl get nodes --output yaml | grep -A4 addresses
```
outputnya akan menampilkan bahwa node memiliki internal ip namun tidak memiliki ekternal ip address:
```bash
...
addresses:
- address: 10.0.0.4
  type: InternalIP
- address: ""
  type: ExternalIP
...
```
11. Command lain untuk verify bahwa node tidak memiliki ekternal ip address 
```bash
kubectl get nodes --output wide
```
Output yang ditampilkan tidak memiliki EXTERNAL-IP 
```bash
STATUS ... VERSION        EXTERNAL-IP   OS-IMAGE ...
Ready      v1.8.7-gke.1                 Container-Optimized OS from Google
Ready      v1.8.7-gke.1                 Container-Optimized OS from Google
Ready      v1.8.7-gke.1                 Container-Optimized OS from Google
```
12. Clean Up 
```bash
gcloud container clusters delete private-cluster --zone=$ZONE 
```
press Y untuk melanjutkan menghapus cluster 

## Create a private cluster that uses a custom subnetwork

1. Create custom subnetwork untuk secondary range ip
```bash
gcloud compute networks subnets create my-subnet \
    --network default \
    --range 10.0.4.0/22 \
    --enable-private-ip-google-access \
    --region=$REGION \
    --secondary-range my-svc-range=10.0.32.0/20,my-pod-range=10.4.0.0/14
```

2. Create private cluster menggunakan subnetwork yg dibuat
```bash
gcloud beta container clusters create private-cluster2 \
    --enable-private-nodes \
    --enable-ip-alias \
    --master-ipv4-cidr 172.16.0.32/28 \
    --subnetwork my-subnet \
    --services-secondary-range-name my-svc-range \
    --cluster-secondary-range-name my-pod-range \
    --zone=$ZONE
```

3. mengambil ekternal ip address range dari source-instance
```bash
gcloud compute instances describe source-instance --zone=$ZONE | grep natIP
```
  - copy natIP address 
  - untuk menghubungkan external ip address, replace MY_EXTERNAL_IP dengan cidr range external addresses.CIDR range dari outputnya adalah (natIP/32).
  ```bash
  gcloud container clusters update private-cluster2 \
        --enable-master-authorized-networks \
        --zone=$ZONE \
        --master-authorized-networks MY_EXTERNAL_IP
  ```
  
  4. SSH source-instance 
  ```bash
  gcloud compute ssh source-instance --zone=$ZONE 
  ```
  
  5. Konfigurasi access kubernetes cluster lewat SSH shell
  ```bash
  gcloud container cluster get-credentials private-cluster2 --zone=$ZONE 
  ```
  
  6. Verify cluster node tidak memiliki external IP address 
  ```bash
  kubectl get nodes --output yaml | grep -A4 addresses 
  ```
  output dari node yang punya internal IP address namun tidak memiliki ekternal ip address
  ```bash
  ...
  addresses:
  - address: 10.0.4.3
    type: InternalIP
  ...
  ```
  
  7. primary range subnetwork, range ip address ini hanya untuk nodes, example range untuk nodes `10.0.4.0/22`.
  8. second primary range subnetwrok, range ip address ini hanya untuk pods, example range untuk pods `10.4.0.0/14`.
