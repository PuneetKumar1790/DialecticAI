const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const PRIMARY_MODEL = "llama-3.3-70b-versatile"
const FALLBACK_MODEL = "llama-3.1-8b-instant"

export async function callGroq(systemPrompt, userPrompt, useFallback = false) {
  const key = import.meta.env.VITE_GROQ_KEY
  const model = useFallback ? FALLBACK_MODEL : PRIMARY_MODEL

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
  })

  const data = await res.json()

  if (data.error) {
    if (data.error.code === "rate_limit_exceeded" && !useFallback) {
      await sleep(2000)
      return callGroq(systemPrompt, userPrompt, true)
    }

    const error = new Error("Unable to fetch a philosopher response.")
    error.code = data.error.code || "groq_error"
    throw error
  }

  return data.choices?.[0]?.message?.content?.trim() || ""
}

export async function callGroqChat(systemPrompt, messages, useFallback = false) {
  const key = import.meta.env.VITE_GROQ_KEY
  const model = useFallback ? FALLBACK_MODEL : PRIMARY_MODEL

  const CHAT_SYSTEM_ADDON = `
You are now in an extended one-on-one conversation.
Escalate your core trait as the conversation deepens —
do not become more moderate or agreeable over time.
Socrates asks harder questions the more the person
thinks they understand.
Diogenes gets more dismissive the more the person
justifies themselves.
Nietzsche gets more provocative when challenged.
Chanakya thinks further ahead with each exchange.
Machiavelli becomes more specific and tactical.
Aurelius becomes more precise about what is and
is not in their control.
If the user gives a very short response, acknowledge it briefly and ask
a specific follow-up question to deepen the conversation.
Keep responses to 3-5 sentences maximum.
Never break character. Never say you are an AI.
Never refer to yourself as a language model.
No markdown. Year: 2026.
`

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      max_tokens: 350,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\n${CHAT_SYSTEM_ADDON}`
        },
        ...messages
      ]
    })
  })

  const data = await res.json()

  if (data.error) {
    if (data.error.code === "rate_limit_exceeded" && !useFallback) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("dialecticai:chat-rate-limit"))
      }
      await sleep(2000)
      return callGroqChat(systemPrompt, messages, true)
    }

    const error = new Error(data.error.message || "Chat unavailable")
    error.code = data.error.code || "groq_chat_error"
    throw error
  }

  return data.choices?.[0]?.message?.content?.trim() || ""
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
