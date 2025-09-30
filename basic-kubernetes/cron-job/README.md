# CRON JOB KUBERNETES
* Cron Job adalah aplikasi penjadwalan yang biasanya ada di sistem unix, Dengan Crob Job sebuah aplikasi bisa berjalan sesuai jadwal yang ditentukan

* Kubernetes mendukung resource Cron Job, Dimana cara kerjanya mirip Job namun Job berjalan sekali, Cron Job bisa berjalan berulang kali dan bisa di atur jadwalnya

* Cron Job memungkinkan kita menjalankan aplikasi dengan waktu yang telah ditentukan

* CONTOH PENGGUNAAN CRON JOB :
a. Aplikasi untuk membuat laporan harian
b. Aplikasi untuk membackup data secara berkala 
c. Aplikasi untuk mengirim data tagihan tiap bulan ke pihak lain
d. Aplikasi untuk menarik dana pinjam yang jatuh tempo bulanan
e. dll.

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


