## JOB KUBERNETES
* Job adalah resource di kubernetes yang digunakan untuk menjalankan Pod yang hanya berjalan sekali, Lalu berhenti
pada Replication Controller, Replica Set, Daemon Set.Jika Pod mati
, Maka secara otomatis akan dibuatkan ulang/Jalankan ulang

* Berbeda dengan Job, Pada Job Pod justru akan mati jika pekerjaannya sudah selesai

* Contoh Penggunaan Job
- Aplikasi untuk backup atau restore database
- Aplikasi untuk import atau export data
- Aplikasi untuk menjalankan proses batch
- dll.

1. Membuat Job
```bash
laborant@dev-machine:job$ kubectl apply -f job.yaml 
job.batch/reactapp-job created
```

2. Analisis pembuatan Job
```bash
laborant@dev-machine:job$ kubectl get pod
NAME                 READY   STATUS              RESTARTS   AGE
reactapp-job-d8frg   0/1     ContainerCreating   0          12s
reactapp-job-db9xx   0/1     ContainerCreating   0          12s
laborant@dev-machine:job$ kubectl get pod
NAME                 READY   STATUS              RESTARTS   AGE
reactapp-job-262jn   0/1     ContainerCreating   0          1s
reactapp-job-d8frg   0/1     Completed           0          16s
reactapp-job-db9xx   0/1     Completed           0          16s
reactapp-job-r8tgx   0/1     ContainerCreating   0          1s
laborant@dev-machine:job$ kubectl get job
NAME           STATUS     COMPLETIONS   DURATION   AGE
reactapp-job   Complete   4/4           20s        23s
laborant@dev-machine:job$ 
```

3. Lihat apakah Job berhasil dibuat
```bash
laborant@dev-machine:job$ kubectl get pod
NAME                 READY   STATUS      RESTARTS   AGE
reactapp-job-262jn   0/1     Completed   0          60s
reactapp-job-d8frg   0/1     Completed   0          75s
reactapp-job-db9xx   0/1     Completed   0          75s
reactapp-job-r8tgx   0/1     Completed   0          60s
laborant@dev-machine:job$ kubectl get job
NAME           STATUS     COMPLETIONS   DURATION   AGE
reactapp-job   Complete   4/4           20s        82s
```

4. Melihat Job
```bash
kubectl get job
```

5. Menghapus Job
```bash
kubectl delete job namajob
```

