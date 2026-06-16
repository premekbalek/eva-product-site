const pageLocale = document.documentElement.lang === "cs" ? "cs" : "en";
const uiText = {
  en: {
    send: "Send",
    thinking: "Thinking...",
    initialMessage:
      "Hi, I can answer grounded questions about EVA from the repository knowledge base. Ask about business value, architecture, use cases, delivery, or integrations.",
    configMissing:
      "The chat backend is connected, but the AI model is not configured yet. Set the LLM environment variables on the backend, then try again.",
  },
  cs: {
    send: "Odeslat",
    thinking: "Přemýšlím...",
    initialMessage:
      "Dobrý den, umím odpovídat na otázky o EVA podle znalostní báze v repozitáři. Ptejte se na business hodnotu, architekturu, use cases, delivery nebo integrace.",
    configMissing:
      "Chat backend je připojený, ale AI model ještě není nakonfigurovaný. Nastavte LLM proměnné prostředí na backendu a zkuste to znovu.",
  },
};

const topicSets = {
  en: {
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
  },
  cs: {
    overview: {
      title: "Manažerský přehled",
      body:
        "EVA je AI-first platforma pro enterprise zákaznickou péči. Snižuje zátěž podpory, odstraňuje čekání u opakovatelných požadavků a sjednocuje servisní logiku napříč hlasem, chatem, mobilní aplikací a webem.",
      bullets: [
        "Nahrazuje roztříštěnou logiku IVR, chatbotů a skriptů jednou orchestrační vrstvou.",
        "Cílí na vysokofrekvenční cesty jako stav objednávky, fakturace, přístup k účtu a support tickety.",
        "Vytváří základ pro proaktivní zákaznickou péči, inteligentní routing a personalizované nabídky.",
      ],
    },
    usecases: {
      title: "Use cases",
      body:
        "Nejsilnější první use cases kombinují vysoký objem, jasná pravidla, zákaznickou urgenci a měřitelný provozní dopad.",
      bullets: [
        "Sledování stavu objednávky a dotazy na doručení.",
        "Řešení fakturačních dotazů a načítání platebního kontextu.",
        "Přístup k účtu, reset hesla a obnova autorizace.",
        "Směrování support ticketů a samoobslužné řešení problémů.",
        "Personalizovaná doporučení, když kontext ukazuje relevantní potřebu.",
      ],
    },
    security: {
      title: "Bezpečnost a compliance",
      body:
        "EVA má být nasazena jako řízená servisní vrstva, ne jako nekontrolovaný veřejný chatbot. Identita, autorizace, auditní logy, eskalační pravidla a datové politiky jsou součástí návrhu.",
      bullets: [
        "Ověření identity a oprávnění zákazníka před citlivou akcí.",
        "API volání na vyžádání, aby se zákaznická data načítala jen tehdy, když jsou potřeba.",
        "Auditní stopa pro záměr, přístup k datům, rozhodnutí, vyřešení a eskalaci.",
        "Předání člověku, pokud to vyžaduje confidence, riziko nebo pravidla.",
      ],
    },
    mvp: {
      title: "Rozsah MVP",
      body:
        "Fokusované MVP má rychle prokázat hodnotu a zároveň zůstat v dobře ohraničených zákaznických procesech.",
      bullets: [
        "Stav objednávky a sledování doručení.",
        "Fakturační dotazy a platební navigace.",
        "Přístup k účtu a reset hesla.",
        "Vytvoření support ticketu a sledování stavu.",
        "Základní analytika containmentu, času vyřešení a míry eskalací.",
      ],
    },
  },
};
const topics = topicSets[pageLocale];

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
const mockKnowledgeBaseSets = {
  en: {
    "What makes EVA different from a chatbot?": {
      answer: "EVA is not just a chatbot—it's an orchestration platform. It combines intent detection, identity verification, API calls, decisioning, and resolution in one controlled flow. A chatbot typically handles conversation; EVA handles complete customer journeys with real backend action and governance.",
      citations: [],
    },
    "What is the MVP scope?": {
      answer: "A focused MVP should include:\n\n- **Order status tracking** and delivery inquiry handling\n- **Billing questions** and payment guidance\n- **Account access** and password reset\n- **Support ticket** creation and status tracking\n- Basic analytics for containment, resolution time, and escalation rate\n\nThis proves value quickly while staying inside well-bounded workflows.",
      citations: [],
    },
    "How does EVA integrate with enterprise systems?": {
      answer: "EVA acts as an orchestration layer between channels, identity systems, and business APIs. Key integration points:\n\n- **Customer data APIs** for identity and profile information\n- **Order/product systems** for transaction and inventory data\n- **Billing systems** for payment and account details\n- **Support platforms** for ticket management\n- **Analytics backends** for compliance and optimization\n\nAPIs are called on-demand only when needed, improving speed and reducing unnecessary load.",
      citations: [],
    },
  },
  cs: {
    "Čím se EVA liší od chatbota?": {
      answer: "EVA není jen chatbot, ale orchestrační platforma. Spojuje rozpoznání záměru, ověření identity, API volání, rozhodování a vyřešení požadavku v jednom řízeném flow. Chatbot typicky řeší konverzaci; EVA řeší kompletní zákaznické cesty s reálnou backendovou akcí a governance.",
      citations: [],
    },
    "Jaký je rozsah MVP?": {
      answer: "Fokusované MVP by mělo zahrnovat:\n\n- **Stav objednávky** a dotazy na doručení\n- **Fakturační otázky** a platební navigaci\n- **Přístup k účtu** a reset hesla\n- **Support ticket** a sledování jeho stavu\n- Základní analytiku containmentu, času vyřešení a míry eskalací\n\nTím se rychle prokáže hodnota při zachování jasně ohraničených workflow.",
      citations: [],
    },
    "Jak se EVA integruje s enterprise systémy?": {
      answer: "EVA funguje jako orchestrační vrstva mezi kanály, identitními systémy a business API. Klíčové integrační body:\n\n- **Customer data API** pro identitu a profil zákazníka\n- **Objednávkové a produktové systémy** pro transakční data\n- **Fakturační systémy** pro platby a účty\n- **Support platformy** pro ticket management\n- **Analytické backendy** pro compliance a optimalizaci\n\nAPI se volají na vyžádání jen tehdy, když jsou potřeba, což zrychluje službu a snižuje zbytečnou zátěž.",
      citations: [],
    },
  },
};
const mockKnowledgeBase = mockKnowledgeBaseSets[pageLocale];

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
  if (
    lowerQuestion.includes("chatbot") ||
    lowerQuestion.includes("different") ||
    lowerQuestion.includes("liší") ||
    lowerQuestion.includes("lisi")
  ) {
    return pageLocale === "cs"
      ? mockKnowledgeBase["Čím se EVA liší od chatbota?"]
      : mockKnowledgeBase["What makes EVA different from a chatbot?"];
  }
  if (lowerQuestion.includes("mvp") || lowerQuestion.includes("scope") || lowerQuestion.includes("rozsah")) {
    return pageLocale === "cs"
      ? mockKnowledgeBase["Jaký je rozsah MVP?"]
      : mockKnowledgeBase["What is the MVP scope?"];
  }
  if (
    lowerQuestion.includes("integrat") ||
    lowerQuestion.includes("system") ||
    lowerQuestion.includes("systém") ||
    lowerQuestion.includes("api")
  ) {
    return pageLocale === "cs"
      ? mockKnowledgeBase["Jak se EVA integruje s enterprise systémy?"]
      : mockKnowledgeBase["How does EVA integrate with enterprise systems?"];
  }
  
  // Default response
  if (pageLocale === "cs") {
    return {
      answer:
        "Mohu pomoci s otázkami k architektuře EVA, rozsahu MVP, integračním patternům a use cases. Zkuste se zeptat: 'Čím se EVA liší od chatbota?', 'Jaký je rozsah MVP?' nebo 'Jak se EVA integruje s enterprise systémy?'",
      citations: [],
    };
  }

  return {
    answer:
      "I can help with questions about EVA's architecture, MVP scope, integration patterns, and use cases. Try asking: 'What makes EVA different from a chatbot?', 'What is the MVP scope?', or 'How does EVA integrate with enterprise systems?'",
    citations: [],
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
  chatSubmit.textContent = isLoading ? "..." : uiText[pageLocale].send;
}

async function submitQuestion(question) {
  const cleaned = question.trim();
  if (!cleaned) return;
  addMessage(cleaned, "user");
  conversation.push({ role: "user", content: cleaned });

  const pendingMessage = addMessage(uiText[pageLocale].thinking, "bot");
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
          uiText[pageLocale].configMissing
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
  uiText[pageLocale].initialMessage,
  "bot"
);
