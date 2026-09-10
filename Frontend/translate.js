/**
 * api/translate.js — Serverless translation endpoint for WeatherGPT.
 *
 * This is the backend that app.js's translateToEnglish() has been calling
 * all along (POST /api/translate with { text, source, target }, expects
 * back { translatedText }). Nothing in app.js needs to change — dropping
 * this file into an `api/` folder at the project root is enough for
 * Vercel to serve it at that exact path with zero extra config.
 *
 * Provider strategy:
 *   1. Google Cloud Translation API v2, if GOOGLE_TRANSLATE_API_KEY is set
 *      as an environment variable. This is the "Google Translate" the
 *      person asked for — accurate, handles all 13 of the app's Indian
 *      languages (including Odia/"or" and Assamese/"as"), and has a
 *      generous free tier (500,000 chars/month) before it starts billing.
 *   2. MyMemory (api.mymemory.translated.net) as a no-key fallback, so
 *      translation still works out of the box before anyone has set up
 *      Google Cloud billing, and as a safety net if the Google call ever
 *      fails or the key is missing/invalid. Lower quality and rate-limited
 *      (~5,000 words/day per IP anonymously), but free and keyless.
 *
 * ── Setting up the Google Cloud key (recommended for production) ──
 *   1. Google Cloud Console → create/select a project.
 *   2. Enable the "Cloud Translation API".
 *   3. Create an API key (APIs & Services → Credentials → Create
 *      Credentials → API key). Restrict it to the Cloud Translation API.
 *   4. In Vercel: Project → Settings → Environment Variables → add
 *      GOOGLE_TRANSLATE_API_KEY = <your key> → redeploy.
 *   Skip all of this and the endpoint still works via the MyMemory
 *   fallback — just with lower volume limits and slightly rougher
 *   translations for short colloquial phrases.
 */

const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const FETCH_TIMEOUT_MS = 8000;
const MAX_TEXT_LENGTH = 2000; // a chat message, not a document — guards against abuse

// Our in-app language codes (see VOICE_LANG_MAP in app.js) map 1:1 onto the
// ISO codes both Google and MyMemory expect, so no translation table needed
// here — just an allowlist so the endpoint can't be used as an open proxy.
const SUPPORTED_LANGS = new Set([
  "en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as"
]);

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function translateWithGoogle(text, source, target, apiKey) {
  const res = await withTimeout(
    fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source, target, format: "text" })
    }),
    FETCH_TIMEOUT_MS
  );
  if (!res.ok) throw new Error("Google Translate HTTP " + res.status);
  const data = await res.json();
  const translated = data?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error("Google Translate: no translation in response");
  return translated;
}

async function translateWithMyMemory(text, source, target) {
  const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  const res = await withTimeout(fetch(url), FETCH_TIMEOUT_MS);
  if (!res.ok) throw new Error("MyMemory HTTP " + res.status);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  // MyMemory returns this exact string (still HTTP 200) when its free quota
  // for the day is used up — treat it as a failure so callers get a clean
  // "no translation" instead of that string leaking into the chat.
  if (!translated || /MYMEMORY WARNING/i.test(translated)) {
    throw new Error("MyMemory: no usable translation");
  }
  return translated;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, source, target } = req.body || {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing 'text'" });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: "Text too long" });
  }
  if (!SUPPORTED_LANGS.has(source) || !SUPPORTED_LANGS.has(target || "en")) {
    return res.status(400).json({ error: "Unsupported language" });
  }
  if (source === (target || "en")) {
    return res.status(200).json({ translatedText: text });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  try {
    let translatedText;
    if (apiKey) {
      try {
        translatedText = await translateWithGoogle(text, source, target || "en", apiKey);
      } catch (err) {
        // Google failed (bad key, quota, transient outage) — don't fail the
        // request outright, just fall back the same way we do when no key
        // is configured at all.
        translatedText = await translateWithMyMemory(text, source, target || "en");
      }
    } else {
      translatedText = await translateWithMyMemory(text, source, target || "en");
    }
    return res.status(200).json({ translatedText });
  } catch (err) {
    return res.status(502).json({ error: "Translation unavailable" });
  }
};
