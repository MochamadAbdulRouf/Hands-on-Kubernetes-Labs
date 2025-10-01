# SERVICE on KUBERNETES
Service adalah sebuah gerbang untuk membuka akses untuk satu atau lebih Pod.Service memiliki IP address dan Port yang tidak pernah berubah selama servicenya masih ada.

Client bisa mengakses service tersebut, dan secara otomatis akan meneruskan ke Pod yang ada di belakang service tersebut.Dengan begini client tidak perlu tahu lokasi tiap Pod dan Pod bisa berkurang,bertambah,berubah,berpindah tanpa menganggu client.

## TOPOLOGI SERVICE

### Mengakses Pod Langsung
![akses-pod-langsung](./image/akses-pod.png)

### Mengakses Pod Via Service
![akses-service](./image/akses-via-service.png)

# Membuat Service
**Bagaimana menentukan Pod Untuk Service?** Service akan mendistribusikan traffic ke Pod yang ada dibelakangnya secara seimbang, Service akan menggunakan label selector untuk mengetahui Pod mana yang ada di belakang service tersebut

## Implementasi membuat service

1. Running Pod, Service, Replica Set
```bash
controlplane ~/nginx-service ➜  kubectl apply -f nginx-service.yaml 
replicaset.apps/nginx created
service/nginx-service created
pod/curl created
```

2. Lihat Pod
```bash
controlplane ~/nginx-service ➜  kubectl get pod -o wide
NAME          READY   STATUS    RESTARTS   AGE   IP           NODE     NOMINATED NODE   READINESS GATES
curl          1/1     Running   0          80s   172.17.1.3   node01   <none>           <none>
nginx-28szp   1/1     Running   0          80s   172.17.1.4   node01   <none>           <none>
nginx-dmd9t   1/1     Running   0          80s   172.17.1.5   node01   <none>           <none>
nginx-ds2kn   1/1     Running   0          80s   172.17.1.2   node01   <none>           <none>
```

3. Lihat Detail Label Pod
```bash
controlplane ~/nginx-service ➜ kubectl get pod --show-labels
NAME          READY   STATUS    RESTARTS   AGE     LABELS
curl          1/1     Running   0          7m36s   name=curl
nginx-28szp   1/1     Running   0          7m36s   web=nginx
nginx-dmd9t   1/1     Running   0          7m36s   web=nginx
nginx-ds2kn   1/1     Running   0          7m36s   web=nginx
```

4. Lihat Service 
```bash
controlplane ~/nginx-service ➜ kubectl get svc
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes      ClusterIP   172.20.0.1      <none>        443/TCP    38m
nginx-service   ClusterIP   172.20.89.190   <none>        8080/TCP   3m45s
```

5. Detail service
```bash
controlplane ~/nginx-service ➜  kubectl get svc -o wide
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE     SELECTOR
kubernetes      ClusterIP   172.20.0.1      <none>        443/TCP    40m     <none>
nginx-service   ClusterIP   172.20.89.190   <none>        8080/TCP   6m36s   web=nginx
```

6. Testing menggunakan aplikasi tester dari image saya
```bash
controlplane ~/nginx-service ➜  kubectl exec curl -it -- /bin/sh
/ # curl http://172.20.89.190:8080/
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
/ # exit 
```