const transcript = document.getElementById("transcript");
const composer = document.getElementById("composer");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send-btn");

// Full conversation history, sent to the backend on every turn
// so the model has context.
let history = [];

function addMessage(role, text) {
  const el = document.createElement("div");
  el.className = `message ${role}`;
  el.innerHTML = `<div class="bubble"></div>`;
  el.querySelector(".bubble").textContent = text;
  transcript.appendChild(el);
  transcript.scrollTop = transcript.scrollHeight;
  return el;
}

async function sendMessage(text) {
  addMessage("user", text);
  history.push({ role: "user", content: text });

  const pending = addMessage("assistant", "Thinking…");
  pending.classList.add("pending");

  sendBtn.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.error?.message || "Request failed");
    }

    pending.classList.remove("pending");
    pending.querySelector(".bubble").textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } catch (err) {
    pending.classList.remove("pending");
    pending.querySelector(".bubble").textContent =
      "Something went wrong — check the server logs.";
    console.error(err);
  } finally {
    sendBtn.disabled = false;
  }
}

composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  input.style.height = "auto";
  sendMessage(text);
});

// Send on Enter, newline on Shift+Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    composer.requestSubmit();
  }
});

// Auto-grow the textarea
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
});
