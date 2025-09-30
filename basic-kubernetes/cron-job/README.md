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

* Membuat Cron Job
```bash
kubectl apply -f nodejs.cronjob.yaml
```

* Melihat semua Cron Job
```bash
kubectl get cronjobs
```

* Menghapus Cron Job
```bash
kubectl delete cronjobs namacronjobs
```

* Menghapus Cron Job v2
```bash
kubectl delete cronjobs cronjob-nodejs
```


