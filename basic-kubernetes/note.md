# Basic command dasar untuk Kubernetes

## 1. Melihat semua node di cluster
```bash
kubectl get nodes
```

## 2. Melihat detail Node
```bash
kubectl describe node namanode
```

## 3. Melihat semua pod
```bash
kubectl get pod
```

## 4. Melihat detail pod
```bash
kubectl describe pod namapod
```

## Contoh kode untuk deploy sebuah pod

- Buat sebuah file
```bash
touch filepod.yaml
```

- edit filenya
```bash
vim filepod.yaml
```

- Isi file tersebut dengan ketentuan berikut
````markdown
apiVersion: v1
kind: Pod
metadata:
  name: pod-name
spec:
  containers:
    - name: webserver-nginx
      image: nginx:1.25.3 
      ports:
        - containerPort: 80
````

- Membuat pod
```bash
kubectl create -f filepod.yaml
```

- Melihat pod 
```bash
kubectl get pod
```
- Menampilkan derail tambahan seperti IP dan node 
```bash
kubectl get pod -o wide
```
- Menampilkan semua detail resource pod
```bash
kubectl describe pod namapod
```
- Mengakses pod dan expose port dari sebuah pod
```bash
kubectl port-forward namapod portAkses:portPod
```

```bash
kubectl port-forward namapod 8888:80
```