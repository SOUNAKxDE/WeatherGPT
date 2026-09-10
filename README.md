# WeatherGPT — AI Weather Intelligence & Disaster Response

A conversational, multilingual weather app built as an installable Progressive Web App (PWA). Alongside a live 7‑day forecast, it bundles hazard alerts, an Emergency SOS flow, incident reporting, a climate/research view, and a chat assistant — designed to keep working (from cache) even on a weak or dropped connection.

> This repo also includes a standalone Python NLP prototype (intent classification with Keras) that is **not currently wired into the web app** — see [Python NLP prototype](#python-nlp-prototype-experimental) below.

## Features

- **Today's Forecast** — current conditions, hourly and 7‑day outlook, humidity, wind, UV, AQI and pressure, powered by live [Open‑Meteo](https://open-meteo.com) data (no API key required).
- **Map & Hazards** — spatial view of hazards near a location.
- **Alerts** — active severe‑weather and hazard alerts with a live badge count.
- **Chat** — a conversational assistant with voice input (Web Speech API) and automatic translation of non‑English speech.
- **Plan** — weather‑aware travel/commute and outdoor‑activity guidance.
- **Climate & Research** / **Command Centre** — extended views for historical climate data and coordinated response (currently hidden/role‑gated in the UI).
- **Emergency SOS** — a fast path for reporting danger and requesting help.
- **Incident reporting** — flag flooding, blocked roads, damage, or outages.
- **Multilingual UI** — English plus 12 Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, Assamese), with speech recognition and translation matched to each language.
- **Offline-first PWA** — a service worker caches the app shell (cache‑first) and falls back to the last cached response for live data (network‑first with fallback), so the app still opens and shows a last-known forecast with no connection.
- **Light/dark theme**, saved per device.

## Tech stack

- **Frontend:** Vanilla HTML/CSS/JS (no build step) — `index.html`, `style.css`, `app.js`, `data.js`
- **Weather data:** [Open‑Meteo](https://open-meteo.com) (forecast, geocoding, and air‑quality APIs)
- **Translation backend:** a serverless function (`translate.js`, deployed as `/api/translate`) using Google Cloud Translation API v2 when configured, with an automatic fallback to the free, keyless MyMemory API
- **PWA:** `manifest.json` + `sw.js` service worker
- **Python NLP prototype:** TensorFlow/Keras + NLTK bag‑of‑words intent classifier (`Models/main.py`, `Models/nlp_model.py`, `Models/intents.json`, dependencies in `Models/requirements.txt`)

## Project structure

The repo is split into two top-level folders — the static web app and the separate Python NLP prototype:

```
.
├── Frontend/
│   ├── index.html            # App shell — landing, auth, language picker, main app views
│   ├── app.js                 # App logic: views, chat, voice input, i18n, theming
│   ├── data.js                 # Static/sample data used alongside live weather data
│   ├── style.css                # Styling
│   ├── weather-api.js            # Live weather layer (Open-Meteo) — window.WeatherAPI
│   ├── translate.js               # Translation endpoint handler (see note below)
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                        # Service worker (offline/app-shell caching)
│   ├── 404.html                      # Localized offline-friendly 404 page
│   ├── .env.example                   # Template for environment variables
│   ├── logo.png, icon-192.png, icon-512.png,
│   │   favicon.ico, favicon-16x16.png, favicon-32x32.png,
│   │   apple-touch-icon.png            # App icons
│   └── ...
│
└── Models/
    ├── main.py                # CLI entry point for the NLP prototype
    ├── nlp_model.py             # BasicAssistant: trains/loads the Keras intent classifier
    ├── intents.json              # Training intents (weather/hazard patterns)
    ├── requirements.txt           # Python dependencies
    ├── models/
    │   ├── nlp_model.keras         # Trained Keras model
    │   ├── nlp_model_words.pkl      # Saved vocabulary
    │   └── nlp_model_intents.pkl     # Saved intent labels
    └── __pycache__/                   # Compiled bytecode (safe to delete/ignore)
```

## Getting started (web app)

The frontend has no build step — it's static HTML/CSS/JS. A local server is still needed because the service worker only registers over `http(s)`, not `file://`.

```bash
cd Frontend
npx serve .
# then open the printed local URL in your browser
```

### Translation endpoint (optional)

`translate.js` handles translating non‑English voice input and is called by `app.js` at `/api/translate`. If you deploy on [Vercel](https://vercel.com), move (or symlink) it into an `api/` folder at the project root — Vercel turns any file there into a serverless function at that exact path, so nothing in `app.js` needs to change.

1. Copy the example env file and fill it in if you want higher-quality translation:
   ```bash
   cd Frontend
   cp .env.example .env.local
   ```
2. To use Google Cloud Translation instead of the default free MyMemory fallback, set `GOOGLE_TRANSLATE_API_KEY` in `.env.local` (see the setup steps in the comment at the top of `translate.js`), then redeploy.
3. Without a key, translation still works out of the box via MyMemory (lower volume limits, ~5,000 words/day per IP).

Deploying with Vercel:
```bash
vercel deploy
```

## Python NLP prototype (experimental)

A separate bag-of-words intent classifier (weather/hazard intents defined in `Models/intents.json`) trained with Keras. It is **not called by the web app** — it's a standalone command-line prototype.

```bash
cd Models
pip install -r requirements.txt
python main.py
```

On first run it trains a model from `intents.json` and saves it under `models/` (`nlp_model.keras` plus `_words.pkl` / `_intents.pkl`); subsequent runs load the saved model instead of retraining. Type a message at the prompt, or `STOP` to exit.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GOOGLE_TRANSLATE_API_KEY` | No | Enables Google Cloud Translation v2 in `translate.js`. Falls back to MyMemory if unset or if the call fails. |

## License

Add a license of your choice (e.g. MIT) here.
