# ─── Base image ───────────────────────────────────────────────────────────────
FROM python:3.10-slim

# ─── Metadata ─────────────────────────────────────────────────────────────────
LABEL maintainer="CBA Assignment"
LABEL description="Exercise 10 – FastAPI Iris Classifier API"

# ─── System dependencies ──────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ─── Working directory ────────────────────────────────────────────────────────
WORKDIR /app

# ─── Python dependencies ──────────────────────────────────────────────────────
COPY requirements_api.txt .
RUN pip install --no-cache-dir -r requirements_api.txt

# ─── Copy application code ────────────────────────────────────────────────────
COPY exercise10_rest_api.py .

# ─── Expose port ──────────────────────────────────────────────────────────────
EXPOSE 8000

# ─── Health check ─────────────────────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# ─── Start server ─────────────────────────────────────────────────────────────
CMD ["python", "exercise10_rest_api.py"]
