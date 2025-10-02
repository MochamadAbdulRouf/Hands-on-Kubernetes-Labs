# TIPE SERVICE
Service memiliki beberapa tipe, yaitu :
- ClusterIP: Mengekpos Service di dalam internal kubernetes cluster
- ExternalName: Memetakan Service ke externalName (misalnya: example.com)
- NodePort: Mengekspos Service pada setiap IP node dan port yang sama. Kita dapat    mengakses Service dengan tipe ini, dari luar cluster melalui <NodeIP>:<NodePort>.
- LoadBalancer: Mengekspos Service secara eksternal dengan menggunakan LoadBalancer yang disediakan oleh penyedia layanan cloud.
