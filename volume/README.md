# VOLUME KUBERNETES
* Berkas berkas didalam container itu tidak permanen dan akan terhapus jika Pod atau Containernya terhapus
* Volume secara sederhana adalah sebuah direktori yang bisa di akses container-container di Pod

## Jenis-Jenis Volume
- emptyDir, Direktori sederhana yang isinya kosong
- hostPath, di gunakan untuk sharing direktori di Node ke Pod
- gitRepo, Direktori yang dibuat pertama kali dengan clone git repository
- nfs, Sharing netwrok file system
- DLL. https://kubernetes.io/id/docs/concepts/storage/volumes/#jenis-jenis-volume

## Bagaimana Kode NodeJS bisa bekerja di Kubernetes Volume
Di NodeJS ada kode berikut 
```bash
let location = process.env.HTML_LOCATION;
if (!location) {
  location = "/app/html";
}
```
Kode tersebut memberitahu bahwa dia butuh lokasi direktori untuk menulis filenya.
Lalu di Kubernetes Volume dia menyediakan lokasinya di kode berikut.
- Di bagian Volume dia menyediakan direktori kosong bernama html
```bash
volumes:
  - name: html 
    emptyDir: {}
```
- Di bagian Volume Mounts dia berperan memasang Volume ke direktori html dan membuatnya bisa di akses didalam container melalui alamat /app/html
```bash
volumeMounts:
  - mountPath: /app/html
    name: html
```

## Implementasi Volume Jenis emptyDir
1. Running Pod
```bash
controlplane ~/nodejs-writer ➜  kubectl apply -f pod-nodejs-writer.yaml 
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
controlplane ~/nodejs-volume ➜  kubectl exec nodejs-writer -it -- /bin/sh
/app # ls
html       writer.js
/app # ls html/
index.html
/app # ls html/^C

/app # cat html/index.html 
<html><body>Sat Oct 04 2025 14:25:50 GMT+0000 (Coordinated Universal Time)</body></html>/app # 
```

Note: diatas bisa dilihat bahwa ketika masuk ke container dia langsung masuk ke direktori app karena itu di Dockerfilenya bagian WORKDIR di isi /app, Karena itu ketika masuk ke container otomatis masuk ke direktori /app