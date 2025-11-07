# Basic Of GKE (Google Kubernetes Engine)

1. Set default compute region
```bash
gcloud config set compute/region us-central1
```

2. set default compute zone
```bash
gcloud config set compute/zone us-central1-a
```

3. Create a GKE cluster
```bash
gcloud container clusters create --machine-type=e2-medium --zone=us-central1-a lab-cluster
```

4. Get authentication credentials for the cluster
```bash
gcloud container clusters get-credentials lab-cluster
```

5. Deploy simple application to the cluster
```bash
kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:1.0
```

6. Expose application to external traffic
```bash
kubectl expose deployment hello-server --type=LoadBalancer --port 8080
```

7. To inspect `hello-server` service 
```bash
kubectl get service
```

8. View application
```bash
http://[EXTERNAL-IP]:8080
```

9. Delete the Cluster
```bash
gcloud container clusters delete lab-cluster
```