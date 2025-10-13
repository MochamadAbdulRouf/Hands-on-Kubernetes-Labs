# CRON JOB KUBERNETES
* Cron Job adalah aplikasi penjadwalan yang biasanya ada di sistem unix, Dengan Crob Job sebuah aplikasi bisa berjalan sesuai jadwal yang ditentukan

* Kubernetes mendukung resource Cron Job, Dimana cara kerjanya mirip Job namun Job berjalan sekali, Cron Job bisa berjalan berulang kali dan bisa di atur jadwalnya

* Cron Job memungkinkan kita menjalankan aplikasi dengan waktu yang telah ditentukan

* CONTOH PENGGUNAAN CRON JOB :
- Aplikasi untuk membuat laporan harian
- Aplikasi untuk membackup data secara berkala 
- Aplikasi untuk mengirim data tagihan tiap bulan ke pihak lain
- Aplikasi untuk menarik dana pinjam yang jatuh tempo bulanan
- dll.

1. Membuat Cron Job
```bash
kubectl apply -f nodejs.cronjob.yaml
```

2. Melihat semua Cron Job
```bash
kubectl get cronjobs
```

3. Menghapus Cron Job
```bash
kubectl delete cronjobs namacronjobs
```

4. Menghapus Cron Job v2
```bash
kubectl delete cronjobs cronjob-nodejs
```

## IMPLEMENTASI
1. Running CronJob
```bash
laborant@dev-machine:cronjob$ kubectl apply -f nodejs-cronjob.yaml 
cronjob.batch/cronjob-nodejs created
```

2. Melihat apakah CronJob Running
```bash
laborant@dev-machine:cronjob$ kubectl get cronjobs.batch 
NAME             SCHEDULE    TIMEZONE   SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob-nodejs   * * * * *   <none>     False     0        <none>          15s
```

3. Melihat CronJob v2
```bash
laborant@dev-machine:cronjob$ kubectl get cronjob
NAME             SCHEDULE    TIMEZONE   SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob-nodejs   * * * * *   <none>     False     0        <none>          21s
```

4. Melihat Logs CronJob dari Aplikasi NodeJS, jadi Aplikasi NodeJS akan Running setiap Menit sesuai Jadwal yang di tentukan CronJob pada file konfigurasi dan membuat console.log lalu Kubernetes menyimpannya sebagai data log yang terikat dengan Pod.
```bash
controlplane ~/cronjob-kube ➜  kubectl logs cronjob-nodejs-29339011-n2sjt 
--- Memulai Tugas: Menghitung Bilangan Prima hingga 20000 ---

[HASIL]
Ditemukan 2262 bilangan prima.
Tugas selesai dalam 0.00 detik.
--- Tugas Berhasil Diselesaikan ---
```

5. Menghapus CronJob 
```bash
laborant@dev-machine:cronjob$ kubectl delete cronjob cronjob-nodejs 
cronjob.batch "cronjob-nodejs" deleted from default namespace
```

6. Cek apakah CronJob masih ada
```bash
laborant@dev-machine:cronjob$ kubectl get cronjob
No resources found in default namespace.
```

