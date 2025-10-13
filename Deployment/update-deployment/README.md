# UPDATE DEPLOYMENT 
Untuk Update Deployment itu mudah banget, Tinggal gunakan command kubectl apply -f filename.yaml lagi untuk Update Deployment terbaru.Saat Deployment terbaru di eksekusi dia akan membuat replica set baru lalu menyalakan Pod baru.Setelah Pod siap Deployment akan menghapus Pod lama secara otomatis.Ini membuat proses update berjalan seamless tidak akan menyebabkan downtime.

## Implementasi

1. Disini saya sudah running file konfig Deployment sebelumnya
```bash
controlplane ~ ➜  kubectl get all
NAME                             READY   STATUS    RESTARTS   AGE
pod/nodejs-web-878f8bc9c-6mkx6   1/1     Running   0          20s
pod/nodejs-web-878f8bc9c-lwt24   1/1     Running   0          20s
pod/nodejs-web-878f8bc9c-mqq8c   1/1     Running   0          20s

NAME                     TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/kubernetes       ClusterIP   172.20.0.1       <none>        443/TCP          76m
service/service-nodejs   NodePort    172.20.220.200   <none>        2122:30002/TCP   20s

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nodejs-web   3/3     3            3           20s

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/nodejs-web-878f8bc9c   3         3         3       20s
```

2. Di kode file konfig "deployment-update", terdapat perbedaan servicenya tidak ada karena service tidak perlu di update.Jadi ketika di running dengan file konfig berbeda hasilnya service tetap ada karena tidak mengalami update.Hanya perubahan di Deployment terdapat update pada versi image.
- Update Deployment
```bash
kubectl apply -f deployment-update.yaml
```

3. Running Update Deployment
```bash
controlplane ~ ➜  kubectl apply -f deployment-update.yaml 
deployment.apps/nodejs-web configured
```

4. Coba lihat di Browser pada port EXTERNAL Service 30002
![update-deployment](/Deployment/image/update-deployment.png)




