# Dockerfile

# Gunakan base image Node.js yang ringan (Alpine)
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file aplikasi kita ke dalam container
COPY app.js .

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["node", "app.js"]