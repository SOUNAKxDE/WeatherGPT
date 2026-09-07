/**
 * weather-api.js — Live weather data layer for WeatherGPT.
 *
 * Replaces the previous Math.sin()-based fake generators with real
 * conditions from Open-Meteo (https://open-meteo.com — free, no API key
 * required). Exposes a single global: window.WeatherAPI.
 *
 * Design goals:
 *   - Never block the UI: app.js renders instantly from CITIES (data.js)
 *     or a cached response, then re-renders when live data arrives.
 *   - Work offline-ish: failed/blocked requests fall back to the last
 *     cached reading (however old) rather than showing an error, since a
 *     weather+disaster app has to degrade gracefully on bad connections.
 *   - Match the exact shape the rest of app.js already expects (the same
 *     fields as a CITIES[...] entry, see data.js) so no other file needs
 *     to change its rendering logic.
 *
 * Load order: data.js, then weather-api.js, then app.js.
 */
(function (global) {
  "use strict";

  const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
  const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
  const CACHE_PREFIX = "weathergpt_wcache_";
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes — weather doesn't need to be more real-time than this for this app
  const FETCH_TIMEOUT_MS = 8000;

  // WMO weather codes -> our existing icon set + short description.
  // https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
  function codeToIcon(code, isDay) {
    if (code === 0) return { icon: isDay ? "clear" : "night", desc: "Clear sky" };
    if ([1, 2].includes(code)) return { icon: isDay ? "pcloud" : "night", desc: "Partly cloudy" };
    if (code === 3) return { icon: "cloud", desc: "Overcast" };
    if ([45, 48].includes(code)) return { icon: "fog", desc: "Fog" };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: "rain", desc: "Drizzle" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: "rain", desc: "Rain showers" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: "cloud", desc: "Snow" };
    if ([95, 96, 99].includes(code)) return { icon: "storm", desc: "Thunderstorms" };
    return { icon: "cloud", desc: "Cloudy" };
  }

  function withTimeout(promise, ms) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  async function fetchJson(url) {
    const res = await withTimeout(fetch(url), FETCH_TIMEOUT_MS);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  function cacheKey(locationLabel) {
    return CACHE_PREFIX + locationLabel.trim().toLowerCase();
  }

  function readCache(locationLabel) {
    try {
      const raw = localStorage.getItem(cacheKey(locationLabel));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function writeCache(locationLabel, payload) {
    try {
      localStorage.setItem(cacheKey(locationLabel), JSON.stringify({ ts: Date.now(), payload }));
    } catch (e) {
      /* localStorage full/unavailable — non-fatal, just skip caching */
    }
  }

  /** Look up lat/lon for a "City, State" style label. Biases toward India since that's this app's audience, but works generally. */
  async function geocode(locationLabel) {
    const cityName = locationLabel.split(",")[0].trim();
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`;
    const data = await fetchJson(url);
    const results = (data && data.results) || [];
    if (!results.length) throw new Error("Location not found: " + locationLabel);
    // Prefer an Indian result if the app's location field mentions a known Indian state; otherwise take the top hit.
    const stateHint = (locationLabel.split(",")[1] || "").trim().toLowerCase();
    const best =
      (stateHint && results.find(r => (r.admin1 || "").toLowerCase().includes(stateHint))) ||
      results.find(r => r.country_code === "IN") ||
      results[0];
    return { lat: best.latitude, lon: best.longitude, resolvedName: best.name };
  }

  async function fetchForecastAndAir(lat, lon) {
    const forecastUrl =
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,is_day` +
      `&hourly=temperature_2m,precipitation_probability,weather_code,uv_index` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
      `&timezone=auto&forecast_days=7`;
    const airUrl = `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi`;

    const [forecast, air] = await Promise.all([
      fetchJson(forecastUrl),
      fetchJson(airUrl).catch(() => null) // AQI is a bonus field — don't fail the whole request if this one endpoint hiccups
    ]);
    return { forecast, air };
  }

  function buildDayName(dateStr, index) {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short" });
  }

  /** Shapes raw Open-Meteo responses into the exact object shape app.js/data.js already use (see a CITIES[...] entry). */
  function shapeResponse(forecast, air, resolvedName) {
    const cur = forecast.current;
    const daily = forecast.daily;
    const hourly = forecast.hourly;
    const { icon, desc } = codeToIcon(cur.weather_code, cur.is_day === 1);

    const uvNow = (() => {
      // Find the closest hourly index to "now" for a live-ish UV reading.
      const idx = hourly.time.indexOf(cur.time) !== -1 ? hourly.time.indexOf(cur.time) : 0;
      return Math.round(hourly.uv_index[idx] || daily.uv_index_max[0] || 0);
    })();

    const base = {
      temp: Math.round(cur.temperature_2m),
      feels: Math.round(cur.apparent_temperature),
      hi: Math.round(daily.temperature_2m_max[0]),
      lo: Math.round(daily.temperature_2m_min[0]),
      humidity: Math.round(cur.relative_humidity_2m),
      wind: Math.round(cur.wind_speed_10m),
      rain: Math.round(daily.precipitation_probability_max[0] ?? 0),
      uv: uvNow,
      aqi: air && air.current ? Math.round(air.current.us_aqi) : 80, // neutral placeholder if the AQI endpoint failed
      pressure: Math.round(cur.surface_pressure),
      desc,
      icon,
      coastal: false,
      resolvedName,
      source: "live"
    };

    // Real hourly (next 24h starting from the current hour)
    const nowIdx = Math.max(0, hourly.time.indexOf(cur.time));
    const realHourly = [];
    for (let i = 0; i < 24; i++) {
      const idx = nowIdx + i;
      if (idx >= hourly.time.length) break;
      const t = new Date(hourly.time[idx]);
      const hourCode = hourly.weather_code[idx];
      const hourIsDay = t.getHours() >= 6 && t.getHours() <= 19;
      realHourly.push({
        time: i === 0 ? "Now" : t.toLocaleTimeString([], { hour: "numeric" }),
        temp: Math.round(hourly.temperature_2m[idx]),
        icon: codeToIcon(hourCode, hourIsDay).icon,
        rain: Math.round(hourly.precipitation_probability[idx] ?? 0)
      });
    }

    // Real daily (7 days from the API)
    const realDaily = daily.time.map((dateStr, i) => ({
      name: buildDayName(dateStr, i),
      icon: codeToIcon(daily.weather_code[i], true).icon,
      hi: Math.round(daily.temperature_2m_max[i]),
      lo: Math.round(daily.temperature_2m_min[i]),
      rain: Math.round(daily.precipitation_probability_max[i] ?? 0)
    }));

    return { ...base, realHourly, realDaily };
  }

  /**
   * Fetch live weather for a "City, State" label.
   * Resolves to a shaped weather object on success.
   * Resolves to a cached (possibly stale) object if the network call fails
   * but a previous cache entry exists.
   * Rejects only if there is truly nothing to show (no network AND no cache).
   */
  async function getLiveWeather(locationLabel) {
    const cached = readCache(locationLabel);
    const isFresh = cached && Date.now() - cached.ts < CACHE_TTL_MS;
    if (isFresh) return { ...cached.payload, stale: false };

    try {
      const { lat, lon, resolvedName } = await geocode(locationLabel);
      const { forecast, air } = await fetchForecastAndAir(lat, lon);
      const shaped = shapeResponse(forecast, air, resolvedName);
      writeCache(locationLabel, shaped);
      return { ...shaped, stale: false };
    } catch (err) {
      if (cached) {
        // Network/geocoding failed but we have something to show — better than nothing, and honest about it.
        return { ...cached.payload, stale: true };
      }
      throw err;
    }
  }

  /**
   * Search-as-you-type city lookup for the location pickers (Home's "Switch
   * location" popover and Settings' "Primary location" field). Returns a
   * small list of candidate places the user can pick from — unlike
   * getLiveWeather, this doesn't fetch a forecast, just resolves names to
   * coordinates so the UI can show real matches instead of a fixed list.
   */
  async function searchLocations(query) {
    const q = (query || "").trim();
    if (q.length < 2) return [];
    try {
      const url = `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
      const data = await fetchJson(url);
      const results = (data && data.results) || [];
      return results.map((r) => {
        const parts = [r.name];
        if (r.admin1) parts.push(r.admin1);
        if (r.country) parts.push(r.country);
        return { label: parts.join(", "), lat: r.latitude, lon: r.longitude };
      });
    } catch (err) {
      return []; // offline/blocked — caller should just show no suggestions, not an error
    }
  }

  global.WeatherAPI = { getLiveWeather, searchLocations };
})(window);
