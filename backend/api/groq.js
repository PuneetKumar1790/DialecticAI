const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callGroq(systemPrompt, userPrompt, useFallback = false) {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const model = useFallback ? FALLBACK_MODEL : PRIMARY_MODEL;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      temperature: 0.85,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  const data = await res.json();

  if (data.error) {
    if (data.error.code === "rate_limit_exceeded" && !useFallback) {
      await sleep(2000);
      return callGroq(systemPrompt, userPrompt, true);
    }

    const error = new Error("Unable to fetch a philosopher response.");
    error.code = data.error.code || "groq_error";
    throw error;
  }

  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function callGroqChat(
  systemPrompt,
  messages,
  useFallback = false
) {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const model = useFallback ? FALLBACK_MODEL : PRIMARY_MODEL;

  const CHAT_SYSTEM_ADDON = `
You are now in an extended one-on-one conversation.
Escalate your core trait as the conversation deepens —
do not become more moderate or agreeable over time.
Socrates asks harder questions the more the person`;

  const fullSystemPrompt = systemPrompt + "\n\n" + CHAT_SYSTEM_ADDON;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      temperature: 0.85,
      messages: [{ role: "system", content: fullSystemPrompt }, ...messages]
    })
  });

  const data = await res.json();

  if (data.error) {
    if (data.error.code === "rate_limit_exceeded" && !useFallback) {
      await sleep(2000);
      return callGroqChat(systemPrompt, messages, true);
    }

    const error = new Error("Unable to fetch a philosopher response.");
    error.code = data.error.code || "groq_error";
    throw error;
  }

  return data.choices?.[0]?.message?.content?.trim() || "";
}
