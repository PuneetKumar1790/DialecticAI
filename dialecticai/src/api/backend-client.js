// API client for communicating with DialecticAI backend
// Never expose API keys on frontend - they go through the backend

const LOCAL_BACKEND_URL = "http://localhost:5000/api";
const PROD_BACKEND_URL = "https://dialecticai-backend.onrender.com/api";

const configuredBackendUrl = (import.meta.env.VITE_BACKEND_URL || "").trim();
const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const configuredPointsToLocalhost = /localhost|127\.0\.0\.1/.test(configuredBackendUrl);

// Safety: if a localhost URL is accidentally configured in a production build,
// use the deployed backend instead of failing in user browsers.
const BACKEND_URL = (
  !isLocalHost && configuredPointsToLocalhost
    ? PROD_BACKEND_URL
    : configuredBackendUrl || (isLocalHost ? LOCAL_BACKEND_URL : PROD_BACKEND_URL)
).replace(/\/$/, "");

export async function generateResponse(philosopherId, systemPrompt, userPrompt, model = "groq") {
  const res = await fetch(`${BACKEND_URL}/response/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      philosopherId,
      systemPrompt,
      userPrompt,
      model
    })
  });

  if (!res.ok) {
    const error = await res.json();
    const err = new Error(error.error || "Failed to generate response");
    err.code = error.code;
    throw err;
  }

  const data = await res.json();
  return data.response;
}

export async function generateChatResponse(philosopherId, systemPrompt, messages) {
  const res = await fetch(`${BACKEND_URL}/response/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      philosopherId,
      systemPrompt,
      messages
    })
  });

  if (!res.ok) {
    const error = await res.json();
    const err = new Error(error.error || "Failed to generate response");
    err.code = error.code;
    throw err;
  }

  const data = await res.json();
  return data.response;
}

export async function healthCheck() {
  try {
    const res = await fetch(`${BACKEND_URL.replace('/api', '')}/api/health`);
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}
