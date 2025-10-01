# SERVICE on KUBERNETES
Service adalah sebuah gerbang untuk membuka akses untuk satu atau lebih Pod.Service memiliki IP address dan Port yang tidak pernah berubah selama servicenya masih ada.

Client bisa mengakses service tersebut, dan secara otomatis akan meneruskan ke Pod yang ada di belakang service tersebut.Dengan begini client tidak perlu tahu lokasi tiap Pod dan Pod bisa berkurang,bertambah,berubah,berpindah tanpa menganggu client.

## TOPOLOGI SERVICE

### Mengakses Pod Langsung
![akses-pod-langsung](./image/akses-pod.png)

### Mengakses Pod Via Service
![akses-service](./image/akses-via-service.png)

# Membuat Service
_Bagaimana menentukan Pod Untuk Service?_ Service akan mendistribusikan traffic ke Pod yang ada dibelakangnya supaya seimbang, Service akan menggunakan label selector untuk mengetahui Pod mana yang ada di belakang service tersebut
