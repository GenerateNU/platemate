FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip

RUN pip install pandas requests numpy torch torchvision torchaudio pymongo python-dotenv openai fastapi uvicorn transformers datasets sentencepiece

COPY . .

EXPOSE 4000

CMD ["uvicorn", "app.reccomendation:app", "--host", "0.0.0.0", "--port", "4000"]