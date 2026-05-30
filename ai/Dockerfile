FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libgl1 libgomp1 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY saved_model/ ./saved_model/
COPY api/app.py .

# buat cache dirs
RUN mkdir -p /tmp/huggingface \
    && mkdir -p /tmp/matplotlib \
    && chmod -R 777 /tmp/huggingface \
    && chmod -R 777 /tmp/matplotlib

ENV HF_HOME=/tmp/huggingface
ENV TRANSFORMERS_CACHE=/tmp/huggingface
ENV MPLCONFIGDIR=/tmp/matplotlib

EXPOSE 7860

CMD ["python", "app.py"]