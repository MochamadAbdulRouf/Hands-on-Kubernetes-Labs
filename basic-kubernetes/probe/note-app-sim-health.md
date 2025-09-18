# DOKUMENTASI PROSES BERJALANNYA PRATIK PROBE DENGAN SEBUAH APLIKASI PYTHON UNTUK SIMULASI PROBE PADA KUBERNETES

1. Deploy pod ke deployment
```bash
kubectl apply -f sim-app.yaml
```

2. Lihat proses masih belum ready saat pertama kali pod dibuat 
```bash
laborant@dev-machine:sim-health-app$ kubectl get deployment
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
sim-health-app   0/1     1            0           36s
``` 

3. Kita lihat bagian bawah sendiri untuk eventnya 
Jika kita lihat bagian event paling bawah sendiri ada logs berikut:
```bash
Warning  Unhealthy  15s (x2 over 25s)  kubelet            Readiness probe failed: HTTP probe failed with statuscode: 503
```
Kenapa hal itu bisa terjadi? Ingat di logika aplikasi python kita untuk endpoint (/ready).Aplikasi tersebut semgaja dirancang untuk Memulai proses startup 25 detik, Selama 25 detik jika ada yang mengakses /ready.Ia akan merespon dengan 503.Setelah 25 detik berlalau, enpoint (/ready) akan mulai merespon dengan 200 (OK).

Pesan Warning Unhealthy yang kita lihat adalah bukti kubernetes sedang melakukan tugasnya dengan benar. Ia mendeteksi aplikasi belum siap dan menandai pod tersebut sebagai Unhealthy (Tidak sehat untuk menerima traffic).

Perubahan 0/1 menjadi 1/1 adalah konfirmasi bahwa readinessProbe anda sekarang berhasil, dan kubernetes menganggap pod siap menerima traffic dari service

### Berikut logs lebih lengkapnya untuk analisis
```bash
laborant@dev-machine:sim-health-app$ kubectl describe pod sim-health-app-777d7b4dcf-bgq4w 
Name:             sim-health-app-777d7b4dcf-bgq4w
Namespace:        default
Priority:         0
Service Account:  default
Node:             node-01/172.16.0.3
Start Time:       Thu, 18 Sep 2025 03:42:10 +0000
Labels:           app=sim-health
                  pod-template-hash=777d7b4dcf
Annotations:      <none>
Status:           Running
IP:               10.244.1.2
IPs:
  IP:           10.244.1.2
Controlled By:  ReplicaSet/sim-health-app-777d7b4dcf
Containers:
  sim-health-cn:
    Container ID:   containerd://353faeb623a424816fbb88e5629230e7bc6dc490e70d18bd0933a860195a684b
    Image:          mochabdulrouf/sim-health-app:1.0
    Image ID:       docker.io/mochabdulrouf/sim-health-app@sha256:cd7fcb78586b361cef4e1141a614bd00e48e4e4d75cfdbaae51ec570ccbb0535
    Port:           8080/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 18 Sep 2025 03:42:24 +0000
    Ready:          True
    Restart Count:  0
    Liveness:       http-get http://:8080/health delay=15s timeout=1s period=20s #success=1 #failure=3
    Readiness:      http-get http://:8080/ready delay=5s timeout=1s period=10s #success=1 #failure=3
    Startup:        http-get http://:8080/health delay=0s timeout=1s period=10s #success=1 #failure=5
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-9qvw5 (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True 
  Initialized                 True 
  Ready                       True 
  ContainersReady             True 
  PodScheduled                True 
Volumes:
  kube-api-access-9qvw5:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    Optional:                false
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  45s                default-scheduler  Successfully assigned default/sim-health-app-777d7b4dcf-bgq4w to node-01
  Normal   Pulling    45s                kubelet            Pulling image "mochabdulrouf/sim-health-app:1.0"
  Normal   Pulled     31s                kubelet            Successfully pulled image "mochabdulrouf/sim-health-app:1.0" in 13.365s (13.365s including waiting). Image size: 48279289 bytes.
  Normal   Created    31s                kubelet            Created container: sim-health-cn
  Normal   Started    31s                kubelet            Started container sim-health-cn
  Warning  Unhealthy  15s (x2 over 25s)  kubelet            Readiness probe failed: HTTP probe failed with statuscode: 503
```

