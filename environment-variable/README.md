# ENVIRONMENT VARIABLE
Environment Variable berguna untuk memasukan data konfigurasi ke Container saat sedang berjalan, Seperti memberikan data konfigurasi yang penting sebelum aplikasi dijalankan

## NodeJS Writer Environment
Di dalam Aplikasi NodeJS Writer terdapat kode:
```bash
let location = process.env.HTML_LOCATION;
```
kode itu memberitahu nantinya aplikasi NodeJS dapat menulis file *index.html* didalam sebuah direktori yang ditentukan oleh environment variable yang ditentukan dari value
environment variable *HTML_LOCATION*.

## Implementasi ENVIRONMENT VARIABLE

1. Running Pod NodeJS
```bash
controlplane ~/nodejs-environment ➜  kubectl apply -f nodejs-environment.yaml 
pod/nodejs-app created
```

2. Melihat semua Resource
```bash
controlplane ~/nodejs-environment ➜  kubectl get all
NAME             READY   STATUS    RESTARTS   AGE
pod/nodejs-app   1/1     Running   0          9s

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   172.20.0.1   <none>        443/TCP   66s
```

3. Masuk ke container didalam Pod dan melihat apakah env HTML_LOCATION sudah ada
```bash
controlplane ~/nodejs-environment ➜  kubectl exec nodejs-app -it -- /bin/sh
/app # env
KUBERNETES_SERVICE_PORT=443
KUBERNETES_PORT=tcp://172.20.0.1:443
NODE_VERSION=18.20.8
HOSTNAME=nodejs-app
YARN_VERSION=1.22.22
SHLVL=1
HOME=/root
HTML_LOCATION=/app/app-environment
TERM=xterm
KUBERNETES_PORT_443_TCP_ADDR=172.20.0.1
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT_443_TCP=tcp://172.20.0.1:443
KUBERNETES_SERVICE_HOST=172.20.0.1
PWD=/app
```

4. Melihat apakah environment variable yang sudah dimasukan sudah sesuai implementasinya.
```bash
/app # ls app-environment/
index.html
/app # cat app-environment/index.html 
<html><body>Mon Oct 06 2025 06:45:08 GMT+0000 (Coordinated Universal Time)</body></html>/app #
```