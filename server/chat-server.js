const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 8787);
const ROOT_DIR = path.resolve(__dirname, "..");
const KB_DIR = path.join(ROOT_DIR, "knowledge");
const UNKNOWN_ANSWER = "Nemám to v znalostech. Můžu doplnit, když dodáš podklady.";
const SYSTEM_PROMPT = `You are EVA Product Expert – an AI assistant specialized in EVA (Enterprise Virtual Assistant) platform used for AI-driven customer interaction and orchestration.
Your role:
- Answer questions about EVA from BOTH business and technical perspective.
- Help users understand architecture, use cases, capabilities and value.
Rules:
1) Always answer clearly and concisely.
2) Structure answers with headings.
3) Separate BUSINESS view and TECHNICAL view when useful.
4) Do NOT hallucinate; only use the provided knowledge base.
5) If unknown, say so.
6) Provide a short “Next steps” section when relevant.`;

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "about",
  "by",
  "co",
  "do",
  "does",
  "for",
  "how",
  "i",
  "is",
  "it",
  "jak",
  "je",
  "jsou",
  "k",
  "na",
  "of",
  "or",
  "pro",
  "se",
  "the",
  "to",
  "v",
  "ve",
  "what",
  "with",
  "z",
]);

const QUERY_ALIASES = {
  api: ["rest", "bff", "bsl", "backend", "endpoint", "data"],
  architecture: ["architektura", "orchestrace", "orchestrator", "vrstva", "backend"],
  authorization: ["autorizace", "opravneni", "pin", "token"],
  business: ["hodnota", "metriky", "operator", "offloading", "cx"],
  channel: ["kanal", "kanaly", "omnichannel", "voice", "chat", "app", "web"],
  chatbot: ["chatbot", "orchestration", "orchestrace", "end-to-end"],
  compliance: ["audit", "autorizace", "opravneni"],
  customer: ["zakaznik", "zakaznicky", "volajici"],
  data: ["data", "datove", "entity", "input", "model"],
  delivery: ["delivery", "discovery", "pi", "nd", "implementace"],
  endpoint: ["endpoint", "rest", "bff", "bsl"],
  integration: ["integrace", "integracni", "rest", "bff", "bsl", "backend"],
  intent: ["zamer", "intent", "use", "case"],
  latency: ["latence", "zatez", "on-demand"],
  metrics: ["metriky", "containment", "resolution", "nps", "latence"],
  mvp: ["use", "case", "delivery", "discovery"],
  process: ["proces", "kroky", "identifikace", "segmentace", "autorizace"],
  resolution: ["vyreseni", "resolution", "pozadavek"],
  roi: ["hodnota", "metriky", "offloading", "operator"],
  security: ["autorizace", "opravneni", "audit", "pin", "token"],
  technical: ["technicky", "architektura", "data", "backend"],
  usecase: ["use", "case", "priklady", "pozadavku"],
  value: ["hodnota", "offloading", "zrychleni", "cx", "standardizace"],
  voice: ["voice", "stt", "tts", "kanal"],
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function expandTokens(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const alias of QUERY_ALIASES[token] || []) {
      expanded.add(alias);
    }
  }
  return expanded;
}

function loadKnowledgeBase() {
  const files = ["eva_kb_business.md", "eva_kb_technical.md"];
  const chunks = [];

  for (const source of files) {
    const markdown = fs.readFileSync(path.join(KB_DIR, source), "utf8");
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] || source;
    const sectionPattern = /^##\s+(.+)$/gm;
    const matches = [...markdown.matchAll(sectionPattern)];

    for (let index = 0; index < matches.length; index += 1) {
      const heading = matches[index][1].trim();
      const start = matches[index].index;
      const end = matches[index + 1]?.index ?? markdown.length;
      const content = markdown.slice(start, end).trim();
      chunks.push({
        source,
        section: `${title} > ${heading}`,
        content,
        tokens: tokenize(`${heading} ${content}`),
      });
    }
  }

  return chunks;
}

const KB_CHUNKS = loadKnowledgeBase();

function retrieveRelevantChunks(message, limit = 6) {
  const queryTokens = expandTokens(tokenize(message));
  if (!queryTokens.size) return [];

  return KB_CHUNKS.map((chunk) => {
    let score = 0;
    const seen = new Set();
    for (const token of chunk.tokens) {
      if (queryTokens.has(token) && !seen.has(token)) {
        score += token === "eva" ? 0.25 : 1;
        seen.add(token);
      }
    }
    return { ...chunk, score };
  })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function detectLocale(messages, explicitLocale) {
  if (explicitLocale === "cs" || explicitLocale === "en") return explicitLocale;
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
  const normalized = normalize(latestUserMessage);
  const czechSignals = ["jak", "co", "proc", "kdyz", "muze", "znalostech", "ucet", "zakaznik", "resit"];
  return czechSignals.some((signal) => normalized.split(/\s+/).includes(signal)) ? "cs" : "en";
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => ["user", "assistant", "system"].includes(message?.role) && typeof message.content === "string")
    .slice(-12)
    .map((message) => ({ role: message.role, content: message.content.slice(0, 4000) }));
}

