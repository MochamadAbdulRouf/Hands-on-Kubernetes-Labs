# Base image python yang ringan
FROM python:3.9-slim

# Set direktory kerja didalam container
WORKDIR /app

# Copy file requirements.txt ke container
COPY requirements.txt  .

# Install libary yang dibutuhkan
RUN pip install --no-cache-dir -r requirements.txt

# Copy kode aplikasi ke container
COPY sim-health.py .

# Expose port container sesuai aplikasi 8080
EXPOSE 8080

# Running aplikasi saat container start
CMD ["python", "sim-health.py"] 
