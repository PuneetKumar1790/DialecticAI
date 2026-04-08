const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function callGemini(systemPrompt, userPrompt) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 300
      }
    })
  });

  const data = await res.json();

  if (data.error) {
    const error = new Error("Fallback model unavailable.");
    error.code = data.error.status || "gemini_error";
    throw error;
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}
