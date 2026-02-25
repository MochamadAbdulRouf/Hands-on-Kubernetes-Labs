# Managing a GKE Multi-tenant Cluster with Namespaces 

## Viw and Create Namespace

set default zone dan melakukan authenticate provided cluster `multi-tenant-cluster` 
```bash
export ZONE=placeholder
gcloud config set compute/zone ${ZONE} && gcloud container clusters get-credentials multi-tenant-cluster
```

Default namespace
```bash
kubectl get namespace
```
- default: namepsace ini akan digunakan jika melakukan membuat resource tanpa menentukan namespace nya.
- kube-node-lease: manage healthy sebuah nodes, agar `control-plane` tahu node itu masih hidup atau mati.
- kube-public: digunakan untuk resource yang dapat dilihat oleh seluruh user di cluster 
- kube-system: untuk digunakan oleh component yang secara default sistem dari kubernetes.

mendapatkan list namespace resource:
```bash
kubectl api-resources --namespaced=true
```

mendapatkan resource tertentu dari sebuah namespace
```bash
kubectl get services --namespace=kube-system
```
output yang dihasilkan adalah seluruh resources service dari namespace tersebut.

### Implementation

Create 2 namespace dengan nama team-a dan team-b:
```bash
kubectl create namespace team-a && \
kubectl create namespace team-b
```

Contoh melakukan deployment ke 2 namespace tersebut
```bash
kubectl run app-server --image=quay.io/centos/centos:9 --namespace=team-a -- sleep infinity && \
kubectl run app-server --image=quay.io/centos/centos:9 --namespace=team-b -- sleep infinity
```

Melihat detail dari pods yang dibuat 
```bash
kubectl describe pod app-server --namespace=team-a
```

Secara default jika kita membuat atau melihat resource tanpa `--namespace` maka akan di arahkan ke `default`, kita bisa ubah konteksnya untuk selalu mengarahkan membuat atau melihat resource ke namespace `team-a`. berikut commandnya 
```bash
kubectl config set-context --current --namespace=team-a
```
Test tanpa menggunakan flag `--namespace`, seharusnya akan langsung mengarahkan ke `namespace team-a`
```bash
kubectl describe pod app-server 
```

## Access Control in Namespaces

| Role | Description |
| --- | --- |
| Kubernetes Engine Admin | Kelola cluster dan semua resource, bisa create,update,dll. cocok untuk DevOps |
| Kubernetes Engine Developer | Kelola Resources didalam cluster, bisa create, update, delete pod, services, deployment, dll. tidak dapat membuat atau menghapus cluster, cocok untuk Developer |
| Kubernetes Engine Cluster Admin | Bisa create dan delete cluster, tidak bisa mengelola pod dan service didalam cluster. cocok untuk infra/cloud engineer |
| Kubernetes Engine Viewer | read only semua resource, bisa melihat cluster, namespace, dan resources kebernetes. tidak bisa mengubah apapun, cocok untuk QA atau monitoring |
| Kubernetes Engine Cluster Viewer | Bisa get dan list cluster GKE, akses minimum untuk masuk ke cluster, cocok untuk user yang butuh akses dasar |


Perumpamaan skenerionya begini, Memberikan role Kubernetes Engine Cluster Viewer ke akun GCP, untuk digunakan developer yang akan mengakses namespace team-a. berikut commandnya 
```bash
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} \
--member=serviceAccount:team-a-dev@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com  \
--role=roles/container.clusterViewer
```

### Kubernetes RBAC

Akses terhadap semua resource (Pods, Deployment, Service,dll) di sebuah cluster, itu bisa didefinisikan menggunakan resource `role binding`, `role binding` akan melakukan identifikasi apakah user account atau groups memeliki akses ketika ingin membuat sebuah resource di cluster.

Untuk membuat sebuah role di namespace tertentu, dengan menentukan resource yang dapat di akses oleh role tersebut. Bisa menggunakan flag `--verb` untuk mengidentifikasi resource apa saja yang dapat di akses oleh role tersebut. commandnya:
```bash
kubectl create role pod-reader \
--resource=pods --verb=watch --verb=get --verb=list
```
Atau membuat sebuah role dengan multiple rules atau berbagai resource yang spesifik bisa di lihat file `developer-role.yaml`.


membuat sebuah role binding di antara team-a-developer `serviceaccount` dan developer-role:
```bash
kubectl create rolebinding team-a-developers \
--role=developer --user=team-a-dev@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com
```

Test role binding 
  - Download service account keys untuk menggunakan `serviceaccount`:
```bash 
gcloud iam service-accounts keys create /tmp/key.json --iam-account team-a-dev@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com
```

Berikut cara mengaktifkan service account, selanjutnya saat menggunakan cluster, role yang digunakan adalah role dev.
```bash
gcloud auth activate-service-account  --key-file=/tmp/key.json
```

Mendapatkan credentials cluster, untuk service account 
```bash
export ZONE=placeholder
gcloud container clusters get-credentials multi-tenant-cluster --zone ${ZONE} --project ${GOOGLE_CLOUD_PROJECT}
```

testing dengan melihat list pods yang ada di namespace team-a
```bash
kubectl get pods --namespace=team-a
```
output:
```bash
NAME           READY   STATUS    RESTARTS   AGE
app-server     1/1     Running   0          6d
```
namun ketika mencoba melihat pods yang ada di namespace team-b, akan di tolak karena tidak memiliki akses.
```bash
kubectl get pods --namespace=team-b
```
output
```bash
Error from server (Forbidden): pods is forbidden: User "team-a-dev@a-gke-project.iam.gserviceaccount.com" cannot list resource "pods" in API group "" in the namespace "team-b": requires one of ["container.pods.list"] permission(s).
```

