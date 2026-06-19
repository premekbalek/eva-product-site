# EVA Product Site
# Single-container image: serves both the static frontend and the Node.js API
# on the same port so no separate static-file server is needed.
#
# Build:
#   docker build -t evaproduct .
#
# Run (demo / no LLM configured):
#   docker run -p 8787:8787 evaproduct
#
# Run with OpenAI:
#   docker run -p 8787:8787 \
#     -e LLM_PROVIDER=openai \
#     -e LLM_MODEL=gpt-4o-mini \
#     -e LLM_API_KEY=sk-... \
#     evaproduct
#
# Run with Azure OpenAI:
#   docker run -p 8787:8787 \
#     -e LLM_PROVIDER=azure \
#     -e LLM_MODEL=<deployment-name> \
#     -e LLM_API_KEY=... \
#     -e LLM_ENDPOINT=https://<resource>.openai.azure.com \
#     -e LLM_API_VERSION=2024-10-21 \
#     evaproduct
#
# Open: http://localhost:8787

FROM node:22-alpine

# Install only production OS security patches
RUN apk upgrade --no-cache

WORKDIR /app

# Copy everything (static HTML/CSS/JS + server)
# .dockerignore keeps the image lean
COPY . .

# Port exposed by chat-server.js (also serves static files in Docker mode)
EXPOSE 8787

ENV PORT=8787 \
    NODE_ENV=production

# Use non-root user for security
RUN addgroup -S evaapp && adduser -S -G evaapp evaapp
USER evaapp

CMD ["node", "server/chat-server.js"]