function buildMessages(messages, chunks, locale) {
  const groundingContext = chunks
    .map((chunk, index) => `[${index + 1}] Source: ${chunk.source}\nSection: ${chunk.section}\n${chunk.content}`)
    .join("\n\n");
  const languageInstruction =
    locale === "cs"
      ? "Answer in Czech because the user is writing Czech."
      : "Answer in English because the user is not writing Czech.";

  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "system",
      content: `${languageInstruction}
Use only the Grounding Context below. If the context does not contain the answer, reply exactly: "${UNKNOWN_ANSWER}"
Do not use outside knowledge. Keep citations out of the prose because the API returns citations separately.

Grounding Context:
${groundingContext}`,
    },
    ...messages,
  ];
}

function llmConfigError() {
  const provider = process.env.LLM_PROVIDER;
  if (!provider) {
    return "Chat backend is running, but no LLM provider is configured. Set LLM_PROVIDER, LLM_MODEL, and LLM_API_KEY. Azure also needs LLM_ENDPOINT and LLM_API_VERSION.";
  }
  if (!["azure", "openai", "local"].includes(provider)) return `Unsupported LLM_PROVIDER "${provider}". Use "azure", "openai", or "local".`;
  if (!process.env.LLM_MODEL) return "LLM_MODEL is not configured.";
  if (provider !== "local" && !process.env.LLM_API_KEY) return "LLM_API_KEY is not configured.";
  if (provider === "azure" && (!process.env.LLM_ENDPOINT || !process.env.LLM_API_VERSION)) {
    return "Azure provider needs LLM_ENDPOINT and LLM_API_VERSION.";
  }
  if (provider === "local" && !process.env.LLM_ENDPOINT) return "Local provider needs LLM_ENDPOINT.";
  return null;
}

async function callOpenAiCompatible(url, headers, messages) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages,
      temperature: 0,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `LLM request failed with status ${response.status}.`);
  }
  const answer = data.choices?.[0]?.message?.content;
  if (!answer) throw new Error("LLM response did not include an answer.");
  return answer.trim();
}

async function callLlm(messages) {
  const configError = llmConfigError();
  if (configError) {
    const error = new Error(configError);
    error.code = "CONFIG";
    throw error;
  }

  if (process.env.LLM_PROVIDER === "azure") {
    const endpoint = process.env.LLM_ENDPOINT.replace(/\/$/, "");
    const deployment = encodeURIComponent(process.env.LLM_MODEL);
    const apiVersion = encodeURIComponent(process.env.LLM_API_VERSION);
    return callOpenAiCompatible(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      { "api-key": process.env.LLM_API_KEY },
      messages
    );
  }

  if (process.env.LLM_PROVIDER === "local") {
    return callOpenAiCompatible(process.env.LLM_ENDPOINT, {}, messages);
  }

  return callOpenAiCompatible(
    "https://api.openai.com/v1/chat/completions",
    { Authorization: `Bearer ${process.env.LLM_API_KEY}` },
    messages
  );
}

async function handleChat(request, response) {
  const body = await readJson(request);
  const messages = sanitizeMessages(body.messages);
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";

  if (!latestUserMessage.trim()) {
    sendJson(response, 400, { answer: "Missing a user message.", citations: [] });
    return;
  }

  const chunks = retrieveRelevantChunks(latestUserMessage);
  const citations = chunks.map((chunk) => ({ source: chunk.source, section: chunk.section }));

  if (!chunks.length) {
    sendJson(response, 200, { answer: UNKNOWN_ANSWER, citations: [] });
    return;
  }

  try {
    const locale = detectLocale(messages, body.locale);
    const answer = await callLlm(buildMessages(messages, chunks, locale));
    sendJson(response, 200, { answer, citations });
  } catch (error) {
    const statusCode = error.code === "CONFIG" ? 503 : 502;
    sendJson(response, statusCode, {
      answer: error.message || "Chat backend failed.",
      error: error.code === "CONFIG" ? "LLM_CONFIG_MISSING" : "LLM_REQUEST_FAILED",
      citations,
    });
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/chat") {
    handleChat(request, response).catch((error) => {
      sendJson(response, 500, { answer: error.message || "Chat backend failed.", citations: [] });
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  sendJson(response, 404, { answer: "Not found.", citations: [] });
});

server.listen(PORT, () => {
  console.log(`EVA chat backend listening on http://localhost:${PORT}`);
});
