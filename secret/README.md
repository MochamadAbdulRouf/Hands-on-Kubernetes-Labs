# SECRET
## Sensitive Data
Saat menggunakan Config Map maka data yang ada di Config Map di anggap tidak sensitive.Namun Aplikasi juga butuh data yang sensitive, Seperti Username password Database, API Key, Secret Key, DLL.Untuk menyimpan jenis data sensitive bisa menggunakan object Secret di Kubernetes, Secret sama seperti Config Map berisi Key dan Value.

## Apakah aman menyimpan data sensitive aplikasi di Secret Kubernetes?
Kubernetes menyimpan Secret dengan aman dan hanya mendistribusikannya ke Node yang membutuhkan Secret tersebut.Secret selalu disimpan di memory di node dan tidak pernah di simpan di physical storage, Di Master node sendiri (lebih tepatnya etcd) Secret disimpan dengan cara di encrypt, Sehingga lebih aman.Secara sederhana gunakan Config Map untuk konfigurasi yang tidak sensitive dan gunakan Secret untuk konfigurasi yang sensitive

## Implementasi Secret
Berikut adalah penerapan Secret di Kubernetes, Sebagai perumpamaan disini memasukan APP_VERSION dan NODE_ENV sebagai data sensitive dan memasukannya di Object Secret.Jadi data secret akan diubah menjadi Environment Variable didalam Container untuk digunakan oleh Aplikasinya.Jadi walau data Secret jika masuk ke Container akan tetap keluar menjadi Environment Variable supaya bisa digunakan Aplikasinya didalam Container.

1. Running Secret, Replica Set, Service
```bash
controlplane ~/secret-nodejs ➜  kubectl apply -f secret-nodejs.yaml 
secret/nodejs-secret created
replicaset.apps/nodejs-env created
service/nodejs-env-serv created
```

2. Melihat semua resource Kubernetes
```bash
controlplane ~/secret-nodejs ➜  kubectl get all
NAME                   READY   STATUS    RESTARTS   AGE
pod/nodejs-env-7hs4r   1/1     Running   0          42s
pod/nodejs-env-tjptg   1/1     Running   0          42s

NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/kubernetes        ClusterIP   172.20.0.1       <none>        443/TCP          76m
service/nodejs-env-serv   NodePort    172.20.121.216   <none>        2122:30003/TCP   42s

NAME                         DESIRED   CURRENT   READY   AGE
replicaset.apps/nodejs-env   2         2         2       42s
```

3. Melihat Secret yang telah dibuat
```bash
controlplane ~/secret-nodejs ➜  kubectl get secrets 
NAME            TYPE     DATA   AGE
nodejs-secret   Opaque   2      6m
```

4. Melihat lebih lengkap Secret yang dibuat
```bash
controlplane ~/secret-nodejs ➜  kubectl describe secrets nodejs-secret 
Name:         nodejs-secret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
APP_VERSION:  5 bytes
NODE_ENV:     10 bytes
```

5. Melihat Key Value Data Secret yang dimasukan ke Environment Variable didalam Container
```bash
controlplane ~/secret-nodejs ➜  kubectl exec nodejs-env-7hs4r -it -- /bin/sh
/app # env
KUBERNETES_PORT=tcp://172.20.0.1:443
KUBERNETES_SERVICE_PORT=443
NODEJS_ENV_SERV_PORT_2122_TCP_PORT=2122
NODE_VERSION=18.20.8
NODEJS_ENV_SERV_PORT_2122_TCP_PROTO=tcp
HOSTNAME=nodejs-env-7hs4r
YARN_VERSION=1.22.22
SHLVL=1
HOME=/root
NODEJS_ENV_SERV_SERVICE_HOST=172.20.128.246
NODEJS_ENV_SERV_PORT_2122_TCP=tcp://172.20.128.246:2122
NODEJS_ENV_SERV_SERVICE_PORT=2122
NODEJS_ENV_SERV_PORT=tcp://172.20.128.246:2122
TERM=xterm
KUBERNETES_PORT_443_TCP_ADDR=172.20.0.1
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT_443_TCP=tcp://172.20.0.1:443
KUBERNETES_SERVICE_HOST=172.20.0.1
PWD=/app
NODE_ENV=Production
APP_VERSION=2.1.2
NODEJS_ENV_SERV_PORT_2122_TCP_ADDR=172.20.128.246
```