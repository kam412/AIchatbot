// server.js
// Minimal Express backend that talks to the OpenRouter API on behalf of
// the browser, so your API key never gets exposed to the client.

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL =
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

if (!OPENROUTER_API_KEY) {
  console.warn(
    "⚠️  OPENROUTER_API_KEY is not set. Add it to a .env file before chatting."
  );
}

// System prompt — customize this to give your bot a personality.
const SYSTEM_PROMPT =
  "You are a friendly, helpful assistant embedded in a personal chat app.";

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    // OpenRouter's API is OpenAI-compatible: roles are "system"/"user"/
    // "assistant" and messages use "content" directly, so no reshaping is
    // needed beyond prepending the system prompt.
    const orMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          // OpenRouter asks for these on free-tier requests; the values
          // don't need to be real for local use.
          "HTTP-Referer": "http://localhost",
          "X-Title": "Personal Chatbot",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: orMessages,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return res.status(response.status).json({ error: data });
    }

    const reply = data.choices?.[0]?.message?.content;

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot running at http://localhost:${PORT}`);
});
