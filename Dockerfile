# Container image for Google Cloud Run
FROM python:3.11-slim

# Prevent Python from writing pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy application (static site + simple Python server)
COPY . .

# Cloud Run sets $PORT; server.py reads it. No extra dependencies required.

# Expose a default port for local runs (Cloud Run will override with $PORT)
EXPOSE 8080

# Start the HTTP server (listens on $PORT if provided)
CMD ["python", "server.py"]
