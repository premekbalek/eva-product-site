const topics = {
  overview: {
    title: "Executive overview",
    body:
      "EVA is an AI-first customer service platform for banks. It is designed to reduce call-center load, remove waiting time for repeatable requests, and give customers consistent service logic across voice, chat, mobile app, and web.",
    bullets: [
      "Replaces fragmented IVR, chatbot, and script logic with one orchestration layer.",
      "Targets high-volume journeys such as card blocking, balance checks, access reset, and application status.",
      "Creates a foundation for proactive banking service, including fraud alerts and next-best offers.",
    ],
  },
  usecases: {
    title: "Use cases",
    body:
      "The strongest first use cases combine high volume, clear rules, customer urgency, and measurable operational impact.",
    bullets: [
      "Card blocking after suspicious transaction detection.",
      "Balance, transaction, and payment context retrieval.",
      "Mortgage or loan application status with next-step guidance.",
      "Secure access reset and authorization recovery.",
      "Compliant cross-sell when context indicates a relevant need.",
    ],
  },
  security: {
    title: "Security and compliance",
    body:
      "EVA should be deployed as a governed bank service layer, not as an uncontrolled public chatbot. Identity, authorization, audit logs, escalation rules, and data-access policies are part of the core design.",
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
      "A focused MVP should prove value quickly while staying inside well-bounded banking workflows.",
    bullets: [
      "Balance and transaction lookup.",
      "Card blocking and replacement guidance.",
      "Access reset with authorization checks.",
      "Loan or application status.",
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

const chatMessages = document.querySelector("#chat-messages");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const quickPrompts = document.querySelectorAll(".quick-prompts button");

const answers = [
  {
    match: ["chatbot", "different", "why"],
    answer:
      "EVA is positioned as a resolver, not a chatbot. A chatbot usually answers or routes. EVA identifies intent, verifies identity, pulls context, calls banking APIs, completes the action, logs the journey, and escalates only when policy or confidence requires it.",
  },
  {
    match: ["mvp", "scope", "start"],
    answer:
      "The MVP should focus on balance and transactions, card blocking, access reset, and application status. These are high-volume, measurable journeys with clear success criteria and strong operational ROI.",
  },
  {
    match: ["integrate", "integration", "api", "backend", "systems"],
    answer:
      "EVA sits between channels and bank systems as an orchestration layer. It can call identity, CRM, card management, account, loan, and notification APIs on demand, then return one consistent answer across voice, chat, mobile, and web.",
  },
  {
    match: ["security", "compliance", "audit", "risk"],
    answer:
      "The security model should include identity verification, entitlement checks, least-needed data access, audit logs, confidence thresholds, and human escalation. EVA should operate under the same governance expectations as other bank service channels.",
  },
  {
    match: ["roi", "business", "impact", "cost"],
    answer:
      "The business case is reduced operator contacts, faster service, better CX/NPS, and new revenue moments through compliant next-best offers. The pitch target is roughly 30-60% reduction in selected operator contacts after proven rollout.",
  },
];

function addMessage(text, type) {
  const element = document.createElement("div");
  element.className = `message ${type}`;
  element.textContent = text;
  chatMessages.appendChild(element);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerFor(question) {
  const normalized = question.toLowerCase();
  const hit = answers.find((item) => item.match.some((word) => normalized.includes(word)));
  if (hit) return hit.answer;
  return "A good way to evaluate EVA is to pick one high-volume journey and measure containment, resolution time, escalation rate, customer satisfaction, and backend API load. The strongest pilot is usually card blocking or balance plus transactions.";
}

function submitQuestion(question) {
  const cleaned = question.trim();
  if (!cleaned) return;
  addMessage(cleaned, "user");
  window.setTimeout(() => addMessage(answerFor(cleaned), "bot"), 220);
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
  "Hi, I can explain EVA as a corporate banking product. Ask about value, architecture, security, MVP scope, or integration.",
  "bot"
);
