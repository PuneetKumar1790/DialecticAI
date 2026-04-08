// API client for communicating with DialecticAI backend
// Update BACKEND_URL with your deployment URL

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export async function fetchCategories() {
  const res = await fetch(`${BACKEND_URL}/philosophers/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchCategory(categoryKey) {
  const res = await fetch(`${BACKEND_URL}/philosophers/categories/${categoryKey}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

export async function fetchPhilosopher(philosopherId) {
  const res = await fetch(`${BACKEND_URL}/philosophers/philosopher/${philosopherId}`);
  if (!res.ok) throw new Error("Failed to fetch philosopher");
  return res.json();
}

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
