/**
 * sw.js — Service worker for WeatherGPT.
 *
 * Goal: the parts of this app that matter most in a disaster (Emergency
 * SOS, Alerts, the last forecast you saw) should still open with no
 * connection at all, not just a browser error page.
 *
 * Strategy:
 *   - App shell (HTML/CSS/JS/icons): cache-first, so the app opens
 *     instantly and works offline; a network request still runs in the
 *     background to keep the cache fresh for next time.
 *   - Everything else (the live weather API, fonts, etc.): network-first,
 *     falling back to a cached copy if the network is unavailable.
 *
 * NOTE: service workers only register over HTTPS or http://localhost — not
 * over a plain file:// URL. Serve this folder with any static file server
 * (e.g. `npx serve`) to see offline support working locally.
 */
"use strict";

const CACHE_VERSION = "weathergpt-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./weather-api.js",
  "./app.js",
  "./manifest.json",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {
      /* If a single asset 404s this shouldn't block the whole SW from installing */
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_VERSION).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

function isAppShellRequest(url) {
  return url.origin === self.location.origin;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // don't intercept POSTs etc.

  const url = new URL(req.url);

  if (isAppShellRequest(url)) {
    // Cache-first for our own files, with a background revalidation.
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, res.clone()));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  } else {
    // Network-first for external calls (live weather, fonts): freshest data when online,
    // last-known response when not.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
