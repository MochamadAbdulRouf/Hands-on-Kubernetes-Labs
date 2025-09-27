# REPLICATION CONTROLLER
Replication Controller bertugas untuk memastikan bahwa pod selalu berjalan, Jika tiba tiba Pod mati atau hilang, Misal ketika ada Node yang mati.Maka Replication Controller secara otomatis akan menjalankan Pod yang mati atau hilang tersebut.

Replication Controller biasanya ditugaskan untuk memanage lebih dari 1 Pod 

Replication Controller akan memastikan jumlah pod berjalan sesuai jumlah yang ditentukan.Jika lebih maka rc akan menghapus pod yang ada.

## Topology Replication Controller
![tp-rc](./image/tp-rc.png)

## Ketika Terjadi Masalah
![tp-rc-error](./image/tp-rc-problem.png)

Source gambar : PPT Programmer Zaman Now Kelas Kubernetes

* Running pod
```bash
laborant@dev-machine:replica-controller$ kubectl apply -f sim-app-replication.yaml
```

* Pod running
```bash
laborant@dev-machine:replica-controller$ kubectl get pod
NAME                      READY   STATUS    RESTARTS   AGE
sim-health-app-rc-4jdwp   1/1     Running   0          9m15s
sim-health-app-rc-4q9pq   1/1     Running   0          9m15s
sim-health-app-rc-nb4k2   1/1     Running   0          9m15s
```

* Melihat Replica Controller
```bash
laborant@dev-machine:replica-controller$ kubectl get replicationcontrollers 
NAME                DESIRED   CURRENT   READY   AGE
sim-health-app-rc   3         3         3       9m50s
laborant@dev-machine:replica-controller$ kubectl get replicationcontroller
NAME                DESIRED   CURRENT   READY   AGE
sim-health-app-rc   3         3         3       9m53s
laborant@dev-machine:replica-controller$ kubectl get rc
NAME                DESIRED   CURRENT   READY   AGE
sim-health-app-rc   3         3         3       10m
```

## Sebelum Menghapus Replication Controller
* Saat kita menghapus Replication Controller, Maka Pod yang berada di label selector ikut terhapus
* Jika kita ingin menghapus Replication Controller, tanpa menghapus Pod yang berada pada label selectornya, Kita bisa tambahkan opsi --cascade=false

* Menghapus Replication Controller
```bash
kubectl delete rc sim-health-app-rc
```
* Menghapus Replication Controller saja
```bash
kubectl delete rc sim-health-app-rc --cascade=false
```