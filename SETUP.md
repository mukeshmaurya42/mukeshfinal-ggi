# MarketGen AI — Local Setup (VS Code)

## 1. Install dependencies
```bash
bun install
```
(Install Bun first if needed: https://bun.sh)

## 2. Configure the AI key (REQUIRED for generation)

The app shows **"AI is not configured"** when no AI key is present.

### Option A: OpenAI / ChatGPT (recommended, fewer rate limits)
1. Go to https://platform.openai.com/api-keys
2. Create an API key (you may need to add a small credit balance)
3. Open `.env` and paste it:
   ```
   OPENAI_API_KEY="sk-...your_key_here..."
   ```
4. Save the file.

### Option B: free Google Gemini key
1. Go to https://aistudio.google.com/apikey
2. Click **Create API key** (free, no credit card)
3. Open `.env` and paste it:
   ```
   GEMINI_API_KEY="AIza...your_key_here..."
   ```
4. Save the file.

> **Note:** Only one key is needed. The app prefers OpenAI first, then Gemini, then Lovable Cloud.

## 3. Run
```bash
bun run dev
```
Open http://localhost:3000

## 4. Sign up → Studio → Generate
The Studio page will now produce real AI content.

---

### Troubleshooting
- **"AI is not configured"** → you didn't save `.env` or didn't restart `bun run dev` after editing it.
- **OpenAI 429** → you've hit OpenAI's rate limit. Wait a moment or check your billing quota at https://platform.openai.com/usage.
- **Gemini 403/400/429** → invalid key, rate limit, or region restriction. Switch to OpenAI or generate a new Gemini key.
- **Supabase auth fails** → the `.env` Supabase values are pre-filled and point to the hosted backend; don't change them.
