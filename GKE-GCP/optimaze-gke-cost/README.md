# Understanding GKE costs 

Best practice untuk menghemat costs dari service GKE yang dipakai. Untuk sebuah team keci, mungkin akan mudah dengan menggunakan 1 cluster per dev saja. tapi sebenarnya harus mempertimbangkan juga mengenai multi-tenant cluster untuk menghemat biaya operasional, dengan cara menggunakan namespace dan policies untuk menghemat sumber daya service, dan tim dev tetap dapat memiliki ruang untuk bereksperimen. 

## Techinal Implementation 
### For Dev (non-prod) environment !

- Disable Horizontal Pod AutoScaling 
```bash
gcloud container cluster update <cluster-name> \ 
    --update-addons=HorizontalPodAutoscaling=DISABLED 
```

- Disable kube-dns 
```bash
kubectl scale --replicas=0 deployment/kube-dns-autoscaler \
    ---namespace=kube-system
```

- Limit Kube DNS Scaling 
```bash
kubectl scale --replicas=0 deployment/kube-dns-autoscaler \
    --namespace=kube-system 
```
```bash
kubectl scale --replicas=1 deployment/kube-dns \
    --namespace=kube-system
```

- optimasi minAvailable terhadap Pod, pertimbang jumlah berapa minim pod yang berjalan tanpa menganggu user klien yang mengakses aplikasi
```bash
apiVersion: v1/beta1
kind: Pod
metadata:
    name: my-app
spec:
    minAvailable: 2 # optimasi jumlah minimum pod pada cluster 
    selector: 
        matchLabels:
            app: nginx
```

- Manage resource menggunakan type ResourceQuota
```bash
apiVersion: v1 
kind: ResourceQuota
metadata:
    name: my-app
spec:
    hard:
        requests.cpu: "1"
        requests.memory: 1Gi
        limits.cpu: "2"
        limits.memory: 2Gi
```

- manage menggunakan type LimitRange
```bash
apiVersion: v1 
kind: LimitRange 
metadata:
    name: limit-app
spec:
    limits: 
    - default:
        memory: 512Mi
      defaultRequest:
        memory: 256Mi
      type: Container
```

- Partial metric-server Deployment YAML
untuk membantu mencegah server metrik sering memuat ulang dan menghindari terlalu banyak restart
```bash
apiVersion: apps/v1
kind: Deployment
spec: 
    selector: 
        matchLabels:
            app-v1: my-app 
    template:
      spec:
        containers:
        - command: 
          - /pod_name
          ...
          - --scale-down-delay=24h # Pastikan ini ada 
          ...   
```

- Implementasi
```bash
kubectl apply -f <filename> --namespace=app-resource
```
