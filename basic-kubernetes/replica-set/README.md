# REPLICA SET
Pada awalnya di kubernetes terdapat Replication Controller digunakan untuk menjaga jumlah replica pod dan me-reschedule pod yang mati.Namun sekarng telah dikenalkan resource baru bernama Replica Set

Replica Set adalah generasi baru dari Replication Controller, dan digunakan sebagai pengganti Replication Controller.Replication Controller sendiri penggunaanya saat ini tidak di rekomendasikan.


## Replica Set VS Replication Controller
* Replica Set memiliki kemampuan hampir mirip dengan Replication Controller

* Namun Replica Set memliki label selector yang lebih expressive dibandingkan Replica Controller yang hanya memiliki fitur label selector secara match

## Running Replica Set
* Running Pod
```bash
laborant@dev-machine:replication-set$ kubectl apply -f sim-health-app-replica-set.yaml 
replicaset.apps/sim-health-app-replica-set created
```

* Melihat pod
```bash
laborant@dev-machine:replication-set$ kubectl get pod
NAME                      READY   STATUS    RESTARTS   AGE
sim-health-app-rs-fftc7   1/1     Running   0          71s
sim-health-app-rs-l2vbl   1/1     Running   0          71s
sim-health-app-rs-l9vjx   1/1     Running   0          71s
```

* Melihat Replica Set
```bash
laborant@dev-machine:replication-set$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
sim-health-app-rs   3         3         3       50s
laborant@dev-machine:replication-set$ kubectl get replicasets.apps 
NAME                DESIRED   CURRENT   READY   AGE
sim-health-app-rs   3         3         3       61s
laborant@dev-machine:replication-set$ kubectl get replicasets
NAME                DESIRED   CURRENT   READY   AGE
sim-health-app-rs   3         3         3       65s
```