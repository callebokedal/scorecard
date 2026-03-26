FROM node:22-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 5173

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

# Vite dev server – bind to 0.0.0.0 so it is reachable from the host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
