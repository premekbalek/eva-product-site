const topics = {
  overview: {
    title: "Executive overview",
    body:
      "EVA is an AI-first customer service platform for enterprises. It is designed to reduce support load, remove waiting time for repeatable requests, and give customers consistent service logic across voice, chat, mobile app, and web.",
    bullets: [
      "Replaces fragmented IVR, chatbot, and script logic with one orchestration layer.",
      "Targets high-volume journeys such as order status, billing inquiries, account access, and support tickets.",
      "Creates a foundation for proactive customer service, including intelligent routing and personalized offers.",
    ],
  },
  usecases: {
    title: "Use cases",
    body:
      "The strongest first use cases combine high volume, clear rules, customer urgency, and measurable operational impact.",
    bullets: [
      "Order status tracking and delivery inquiry handling.",
      "Billing question resolution and payment context retrieval.",
      "Account access, password reset, and authorization recovery.",
      "Support ticket routing and self-service issue resolution.",
      "Personalized recommendations when context indicates a relevant need.",
    ],
  },
  security: {
    title: "Security and compliance",
    body:
      "EVA should be deployed as a governed service layer, not as an uncontrolled public chatbot. Identity, authorization, audit logs, escalation rules, and data-access policies are part of the core design.",
    bullets: [
      "Customer identity and entitlement checks before sensitive action.",
      "On-demand API calls so customer data is accessed only when needed.",
      "Audit trail for intent, data access, decisioning, resolution, and escalation.",
      "Human handoff when confidence, risk, or policy thresholds require it.",
    ],
  },
  mvp: {
    title: "MVP scope",
    body:
      "A focused MVP should prove value quickly while staying inside well-bounded customer service workflows.",
    bullets: [
      "Order status and delivery tracking.",
      "Billing inquiry and payment guidance.",
      "Account access and password reset.",
      "Support ticket creation and status tracking.",
      "Basic analytics for containment, resolution time, and escalation rate.",
    ],
  },
};

const kbPanel = document.querySelector("#kb-panel");
const kbButtons = document.querySelectorAll(".kb-button");

function renderTopic(topicKey) {
  const topic = topics[topicKey] || topics.overview;
  kbPanel.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.body}</p>
    <ul>${topic.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
  kbButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.topic === topicKey);
  });
}

kbButtons.forEach((button) => {
  button.addEventListener("click", () => renderTopic(button.dataset.topic));
});

renderTopic("overview");

// Mock knowledge base for demo mode
const mockKnowledgeBase = {
  "What makes EVA different from a chatbot?": {
    answer: "EVA is not just a chatbot—it's an orchestration platform. It combines intent detection, identity verification, API calls, decisioning, and resolution in one controlled flow. A chatbot typically handles conversation; EVA handles complete customer journeys with real backend action and governance.",
    citations: []
  },
  "What is the MVP scope?": {
    answer: "A focused MVP should include:\n\n- **Order status tracking** and delivery inquiry handling\n- **Billing questions** and payment guidance\n- **Account access** and password reset\n- **Support ticket** creation and status tracking\n- Basic analytics for containment, resolution time, and escalation rate\n\nThis proves value quickly while staying inside well-bounded workflows.",
    citations: []
  },
  "How does EVA integrate with enterprise systems?": {
    answer: "EVA acts as an orchestration layer between channels, identity systems, and business APIs. Key integration points:\n\n- **Customer data APIs** for identity and profile information\n- **Order/product systems** for transaction and inventory data\n- **Billing systems** for payment and account details\n- **Support platforms** for ticket management\n- **Analytics backends** for compliance and optimization\n\nAPIs are called on-demand only when needed, improving speed and reducing unnecessary load.",
    citations: []
  }
};

const chatMessages = document.querySelector("#chat-messages");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const quickPrompts = document.querySelectorAll(".quick-prompts button");
const chatSubmit = chatForm.querySelector("button");

const chatApiUrl =
  window.EVA_CHAT_API_URL ||
  (window.location.hostname === "localhost" && window.location.port !== "8787"
    ? "http://localhost:8787/api/chat"
    : "/api/chat");
const conversation = [];

