# Setup Cluster using Cloudshell on AWS 

karena saya menggunakan aws academy, saya setup menggunakan sebuah script yang bisa dicek di file `eks-cluster.yaml`. Menggunakan IAM Policy dari `LabRole`.

isi dari script akan membuat sebuah cluster beserta node nya, untuk network akan dibuat otomatis oleh EKS. pembuatan cluster ini akan berjalan di service `Cloud Formation` 
```bash
# Mengambil AWS Account ID secara dinamis
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
LAB_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/LabRole"

# Membuat file konfigurasi eksctl
cat <<EOF > eks-cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: cloudstack-dev
  region: us-west-2

# Memaksa EKS Control Plane menggunakan LabRole
iam:
  serviceRoleARN: "${LAB_ROLE_ARN}"

managedNodeGroups:
  - name: dev-workers
    instanceType: t3.large
    minSize: 2
    maxSize: 3
    # Memaksa Worker Nodes menggunakan LabRole
    iam:
      instanceRoleARN: "${LAB_ROLE_ARN}"
EOF

echo "File eks-cluster.yaml berhasil dibuat dengan LabRole ARN: $LAB_ROLE_ARN"
```

Memulai pembuatan cluster 
```bash
eksctl create cluster -f eks-cluster.yaml
```

Jika pembuatan cluster sudah seleai, cek nodes yang ada di cluster. jika muncul berarti berhasil melakukan pembuatan cluster menggunakan service EKS 
```bash
kubectl get nodes
```
