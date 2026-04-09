# ---- Build Stage ----
FROM python:3.9-slim AS builder

WORKDIR /app

# Install dependencies into a separate layer for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt


# ---- Runtime Stage ----
FROM python:3.9-slim

# Security: run as non-root user
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY app.py .

# Switch to non-root
USER appuser

# Expose default port (overridable via APP_PORT env var)
EXPOSE 5000

# Health check (Docker-level, complementary to K8s probes)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/healthz')"

# Use gunicorn for production-grade serving
# Workers = 2 * CPU cores + 1 (adjust via GUNICORN_WORKERS env)
ENV GUNICORN_WORKERS=2
ENV APP_PORT=5000

CMD gunicorn \
    --workers $GUNICORN_WORKERS \
    --bind 0.0.0.0:$APP_PORT \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    "app:app"