function getMockResponse(question) {
  // Check for exact match first
  if (mockKnowledgeBase[question]) {
    return mockKnowledgeBase[question];
  }
  
  // Check for keyword matches
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes("chatbot") || lowerQuestion.includes("different")) {
    return mockKnowledgeBase["What makes EVA different from a chatbot?"];
  }
  if (lowerQuestion.includes("mvp") || lowerQuestion.includes("scope")) {
    return mockKnowledgeBase["What is the MVP scope?"];
  }
  if (lowerQuestion.includes("integrat") || lowerQuestion.includes("system") || lowerQuestion.includes("api")) {
    return mockKnowledgeBase["How does EVA integrate with enterprise systems?"];
  }
  
  // Default response
  return {
    answer: "I can help with questions about EVA's architecture, MVP scope, integration patterns, and use cases. Try asking: 'What makes EVA different from a chatbot?', 'What is the MVP scope?', or 'How does EVA integrate with enterprise systems?'",
    citations: []
  };
}

function addMessage(text, type, citations = []) {
  const element = document.createElement("div");
  element.className = `message ${type}`;
  const body = document.createElement("div");
  body.className = "message-body";
  if (type === "bot") {
    body.innerHTML = renderBasicMarkdown(text);
  } else {
    body.textContent = text;
  }
  element.appendChild(body);

  if (citations.length) {
    const citationList = document.createElement("ul");
    citationList.className = "citations";
    citations.forEach((citation) => {
      const item = document.createElement("li");
      item.textContent = `${citation.source}: ${citation.section}`;
      citationList.appendChild(item);
    });
    element.appendChild(citationList);
  }

  chatMessages.appendChild(element);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return element;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function renderBasicMarkdown(markdown) {
  const lines = String(markdown).split(/\r?\n/);
  const parts = [];
  let listItems = [];

  function flushList() {
    if (!listItems.length) return;
    parts.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    listItems = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      parts.push(`<h4>${renderInlineMarkdown(trimmed.slice(4))}</h4>`);
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      parts.push(`<h3>${renderInlineMarkdown(trimmed.slice(3))}</h3>`);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(renderInlineMarkdown(trimmed.replace(/^[-*]\s+/, "")));
      return;
    }

    flushList();
    parts.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  });

  flushList();
  return parts.join("");
}

function detectLocale(text) {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const czechSignals = [" jak ", " co ", " proc ", " muze ", " ucet ", " zakaznik ", " resi "];
  return czechSignals.some((signal) => ` ${normalized} `.includes(signal)) ? "cs" : "en";
}

function setChatLoading(isLoading) {
  chatInput.disabled = isLoading;
  chatSubmit.disabled = isLoading;
  chatSubmit.textContent = isLoading ? "..." : "Send";
}

async function submitQuestion(question) {
  const cleaned = question.trim();
  if (!cleaned) return;
  addMessage(cleaned, "user");
  conversation.push({ role: "user", content: cleaned });

  const pendingMessage = addMessage("Thinking...", "bot");
  setChatLoading(true);

  try {
    const response = await fetch(chatApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation,
        locale: detectLocale(cleaned),
      }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (data.error === "LLM_CONFIG_MISSING") {
        throw new Error(
          "The chat backend is connected, but the AI model is not configured yet. Set the LLM environment variables on the backend, then try again."
        );
      }
      throw new Error(data.answer || `Chat request failed with status ${response.status}.`);
    }

    pendingMessage.remove();
    addMessage(data.answer, "bot", data.citations || []);
    conversation.push({ role: "assistant", content: data.answer });
  } catch (error) {
    // Use mock response as fallback
    const mockResponse = getMockResponse(cleaned);
    pendingMessage.remove();
    addMessage(mockResponse.answer, "bot", mockResponse.citations);
    conversation.push({ role: "assistant", content: mockResponse.answer });
  } finally {
    setChatLoading(false);
    chatInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(chatInput.value);
  chatInput.value = "";
});

quickPrompts.forEach((button) => {
  button.addEventListener("click", () => submitQuestion(button.dataset.question));
});

addMessage(
  "Hi, I can answer grounded questions about EVA from the repository knowledge base. Ask about business value, architecture, use cases, delivery, or integrations.",
  "bot"
);
