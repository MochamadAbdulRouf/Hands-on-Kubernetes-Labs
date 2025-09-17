# Annotations

## Annotations? what is that?
````markdown
1. annotation adalah tempat untuk menaruh metadata yang tidak untuk di identifikasi

2. Isinya bebas dan bisa sangat panjang.

3. annotation itu seperti deskripsi atau catatan
kegunaanya untuk menyimpan metadata non-identifikasi
````

## Command untuk melihat dan menambahkan annotation ke pod

- Melihat apakah di pod tersebut adda annotation dengan key dan value yang ada
```bash
laborant@dev-machine:kube-annotation$ kubectl annotate pod pod-annotation annotation-key1=annotation-value
pod/pod-annotation annotated
```

- Mengubah atau menambahkan key dan value ke annotation yang ada didalam pod
```bash
laborant@dev-machine:kube-annotation$ kubectl annotate pod pod-annotation annotation-key2=jadiin-dikit-aja --overwrite
pod/pod-annotation annotated
```

- Cek apakah key dan valuenya sudah berubah
```bash
laborant@dev-machine:kube-annotation$ kubectl annotate pod pod-annotation annotation-key2=jadiin-dikit-aja
pod/pod-annotation annotated
laborant@dev-machine:kube-annotation$ 
```

- Hasil dari file web-with-annotation.yaml yang berisi lengkap dengan sedikit varian implementasi asli saat di prodution
```bash
laborant@dev-machine:kube-annotation$ kubectl get deployment
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
my-webapp-deployment   2/2     2            2           20s
```

- Hasil dari Deployment
```bash
laborant@dev-machine:kube-annotation$ kubectl get deployment -o wide
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS        IMAGES       SELECTOR
my-webapp-deployment   2/2     2            2           78s   nginx-container   nginx:1.21   app=my-webapp
```