4. Setelah menunggu lebih 25 detik 
Coba cek apakah pods sudah siap dan running dan hasilnya berikut pod berhasil running dan siap menerima traffic dari service
```bash
laborant@dev-machine:sim-health-app$ kubectl get pods --watch
NAME                              READY   STATUS    RESTARTS   AGE
sim-health-app-777d7b4dcf-bgq4w   1/1     Running   0          7m22s
```

5. Mungkin kita bingung disini masih Unhealthy pada bagian event liveness padahal sudah lebih 25 detik!!

Di event bukanlah hasil sesungguhnya karena bagian event hanyalah mencatat historis readinessProbe sekitar 7 menit lalu, yang sempat gagal 2 kali. Jadi kenapa masih ada? Kubernetes mencatat kegagalan ini sebagao warning lalu apakah masih terjadi? Tidak. JIka probe ini masih gagal, status Pod tidak akan pernah menjadi Ready: True atau READY 1/1.Fakta bahwa statusnya sudah sehat membuktikan probe tersebut sekarang sudah berhasil.Apa yang Anda lihat di Events adalah jejak dari proses startup tersebut.

**Apa yang Anda lihat di Events adalah jejak dari proses startup tersebut**

### Berikut hasil logs untuk analisis

```bash
laborant@dev-machine:sim-health-app$ kubectl describe pod sim-health-app-777d7b4dcf-bgq4w 
Name:             sim-health-app-777d7b4dcf-bgq4w
Namespace:        default
Priority:         0
Service Account:  default
Node:             node-01/172.16.0.3
Start Time:       Thu, 18 Sep 2025 03:42:10 +0000
Labels:           app=sim-health
                  pod-template-hash=777d7b4dcf
Annotations:      <none>
Status:           Running
IP:               10.244.1.2
IPs:
  IP:           10.244.1.2
Controlled By:  ReplicaSet/sim-health-app-777d7b4dcf
Containers:
  sim-health-cn:
    Container ID:   containerd://353faeb623a424816fbb88e5629230e7bc6dc490e70d18bd0933a860195a684b
    Image:          mochabdulrouf/sim-health-app:1.0
    Image ID:       docker.io/mochabdulrouf/sim-health-app@sha256:cd7fcb78586b361cef4e1141a614bd00e48e4e4d75cfdbaae51ec570ccbb0535
    Port:           8080/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 18 Sep 2025 03:42:24 +0000
    Ready:          True
    Restart Count:  0
    Liveness:       http-get http://:8080/health delay=15s timeout=1s period=20s #success=1 #failure=3
    Readiness:      http-get http://:8080/ready delay=5s timeout=1s period=10s #success=1 #failure=3
    Startup:        http-get http://:8080/health delay=0s timeout=1s period=10s #success=1 #failure=5
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-9qvw5 (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True 
  Initialized                 True 
  Ready                       True 
  ContainersReady             True 
  PodScheduled                True 
Volumes:
  kube-api-access-9qvw5:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    Optional:                false
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason     Age                    From               Message
  ----     ------     ----                   ----               -------
  Normal   Scheduled  7m41s                  default-scheduler  Successfully assigned default/sim-health-app-777d7b4dcf-bgq4w to node-01
  Normal   Pulling    7m41s                  kubelet            Pulling image "mochabdulrouf/sim-health-app:1.0"
  Normal   Pulled     7m27s                  kubelet            Successfully pulled image "mochabdulrouf/sim-health-app:1.0" in 13.365s (13.365s including waiting). Image size: 48279289 bytes.  Normal   Created    7m27s                  kubelet            Created container: sim-health-cn  Normal   Started    7m27s                  kubelet            Started container sim-health-cn
  Warning  Unhealthy  7m11s (x2 over 7m21s)  kubelet            Readiness probe failed: HTTP probe failed with statuscode: 503
  ```