# OpenRouter Chatbot

A small web app: a chat UI in the browser, talking to a Node/Express
server, which calls OpenRouter's API (free tier, no credit card
required, wide choice of models through one key). Your API key stays
on the server and is never sent to the browser.

```
browser  <-->  Express server (server.js)  <-->  OpenRouter API
```

## 1. Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- A free OpenRouter API key from https://openrouter.ai/keys
  (sign up with Google, GitHub, or email — no card needed)

## 2. Run it locally

```bash
# install dependencies
npm install

# add your API key
cp .env.example .env
# then open .env and paste your key in

# start the server
npm start
```

Open **http://localhost:3000** and start chatting.

Use `npm run dev` instead of `npm start` while you're editing —
it restarts the server automatically on save.

## 3. Customize it

- **Personality**: edit `SYSTEM_PROMPT` in `server.js`.
- **Model**: set `OPENROUTER_MODEL` in `.env` (defaults to a free
  Llama 3.3 70B model). Browse other free models — anything ending
  in `:free` — at https://openrouter.ai/models.
- **Look**: colors and type are defined as CSS variables at the top
  of `public/style.css`.

## A note on the free tier

OpenRouter's free models are rate-limited (roughly 20 requests per
minute and 50 per day until you've added at least $10 in lifetime
credit, after which the daily cap rises). Prompts sent to free
models may be used to help improve them — check OpenRouter's current
terms if that matters for what you're building. Fine for a personal
project; worth knowing about if you ever go further with it.

## 4. Put it on GitHub

```bash
# from inside the project folder
git init
git add .
git commit -m "Initial commit: OpenRouter chatbot"

# create a new repo on GitHub first (via github.com or `gh repo create`),
# then point this folder at it:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

`.env` is already in `.gitignore`, so your API key won't be
committed. Anyone who clones the repo will need to supply their own
key via `.env.example`.

## 5. Deploy it (optional)

Any Node host works — Render, Railway, Fly.io, a VPS, etc.
The steps are always the same:

1. Push this repo to GitHub (above).
2. Connect the host to your GitHub repo.
3. Set the `OPENROUTER_API_KEY` environment variable in the host's
   dashboard (not in a committed `.env` file).
4. Set the start command to `npm start`.

## Project structure

```
openrouter-chatbot/
├── server.js          # Express server + OpenRouter API call
├── package.json
├── .env.example        # copy to .env and fill in your key
├── .gitignore
└── public/
    ├── index.html       # chat UI markup
    ├── style.css        # styling
    └── script.js        # frontend chat logic
```
