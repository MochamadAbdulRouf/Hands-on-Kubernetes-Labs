# Manage Kubernetes Object
Manage Kubernetes Object untuk management Kubernetes Object seperti mengupdate, menghapus, atau melihat

## Imperative Management

1. Membuat object
```bash
kubectl create -f namafile.yaml
```

2. Mengupdate object
```bash
kubectl replace -f namafile.yaml
```

3. Melihat object
```bash
kubectl get -f namafile.yaml -o yaml/json 
```

4. Menghapus Object
```bash
kubectl delete -f namafile.yaml
```

## Declarative Management
Saat menggunakan Declarative Management, File konfigurasi akan disimpan didalam annotations object, Hal ini sangat bermanfaat saat mengunakan object Deployment nantinya, Sekarang Imperative Management sudah jarang digunakan, sudah di gantikan menggunakan Declarative Management.

1. Membuat atau Mengupdate Object Kubernetes
```bash
kubectl apply -f namafile.yaml
```
