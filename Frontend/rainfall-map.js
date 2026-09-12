/**
 * rainfall-map.js — Live Rainfall Google Maps Engine for WeatherGPT (36 Official States & UTs)
 *
 * Implements real-time rainfall visualization across all 36 Indian States & Union Territories:
 *  - Google Maps Platform JavaScript API (AdvancedMarkerElement + mapId)
 *  - 36 Official State & Union Territory Meteorological Stations (28 States + 8 UTs)
 *  - Categorized color pins (🔴 Heavy, 🟡 Moderate, 🟢 Light, ⚪ Dry)
 *  - Dynamic precipitation radius circles
 *  - Live batch Open-Meteo precipitation metrics & forecast trends
 *  - RainViewer real-time Doppler radar tile overlays with zoom-safe capping (z <= 7)
 *  - High-zoom graceful fallback with quick 'Reset to Radar' navigation
 *  - Auto-refresh polling with live countdown timer
 *  - Search, state filtering, and GPS geolocation
 */

(function () {
  'use strict';

  // Config & Constants
  const STORAGE_KEY_API_KEY = 'weathergpt_gmaps_api_key';
  const DEFAULT_REFRESH_INTERVAL_SEC = 60;
  const USAGE_ATTRIBUTION_ID = 'gmp_git_agentskills_v1';
  const RADAR_MAX_SUPPORTED_ZOOM = 7; // RainViewer free API hard ceiling

  // Rainfall Rate Classification Thresholds (IMD & WMO Standards in mm/hour)
  const THRESHOLDS = {
    HEAVY: 7.5,     // > 7.5 mm/h: Heavy rainfall / Alert
    MODERATE: 2.5,  // 2.5 - 7.5 mm/h: Moderate rainfall
    LIGHT: 0.1      // 0.1 - 2.5 mm/h: Light rain / Drizzle
                    // < 0.1 mm/h: Dry / Trace
  };

  // Color Palette & Visual Style Tokens
  const COLORS = {
    heavy: { hex: '#ef4444', border: '#b91c1c', bg: 'rgba(239, 68, 68, 0.25)', circleRadius: 32000 },
    moderate: { hex: '#f59e0b', border: '#d97706', bg: 'rgba(245, 158, 11, 0.20)', circleRadius: 22000 },
    light: { hex: '#10b981', border: '#059669', bg: 'rgba(16, 185, 129, 0.16)', circleRadius: 16000 },
    dry: { hex: '#64748b', border: '#475569', bg: 'rgba(100, 116, 139, 0.08)', circleRadius: 10000 }
  };
  const RAIN_COLORS = COLORS;

  // All 36 Official Indian States (28) & Union Territories (8)
  const INITIAL_STATIONS = [
    { id: 'andaman_nicobar', name: 'Andaman & Nicobar Islands', region: 'Port Blair (UT)', lat: 11.6234, lng: 92.7265, isUT: true },
    { id: 'andhra_pradesh', name: 'Andhra Pradesh', region: 'Amaravati / Coastal AP', lat: 16.5417, lng: 80.5158 },
    { id: 'arunachal_pradesh', name: 'Arunachal Pradesh', region: 'Itanagar', lat: 27.0844, lng: 93.6053 },
    { id: 'assam', name: 'Assam', region: 'Guwahati / Dispur', lat: 26.1445, lng: 91.7362 },
    { id: 'bihar', name: 'Bihar', region: 'Patna', lat: 25.5941, lng: 85.1376 },
    { id: 'chandigarh', name: 'Chandigarh', region: 'Chandigarh Capital (UT)', lat: 30.7333, lng: 76.7794, isUT: true },
    { id: 'chhattisgarh', name: 'Chhattisgarh', region: 'Raipur', lat: 21.2514, lng: 81.6296 },
    { id: 'dadra_nagar_daman_diu', name: 'Dadra & Nagar Haveli and Daman & Diu', region: 'Daman (UT)', lat: 20.4283, lng: 72.8397, isUT: true },
    { id: 'delhi', name: 'Delhi NCR', region: 'New Delhi (National Capital / UT)', lat: 28.6139, lng: 77.2090, isUT: true },
    { id: 'goa', name: 'Goa', region: 'Panaji / Konkan Coast', lat: 15.4909, lng: 73.8278 },
    { id: 'gujarat', name: 'Gujarat', region: 'Gandhinagar / Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { id: 'haryana', name: 'Haryana', region: 'Gurugram / Panchkula', lat: 28.4595, lng: 77.0266 },
    { id: 'himachal_pradesh', name: 'Himachal Pradesh', region: 'Shimla', lat: 31.1048, lng: 77.1734 },
    { id: 'jammu_kashmir', name: 'Jammu & Kashmir', region: 'Srinagar / Jammu (UT)', lat: 34.0837, lng: 74.7973, isUT: true },
    { id: 'jharkhand', name: 'Jharkhand', region: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    { id: 'karnataka', name: 'Karnataka', region: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { id: 'kerala', name: 'Kerala', region: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    { id: 'ladakh', name: 'Ladakh', region: 'Leh (UT)', lat: 34.1526, lng: 77.5771, isUT: true },
    { id: 'lakshadweep', name: 'Lakshadweep', region: 'Kavaratti (UT)', lat: 10.5667, lng: 72.6417, isUT: true },
    { id: 'madhya_pradesh', name: 'Madhya Pradesh', region: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    { id: 'maharashtra', name: 'Maharashtra', region: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { id: 'manipur', name: 'Manipur', region: 'Imphal', lat: 24.8170, lng: 93.9368 },
    { id: 'meghalaya', name: 'Meghalaya', region: 'Shillong / Cherrapunji', lat: 25.5788, lng: 91.8933 },
    { id: 'mizoram', name: 'Mizoram', region: 'Aizawl', lat: 23.7271, lng: 92.7176 },
    { id: 'nagaland', name: 'Nagaland', region: 'Kohima', lat: 25.6751, lng: 94.1086 },
    { id: 'odisha', name: 'Odisha', region: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    { id: 'puducherry', name: 'Puducherry', region: 'Puducherry (UT)', lat: 11.9416, lng: 79.8083, isUT: true },
    { id: 'punjab', name: 'Punjab', region: 'Amritsar / Ludhiana', lat: 31.6340, lng: 74.8723 },
    { id: 'rajasthan', name: 'Rajasthan', region: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { id: 'sikkim', name: 'Sikkim', region: 'Gangtok', lat: 27.3389, lng: 88.6065 },
    { id: 'tamil_nadu', name: 'Tamil Nadu', region: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { id: 'telangana', name: 'Telangana', region: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { id: 'tripura', name: 'Tripura', region: 'Agartala', lat: 23.8315, lng: 91.2868 },
    { id: 'uttar_pradesh', name: 'Uttar Pradesh', region: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { id: 'uttarakhand', name: 'Uttarakhand', region: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    { id: 'west_bengal', name: 'West Bengal', region: 'Kolkata', lat: 22.5726, lng: 88.3639 }
  ];

  // State Management
  const state = {
    stations: [...INITIAL_STATIONS],
    stationData: new Map(), // stationId -> weather metrics
    activeFilter: 'all',    // 'all' | 'heavy' | 'moderate' | 'light'
    searchQuery: '',
    selectedStationId: null,

    // Google Maps Instances
    map: null,
    advancedMarkerLibrary: null,
    markers: new Map(),     // stationId -> AdvancedMarkerElement
    circles: new Map(),     // stationId -> google.maps.Circle
    infoWindow: null,

    // Auto-refresh timer
    refreshCountdown: DEFAULT_REFRESH_INTERVAL_SEC,
    refreshIntervalId: null,
    isPaused: false,

    // Radar Overlay State
    radarLayer: null,
    radarFrames: [],
    radarCurrentFrameIndex: 0,
    radarIsPlaying: false,
    radarPlayTimer: null,
    radarHost: 'https://tilecache.rainviewer.com',
    radarVisible: true
  };

  // DOM Elements
  const el = {};

  function initDOMElements() {
    el.mapContainer = document.getElementById('map');
    el.placesList = document.getElementById('placesList');
    el.placesCount = document.getElementById('placesCount');
    el.lastUpdatedTime = document.getElementById('lastUpdatedTime');
    el.refreshTimer = document.getElementById('refreshTimer');
    el.btnRefresh = document.getElementById('btnRefresh');
    el.searchInput = document.getElementById('stationSearch');
    el.statAll = document.getElementById('statAll');
    el.statHeavy = document.getElementById('statHeavy');
    el.statModerate = document.getElementById('statModerate');
    el.statLight = document.getElementById('statLight');
    el.countAll = document.getElementById('countAll');
    el.countHeavy = document.getElementById('countHeavy');
    el.countModerate = document.getElementById('countModerate');
    el.countLight = document.getElementById('countLight');

    // Zoom & Radar Status Elements
    el.zoomRadarStatus = document.getElementById('zoomRadarStatus');
    el.zoomRadarText = document.getElementById('zoomRadarText');
    el.btnResetRadarZoom = document.getElementById('btnResetRadarZoom');

    // Radar Player Elements
    el.radarToggle = document.getElementById('radarToggle');
    el.btnPlayRadar = document.getElementById('btnPlayRadar');
    el.radarSlider = document.getElementById('radarSlider');
    el.radarTimeLabel = document.getElementById('radarTimeLabel');

    // Modal Elements
    el.btnOpenKeyModal = document.getElementById('btnOpenKeyModal');
    el.apiKeyModal = document.getElementById('apiKeyModal');
    el.btnCloseKeyModal = document.getElementById('btnCloseKeyModal');
    el.apiKeyInput = document.getElementById('apiKeyInput');
    el.btnSaveApiKey = document.getElementById('btnSaveApiKey');
    el.btnUseDemoKey = document.getElementById('btnUseDemoKey');
  }

  // =========================================================================
  // Google Maps Initialization & Loader
  // =========================================================================

  function getActiveApiKey() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('key')) return urlParams.get('key');
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  }

  function showMapOverlayBanner(message) {
    if (!el.mapContainer) return;
    const existing = document.getElementById('mapOverlayNotice');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'mapOverlayNotice';
    banner.style.cssText = `
      position: absolute;
      top: 4.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(18, 22, 31, 0.95);
      border: 1px solid #c98f4e;
      color: #fcd34d;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 500;
      z-index: 25;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
    `;
    banner.innerHTML = `
      <span>⚠️</span>
      <span>${message}</span>
      <button id="btnBannerOpenKey" style="background:#4bacce; color:#04141c; border:none; padding:0.25rem 0.6rem; border-radius:4px; font-weight:600; cursor:pointer; font-size:0.75rem;">Set Key</button>
    `;
    el.mapContainer.parentElement.appendChild(banner);

    document.getElementById('btnBannerOpenKey')?.addEventListener('click', () => {
      showApiKeyModal();
    });
  }

  async function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) {
        resolve(true);
        return;
      }

      // Modern Google Maps Dynamic Bootstrap Loader
      (function(g){
        var f,h,a,k="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;
        b=b[c]||(b[c]={});
        var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,
        u=()=>f||(f=new Promise(async(f,n)=>{
          await (a=m.createElement("script"));
          e.set("libraries",[...r]+"");
          for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
          e.set("callback",c+".maps."+q);
          a.src=`https://maps.${c}apis.com/maps/api/js?`+e;
          d[q]=f;
          a.onerror=()=>h=n(Error(k+" could not load."));
          a.nonce=m.querySelector("script[nonce]")?.nonce||"";
          m.head.append(a);
        }));
        d[l]?console.warn(k+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n));
      })({
        key: apiKey || '',
        v: 'weekly',
        authReferrerPolicy: 'origin'
      });

      // Verification timeout
      setTimeout(() => {
        if (window.google && window.google.maps) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1500);
    });
  }

  async function initializeApp() {
    initDOMElements();
    bindEventHandlers();

    // Populate API Key in input if present
    const existingKey = getActiveApiKey();
    if (el.apiKeyInput && existingKey) {
      el.apiKeyInput.value = existingKey;
    }

    // Set initial timestamp immediately so '--:--:--' is updated right away
    if (el.lastUpdatedTime) {
      const initDate = new Date();
      el.lastUpdatedTime.textContent = initDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (el.lastUpdatedTime.parentElement) {
        el.lastUpdatedTime.parentElement.title = `Initialized at ${initDate.toLocaleString()}`;
      }
    }

    // Load Maps SDK
    const mapsReady = await loadGoogleMapsScript(existingKey);

    if (!mapsReady || !window.google || !window.google.maps) {
      showMapOverlayBanner('Google Maps Platform key required for full map canvas. Click "API Key" to add your key or get a free Maps Demo Key.');
    }

    await initMap();
    await fetchLiveRainfallData();
    await initRadarTiles();
    startRefreshTimer();
  }

  async function initMap() {
    if (!window.google || !window.google.maps) return;

    // Load modern libraries
    try {
      const { Map } = await google.maps.importLibrary('maps');
      state.advancedMarkerLibrary = await google.maps.importLibrary('marker');
    } catch (e) {
      console.warn('Google Maps importLibrary fallback:', e);
    }

    // Create Map with mandatory mapId for AdvancedMarkerElement
    const MapClass = (window.google.maps.maps && window.google.maps.maps.Map) || google.maps.Map;
    state.map = new MapClass(el.mapContainer, {
      center: { lat: 22.0, lng: 82.5 }, // Geographical centroid of India
      zoom: 5,
      mapId: 'WEATHERGPT_MAP_ID',
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      minZoom: 4,
      maxZoom: 16,
      restriction: {
        latLngBounds: {
          north: 37.8,
          south: 6.0,
          west: 67.0,
          east: 98.5
        },
        strictBounds: false
      },
      // Deep obsidian palette aligned with WeatherGPT index.html
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#0d1119' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0d13' }, { weight: 2.5 }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8991a3' }] },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#4bacce' }, { weight: 1.2 }]
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#e7eaf1' }]
        },
        {
          featureType: 'administrative.province',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#232838' }, { weight: 1.0 }]
        },
        {
          featureType: 'administrative.province',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#cbd5e1' }]
        },
        {
          featureType: 'administrative.province',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#0a0d13' }, { weight: 3 }]
        },
        {
          featureType: 'administrative.province',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#e7eaf1' }]
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#0a0d13' }, { weight: 2 }]
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#161b28' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#11151f' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#06080d' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#475569' }]
        }
      ]
    });

    state.infoWindow = new google.maps.InfoWindow({
      maxWidth: 320
    });

    // Close infoWindow when clicking on map
    state.map.addListener('click', () => {
      state.infoWindow.close();
      state.selectedStationId = null;
      updateSidebarSelection();
    });

    // Listen for zoom changes to update radar status & show helpful guidance
    state.map.addListener('zoom_changed', () => {
      updateZoomRadarStatus();
    });

    // Render markers if data is already available
    if (state.stationData.size > 0) {
      renderMarkers();
    }

    updateZoomRadarStatus();
  }

  function updateZoomRadarStatus() {
    if (!state.map || !el.zoomRadarStatus || !el.zoomRadarText) return;

    const zoom = state.map.getZoom();

    if (zoom <= RADAR_MAX_SUPPORTED_ZOOM) {
      el.zoomRadarStatus.classList.remove('high-zoom');
      el.zoomRadarText.textContent = `Doppler Radar Active · Regional (Zoom ${zoom}/7)`;
      if (el.btnResetRadarZoom) el.btnResetRadarZoom.style.display = 'none';
    } else {
      el.zoomRadarStatus.classList.add('high-zoom');
      el.zoomRadarText.textContent = `🔍 Station Detail Mode (Zoom ${zoom}) · Radar paused above z7`;
      if (el.btnResetRadarZoom) el.btnResetRadarZoom.style.display = 'inline-block';
    }
  }

  // =========================================================================
  // Live Weather / Rainfall API (Open-Meteo Multi-location Batch)
  // =========================================================================

  async function fetchLiveRainfallData() {
    setLoadingState(true);

    try {
      const lats = state.stations.map(s => s.lat.toFixed(4)).join(',');
      const lngs = state.stations.map(s => s.lng.toFixed(4)).join(',');

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,weather_code,wind_speed_10m` +
        `&hourly=precipitation,precipitation_probability&forecast_hours=12`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const results = Array.isArray(data) ? data : [data];

      state.stations.forEach((station, idx) => {
        const res = results[idx] || {};
        const cur = res.current || {};
        const hourly = res.hourly || {};

        // Precipitation rate in mm/hour
        const rainRate = typeof cur.precipitation === 'number' ? cur.precipitation : 0;
        const category = classifyRainfall(rainRate);

        // Previous reading for delta trend
        const previousData = state.stationData.get(station.id);
        const previousRate = previousData ? previousData.rainRate : rainRate;
        let trend = 'steady';
        if (rainRate > previousRate + 0.2) trend = 'rising';
        else if (rainRate < previousRate - 0.2) trend = 'falling';

        state.stationData.set(station.id, {
          station,
          rainRate: parseFloat(rainRate.toFixed(1)),
          category,
          trend,
          temperature: Math.round(cur.temperature_2m ?? 28),
          humidity: Math.round(cur.relative_humidity_2m ?? 78),
          windSpeed: Math.round(cur.wind_speed_10m ?? 14),
          weatherCode: cur.weather_code ?? 0,
          hourlyRain: hourly.precipitation ? hourly.precipitation.slice(0, 6) : [],
          hourlyProb: hourly.precipitation_probability ? hourly.precipitation_probability.slice(0, 6) : [],
          lastUpdated: new Date()
        });
      });

      updateStatsSummary();
      renderSidebarList();

      if (el.lastUpdatedTime) {
        const now = new Date();
        el.lastUpdatedTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (el.lastUpdatedTime.parentElement) {
          el.lastUpdatedTime.parentElement.title = `Last synced at ${now.toLocaleString()}`;
        }
      }

      resetCountdown();

      try {
        if (state.map) {
          renderMarkers();
        }
      } catch (markerErr) {
        console.warn('Map marker rendering notice:', markerErr);
      }
    } catch (err) {
      console.error('Error fetching live rainfall metrics from Open-Meteo:', err);
    } finally {
      setLoadingState(false);
    }
  }

  function classifyRainfall(mmPerHour) {
    if (mmPerHour > THRESHOLDS.HEAVY) return 'heavy';
    if (mmPerHour >= THRESHOLDS.MODERATE) return 'moderate';
    if (mmPerHour >= THRESHOLDS.LIGHT) return 'light';
    return 'dry';
  }

  function getCategoryLabel(category) {
    switch (category) {
      case 'heavy': return 'Heavy Rain';
      case 'moderate': return 'Moderate Rain';
      case 'light': return 'Light Rain';
      default: return 'Dry / Trace';
    }
  }

  function getAdvisoryText(category, rate) {
    switch (category) {
      case 'heavy':
        return `⚠️ High alert: ${rate} mm/h rainfall recorded. Risk of urban waterlogging, reduced visibility, and localized flash floods in low-lying areas.`;
      case 'moderate':
        return `🌧️ Moderate rain (${rate} mm/h). Wet road surfaces, carry umbrella and allow extra transit time.`;
      case 'light':
        return `🌦️ Light precipitation (${rate} mm/h). Minor drizzling observed, routine outdoor operations normal.`;
      default:
        return `🌤️ Clear or dry conditions (< 0.1 mm/h). No precipitation currently detected.`;
    }
  }

  // =========================================================================
  // Marker & Circle Map Rendering
  // =========================================================================

  function renderMarkers() {
    if (!state.map) return;
    const AdvancedMarkerElement = state.advancedMarkerLibrary?.AdvancedMarkerElement || window.google?.maps?.marker?.AdvancedMarkerElement;

    state.stations.forEach(station => {
      const data = state.stationData.get(station.id);
      if (!data) return;

      const isVisible = (state.activeFilter === 'all' || state.activeFilter === data.category) &&
        (!state.searchQuery ||
         station.name.toLowerCase().includes(state.searchQuery) ||
         station.region.toLowerCase().includes(state.searchQuery));

      const style = COLORS[data.category] || COLORS.dry;

      // 1. Create or Update AdvancedMarkerElement or standard Marker
      let marker = state.markers.get(station.id);

      if (AdvancedMarkerElement) {
        if (!marker || !(marker instanceof AdvancedMarkerElement)) {
          const markerPin = document.createElement('div');
          markerPin.className = `rain-marker-pin marker-${data.category}`;
          markerPin.setAttribute('data-station-id', station.id);

          const bubble = document.createElement('div');
          bubble.className = 'marker-bubble';
          bubble.innerHTML = getMarkerBubbleContent(data);
          markerPin.appendChild(bubble);

          marker = new AdvancedMarkerElement({
            map: isVisible ? state.map : null,
            position: { lat: station.lat, lng: station.lng },
            title: `${station.name} (${station.region}) — ${data.rainRate} mm/h`,
            content: markerPin
          });

          // Click handler
          marker.addListener('click', () => {
            onStationClick(station.id);
          });

          state.markers.set(station.id, marker);
        } else {
          marker.map = isVisible ? state.map : null;
          const pin = marker.content;
          if (pin) {
            pin.className = `rain-marker-pin marker-${data.category}`;
            const bubble = pin.querySelector('.marker-bubble');
            if (bubble) bubble.innerHTML = getMarkerBubbleContent(data);
          }
        }
      } else if (window.google?.maps?.Marker) {
        // Fallback for standard Marker with label
        if (!marker || (window.google.maps.marker && marker instanceof AdvancedMarkerElement)) {
          marker = new google.maps.Marker({
            map: isVisible ? state.map : null,
            position: { lat: station.lat, lng: station.lng },
            title: `${station.name} (${station.region}) — ${data.rainRate} mm/h`,
            label: {
              text: `${station.name} (${data.rainRate} mm/h)`,
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 'bold'
            }
          });

          marker.addListener('click', () => {
            onStationClick(station.id);
          });

          state.markers.set(station.id, marker);
        } else {
          marker.setMap(isVisible ? state.map : null);
          if (marker.setLabel) {
            marker.setLabel({
              text: `${station.name} (${data.rainRate} mm/h)`,
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 'bold'
            });
          }
        }
      }

      // 2. Create or Update Dynamic Precipitation Circles
      if (window.google?.maps?.Circle) {
        let circle = state.circles.get(station.id);

        if (!circle) {
          circle = new google.maps.Circle({
            map: isVisible ? state.map : null,
            center: { lat: station.lat, lng: station.lng },
            radius: style.circleRadius,
            fillColor: style.hex,
            fillOpacity: data.category === 'heavy' ? 0.32 : data.category === 'moderate' ? 0.24 : data.category === 'light' ? 0.16 : 0.05,
            strokeColor: style.border,
            strokeOpacity: 0.75,
            strokeWeight: 1.5,
            clickable: false
          });
          state.circles.set(station.id, circle);
        } else {
          circle.setMap(isVisible ? state.map : null);
          circle.setOptions({
            fillColor: style.hex,
            strokeColor: style.border,
            radius: style.circleRadius,
            fillOpacity: data.category === 'heavy' ? 0.32 : data.category === 'moderate' ? 0.24 : data.category === 'light' ? 0.16 : 0.05
          });
        }
      }
    });
  }

  function getMarkerBubbleContent(data) {
    const icon = data.category === 'heavy' ? '🌧️' : data.category === 'moderate' ? '🌦️' : data.category === 'light' ? '🌦️' : '☀️';
    return `<span class="marker-icon">${icon}</span><span class="marker-name">${escapeHtml(data.station.name)}</span><span class="marker-val">${data.rainRate} mm/h</span>`;
  }

  function onStationClick(stationId) {
    state.selectedStationId = stationId;
    const station = state.stations.find(s => s.id === stationId);
    const data = state.stationData.get(stationId);
    if (!station || !data) return;

    // Smooth pan to location
    state.map.panTo({ lat: station.lat, lng: station.lng });

    // Open InfoWindow
    openInfoWindow(station, data);

    // Highlight card in sidebar & scroll into view
    updateSidebarSelection();
  }

  function openInfoWindow(station, data) {
    const marker = state.markers.get(station.id);
    if (!marker) return;

    const contentHtml = `
      <div class="info-card">
        <div class="info-card-header">
          <div class="info-city">${escapeHtml(station.name)}</div>
          <div class="info-sub">${escapeHtml(station.region)}, India</div>
        </div>
        <div class="info-rate-box ${data.category}">
          <div>
            <div class="info-rate-val">${data.rainRate} <span style="font-size:0.75rem">mm/h</span></div>
            <div class="info-rate-label">${getCategoryLabel(data.category)}</div>
          </div>
          <div style="font-size:1.6rem">
            ${data.category === 'heavy' ? '⛈️' : data.category === 'moderate' ? '🌧️' : data.category === 'light' ? '🌦️' : '🌤️'}
          </div>
        </div>
        <div class="info-grid">
          <div class="info-grid-item">
            <div class="info-grid-label">Temperature</div>
            <div class="info-grid-val">${data.temperature}°C</div>
          </div>
          <div class="info-grid-item">
            <div class="info-grid-label">Humidity</div>
            <div class="info-grid-val">${data.humidity}%</div>
          </div>
          <div class="info-grid-item">
            <div class="info-grid-label">Wind Speed</div>
            <div class="info-grid-val">${data.windSpeed} km/h</div>
          </div>
          <div class="info-grid-item">
            <div class="info-grid-label">Trend</div>
            <div class="info-grid-val" style="text-transform:capitalize">${data.trend}</div>
          </div>
        </div>
        <div class="info-advisory ${data.category}">
          ${getAdvisoryText(data.category, data.rainRate)}
        </div>
      </div>
    `;

    state.infoWindow.setContent(contentHtml);
    state.infoWindow.open({
      anchor: marker,
      map: state.map
    });
  }

  // =========================================================================
  // Sidebar List & Stats Rendering (Uncluttered & Clean Spacing)
  // =========================================================================

  function renderSidebarList() {
    const list = Array.from(state.stationData.values());

    // Sort by highest rainfall rate first
    list.sort((a, b) => b.rainRate - a.rainRate);

    const filtered = list.filter(item => {
      const matchesFilter = state.activeFilter === 'all' || state.activeFilter === item.category;
      const matchesSearch = !state.searchQuery ||
        item.station.name.toLowerCase().includes(state.searchQuery) ||
        item.station.region.toLowerCase().includes(state.searchQuery);
      return matchesFilter && matchesSearch;
    });

    el.placesCount.textContent = `${filtered.length} states & territories`;

    if (filtered.length === 0) {
      el.placesList.innerHTML = `
        <div style="text-align:center; padding: 3rem 1rem; color: var(--text-dim); font-size: 0.85rem">
          No Indian states or union territories found matching your search.
        </div>
      `;
      return;
    }

    el.placesList.innerHTML = filtered.map(item => {
      const isSelected = item.station.id === state.selectedStationId;
      const trendSymbol = item.trend === 'rising' ? '▲' : item.trend === 'falling' ? '▼' : '●';
      const trendColor = item.trend === 'rising' ? '#ef4444' : item.trend === 'falling' ? '#10b981' : '#8991a3';

      return `
        <div class="place-card ${item.category} ${isSelected ? 'selected' : ''}" data-station-id="${item.station.id}">
          <div class="place-card-top">
            <div>
              <div class="place-name">${escapeHtml(item.station.name)}</div>
              <div class="place-region">📍 ${escapeHtml(item.station.region)}</div>
            </div>
            <div class="rain-badge ${item.category}">
              ${item.rainRate} mm/h
            </div>
          </div>
          <div class="place-card-bottom">
            <div class="card-details">
              <span>🌡️ ${item.temperature}°C</span>
              <span>💧 ${item.humidity}%</span>
              <span style="color:${trendColor}">${trendSymbol} ${item.trend}</span>
            </div>
            <span style="font-weight:600; font-size:0.72rem; color: var(--text-dim); text-transform: uppercase;">
              ${getCategoryLabel(item.category)}
            </span>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to cards
    el.placesList.querySelectorAll('.place-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-station-id');
        onStationClick(id);
      });
    });
  }

  function updateSidebarSelection() {
    el.placesList.querySelectorAll('.place-card').forEach(card => {
      const id = card.getAttribute('data-station-id');
      if (id === state.selectedStationId) {
        card.classList.add('selected');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('selected');
      }
    });
  }

  function updateStatsSummary() {
    let heavy = 0;
    let moderate = 0;
    let light = 0;
    let dry = 0;

    state.stationData.forEach(d => {
      if (d.category === 'heavy') heavy++;
      else if (d.category === 'moderate') moderate++;
      else if (d.category === 'light') light++;
      else dry++;
    });

    el.countAll.textContent = state.stationData.size;
    el.countHeavy.textContent = heavy;
    el.countModerate.textContent = moderate;
    el.countLight.textContent = light;
  }

  // =========================================================================
  // RainViewer Real-Time Doppler Radar Tile Layer (Safe Zoom Handling)
  // =========================================================================

  async function initRadarTiles() {
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      if (!res.ok) return;
      const data = await res.json();

      state.radarHost = data.host || 'https://tilecache.rainviewer.com';
      const pastFrames = data.radar?.past || [];
      const nowcastFrames = data.radar?.nowcast || [];
      state.radarFrames = [...pastFrames, ...nowcastFrames];

      if (state.radarFrames.length > 0) {
        state.radarCurrentFrameIndex = pastFrames.length > 0 ? pastFrames.length - 1 : 0;
        el.radarSlider.max = state.radarFrames.length - 1;
        el.radarSlider.value = state.radarCurrentFrameIndex;
        updateRadarTimeLabel();

        if (state.map && state.radarVisible) {
          applyRadarLayer();
        }
      }
    } catch (e) {
      console.warn('Could not initialize RainViewer radar tiles:', e);
    }
  }

  function applyRadarLayer() {
    if (!state.map || state.radarFrames.length === 0) return;

    const frame = state.radarFrames[state.radarCurrentFrameIndex];
    if (!frame) return;

    // Remove existing radar overlay if any
    if (state.radarLayer) {
      state.map.overlayMapTypes.clear();
      state.radarLayer = null;
    }

    if (!state.radarVisible) return;

    // Create ImageMapType for RainViewer with maxZoom: 7
    // Crucial: RainViewer free public API strictly caps at zoom level 7.
    // Returning null for zoom > 7 prevents downloading 'Zoom Level Not Supported' grey tiles!
    state.radarLayer = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        if (zoom > RADAR_MAX_SUPPORTED_ZOOM || zoom < 0) {
          return null; // Suppresses 404 / 'Zoom Level Not Supported' tiles
        }
        return `${state.radarHost}${frame.path}/256/${zoom}/${coord.x}/${coord.y}/2/1_1.png`;
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.65,
      maxZoom: RADAR_MAX_SUPPORTED_ZOOM,
      name: 'RainViewerRadar'
    });

    state.map.overlayMapTypes.insertAt(0, state.radarLayer);
    updateRadarTimeLabel();
    updateZoomRadarStatus();
  }

  function updateRadarTimeLabel() {
    const frame = state.radarFrames[state.radarCurrentFrameIndex];
    if (!frame || !el.radarTimeLabel) return;
    const date = new Date(frame.time * 1000);
    const isNowcast = state.radarCurrentFrameIndex >= (state.radarFrames.length - 3);
    el.radarTimeLabel.textContent = `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${isNowcast ? '(Forecast)' : '(Observed)'}`;
  }

  function toggleRadarPlayback() {
    if (state.radarIsPlaying) {
      stopRadarPlayback();
    } else {
      startRadarPlayback();
    }
  }

  function startRadarPlayback() {
    if (state.radarFrames.length === 0) return;
    state.radarIsPlaying = true;
    el.btnPlayRadar.innerHTML = '⏸';
    el.btnPlayRadar.title = 'Pause radar animation';

    state.radarPlayTimer = setInterval(() => {
      state.radarCurrentFrameIndex = (state.radarCurrentFrameIndex + 1) % state.radarFrames.length;
      el.radarSlider.value = state.radarCurrentFrameIndex;
      applyRadarLayer();
    }, 800);
  }

  function stopRadarPlayback() {
    state.radarIsPlaying = false;
    el.btnPlayRadar.innerHTML = '▶';
    el.btnPlayRadar.title = 'Play radar animation';
    if (state.radarPlayTimer) {
      clearInterval(state.radarPlayTimer);
      state.radarPlayTimer = null;
    }
  }

  // =========================================================================
  // Search, Geocoding & Custom Station Adding
  // =========================================================================

  async function handleSearch(query) {
    state.searchQuery = query.trim().toLowerCase();
    renderSidebarList();
    renderMarkers();

    // If no match in existing list and query is longer than 2 chars, suggest geocoding in India
    const found = state.stations.some(s => s.name.toLowerCase().includes(state.searchQuery));
    if (!found && query.trim().length >= 3) {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=1&country=IN&language=en&format=json`;
        const res = await fetch(geoUrl);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const loc = data.results[0];
          const newStation = {
            id: `custom_${Date.now()}`,
            name: loc.name,
            region: [loc.admin1, loc.country].filter(Boolean).join(', '),
            lat: loc.latitude,
            lng: loc.longitude
          };

          state.stations.unshift(newStation);
          state.searchQuery = '';
          el.searchInput.value = '';
          await fetchLiveRainfallData();
          onStationClick(newStation.id);
        }
      } catch (err) {
        console.warn('Indian geocoding search failed:', err);
      }
    }
  }

  function locateUser() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const userStation = {
        id: 'user_location',
        name: 'My Current Location',
        region: 'GPS Coordinates',
        lat,
        lng
      };

      const existingIdx = state.stations.findIndex(s => s.id === 'user_location');
      if (existingIdx !== -1) {
        state.stations[existingIdx] = userStation;
      } else {
        state.stations.unshift(userStation);
      }

      await fetchLiveRainfallData();
      onStationClick(userStation.id);
    }, (err) => {
      alert('Unable to retrieve your location: ' + err.message);
    });
  }

  // =========================================================================
  // Timer & Event Listeners
  // =========================================================================

  function startRefreshTimer() {
    if (state.refreshIntervalId) clearInterval(state.refreshIntervalId);

    state.refreshIntervalId = setInterval(() => {
      if (state.isPaused) return;

      state.refreshCountdown--;
      if (el.refreshTimer) {
        el.refreshTimer.textContent = `${state.refreshCountdown}s`;
      }

      if (state.refreshCountdown <= 0) {
        fetchLiveRainfallData();
      }
    }, 1000);
  }

  function resetCountdown() {
    state.refreshCountdown = DEFAULT_REFRESH_INTERVAL_SEC;
    if (el.refreshTimer) {
      el.refreshTimer.textContent = `${state.refreshCountdown}s`;
    }
  }

  function setLoadingState(loading) {
    if (el.btnRefresh) {
      if (loading) {
        el.btnRefresh.style.opacity = '0.6';
        el.btnRefresh.textContent = 'Updating...';
      } else {
        el.btnRefresh.style.opacity = '1';
        el.btnRefresh.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> <span>Refresh</span>';
      }
    }
  }

  function bindEventHandlers() {
    // Refresh Button
    if (el.btnRefresh) {
      el.btnRefresh.addEventListener('click', () => {
        fetchLiveRainfallData();
      });
    }

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter');
        renderSidebarList();
        renderMarkers();
      });
    });

    // Stat Banner Pills (Header)
    const pills = [
      { element: el.statAll, filter: 'all' },
      { element: el.statHeavy, filter: 'heavy' },
      { element: el.statModerate, filter: 'moderate' },
      { element: el.statLight, filter: 'light' }
    ];

    pills.forEach(({ element, filter }) => {
      if (!element) return;
      element.addEventListener('click', () => {
        state.activeFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-filter') === filter);
        });
        renderSidebarList();
        renderMarkers();
      });
    });

    // Search Input
    if (el.searchInput) {
      el.searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
      });
      el.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearch(e.target.value);
        }
      });
    }

    // Locate Me Button
    const btnLocate = document.getElementById('btnLocateMe');
    if (btnLocate) {
      btnLocate.addEventListener('click', locateUser);
    }

    // Reset Zoom to Radar Button
    if (el.btnResetRadarZoom) {
      el.btnResetRadarZoom.addEventListener('click', () => {
        if (state.map) {
          state.map.setZoom(6);
        }
      });
    }

    // Map Style Switcher (Dark, Satellite, Terrain)
    document.querySelectorAll('.map-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.map-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-type');
        if (state.map) {
          if (type === 'satellite') {
            state.map.setMapTypeId('satellite');
          } else if (type === 'terrain') {
            state.map.setMapTypeId('terrain');
          } else {
            state.map.setMapTypeId('roadmap');
          }
        }
      });
    });

    // Radar Player Controls
    if (el.btnPlayRadar) {
      el.btnPlayRadar.addEventListener('click', toggleRadarPlayback);
    }
    if (el.radarSlider) {
      el.radarSlider.addEventListener('input', (e) => {
        stopRadarPlayback();
        state.radarCurrentFrameIndex = parseInt(e.target.value, 10);
        applyRadarLayer();
      });
    }
    if (el.radarToggle) {
      el.radarToggle.addEventListener('change', (e) => {
        state.radarVisible = e.target.checked;
        applyRadarLayer();
      });
    }

    // API Key Modal Handlers
    if (el.btnOpenKeyModal) {
      el.btnOpenKeyModal.addEventListener('click', showApiKeyModal);
    }
    if (el.btnCloseKeyModal) {
      el.btnCloseKeyModal.addEventListener('click', hideApiKeyModal);
    }
    if (el.btnSaveApiKey) {
      el.btnSaveApiKey.addEventListener('click', () => {
        const key = el.apiKeyInput.value.trim();
        if (key) {
          localStorage.setItem(STORAGE_KEY_API_KEY, key);
        } else {
          localStorage.removeItem(STORAGE_KEY_API_KEY);
        }
        hideApiKeyModal();
        window.location.reload();
      });
    }
    if (el.btnUseDemoKey) {
      el.btnUseDemoKey.addEventListener('click', () => {
        window.open('https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1', '_blank');
      });
    }
  }

  function showApiKeyModal() {
    if (el.apiKeyModal) el.apiKeyModal.classList.add('open');
  }

  function hideApiKeyModal() {
    if (el.apiKeyModal) el.apiKeyModal.classList.remove('open');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Self-start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