cara untuk logout atau menghapus kredensial yang baru saja di aktifkan
```bash
gcloud auth revoke
```
atau kembali ke tab terminal yang pertama, lalu jalankan command berikut
```bash
export ZONE=placeholder
gcloud container clusters get-credentials multi-tenant-cluster --zone ${ZONE} --project ${GOOGLE_CLOUD_PROJECT}
```
command di atas berlaku untuk mengembalikan kredensial cluster dan reset context yang dibuat untuk namespace `team-a`


## Resource Quotas 
Ketika sebuah cluster dibagikan dalam konfigurasi multi-tenant, penting untuk memastikan pengguna tidak dapat menggunakan sumber daya yang lebih besar dari cluster. Resource Quota akan mendefinisikan batasan yang akan di membatasi penggunakan sumber daya dalam namespace, Quota akan menentukan batas jumlah objek (Pods, Service, Deployment, dll) yang dapat dibuat, total jumlah sumber daya penyimpanan (Persistent volume claims, ephemeral storage, storage class), atau total jumlah sumber daya komputasi (CPU dan Memory/RAM).


Command berikut akan membuat sebuah `Quota`, dan memberikan limit pada jumlah pod dan service loadbalancer yang dapat dibuat.
```bash
kubectl create quota test-quota \
--hard=count/pods=2,count/services.loadbalancers=1 --namespace=team-a
```
testing, membuat 2 pods lagi di dalam namespace `team-a`
```bash
kubectl run app-server-2 --image=quay.io/centos/centos:9 --namespace=team-a -- sleep infinity
```
Buat pods ketiga
```bash
kubectl run app-server-3 --image=quay.io/centos/centos:9 --namespace=team-a -- sleep infinity
```
outputnya seharusnya akan menghasilkan error seperti ini
```bash
Error from server (Forbidden): pods "app-server-3" is forbidden: exceeded quota: test-quota, requested: count/pods=1, used: count/pods=2, limited: count/pods=2
```

cara melihat detail lengkap resource quota menggunakan `kubectl describe`:
```bash
kubectl describe quota test-quota --namespace=team-a
```
output:
```bash
Name:                         test-quota
Namespace:                    team-a
Resource                      Used  Hard
--------                      ----  ----
count/pods                    2     2
count/services.loadbalancers  0     1
```

update `test-quota` memiliki limit pod sebanyak 6
```bash
export KUBE_EDITOR="nano"
kubectl edit quota test-quota --namespace=team-a
```
ganti bagian hard quota di value untuk `count/pods` dibawah `spec`
```bash
apiVersion: v1
kind: ResourceQuota
metadata:
  creationTimestamp: "2020-10-21T14:12:07Z"
  name: test-quota
  namespace: team-a
  resourceVersion: "5325601"
  selfLink: /api/v1/namespaces/team-a/resourcequotas/test-quota
  uid: a4766300-29c4-4433-ba24-ad10ebda3e9c
spec:
  hard:
    count/pods: "6" # <--- edit bagian ini menjadi 6
    count/services.loadbalancers: "1"
status:
  hard:
    count/pods: "5"
    count/services.loadbalancers: "1"
  used:
    count/pods: "2"
```
CTRL + X, Y, enter save and exit.


Lihat update quota 
```bash
kubectl describe quota test-quota --namespace=team-a
```
output
```bash
Name:                         test-quota
Namespace:                    team-a
Resource                      Used  Hard
--------                      ----  ----
count/pods                    2     6
count/services.loadbalancers  0     1
```

### CPU and Memory Quotas
Saat menetapkan kuota untuk CPU dan memori, kita dapat menentukan kuota untuk jumlah permintaan (nilai yang dijamin akan diterima oleh kontainer) atau jumlah batas (nilai yang tidak akan pernah diizinkan untuk melebihi oleh kontainer).

Dalam lab ini, Cluster memiliki 4 mesin e2-standard-2, masing-masing dengan 2 inti dan 8GB memori. Kita telah diberikan file YAML contoh kuota sumber daya untuk implementasi di cluster:


file `cpu-mem-quota.yaml`
```bash
apiVersion: v1
kind: ResourceQuota
metadata:
  name: cpu-mem-quota
  namespace: team-a
spec:
  hard:
    limits.cpu: "4"
    limits.memory: "12Gi"
    requests.cpu: "2"
    requests.memory: "8Gi"
```

Buat quotanya menggunakan file manifest
```bash
kubectl create -f cpu-mem-quota.yaml
```
Dengan kuota ini berlaku, total permintaan CPU dan memori dari semua pod akan dibatasi hingga 2 CPU dan 8 GiB, dengan batas masing-masing 4 CPU dan 12 GiB.



Untuk implementasi `Quota CPU dan memory` ke pods, lihat file `cpu-mem-demo-pod.yaml`. lalu buat pods menggunakan file manifestnya.
```bash
kubectl create -f cpu-mem-demo-pod.yaml --namespace=team-a
```
Lihat CPU dan Memory request dan limit dari `quota` yang dibuat
```bash
kubectl describe quota cpu-mem-quota --namespace=team-a
```
output
```bash
Name:            cpu-mem-quota
Namespace:       team-a
Resource         Used   Hard
--------         ----   ----
limits.cpu       400m   4
limits.memory    512Mi  12Gi
requests.cpu     100m   2
requests.memory  128Mi  8Gi
```
