import express from "express";
import { callGroq, callGroqChat } from "../api/groq.js";
import { callGemini } from "../api/gemini.js";

const router = express.Router();

// Generate response from a philosopher
router.post("/generate", async (req, res) => {
  try {
    const { philosopherId, systemPrompt, userPrompt, model = "groq" } = req.body;

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({
        error: "Missing required fields: systemPrompt and userPrompt"
      });
    }

    let response;
    if (model === "gemini") {
      response = await callGemini(systemPrompt, userPrompt);
    } else {
      response = await callGroq(systemPrompt, userPrompt);
    }

    res.json({
      philosopherId,
      response,
      model
    });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({
      error: error.message || "Failed to generate response",
      code: error.code || "generation_error"
    });
  }
});

// Generate response for chat/extended conversation
router.post("/chat", async (req, res) => {
  try {
    const { philosopherId, systemPrompt, messages } = req.body;

    if (!systemPrompt || !messages) {
      return res.status(400).json({
        error: "Missing required fields: systemPrompt and messages"
      });
    }

    const response = await callGroqChat(systemPrompt, messages);

    res.json({
      philosopherId,
      response
    });
  } catch (error) {
    console.error("Error generating chat response:", error);
    res.status(500).json({
      error: error.message || "Failed to generate response",
      code: error.code || "generation_error"
    });
  }
});

export default router;
