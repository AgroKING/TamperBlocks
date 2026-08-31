FROM python:3.11-slim

# System deps + Foundry (anvil, forge, cast)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L https://foundry.paradigm.xyz | bash \
    && /root/.foundry/bin/foundryup
ENV PATH="/root/.foundry/bin:${PATH}"

# uv for Python dependency management
RUN pip install --no-cache-dir uv

WORKDIR /app

# Install deps first (better layer caching)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

# Now copy the rest of the backend code
COPY . .

RUN chmod +x start.sh

# Render sets $PORT at runtime; EXPOSE is just documentation
EXPOSE 10000

CMD ["./start.sh"]
