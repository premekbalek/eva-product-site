# EVA Product Site

Standalone product presentation for EVA, an AI Banking Service Hub.

This is intentionally independent from PremekWiki. It is a static frontend with:

- corporate landing page
- customer-facing knowledge base
- technical solution section
- product chat backed by a lightweight `/api/chat` service and local EVA knowledge base

## Run locally

```bash
python3 -m http.server 5180
```

Then open:

```text
http://localhost:5180/
```

## How to run chat backend

The static site calls `/api/chat`. During local development from `localhost:5180`, `script.js` automatically points chat requests to:

```text
http://localhost:8787/api/chat
```

Start the backend in a second terminal:

```bash
node server/chat-server.js
```

Health check:

```text
http://localhost:8787/api/health
```

The backend loads local knowledge from:

- `knowledge/eva_kb_business.md`
- `knowledge/eva_kb_technical.md`

It splits the files by headings, retrieves the most relevant sections with keyword overlap, adds them to the LLM prompt as grounding context, and returns:

```json
{
  "answer": "string",
  "citations": [{ "source": "eva_kb_business.md", "section": "Heading path" }]
}
```

If no relevant KB section is found, it returns:

```text
Nemám to v znalostech. Můžu doplnit, když dodáš podklady.
```

## How to configure env vars

The backend supports OpenAI, Azure OpenAI, or a local OpenAI-compatible chat-completions endpoint.

OpenAI:

```bash
export LLM_PROVIDER=openai
export LLM_MODEL=gpt-4o-mini
export LLM_API_KEY=...
node server/chat-server.js
```

Azure OpenAI:

```bash
export LLM_PROVIDER=azure
export LLM_MODEL=<azure-deployment-name>
export LLM_API_KEY=...
export LLM_ENDPOINT=https://<resource-name>.openai.azure.com
export LLM_API_VERSION=2024-10-21
node server/chat-server.js
```

Local OpenAI-compatible endpoint:

```bash
export LLM_PROVIDER=local
export LLM_MODEL=<local-model-name>
export LLM_ENDPOINT=http://localhost:11434/v1/chat/completions
node server/chat-server.js
```

Optional:

```bash
export PORT=8787
export CORS_ORIGIN=https://premekbalek.github.io
```

If no provider is configured, the backend returns a helpful configuration error to the UI.

## Deploy chat backend

GitHub Pages only hosts the static frontend. Deploy `server/chat-server.js` to a lightweight Node/serverless host that can expose:

```text
POST /api/chat
```

Then configure the static page to call that URL. The simplest option is to inject this before `script.js` in `index.html` on the deployed site:

```html
<script>
  window.EVA_CHAT_API_URL = "https://<your-chat-backend>/api/chat";
</script>
```

If your backend is served on the same domain as the frontend, no override is needed because the frontend defaults to `/api/chat`.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `eva-product-site`.
2. Push this folder to the repository.
3. In GitHub, open `Settings` -> `Pages`.
4. Set source to `Deploy from a branch`.
5. Select branch `main` and folder `/root`.
6. Save.

The site will be available at:

```text
https://<your-github-username>.github.io/eva-product-site/
```

This project is plain HTML/CSS/JS and is already compatible with GitHub Pages.
