import logging
import os
import time

from flask import Flask, jsonify, request

# --- Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("k8s-demo-app")

# --- App Initialization ---
app = Flask(__name__)
START_TIME = time.time()

# --- Configuration from Environment Variables ---
APP_API_KEY = os.environ.get("APP_API_KEY", "")
PORT = int(os.environ.get("APP_PORT", 5000))

if not APP_API_KEY:
    logger.warning("APP_API_KEY is not set. All /data requests will be rejected.")


# --- Middleware: Request Logger ---
@app.before_request
def log_request():
    logger.info(
        "Incoming request | method=%s path=%s remote_addr=%s",
        request.method,
        request.path,
        request.remote_addr,
    )


# --- Auth Helper ---
def is_authenticated() -> bool:
    """Validate X-API-KEY header against APP_API_KEY env var."""
    client_key = request.headers.get("X-API-KEY", "")
    return bool(APP_API_KEY) and client_key == APP_API_KEY


# --- Routes ---

@app.route("/healthz", methods=["GET"])
def liveness():
    """Kubernetes Liveness Probe — confirms the process is alive."""
    return jsonify({"status": "ok", "probe": "liveness"}), 200


@app.route("/readyz", methods=["GET"])
def readiness():
    """
    Kubernetes Readiness Probe — confirms the app is ready to serve traffic.
    Extend this with real dependency checks (DB, cache, etc.) as needed.
    """
    if not APP_API_KEY:
        logger.warning("Readiness check failed: APP_API_KEY is not configured.")
        return jsonify({"status": "not_ready", "reason": "APP_API_KEY not configured"}), 503

    return jsonify({"status": "ready", "probe": "readiness"}), 200


@app.route("/data", methods=["GET"])
def get_data():
    """Protected endpoint. Requires a valid X-API-KEY header."""
    if not is_authenticated():
        logger.warning(
            "Unauthorized access attempt | remote_addr=%s", request.remote_addr
        )
        return jsonify({"error": "Unauthorized", "message": "Invalid or missing X-API-KEY header."}), 401

    uptime_seconds = round(time.time() - START_TIME, 2)
    payload = {
        "status": "success",
        "message": "Authenticated! Welcome to the K8s demo app.",
        "data": {
            "app": "k8s-demo-app",
            "version": "1.0.0",
            "uptime_seconds": uptime_seconds,
            "pod_name": os.environ.get("POD_NAME", "local"),
            "namespace": os.environ.get("POD_NAMESPACE", "default"),
            "node_name": os.environ.get("NODE_NAME", "unknown"),
        },
    }
    logger.info("Data endpoint accessed successfully | remote_addr=%s", request.remote_addr)
    return jsonify(payload), 200


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "app": "k8s-demo-app",
        "version": "1.0.0",
        "endpoints": {
            "GET /data": "Protected data endpoint (requires X-API-KEY header)",
            "GET /healthz": "Liveness probe",
            "GET /readyz": "Readiness probe",
        },
    }), 200


# --- Entrypoint ---
if __name__ == "__main__":
    logger.info("Starting k8s-demo-app on 0.0.0.0:%d", PORT)
    app.run(host="0.0.0.0", port=PORT, debug=False)
