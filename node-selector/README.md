# NODE SELECTOR 
Node bisa dibuat dengan spesifikasi yang berbeda dari Node biasanya, Misal Node yang memiliki GPU, atau dengan hardisk SSD.Menggunakan Node Selector, Membuat user bisa memilih menjalankan Pod pada Node tertentu.

## Menambahkan Label ke Node
```bash
kubectl label node namanode key=value
```
### Implementasi Pod Selector
1.
```bash
kubectl apply -f pod-selector.yaml
```
2.
```bash
kubectl label nodes namanode gpu=true
```

3.
```bash
laborant@dev-machine:pod-sel$ kubectl label nodes node-01 gpu=true
laborant@dev-machine:pod-sel$ kubectl apply -f pod.yaml 
pod/pod-nginx created
laborant@dev-machine:pod-sel$ kubectl get pod
NAME        READY   STATUS              RESTARTS   AGE
pod-nginx   0/1     ContainerCreating   0          5s
```

4.
```bash
laborant@dev-machine:pod-sel$ kubectl get pod
NAME        READY   STATUS    RESTARTS   AGE
pod-nginx   1/1     Running   0          21s
laborant@dev-machine:pod-sel$ kubectl get pod -o wide
NAME        READY   STATUS    RESTARTS   AGE   IP           NODE      NOMINATED NODE   READINESS GATES
pod-nginx   1/1     Running   0          56s   10.244.1.2   node-01   <none>           <none>
```

5.
```bash
laborant@dev-machine:pod-sel$ kubectl get node --show-labels
NAME        STATUS   ROLES           AGE     VERSION   LABELS
cplane-01   Ready    control-plane   2m47s   v1.34.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=cplane-01,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node.kubernetes.io/exclude-from-external-load-balancers=
node-01     Ready    <none>          2m34s   v1.34.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,gpu=true,kubernetes.io/arch=amd64,kubernetes.io/hostname=node-01,kubernetes.io/os=linux
node-02     Ready    <none>          2m33s   v1.34.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node-02,kubernetes.io/os=linux
```

### Implementasi Job Selector
* Berikan label ke node yang ditentukan
```bash
kubectl label nodes node-01 hardisk: ssd
```
* Lihat label pada node
```bash
kubectl get node --show-labels
```
* Running Job
```bash
kubectl apply -f job-selector.yaml
```
* Lihat pod berjalan di node mana
```bash
kubectl get pod -o wide
```

### Alur Job Selector
- Job Controller melihat target completions: 5 dan parallelism 2
- Scheduler Kubernetes akan mengambil alih dan mencari node yang mempunyai label "hardisk: ssd" Jika tidak ada maka pod akan pending selamanya
- Proses berjalan lanjut ke Job controller sampai mencapai target completions