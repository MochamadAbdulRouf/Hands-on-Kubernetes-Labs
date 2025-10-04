# VOLUME KUBERNETES
* Berkas berkas didalam container itu tidak permanen dan akan terhapus jika Pod atau Containernya terhapus
* Volume secara sederhana adalah sebuah direktori yang bisa di akses container-container di Pod

## Jenis-Jenis Volume
- emptyDir, Direktori sederhana yang isinya kosong
- hostPath, di gunakan untuk sharing direktori di Node ke Pod
- gitRepo, Direktori yang dibuat pertama kali dengan clone git repository
- nfs, Sharing netwrok file system
- DLL. https://kubernetes.io/id/docs/concepts/storage/volumes/#jenis-jenis-volume

# Implementasi Volume Jenis emptyDir
1. Running Pod
```bash
controlplane ~/nodejs-writer ➜  kubectl apply -f nodejs-volume.yaml 
pod/nodejs-writer created
```

2. Melihat Pod 
```bash
controlplane ~/nodejs-writer ➜  kubectl get pods -o wide
NAME            READY   STATUS    RESTARTS   AGE   IP           NODE     NOMINATED NODE   READINESS GATES
nodejs-writer   1/1     Running   0          16s   172.17.1.2   node01   <none>           <none>
```

3. Masuk ke container nodejs dan melihat apakah volume berhasil
```bash
controlplane ~/nodejs-writer ➜  kubectl exec nodejs-writer -it -- /bin/sh
/ # ls
app     app.js  bin     dev     etc     home    lib     media   mnt     opt     proc    root    run     sbin    srv     sys     tmp     usr     var
/ # ls app
html
/ # cat app
app.js  app/
/ # cat app
app.js  app/
/ # cat app
app.js  app/
/ # cat app/html/
cat: read error: Is a directory
/ # cat app/html/index.html 
app.js  app/    bin/    dev/    etc/    home/   lib/    media/  mnt/    opt/    proc/   root/   run/    sbin/   srv/    sys/    tmp/    usr/    var/
/ # cat app/html/index.html 
<html><body>Sat Oct 04 2025 13:39:39 GMT+0000 (Coordinated Universal Time)</body></html>/ # 
```