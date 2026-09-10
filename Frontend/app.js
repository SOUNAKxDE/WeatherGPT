(function(){
"use strict";

const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const el = (tag, cls, html) => { const n=document.createElement(tag); if(cls) n.className=cls; if(html!==undefined) n.innerHTML=html; return n; };
const rand = (min,max) => Math.random()*(max-min)+min;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];

function setTheme(theme){
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);
  try{ localStorage.setItem('weathergpt_theme', isLight ? 'light' : 'dark'); }catch(e){}
  $$('#themeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.theme===theme));
  $$('#quickThemeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.theme===theme));
}
(function applySavedTheme(){
  let savedTheme = null;
  try{ savedTheme = localStorage.getItem('weathergpt_theme'); }catch(e){}
  if(savedTheme === 'light') setTheme('light');
})();

function toast(msg, ms=2600){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove('show'), ms);
}
function ic(name, cls='icon'){ return `<svg class="${cls}"><use href="#i-${name}"></use></svg>`; }

const ICONS = { clear:ic('sun'), pcloud:ic('cloud-sun'), cloud:ic('cloud'), rain:ic('cloud-rain'), storm:ic('cloud-lightning'), fog:ic('cloud-fog'), night:ic('moon') };

function genHourly(base){
  const hours = [];
  const now = new Date();
  for(let i=0;i<24;i++){
    const t = new Date(now.getTime() + i*3600000);
    const hour = t.getHours();
    const isNight = hour < 6 || hour > 19;
    let icon = base.icon;
    if(isNight) icon = (base.icon==='rain'||base.icon==='storm') ? base.icon : 'night';
    const rainDelta = Math.round(base.rain + Math.sin(i/3)*20 + rand(-8,8));
    hours.push({
      time: i===0 ? 'Now' : t.toLocaleTimeString([], {hour:'numeric'}),
      temp: Math.round(base.temp + Math.sin((i-9)/6)*4 - (isNight?2:0)),
      icon, rain: Math.max(2, Math.min(96, rainDelta))
    });
  }
  return hours;
}
function genDaily(base){
  const names = ['Today','Tomorrow','Wed','Thu','Fri','Sat','Sun'];
  const icons = ['pcloud','rain','storm','cloud','clear','pcloud','rain'];
  return names.map((n,i)=>({
    name:n, icon: i===0?base.icon:icons[i],
    hi: Math.round(base.hi + rand(-2,2) - i*0.2),
    lo: Math.round(base.lo + rand(-2,2)),
    rain: Math.max(5, Math.round(base.rain + rand(-30,20)))
  }));
}

const state = {
  user: { name:'', location:'Kolkata, West Bengal', role:'citizen', phone:'', email:'', accountType:'citizen', employeeId:'', department:'', designation:'', jurisdiction:'' },
  unit: 'c',
  lang: 'en',
  savedLocations: ['Kolkata, West Bengal','Mumbai, Maharashtra','Delhi, NCR'],
  chats: [], 
  activeChatId: null,
  sos: { taps:0, sending:false, sent:false, lifecycleStep:-1 }
};

function t(key){
  const dict = I18N_DATA.dict[state.lang] || I18N_DATA.dict.en;
  return dict[key] !== undefined ? dict[key] : (I18N_DATA.dict.en[key] || key);
}
function applyLanguage(lang){
  if(!I18N_DATA.dict[lang]) lang = 'en';
  state.lang = lang;
  document.documentElement.lang = lang;
  document.body.dir = (lang === 'ur') ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(elm=>{ elm.textContent = t(elm.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(elm=>{ elm.placeholder = t(elm.dataset.i18nPlaceholder); });
  $$('[data-i18n-aria]').forEach(elm=>{ elm.setAttribute('aria-label', t(elm.dataset.i18nAria)); });
  const langSelect = $('#settingLanguage');
  if(langSelect) langSelect.value = lang;
  const quickLangSelect = $('#quickLanguageSelect');
  if(quickLangSelect) quickLangSelect.value = lang;
  try{ localStorage.setItem('weathergpt_lang', lang); }catch(e){}
  // If we're already inside the app (not just the landing/auth flow), refresh
  // the dynamically-built sections too — data-i18n only covers static markup,
  // so home cards, alerts, map, climate and command views need a fresh render
  // to pick up the new language immediately rather than on next navigation.
  if(state.user && $('#view-app') && !$('#view-app').hidden){
    applyUserToChrome();
    if(typeof renderHome === 'function') renderHome();
    if(typeof renderAlerts === 'function') renderAlerts();
    if(typeof renderMap === 'function') renderMap();
    if(typeof renderClimate === 'function') renderClimate();
    if(typeof renderCommand === 'function') renderCommand();
    if(typeof renderChatHistory === 'function') renderChatHistory();
    if(typeof renderSavedLocations === 'function') renderSavedLocations();
  }
}
let langGateOrigin = null;
function openLanguageGate(origin){
  langGateOrigin = origin || null;
  $('#langGateBack').hidden = !langGateOrigin;
  showView('language');
}
function buildLanguageGate(){
  const grid = $('#languageGrid');
  if(!grid) return;
  grid.innerHTML = I18N_DATA.langs.map(l=>`
    <button class="lang-card" data-lang="${l.code}">
      <span class="lang-native">${l.native}</span>
      <span class="lang-english">${l.english}</span>
    </button>`).join('');
  $$('.lang-card', grid).forEach(card=>{
    card.addEventListener('click', ()=>{
      applyLanguage(card.dataset.lang);
      if(langGateOrigin==='app' && state.user.name){ applyUserToChrome(); renderHome(); showView('app'); }
      else{ showView('landing'); }
      langGateOrigin = null;
    });
  });
  $('#langGateBack').addEventListener('click', ()=>{
    showView(langGateOrigin==='app' ? 'app' : 'landing');
    langGateOrigin = null;
  });
}
function buildSettingsLanguageOptions(){
  const sel = $('#settingLanguage');
  if(!sel) return;
  sel.innerHTML = I18N_DATA.langs.map(l=>`<option value="${l.code}">${l.native} — ${l.english}</option>`).join('');
  sel.value = state.lang;
}

function loadState(){
  try{
    const raw = localStorage.getItem('weathergpt_state');
    if(raw){ Object.assign(state, JSON.parse(raw)); }
    const savedLang = localStorage.getItem('weathergpt_lang');
    if(savedLang) state.lang = savedLang;
  }catch(e){}
}
function saveState(){
  try{ localStorage.setItem('weathergpt_state', JSON.stringify({
    user:state.user, unit:state.unit, savedLocations:state.savedLocations, chats:state.chats
  })); }catch(e){}
}

function showView(name){
  ['language','landing','auth','app'].forEach(v=>{
    $('#view-'+v).hidden = (v!==name);
  });
  window.scrollTo(0,0);
}

function initSplash(onDone){
  const splash = $('#view-splash');
  if(!splash){ onDone(); return; }
  const reduced = document.body.classList.contains('reduced-motion');
  const holdMs = reduced ? 200 : 1100;
  const fadeMs = reduced ? 0 : 450;
  setTimeout(()=>{
    splash.classList.add('splash-fade');
    onDone();
    setTimeout(()=>{ splash.hidden = true; }, fadeMs);
  }, holdMs);
}

let authMode = 'phone';
let accountType = 'citizen';
let resendInterval = null;

function initLandingNav(){
  const hamburger = $('#btnNavHamburger');
  const navLinks = $('#navLinks');
  if(!hamburger || !navLinks) return;

  function setOpen(open){
    navLinks.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  hamburger.addEventListener('click', ()=>{
    setOpen(!navLinks.classList.contains('open'));
  });

  $$('#navLinks a').forEach(a=> a.addEventListener('click', ()=> setOpen(false)));

  document.addEventListener('click', (e)=>{
    if(!navLinks.classList.contains('open')) return;
    if(navLinks.contains(e.target) || hamburger.contains(e.target)) return;
    setOpen(false);
  });
}

function initAuth(){
  $('#btnNavLogin').addEventListener('click', ()=>openAuth());
  $('#btnNavStart').addEventListener('click', ()=>openAuth());
  $('#btnHeroStart').addEventListener('click', ()=>openAuth());
  $('#btnHeroDemo').addEventListener('click', ()=>{
    $('#demoStrip').scrollIntoView({behavior: motionOk()?'smooth':'auto', block:'center'});
  });
  $('#backToLanding').addEventListener('click', ()=> showView('landing'));

  $$('#authModeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('#authModeSwitch .seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      authMode = btn.dataset.mode;
      $('#phoneField').hidden = authMode!=='phone';
      $('#emailField').hidden = authMode!=='email';
    });
  });

  $('#btnSendOtp').addEventListener('click', handleSendOtp);
  $('#btnSendOtpOfficial').addEventListener('click', handleSendOtpOfficial);
  $('#backToIdentifier').addEventListener('click', ()=> switchAuthStep('identifier'));
  $('#btnEditDestination').addEventListener('click', ()=> switchAuthStep('identifier'));
  $('#btnVerifyOtp').addEventListener('click', handleVerifyOtp);
  $('#btnResend').addEventListener('click', startResendTimer);

  $$('#accountTypeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('#accountTypeSwitch .seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      accountType = btn.dataset.account;
      $('#citizenAuthFields').hidden = accountType !== 'citizen';
      $('#officialAuthFields').hidden = accountType !== 'official';
    });
  });

  initOtpBoxes();

  $$('#roleGrid .role-card[data-role]').forEach(card=>{
    card.addEventListener('click', ()=>{
      $$('#roleGrid .role-card[data-role]').forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
    });
  });
  const roleMoreToggle = $('#roleMoreToggle');
  if(roleMoreToggle){
    roleMoreToggle.addEventListener('click', ()=>{
      const expanded = roleMoreToggle.getAttribute('aria-expanded') === 'true';
      roleMoreToggle.setAttribute('aria-expanded', String(!expanded));
      roleMoreToggle.querySelector('span').textContent = expanded ? t('role_more') : t('role_less');
      $$('#roleGrid .role-extra').forEach(c=> c.hidden = expanded);
    });
  }
  $('#btnFinishProfile').addEventListener('click', finishProfile);

  $('#inputState').addEventListener('change', e=> populateCityOptions(e.target.value));
  populateCityOptions($('#inputState').value, 'Kolkata');
}

function populateCityOptions(stateName, preferredCity){
  const sel = $('#inputCity');
  const cities = INDIA_CITIES[stateName] || [];
  const toKeep = preferredCity && cities.includes(preferredCity) ? preferredCity : cities[0];
  sel.innerHTML = cities.map(c=>`<option value="${c}"${c===toKeep?' selected':''}>${c}</option>`).join('');
}

function openAuth(){
  showView('auth');
  switchAuthStep('identifier');
  accountType = 'citizen';
  $$('#accountTypeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.account==='citizen'));
  $('#citizenAuthFields').hidden = false;
  $('#officialAuthFields').hidden = true;
}
function switchAuthStep(step){
  ['identifier','otp','profile'].forEach(s=>{
    $('#step-'+s).hidden = (s!==step);
  });
}

function handleSendOtp(){
  const err = $('#identifierError');
  err.hidden = true;
  if(authMode==='phone'){
    const val = $('#inputPhone').value.trim();
    if(!/^\d{10}$/.test(val)){
      err.textContent = t('error_invalid_phone'); err.hidden = false; return;
    }
    state.user.phone = '+91 ' + val.replace(/(\d{5})(\d{5})/, '$1 $2');
    $('#otpDestination').textContent = state.user.phone;
  } else {
    const val = $('#inputEmail').value.trim();
    if(!/^\S+@\S+\.\S+$/.test(val)){
      err.textContent = t('error_invalid_email'); err.hidden = false; return;
    }
    state.user.email = val;
    $('#otpDestination').textContent = val;
  }
  $('#otpHintPrefix').textContent = 'We sent a 6-digit code to';
  switchAuthStep('otp');
  toast(t('toast_otp_sent_phone'));
  $$('.otp-box')[0].value=''; $$('.otp-box').forEach(b=>b.value='');
  $$('.otp-box')[0].focus();
  startResendTimer();
}

function handleSendOtpOfficial(){
  const err = $('#officialIdentifierError');
  err.hidden = true;
  const empId = $('#inputEmployeeId').value.trim();
  const email = $('#inputOfficialEmail').value.trim();
  if(!empId){
    err.textContent = t('error_employee_id_required'); err.hidden = false; return;
  }
  if(!/^\S+@\S+\.\S+$/.test(email)){
    err.textContent = t('error_invalid_official_email'); err.hidden = false; return;
  }
  state.user.employeeId = empId;
  state.user.email = email;
  state.user.department = $('#inputDepartment').value;
  $('#otpDestination').textContent = email;
  $('#otpHintPrefix').textContent = 'We sent a government verification code to';
  switchAuthStep('otp');
  toast(t('toast_otp_sent_official'));
  $$('.otp-box').forEach(b=>b.value='');
  $$('.otp-box')[0].focus();
  startResendTimer();
}

function initOtpBoxes(){
  const boxes = $$('.otp-box');
  boxes.forEach((box,i)=>{
    box.addEventListener('input', ()=>{
      box.value = box.value.replace(/\D/g,'').slice(0,1);
      if(box.value && boxes[i+1]) boxes[i+1].focus();
      $('#otpError').hidden = true;
    });
    box.addEventListener('keydown', (e)=>{
      if(e.key==='Backspace' && !box.value && boxes[i-1]) boxes[i-1].focus();
    });
    box.addEventListener('paste', (e)=>{
      const text = (e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);
      if(text.length){
        e.preventDefault();
        text.split('').forEach((ch,idx)=>{ if(boxes[idx]) boxes[idx].value=ch; });
        boxes[Math.min(text.length,6)-1].focus();
      }
    });
  });
}

function startResendTimer(){
  clearInterval(resendInterval);
  let t = 30;
  const btn = $('#btnResend'), span = $('#resendTimer');
  btn.disabled = true;
  span.textContent = t;
  resendInterval = setInterval(()=>{
    t--; span.textContent = t;
    if(t<=0){
      clearInterval(resendInterval);
      btn.disabled = false; btn.innerHTML = 'Resend code';
    }
  },1000);
}

function handleVerifyOtp(){
  const boxes = $$('.otp-box');
  const code = boxes.map(b=>b.value).join('');
  if(code.length!==6 || /\D/.test(code)){
    $('#otpError').hidden = false; return;
  }
  toast(t('toast_verified'));
  switchAuthStep('profile');
  $('#citizenPersonaSection').hidden = accountType !== 'citizen';
  $('#officialProfileSection').hidden = accountType !== 'official';
  if(accountType === 'official'){
    $('#profileTitle').textContent = 'A few details for your official account';
    $('#profileSub').textContent = 'This helps route incidents and alerts to the right desk. You can change this later.';
    $('#officialDeptDisplay').textContent = state.user.department || '—';
  } else {
    $('#profileTitle').textContent = t('profile_title');
    $('#profileSub').textContent = t('profile_sub');
  }
  $('#inputName').focus();
}

function finishProfile(){
  const name = $('#inputName').value.trim() || 'Explorer';
  const city = $('#inputCity').value.trim() || 'Kolkata';
  const st = $('#inputState').value || 'West Bengal';
  const loc = `${city}, ${st}`;
  state.user.name = name;
  state.user.location = loc;
  state.user.accountType = accountType;
  if(accountType === 'official'){
    state.user.role = 'official';
    state.user.designation = $('#inputDesignation').value.trim();
    state.user.jurisdiction = $('#inputJurisdiction').value.trim();
  } else {
    const role = $('#roleGrid .role-card.active')?.dataset.role || 'citizen';
    state.user.role = role;
    state.user.designation = '';
    state.user.jurisdiction = '';
  }
  if(!state.savedLocations.includes(loc)) state.savedLocations.unshift(loc);
  saveState();
  enterApp();
}

function motionOk(){ return !document.body.classList.contains('reduced-motion'); }

function enterApp(){
  showView('app');
  applyUserToChrome();
  renderHome();
  renderAlerts();
  renderMap();
  renderClimate();
  renderCommand();
  buildLocationPopover();
  gotoView('chat');
  toast(`${t('toast_welcome')}, ${state.user.name || 'there'}`);
  refreshWeatherFor(state.user.location);
}

function applyUserToChrome(){
  const initials = (state.user.name||'G').trim().charAt(0).toUpperCase();
  $('#sidebarAvatar').textContent = initials;
  $('#sidebarName').textContent = state.user.name || 'Guest User';
  $('#sidebarLocation').textContent = state.user.location.split(',')[0] + (state.user.location.split(',')[1] ? ', '+state.user.location.split(',')[1].trim().split(' ')[0] : '');
  $('#currentLocationLabel').textContent = state.user.location;
  $('#navCommand').hidden = state.user.role !== 'official';
  $('#navClimate').hidden = !(state.user.role === 'researcher' || state.user.role === 'official');
  $('#settingName').value = state.user.name;
  $('#settingLocation').value = state.user.location;
  $$('#settingRoleGrid .role-card').forEach(c=> c.classList.toggle('active', c.dataset.role===state.user.role));
  const isOfficialAccount = state.user.accountType === 'official';
  $('#settingRoleGrid').hidden = isOfficialAccount;
  $('#officialAccountInfo').hidden = !isOfficialAccount;
  if(isOfficialAccount){
    $('#officialAccountDept').textContent = state.user.department || '—';
    $('#officialAccountDesignation').textContent = state.user.designation || '—';
    $('#officialAccountJurisdiction').textContent = state.user.jurisdiction || '—';
  }
  const h = new Date().getHours();
  const greetWord = h<12?t('greet_morning'):(h<17?t('greet_afternoon'):t('greet_evening'));
  $('#homeGreeting').textContent = `${greetWord}, ${state.user.name || 'there'}`;
  $('#homeDate').textContent = new Date().toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'long', day:'numeric'});
}

function initNav(){
  $$('.side-link[data-view]').forEach(btn=>{
    btn.addEventListener('click', ()=> gotoView(btn.dataset.view));
  });
  $$('[data-goto]').forEach(btn=> btn.addEventListener('click', ()=> gotoView(btn.dataset.goto)));

  $('#btnOpenSidebar').addEventListener('click', ()=> toggleSidebar(true));
  $('#btnCloseSidebar').addEventListener('click', ()=> toggleSidebar(false));
  $('#sidebarScrim').addEventListener('click', ()=> toggleSidebar(false));
  $('#btnMobileSOS').addEventListener('click', ()=> { gotoView('sos'); toggleSidebar(false); });

  $('#btnNewChat').addEventListener('click', startNewChat);
}
function toggleSidebar(open){
  $('#sidebar').classList.toggle('open', open);
  $('#sidebarScrim').classList.toggle('show', open);
}
function gotoView(name){
  $$('.panel').forEach(p=>p.hidden = true);
  $('#panel-'+name).hidden = false;
  $$('.side-link[data-view]').forEach(b=> b.classList.toggle('active', b.dataset.view===name));
  toggleSidebar(false);
  if(name==='chat') $('#chatInput').focus();
  // The climate chart is drawn on a <canvas>, so it needs real, visible
  // dimensions to measure itself against. Redraw now that the panel is
  // actually unhidden, or it stays blank/broken from being sized while
  // .panel[hidden] made the canvas's box 0x0 (e.g. right after enterApp()).
  if(name==='climate') renderClimate();
}

function currentCityData(){
  return CITIES[state.user.location] || CITIES['Kolkata, West Bengal'];
}

/**
 * Fetches real conditions for `location` from weather-api.js and merges them
 * into CITIES, then re-renders. Safe to call as often as you like — it's a
 * no-op while a fresher cached reading already exists (see weather-api.js's
 * own TTL), and it never throws: a failed/offline fetch just leaves whatever
 * was already showing (the data.js seed, or a previous live reading).
 */
let weatherRefreshToken = 0;
async function refreshWeatherFor(location){
  if(!global_WeatherAPI()) return; // weather-api.js didn't load (e.g. blocked script) — silently skip, seed data still shows
  const myToken = ++weatherRefreshToken;
  try{
    const live = await window.WeatherAPI.getLiveWeather(location);
    if(myToken !== weatherRefreshToken) return; // user switched location again before this resolved — drop the stale result
    if(state.user.location !== location) return; // guard against a late resolve after another switch
    CITIES[location] = { ...(CITIES[location]||{}), ...live };
    renderHome();
    if($('#panel-alerts') && !$('#panel-alerts').hidden) renderAlerts(); // keep the full Alerts panel in sync too, not just the Home preview
    if(live.stale) toast(t('toast_stale_weather'));
  }catch(err){
    console.warn('Live weather unavailable for', location, err);
    // No toast here: falling back to the seed/demo data silently is the right UX for a background refresh.
  }
}
function global_WeatherAPI(){ return typeof window !== 'undefined' && window.WeatherAPI; }
function fmtTemp(c){
  if(state.unit==='f') return Math.round(c*9/5+32)+'°';
  return Math.round(c)+'°';
}

function renderHome(){
  const d = currentCityData();
  $('#hwcIcon').innerHTML = ICONS[d.icon];
  $('#hwcTemp').textContent = fmtTemp(d.temp);
  $('#hwcDesc').textContent = d.desc;
  $('#hwcFeels').textContent = fmtTemp(d.feels);
  $('#hwcHigh').textContent = fmtTemp(d.hi);
  $('#hwcLow').textContent = fmtTemp(d.lo);
  $('#hwcHumidity').textContent = d.humidity+'%';
  $('#hwcWind').textContent = d.wind+' km/h';
  $('#hwcRain').textContent = d.rain+'%';
  $('#hwcUv').textContent = d.uv + ' · ' + (d.uv>=8?t('level_very_high'):d.uv>=6?t('level_high'):d.uv>=3?t('level_moderate'):t('level_low'));
  $('#hwcAqi').textContent = d.aqi + ' · ' + (d.aqi>150?t('aqi_unhealthy'):d.aqi>100?t('aqi_poor'):d.aqi>50?t('level_moderate'):t('aqi_good'));
  $('#hwcPressure').textContent = d.pressure+' hPa';

  const hourly = (d.realHourly && d.realHourly.length) ? d.realHourly : genHourly(d);
  $('#hourlyStrip').innerHTML = hourly.map(h=>`
    <div class="hour-card">
      <div class="h-time">${h.time}</div>
      <div class="h-icon">${ICONS[h.icon]}</div>
      <div class="h-temp">${fmtTemp(h.temp)}</div>
      <div class="h-rain">${ic('droplet','icon-sm')} ${h.rain}%</div>
    </div>`).join('');

  const daily = (d.realDaily && d.realDaily.length) ? d.realDaily : genDaily(d);
  const globalHi = Math.max(...daily.map(x=>x.hi)), globalLo = Math.min(...daily.map(x=>x.lo));
  $('#dailyList').innerHTML = daily.map(dd=>{
    const left = ((dd.lo-globalLo)/(globalHi-globalLo+0.001))*100;
    const width = ((dd.hi-dd.lo)/(globalHi-globalLo+0.001))*100;
    return `<div class="day-row">
      <span class="d-name">${dd.name}</span>
      <div class="d-bar-wrap"><div class="d-bar" style="left:${left}%; width:${Math.max(width,8)}%"></div></div>
      <span class="d-icon">${ICONS[dd.icon]}</span>
      <span class="d-temps"><span class="hi">${fmtTemp(dd.hi)}</span> <span class="lo">${fmtTemp(dd.lo)}</span></span>
    </div>`;
  }).join('');

  renderLifestyle(d);
  renderAlertsPreview();
}

function renderLifestyle(d){
  const cards = {
    citizen: [
      {icon:'umbrella', title:'Commute', text:`Rain probability hits ${d.rain}% this evening — carry an umbrella after 5 PM.`},
      {icon:'activity', title:'Air quality', text:`AQI ${d.aqi} (${d.aqi>100?'sensitive groups should limit exertion':'generally acceptable'}) today.`},
      {icon:'footprints', title:'Best outdoor window', text:`6:10–7:20 AM looks calmest — lower heat, low rain chance.`},
      {icon:'users', title:'Family safety', text:`No active lightning risk on the school-commute route right now.`},
    ],
    farmer: [
      {icon:'wheat', title:'Irrigation', text:`Soil moisture adequate — hold irrigation until rain chance drops below 30%.`},
      {icon:'thermometer', title:'Heat stress', text:`Feels-like ${fmtTemp(d.feels)} at midday — schedule fieldwork before 10 AM.`},
      {icon:'wind', title:'Spraying window', text:`Wind at ${d.wind} km/h — acceptable for spraying, recheck after 2 PM.`},
      {icon:'snowflake', title:'Frost risk', text:`No frost risk expected in the next 5 days.`},
    ],
    traveler: [
      {icon:'plane', title:'Destination watch', text:`Add a destination in Plan → Travel to monitor severe weather en route.`},
      {icon:'luggage', title:'Packing', text:`Pack light rainwear — ${d.rain}% rain chance today at your base location.`},
      {icon:'cloud-fog', title:'Visibility', text:`No fog or dust events reported on nearby routes.`},
      {icon:'clock', title:'Delay risk', text:`Low delay risk from weather at this time.`},
    ],
    student: [
      {icon:'backpack', title:'School / campus commute', text:`Rain probability hits ${d.rain}% this evening — leave a few minutes early and keep a rain cover for your bag.`},
      {icon:'activity', title:'Outdoor classes / sports', text:`AQI ${d.aqi} — ${d.aqi>100?'consider moving PE or practice indoors today':'fine for outdoor classes and practice'}.`},
      {icon:'footprints', title:'Best study-break window', text:`6:10–7:20 AM looks calmest for a walk or outdoor revision session.`},
      {icon:'umbrella', title:'Exam-day check', text:`No severe weather alerts active for your area right now.`},
    ],
    parent: [
      {icon:'users', title:'Family safety', text:`No active lightning risk on the school-commute route right now.`},
      {icon:'umbrella', title:'School run', text:`Rain probability hits ${d.rain}% this evening — pack an umbrella for pickup.`},
      {icon:'activity', title:'Air quality for kids', text:`AQI ${d.aqi} — ${d.aqi>100?'keep young children indoors during peak hours':'safe for outdoor play'}.`},
      {icon:'bell', title:'Alerts', text:`You'll be notified immediately if a severe weather warning is issued for your area.`},
    ],
    fitness_trainer: [
      {icon:'activity', title:'Training window', text:`6:10–7:20 AM looks calmest for outdoor sessions — lower heat, low rain chance.`},
      {icon:'thermometer', title:'Heat safety', text:`Feels-like ${fmtTemp(d.feels)} at midday — shift high-intensity sessions earlier or move indoors.`},
      {icon:'wind', title:'Wind conditions', text:`Wind at ${d.wind} km/h — fine for outdoor drills.`},
      {icon:'droplet', title:'Hydration reminder', text:`Humidity is elevated today — plan extra hydration breaks for clients.`},
    ],
    researcher: [
      {icon:'bar-chart', title:'Anomaly', text:`Rainfall running slightly above the 20-year seasonal average.`},
      {icon:'calculator', title:'Model spread', text:`Ensemble members show moderate agreement for next 48h rainfall.`},
      {icon:'map', title:'Coverage', text:`Radar and satellite coverage nominal across your saved region.`},
      {icon:'folder', title:'Export', text:`Historical dataset ready for export in Climate & Research.`},
    ],
    official: [
      {icon:'landmark', title:'Command view', text:`Open Command Centre for live hazard, incident and resource status.`},
      {icon:'siren', title:'SOS queue', text:`Incidents awaiting triage — check Command Centre for priorities.`},
      {icon:'waves', title:'Flood watch', text:`Riverside wards flagged for monitoring this evening.`},
      {icon:'radio-tower', title:'Network health', text:`Mesh gateways reporting nominal uptime.`},
    ],
    runner: [
      {icon:'footprints', title:'Best run window', text:`6:10–7:20 AM looks calmest — lower heat, low rain chance.`},
      {icon:'thermometer', title:'Heat safety', text:`Feels-like ${fmtTemp(d.feels)} at midday — shift longer runs earlier or move indoors.`},
      {icon:'wind', title:'Wind conditions', text:`Wind at ${d.wind} km/h — fine for an outdoor route.`},
      {icon:'droplet', title:'Hydration reminder', text:`Humidity is elevated today — carry extra water on longer runs.`},
    ],
    beachgoer: [
      {icon:'waves', title:'Sea conditions', text:`Check the Marine tool in Plan for wave height and rip current risk.`},
      {icon:'sun', title:'UV exposure', text:`UV index ${d.uv} — reapply sunscreen every couple of hours.`},
      {icon:'wind', title:'Wind at coast', text:`Wind at ${d.wind} km/h — comfortable for a beach day.`},
      {icon:'cloud-lightning', title:'Storm watch', text:`No coastal storm warnings active right now.`},
    ],
    event_planner: [
      {icon:'party-popper', title:'Event-day outlook', text:`Add your event location and date in Plan → Event for a tailored forecast.`},
      {icon:'umbrella', title:'Rain contingency', text:`Rain probability hits ${d.rain}% — line up a backup indoor space just in case.`},
      {icon:'wind', title:'Setup conditions', text:`Wind at ${d.wind} km/h — fine for outdoor decor and tents.`},
      {icon:'bell', title:'Alerts', text:`You'll be notified immediately if a severe weather warning is issued for your area.`},
    ],
    responder: [
      {icon:'siren', title:'Active hazards', text:`Check Alerts for warnings currently in effect near you.`},
      {icon:'map', title:'Route conditions', text:`No flood or visibility hazards reported on major routes right now.`},
      {icon:'radio-tower', title:'Comms', text:`Mesh network fallback is on — SOS tools work even without signal.`},
      {icon:'ambulance', title:'Nearby resources', text:`Shelters and aid points are visible on the hazard map.`},
    ]
  };
  const list = cards[state.user.role] || cards.citizen;
  $('#lifestyleGrid').innerHTML = list.map(c=>`
    <div class="life-card">
      <div class="lc-top"><span class="lc-icon icon-tile">${ic(c.icon,'icon-md')}</span><h5>${c.title}</h5></div>
      <p>${c.text}</p>
    </div>`).join('');
}

/**
 * Derives alert cards directly from whatever is currently in `currentCityData()`
 * — real live Open-Meteo numbers when available, seed data otherwise — instead
 * of only ever showing the 4 fixed cards in data.js. These are recomputed on
 * every render, so they track the actual numbers on screen and clear
 * themselves once conditions drop back below the threshold.
 */
function deriveLiveAlerts(){
  const d = currentCityData();
  const out = [];
  if(d.rain >= 70){
    out.push({ sev:'warning', icon:'cloud-lightning', title:`Heavy Rain Likely — ${state.user.location.split(',')[0]}`,
      body:`Current rain-chance reading is ${d.rain}% — expect significant rainfall today. Carry rain protection and allow extra travel time.`,
      time:'Live · based on current conditions', source:'WeatherGPT (derived from live forecast data)', live:true });
  } else if(d.rain >= 45){
    out.push({ sev:'watch', icon:'cloud-rain', title:`Rain Watch — ${state.user.location.split(',')[0]}`,
      body:`Rain chance is at ${d.rain}% — keep an umbrella handy and check again before heading out.`,
      time:'Live · based on current conditions', source:'WeatherGPT (derived from live forecast data)', live:true });
  }
  if(d.aqi >= 150){
    out.push({ sev:'warning', icon:'activity', title:`Unhealthy Air Quality — AQI ${d.aqi}`,
      body:`Air quality is currently Unhealthy. Limit prolonged outdoor exertion, especially for children, older adults and anyone with respiratory conditions.`,
      time:'Live · based on current AQI reading', source:'WeatherGPT (derived from live air-quality data)', live:true });
  } else if(d.aqi >= 100){
    out.push({ sev:'advisory', icon:'activity', title:`Air Quality Advisory — AQI ${d.aqi}`,
      body:`Air quality is Poor for sensitive groups. Consider limiting extended outdoor activity.`,
      time:'Live · based on current AQI reading', source:'WeatherGPT (derived from live air-quality data)', live:true });
  }
  if(d.wind >= 35){
    out.push({ sev:'watch', icon:'wind', title:`High Wind Advisory — ${d.wind} km/h`,
      body:`Sustained wind is running high at ${d.wind} km/h. Secure loose outdoor items and use caution on exposed roads.`,
      time:'Live · based on current conditions', source:'WeatherGPT (derived from live forecast data)', live:true });
  }
  if(d.uv >= 9){
    out.push({ sev:'advisory', icon:'sun', title:`Extreme UV — Index ${d.uv}`,
      body:`UV index is Extreme today. Seek shade, wear sunscreen, and avoid prolonged midday sun exposure.`,
      time:'Live · based on current conditions', source:'WeatherGPT (derived from live forecast data)', live:true });
  }
  return out;
}
function allAlerts(){ return [...deriveLiveAlerts(), ...ALERTS]; }

function renderAlertsPreview(){
  $('#alertsPreview').innerHTML = allAlerts().slice(0,2).map(a=> alertCardHtml(a)).join('');
}

function alertCardHtml(a){
  const tileClass = a.sev==='warning' ? 'danger' : a.sev==='watch' ? 'warn' : '';
  return `<div class="alert-card sev-${a.sev}">
    <div class="alert-icon icon-tile ${tileClass}">${ic(a.icon,'icon-md')}</div>
    <div class="alert-body">
      <div class="alert-title">${a.title}${a.live?' <span class="alert-live-tag">LIVE</span>':''}</div>
      <p class="muted small">${a.body}</p>
      <div class="alert-meta">${a.time} · ${a.source}</div>
    </div>
    <span class="alert-sev-tag">${a.sev}</span>
  </div>`;
}
function renderAlerts(filter='all'){
  const all = allAlerts();
  const list = filter==='all' ? all : all.filter(a=>a.sev===filter);
  const emptyKey = {all:'alerts_none_all', warning:'alerts_none_warning', watch:'alerts_none_watch', advisory:'alerts_none_advisory'}[filter] || 'alerts_none_all';
  $('#alertList').innerHTML = list.length ? list.map(alertCardHtml).join('') : `<p class="muted">${t(emptyKey)}</p>`;
  $('#alertBadge').textContent = all.filter(a=>a.sev==='warning').length;
}
function initAlertTabs(){
  $$('#alertTabs .tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      $$('#alertTabs .tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      renderAlerts(tab.dataset.filter);
    });
  });
}

function startNewChat(){
  const id = 'c'+Date.now();
  state.chats.unshift({id, title:'New chat', messages:[]});
  state.activeChatId = id;
  saveState();
  renderChatHistory();
  gotoView('chat');
  renderMessages();
}
function renderChatHistory(){
  const wrap = $('#chatHistoryList');
  if(!state.chats.length){
    wrap.innerHTML = `<div class="empty-state empty-state-sm">
      <svg class="icon-md empty-state-icon"><use href="#i-message-circle"></use></svg>
      <p class="empty-state-title">${t('empty_chats_title')}</p>
      <p class="empty-state-sub">${t('empty_chats_sub')}</p>
    </div>`;
    return;
  }
  wrap.innerHTML = state.chats.slice(0,12).map(c=>`<button class="history-item" data-id="${c.id}">${c.title}</button>`).join('');
  $$('.history-item', wrap).forEach(b=>{
    b.addEventListener('click', ()=>{ state.activeChatId=b.dataset.id; gotoView('chat'); renderMessages(); });
  });
}
function activeChat(){
  if(!state.activeChatId || !state.chats.find(c=>c.id===state.activeChatId)){
    const id='c'+Date.now(); state.chats.unshift({id,title:'New chat',messages:[]}); state.activeChatId=id;
  }
  return state.chats.find(c=>c.id===state.activeChatId);
}
function renderMessages(){
  const chat = activeChat();
  const wrap = $('#chatMessages');
  if(!chat.messages.length){
    wrap.innerHTML=''; wrap.appendChild($('#chatEmpty') || buildChatEmpty());
    $('#chatEmpty').hidden = false;
    return;
  }
  wrap.innerHTML = '';
  chat.messages.forEach(m=> wrap.appendChild(buildMsgNode(m)));
  wrap.scrollTop = wrap.scrollHeight;
}
function buildChatEmpty(){ return $('#chatEmpty'); }

function buildMsgNode(m){
  const row = el('div', 'msg msg-'+m.role);
  const avatar = el('div','msg-avatar', m.role==='user' ? (state.user.name||'G').charAt(0).toUpperCase() : ic('cloud-sun'));
  const bubble = el('div','msg-bubble');
  bubble.innerHTML = m.html || `<p>${escapeHtml(m.text)}</p>`;
  if(m.translatedText){
    bubble.innerHTML += `<span class="msg-translation">${escapeHtml(m.translatedText)}</span>`;
  }
  row.appendChild(avatar); row.appendChild(bubble);
  return row;
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/**
 * Sends whatever is currently in the chat box. Shared by the send button,
 * the Enter key, and the voice flow (which auto-sends once it decides the
 * person has stopped talking).
 */
function sendFromBox(){
  const ta = $('#chatInput');
  if(!ta.value.trim()) return;
  // Sending — whether by tapping Send, hitting Enter, or the voice flow's
  // own silence timeout — should always stop an in-progress recording. This
  // matters when the person sends by hand while the mic is still listening:
  // without this, recognition would keep running in the background after
  // the message has already gone out.
  if(voiceState.active && voiceState.recognition){
    try{ voiceState.recognition.stop(); }catch(e){}
  }
  sendMessage(ta.value, { sourceLang: ta.dataset.voiceLang || null });
  delete ta.dataset.voiceLang;
}

function initChat(){
  $$('#suggestionGrid .suggestion-card').forEach(card=>{
    card.addEventListener('click', ()=> sendMessage(card.textContent));
  });
  $('#btnSend').addEventListener('click', sendFromBox);
  const ta = $('#chatInput');
  ta.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendFromBox(); }
  });
  ta.addEventListener('input', ()=>{
    ta.style.height='auto';
    ta.style.overflowY = ta.scrollHeight>140 ? 'auto' : 'hidden';
    ta.style.height=Math.min(ta.scrollHeight,140)+'px';
    // If the person edits the box by hand, it's no longer "the transcript we
    // just heard" — drop the voice-language tag so we don't try to translate
    // hand-typed text using a stale source language.
    if(!voiceState.active) delete ta.dataset.voiceLang;
    const emptyEl = $('#chatEmpty');
    if(emptyEl) emptyEl.hidden = ta.value.trim().length>0;
    const disclaimerEl = $('.chat-disclaimer');
    if(disclaimerEl) disclaimerEl.style.display = ta.value.trim().length>0 ? 'none' : '';
  });
  $('#btnVoice').addEventListener('click', startVoiceInput);
  $('#btnLangChat').addEventListener('click', ()=> openLanguageGate('app'));
}

/**
 * Maps our in-app language codes to BCP-47 locale tags the browser's
 * SpeechRecognition engine understands. Extend this alongside I18N_DATA.langs
 * whenever a new language is added to the language picker.
 */
const VOICE_LANG_MAP = {
  en:'en-IN', hi:'hi-IN', bn:'bn-IN', ta:'ta-IN', te:'te-IN', mr:'mr-IN',
  gu:'gu-IN', kn:'kn-IN', ml:'ml-IN', pa:'pa-IN', ur:'ur-IN', or:'or-IN', as:'as-IN'
};
function speechLangFor(lang){ return VOICE_LANG_MAP[lang] || 'en-IN'; }

// Single source of truth for "are we currently listening". The mic button's
// visual state and the "Listening…" pill both read from this object, so they
// can never show out of sync with what SpeechRecognition is actually doing.
const voiceState = { recognition:null, active:false };

function setListeningUI(active, statusText){
  const btn = $('#btnVoice');
  const indicator = $('#voiceIndicator');
  const indicatorText = $('#voiceIndicatorText');
  if(btn){ btn.classList.toggle('is-listening', active); btn.setAttribute('aria-pressed', active ? 'true' : 'false'); }
  if(indicator) indicator.hidden = !active;
  if(indicatorText) indicatorText.textContent = statusText || 'Listening… speak now';
}

function endVoiceInput(){
  voiceState.active = false;
  voiceState.recognition = null;
  setListeningUI(false);
}

// How long we'll wait after the last bit of detected speech before we
// decide the person is done talking, auto-stop the mic, and send.
const VOICE_SILENCE_MS = 10000;

function startVoiceInput(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ toast(t('toast_voice_unavailable')); return; }

  // Tapping the mic again while it's already listening cancels the recording
  // instead of starting a second one.
  if(voiceState.active){ if(voiceState.recognition) voiceState.recognition.stop(); return; }

  const ta = $('#chatInput');
  const baseValue = ta.value.trim();
  const recog = new SR();
  recog.lang = speechLangFor(state.lang);
  recog.interimResults = true;
  // Continuous + our own silence timer (below) gives us exact control over
  // the 10s cutoff, instead of relying on each browser's own, inconsistent
  // endpointing to decide when a pause means "done talking".
  recog.continuous = true;
  recog.maxAlternatives = 1;

  let finalTranscript = '';
  let silenceTimer = null;
  const armSilenceTimer = ()=>{
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(()=>{ try{ recog.stop(); }catch(e){} }, VOICE_SILENCE_MS);
  };

  voiceState.recognition = recog;
  voiceState.active = true;
  setListeningUI(true);
  armSilenceTimer(); // also covers "never said anything at all"

  recog.onresult = (e)=>{
    armSilenceTimer();
    let interim = '';
    for(let i=e.resultIndex; i<e.results.length; i++){
      const res = e.results[i];
      if(res.isFinal) finalTranscript += res[0].transcript;
      else interim += res[0].transcript;
    }
    const heard = (finalTranscript + interim).trim();
    ta.value = [baseValue, heard].filter(Boolean).join(' ');
    ta.dispatchEvent(new Event('input'));
    setListeningUI(true, heard || undefined);
  };
  recog.onerror = (e)=>{
    clearTimeout(silenceTimer);
    endVoiceInput();
    if(e.error === 'no-speech') toast('Didn\u2019t catch that — try again');
    else if(e.error === 'not-allowed' || e.error === 'service-not-allowed') toast('Microphone access is blocked in your browser settings');
    else toast(t('toast_voice_unavailable'));
  };
  recog.onend = ()=>{
    clearTimeout(silenceTimer);
    const heardSomething = finalTranscript.trim().length>0;
    // Tag the box with which language we just heard, so sendMessage() knows
    // whether to request an English translation before rendering the bubble.
    if(heardSomething) ta.dataset.voiceLang = state.lang;
    endVoiceInput();
    // 10s of silence (or the person tapping the mic to stop) means "done" —
    // send it straight away rather than waiting for a manual tap on send.
    if(heardSomething) sendFromBox();
  };

  try{ recog.start(); }
  catch(err){ clearTimeout(silenceTimer); endVoiceInput(); toast(t('toast_voice_unavailable')); }
}

/**
 * Sends recognized non-English speech to a backend translation endpoint.
 * There is no backend wired into this front-end prototype, so this call is
 * *expected* to fail right now — it's written so that standing up the real
 * endpoint described in the project notes is a drop-in fix, nothing here
 * needs to change. On failure we simply skip showing a translation line.
 */
async function translateToEnglish(text, sourceLang){
  if(!text || !sourceLang || sourceLang === 'en') return null;
  try{
    const res = await fetch('/api/translate', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ text, source: sourceLang, target: 'en' })
    });
    if(!res.ok) throw new Error('translate endpoint unavailable');
    const data = await res.json();
    return (data && data.translatedText) ? data.translatedText : null;
  }catch(e){
    return null;
  }
}

/**
 * Returns a short sequence of "what I'm doing" status lines tailored to the
 * question being asked, so the thinking indicator in sendMessage() feels
 * like it's actually working the problem rather than just waiting.
 * Mirrors the same keyword categories generateReply() branches on.
 */
function thinkingStepsFor(text, cityShort){
  const t = text.toLowerCase();
  const loc = `Pulling live conditions for <span class="think-highlight">${cityShort}</span>`;
  if(/umbrella|rain|shower/.test(t)) return [
    'Reading your question', loc,
    'Scanning rain radar & hourly precipitation odds', 'Timing the driest window'
  ];
  if(/run|jog|exercise|walk|workout|cycl/.test(t)) return [
    'Reading your question', loc,
    'Checking UV, heat and rain by hour', 'Finding the best outdoor window'
  ];
  if(/irrigat|crop|farm|field|soil/.test(t)) return [
    'Reading your question', loc,
    'Checking soil moisture & rain outlook', 'Weighing irrigation timing'
  ];
  if(/flood|inundat|water.?log/.test(t)) return [
    'Reading your question',
    'Checking river levels & drainage zones',
    'Cross-referencing the flood-risk model', 'Assessing nearby routes'
  ];
  if(/lightning|thunder|storm/.test(t)) return [
    'Reading your question',
    'Tracking convective cells nearby',
    'Estimating storm speed & direction', 'Drafting safety guidance'
  ];
  if(/travel|destination|trip|flight|airport/.test(t)) return [
    'Reading your question', loc,
    'Checking severe-weather risk on your route', 'Putting together packing notes'
  ];
  if(/aqi|air quality|pollution|pm2\.5|pollen/.test(t)) return [
    'Reading your question', loc,
    'Checking live air-quality readings', 'Assessing exposure risk'
  ];
  if(/climate|trend|history|historical|20 year|last \d+ years|anomaly/.test(t)) return [
    'Reading your question',
    'Pulling the 20-year rainfall record',
    'Looking for trend anomalies'
  ];
  if(/shelter|evacuat|safe place/.test(t)) return [
    'Reading your question',
    'Checking nearby shelter capacity', 'Cross-checking hospital network status'
  ];
  if(/sos|emergency|help me|rescue/.test(t)) return [
    'Reading your question', 'Checking for active local incidents'
  ];
  if(/wind|gust/.test(t)) return [
    'Reading your question', loc, 'Checking wind speed & gust advisories'
  ];
  if(/temperature|hot|cold|heat/.test(t)) return [
    'Reading your question', loc, 'Comparing against today\'s forecast range'
  ];
  if(/hello|hi\b|hey/.test(t)) return [ 'Reading your question' ];
  return [
    'Reading your question', loc,
    'Cross-checking forecast models', 'Composing response'
  ];
}

async function sendMessage(text, meta={}){
  text = (text||'').trim();
  if(!text) return;
  const chat = activeChat();
  if(chat.title==='New chat') chat.title = text.slice(0,42);
  const userMsg = {role:'user', text};
  chat.messages.push(userMsg);
  $('#chatInput').value=''; $('#chatInput').style.height='auto'; $('#chatInput').style.overflowY='hidden';
  const disclaimerEl = $('.chat-disclaimer');
  if(disclaimerEl) disclaimerEl.style.display = '';
  renderMessages();
  renderChatHistory();
  saveState();

  // If this text came from the mic in a non-English language, fetch an
  // English translation and slot it under the user's bubble once it's back.
  if(meta.sourceLang && meta.sourceLang !== 'en'){
    translateToEnglish(text, meta.sourceLang).then(translated=>{
      if(!translated || translated.trim().toLowerCase() === text.trim().toLowerCase()) return;
      userMsg.translatedText = translated;
      renderMessages();
    });
  }

  const wrap = $('#chatMessages');
  const cityShort = state.user.location.split(',')[0];
  const steps = thinkingStepsFor(text, cityShort);
  const reduced = document.body.classList.contains('reduced-motion');

  const typingRow = el('div','msg msg-bot msg-thinking');
  typingRow.innerHTML = `<div class="msg-avatar">${ic('cloud-sun')}</div>
    <div class="msg-bubble">
      <div class="think-wrap">
        <div class="think-row">
          <span class="think-spinner"></span>
          <span class="think-text">${steps[0]}</span>
        </div>
        <div class="think-track"><div class="think-bar"></div></div>
        <div class="think-log"></div>
      </div>
    </div>`;
  wrap.appendChild(typingRow); wrap.scrollTop = wrap.scrollHeight;

  const textEl = $('.think-text', typingRow);
  const logEl = $('.think-log', typingRow);
  const stepMs = reduced ? 1 : 520 + Math.random()*380;

  function advance(i){
    if(i >= steps.length){
      setTimeout(()=>{
        typingRow.remove();
        const reply = generateReply(text);
        chat.messages.push({role:'bot', html: reply});
        renderMessages();
        saveState();
      }, reduced ? 0 : 240);
      return;
    }
    const prevLine = el('div','think-log-item');
    prevLine.innerHTML = `<span class="think-check">${ic('check')}</span><span>${steps[i-1].replace(/<[^>]+>/g,'')}</span>`;
    logEl.appendChild(prevLine);

    if(reduced){
      textEl.innerHTML = steps[i];
    } else {
      textEl.classList.add('swap-out');
      setTimeout(()=>{
        textEl.innerHTML = steps[i];
        textEl.classList.remove('swap-out');
        textEl.classList.add('swap-in');
        setTimeout(()=> textEl.classList.remove('swap-in'), 220);
      }, 150);
    }
    wrap.scrollTop = wrap.scrollHeight;
    setTimeout(()=> advance(i+1), stepMs);
  }

  setTimeout(()=> advance(1), stepMs);
}

function generateReply(q){
  const t = q.toLowerCase();
  const d = currentCityData();
  const cityShort = state.user.location.split(',')[0];

  const miniCard = (icon,temp,meta)=>`<div class="mini-weather-card"><span class="mwc-icon">${icon}</span><div><div class="mwc-temp">${temp}</div><div class="mwc-meta">${meta}</div></div></div>`;

  if(/umbrella|rain|shower/.test(t)){
    return `<p>Rain probability in ${cityShort} climbs to <strong>${d.rain}%</strong> later today, with the heaviest band expected after 5:30 PM.</p><p>I'd carry an umbrella and, if you can, leave 10–15 minutes earlier to stay ahead of the heaviest showers.</p>${miniCard(ICONS[d.icon], fmtTemp(d.temp), `${d.desc} · ${d.humidity}% humidity`)}`;
  }
  if(/run|jog|exercise|walk|workout|cycl/.test(t)){
    return `<p>For outdoor activity in ${cityShort}, the safest window today is <strong>6:10–7:20 AM</strong> — lower heat, low rain chance, and manageable UV.</p><p>Avoid 12–3 PM: UV index reaches ${d.uv} and feels-like temperature climbs to ${fmtTemp(d.feels)}.</p>`;
  }
  if(/irrigat|crop|farm|field|soil/.test(t)){
    return `<p>Soil moisture looks adequate for now. With a ${d.rain}% rain chance later today, I'd hold off irrigation and re-check tomorrow morning — irrigating now risks waterlogging if the forecast band arrives.</p><p>If you need to spray, wind is currently ${d.wind} km/h — within a workable range before 2 PM.</p>`;
  }
  if(/flood|inundat|water.?log/.test(t)){
    return `<p>Current flood probability for low-lying zones near ${cityShort} is <strong>Moderate</strong> over the next 3 hours, driven by rainfall accumulation and river levels.</p><p>Roads near drainage choke points may see waterlogging first. I'd avoid underpasses and low-lying stretches until the rain band passes. You can see the live extent on the <strong>Map & Hazards</strong> tab.</p>`;
  }
  if(/lightning|thunder|storm/.test(t)){
    return `<p>A convective cell is tracked to the southwest, moving northeast at roughly 18 km/h — lightning risk near you rises after 5 PM.</p><p>If you're outdoors when thunder is audible, move to a solid, enclosed structure and avoid open fields or tall isolated trees.</p>`;
  }
  if(/travel|destination|trip|flight|airport/.test(t)){
    return `<p>Tell me a destination in <strong>Plan → Travel</strong> and I'll check severe-weather risk, visibility and packing suggestions for your dates. In the meantime, ${cityShort} itself shows ${d.desc.toLowerCase()} with a ${d.rain}% rain chance.</p>`;
  }
  if(/aqi|air quality|pollution|pm2\.5|pollen/.test(t)){
    return `<p>Air quality index is currently <strong>${d.aqi}</strong> (${d.aqi>150?'Unhealthy':d.aqi>100?'Poor':d.aqi>50?'Moderate':'Good'}) in ${cityShort}.</p><p>${d.aqi>100?'If you\'re sensitive to air quality, consider limiting prolonged outdoor exertion today.':'Conditions are generally fine for normal outdoor activity.'}</p>`;
  }
  if(/climate|trend|history|historical|20 year|last \d+ years|anomaly/.test(t)){
    return `<p>Over the last 20 years, monsoon rainfall in this district shows a gentle upward trend with more high-intensity rain days. Open <strong>Climate & Research</strong> to explore the interactive chart and export the dataset.</p>`;
  }
  if(/shelter|evacuat|safe place/.test(t)){
    return `<p>The nearest authorized shelters are shown on the <strong>Map & Hazards</strong> layer ("Shelters"). If you're facing an active emergency, please use the <strong>Emergency SOS</strong> button rather than chat.</p>`;
  }
  if(/sos|emergency|help me|rescue/.test(t)){
    return `<p>If this is an active emergency, please go to <strong>Emergency SOS</strong> right now and press the SOS button — it works even with weak connectivity.</p><p>For non-urgent safety questions, I'm happy to help here.</p>`;
  }
  if(/wind|gust/.test(t)){
    return `<p>Current wind near ${cityShort} is <strong>${d.wind} km/h</strong>. No strong-wind warning is active at this time.</p>`;
  }
  if(/temperature|hot|cold|heat/.test(t)){
    return `<p>It's currently <strong>${fmtTemp(d.temp)}</strong> in ${cityShort}, feeling like ${fmtTemp(d.feels)}. Today's range is ${fmtTemp(d.lo)}–${fmtTemp(d.hi)}.</p>${miniCard(ICONS[d.icon], fmtTemp(d.temp), d.desc)}`;
  }
  if(/hello|hi\b|hey/.test(t)){
    return `<p>Hi ${state.user.name||'there'} — ask me about rain, wind, air quality, farming windows, travel, flood risk or anything else weather-related for ${cityShort}.</p>`;
  }
  return `<p>Here's what I have for ${cityShort} right now: <strong>${d.desc}</strong>, ${fmtTemp(d.temp)} (feels like ${fmtTemp(d.feels)}), ${d.rain}% rain chance, wind ${d.wind} km/h.</p><p>Ask me something more specific — like a time window, a destination, or a hazard — and I'll tailor the answer.</p>${miniCard(ICONS[d.icon], fmtTemp(d.temp), `${d.humidity}% humidity · AQI ${d.aqi}`)}`;
}

const LAYER_INFO = {
  radar: { text:'Radar shows a moderate-to-heavy rain band moving northeast at ~18 km/h, expected to reach central districts within 40 minutes.', legend:[['Light rain','#6d84c2'],['Moderate','#4bacce'],['Heavy','#c98f4e'],['Severe','#c9556a']] },
  lightning: { text:'12 lightning strikes detected in the last 10 minutes, clustered southwest of the city centre. Cell tracked moving northeast.', legend:[['Strike (recent)','#e0c168'],['Strike cluster','#c98f4e']] },
  flood: { text:'Flood probability model flags 3 wards as Moderate–High risk in the next 3 hours based on rainfall, drainage and river-level fusion.', legend:[['Low risk','#45a481'],['Moderate','#c98f4e'],['High','#c9556a']] },
  wind: { text:'Sustained wind 14–19 km/h from the southwest, gusting to 28 km/h near the coast.', legend:[['Calm','#6d84c2'],['Breezy','#4bacce'],['Gusty','#c98f4e']] },
  sos: { text:'2 active SOS incidents in the last hour, both triaged. Heatmap reflects incident density, not individual identities.', legend:[['Low density','#45a481'],['Elevated','#c98f4e'],['Critical cluster','#c9556a']] },
  shelters: { text:'6 authorized shelters within 12 km, 3 at more than 50% capacity. Hospital network status nominal.', legend:[['Shelter (open)','#45a481'],['Shelter (near full)','#c98f4e'],['Hospital','#6d84c2']] }
};
let currentLayer = 'radar';

function renderMap(){
  drawMapLayer(currentLayer);
  $('#mapDetailText').textContent = LAYER_INFO[currentLayer].text;
  $('#mapLegend').innerHTML = LAYER_INFO[currentLayer].legend.map(([label,color])=>
    `<div><span class="legend-dot" style="background:${color}"></span>${label}</div>`).join('');
}
function drawMapLayer(layer){
  const svg = $('#mapSvg');
  svg.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const outline = document.createElementNS(ns,'path');
  outline.setAttribute('d','M120,80 Q220,40 340,70 T560,60 Q680,90 700,180 Q720,280 620,340 Q540,400 400,390 Q260,410 180,340 Q90,270 100,180 Q100,120 120,80 Z');
  outline.setAttribute('fill','rgba(109,132,194,.05)');
  outline.setAttribute('stroke','rgba(109,132,194,.22)');
  outline.setAttribute('stroke-width','1.5');
  svg.appendChild(outline);

  const seedPositions = [[260,150],[340,220],[420,150],[500,260],[300,300],[460,340],[560,180],[220,260]];
  const colors = LAYER_INFO[layer].legend.map(l=>l[1]);
  seedPositions.forEach((p,i)=>{
    const c = document.createElementNS(ns,'circle');
    const r = 26 + (i%3)*18;
    c.setAttribute('cx',p[0]); c.setAttribute('cy',p[1]); c.setAttribute('r',r);
    c.setAttribute('fill', colors[i%colors.length]);
    c.setAttribute('opacity', 0.16 + (i%3)*0.06);
    svg.appendChild(c);
  });
  seedPositions.slice(0, layer==='sos'?2: layer==='shelters'?6:4).forEach((p,i)=>{
    const dot = document.createElementNS(ns,'circle');
    dot.setAttribute('cx',p[0]+rand(-10,10)); dot.setAttribute('cy',p[1]+rand(-10,10)); dot.setAttribute('r', layer==='shelters'?6:5);
    dot.setAttribute('fill', colors[(i+1)%colors.length]);
    dot.setAttribute('stroke','#0a0d13'); dot.setAttribute('stroke-width','1.5');
    svg.appendChild(dot);
  });
  const you = document.createElementNS(ns,'g');
  you.innerHTML = `<circle cx="400" cy="230" r="7" fill="#4bacce" stroke="#0a0d13" stroke-width="2"/><circle cx="400" cy="230" r="14" fill="none" stroke="#4bacce" stroke-width="1.5" opacity=".6"/>`;
  svg.appendChild(you);
}
function initMap(){
  $$('#mapToolbar .layer-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      $$('#mapToolbar .layer-chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      currentLayer = chip.dataset.layer;
      renderMap();
    });
  });
  $('#mapTimeRange').addEventListener('input', (e)=>{
    const v = +e.target.value;
    const label = v<3 ? `Observed ${3-v}h ago` : v===3 ? 'Now' : `Forecast +${v-3}h`;
    $('#mapDetailText').textContent = `[${label}] ` + LAYER_INFO[currentLayer].text;
  });
}

function initPlan(){
  $$('#toolTabs .tool-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      $$('#toolTabs .tool-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      $$('.tool-panel').forEach(p=>p.hidden=true);
      $('#tool-'+tab.dataset.tool).hidden=false;
    });
  });

  const todayStr = new Date().toISOString().slice(0,10);
  if($('#eventDate')) $('#eventDate').value = todayStr;
  if($('#travelDate')) $('#travelDate').value = todayStr;

  $('#btnCheckTravel').addEventListener('click', ()=>{
    const destRaw = $('#travelDest').value.trim() || 'your destination';
    const dest = escapeHtml(destRaw);
    const found = findCity(destRaw);
    const data = found.data;
    const box = $('#travelResult');
    box.classList.add('show');
    box.innerHTML = `<div class="result-card">
      <h4>${ICONS[data.icon]} ${dest}</h4>
      ${!found.matched ? `<p class="muted small">No exact match for "${dest}" in our demo city list — showing conditions for ${escapeHtml(found.resolvedName)} instead as a stand-in.</p>` : ''}
      <p>${data.desc}, ${fmtTemp(data.temp)} (feels like ${fmtTemp(data.feels)}). Rain chance ${data.rain}%, wind ${data.wind} km/h.</p>
      <p>${data.rain>55 ? 'Pack rainwear and build buffer time into transfers.' : 'Conditions look manageable — pack light layers.'}</p>
      <div class="result-tags">
        <span class="result-tag ${data.rain>55?'warn':'good'}">${data.rain>55?'Rain likely':'Low rain risk'}</span>
        <span class="result-tag ${data.aqi>100?'warn':'good'}">AQI ${data.aqi}</span>
        <span class="result-tag good">No severe-weather advisory</span>
      </div>
    </div>`;
  });

  $('#btnCheckAgri').addEventListener('click', ()=>{
    const crop = $('#agriCrop').value; const loc = escapeHtml($('#agriLoc').value.trim());
    const d = currentCityData();
    const box = $('#agriResult'); box.classList.add('show');
    const irrigate = d.rain < 35;
    box.innerHTML = `<div class="result-card">
      <h4>${ic('wheat')} ${crop} — ${loc}</h4>
      <p>${irrigate ? `Rain chance is only ${d.rain}% — irrigate this morning while soil moisture is manageable.` : `Rain chance is ${d.rain}% — hold irrigation; natural rainfall should cover today's needs.`}</p>
      <p>Wind ${d.wind} km/h is ${d.wind<20?'within a safe spraying range':'a bit high for spraying — recheck later'}. No frost risk in the 5-day outlook.</p>
      <div class="result-tags">
        <span class="result-tag ${irrigate?'good':'warn'}">${irrigate?'Irrigate today':'Hold irrigation'}</span>
        <span class="result-tag good">No frost risk</span>
        <span class="result-tag ${d.wind<20?'good':'warn'}">Spraying ${d.wind<20?'OK':'marginal'}</span>
      </div>
    </div>`;
  });

  $('#btnCheckFitness').addEventListener('click', ()=>{
    const act = $('#fitnessActivity').value;
    const d = currentCityData();
    const box = $('#fitnessResult'); box.classList.add('show');
    // Derive the safe/caution/avoid windows from today's actual numbers
    // instead of a fixed hardcoded time range, so it reacts to real UV/heat/rain.
    const morningRain = Math.max(2, Math.round(d.rain*0.35));
    const eveningRain = Math.round(d.rain*0.7);
    const middayNote = d.uv>=8 ? `UV index reaches ${d.uv} (Very High) and feels-like hits ${fmtTemp(d.feels)}` : d.uv>=6 ? `UV index reaches ${d.uv} (High) and feels-like hits ${fmtTemp(d.feels)}` : `feels-like reaches ${fmtTemp(d.feels)}`;
    box.innerHTML = `<div class="result-card">
      <h4>${ic('footprints')} Best window for ${escapeHtml(act)}</h4>
      <p><strong>6:10 – 7:20 AM</strong> looks safest today — cooler temperatures, ${d.uv<6?'low':'moderate'} UV, and rain chance around ${morningRain}%.</p>
      <p>Avoid 12:00–3:30 PM: ${middayNote}.</p>
      <div class="result-tags">
        <span class="result-tag good">6:10–7:20 AM: Safe (~${morningRain}% rain)</span>
        <span class="result-tag warn">5:30–7:00 PM: Caution — ~${eveningRain}% rain, ${d.humidity}% humidity</span>
        <span class="result-tag ${d.uv>=6?'bad':'warn'}">12:00–3:30 PM: Avoid (UV ${d.uv})</span>
      </div>
    </div>`;
  });

  $('#btnCheckEvent').addEventListener('click', ()=> renderEventPlan());

  $('#btnCheckMarine').addEventListener('click', ()=>{
    const locRaw = $('#marineLoc').value.trim();
    const loc = escapeHtml(locRaw);
    const d = currentCityData();
    const box = $('#marineResult'); box.classList.add('show');
    // Seeded on location + today's date (not raw Math.random()) so repeated
    // clicks are stable within a day, and wave height scales with today's
    // actual wind speed instead of being fully unrelated to real conditions.
    const today = new Date().toISOString().slice(0,10);
    const rnd = seededRandom('marine|'+(locRaw||state.user.location)+'|'+today);
    const wave = (0.4 + d.wind/22 + rnd()*0.6).toFixed(1);
    const safe = wave < 1.6;
    box.innerHTML = `<div class="result-card">
      <h4>${ic('waves')} ${loc || state.user.location.split(',')[0]}</h4>
      <p>Wave height ~${wave} m, wind onshore at ${d.wind} km/h. Tide: next high tide in ${Math.round(1+rnd()*5)}h.</p>
      <p>${safe ? 'Conditions are within a generally safe range for swimming close to shore — still watch for rip currents.' : 'Elevated wave height — exercise caution, and check local lifeguard flags before entering the water.'}</p>
      <div class="result-tags">
        <span class="result-tag ${safe?'good':'warn'}">${safe?'Safe window':'Use caution'}</span>
        <span class="result-tag good">No storm warning active</span>
      </div>
    </div>`;
  });
}

const EVENT_TYPE_ICON = {
  'Wedding':'party-popper', 'Birthday party':'party-popper', 'Corporate event':'building-2',
  'Concert / festival':'radio', 'Sports event':'activity', 'Religious / cultural':'landmark', 'Other':'party-popper'
};

function seededRandom(seedStr){
  let h = 0;
  for(let i=0;i<seedStr.length;i++){ h = (Math.imul(31,h) + seedStr.charCodeAt(i)) | 0; }
  return function(){
    h = Math.imul(h ^ (h>>>15), 1 | h);
    h ^= h + Math.imul(h ^ (h>>>7), 61 | h);
    return ((h ^ (h>>>14)) >>> 0) / 4294967296;
  };
}
/**
 * Looks for `loc` among the known demo cities. Returns both the matched
 * data AND whether it was a real match, so callers can be honest about a
 * miss instead of silently handing back an unrelated city's numbers.
 */
function findCity(loc){
  const key = Object.keys(CITIES).find(c=>c.toLowerCase().includes((loc||'').toLowerCase()));
  if(key) return { data: CITIES[key], matched: true, resolvedName: key };
  return { data: currentCityData(), matched: false, resolvedName: state.user.location };
}
function weatherForDate(loc, dateStr){
  const found = findCity(loc);
  const base = found.data;
  const rnd = seededRandom(loc + '|' + dateStr);
  const rainDelta = Math.round(rnd()*45) - 16;
  const windDelta = Math.round(rnd()*10) - 4;
  const tempDelta = Math.round(rnd()*4) - 2;
  return {
    temp: base.temp + tempDelta,
    rain: Math.min(95, Math.max(4, base.rain + rainDelta)),
    wind: Math.max(4, base.wind + windDelta),
    icon: base.icon,
    desc: base.desc,
    matched: found.matched,
    resolvedName: found.resolvedName
  };
}
function computeEventRisk(w, venue, guests){
  let score = 0;
  if(venue !== 'indoor'){
    if(w.rain > 60) score += 3; else if(w.rain > 35) score += 2; else if(w.rain > 15) score += 1;
    if(w.wind > 30) score += 2; else if(w.wind > 22) score += 1;
    if(venue === 'outdoor-open') score += 1;
  }
  if(guests > 300) score += 1;
  if(score >= 4) return 'high';
  if(score >= 2) return 'moderate';
  return 'low';
}
function buildEventChecklist({type, venue, guests, w, backup}){
  const items = [];
  const push = (icon, tone, text) => items.push({icon, tone, text});

  if(venue !== 'indoor'){
    if(w.rain > 35){
      push('cloud-lightning','warn', `Rain probability is ${w.rain}% — arrange tenting or a covered area for at least the main seating zone.`);
      if(!backup) push('triangle-alert','bad', `No backup indoor venue on file — consider booking one, or set a clear go/no-go decision time 24h out.`);
    } else {
      push('check','good', `Rain probability is low (${w.rain}%) — an open-air setup should be comfortable.`);
    }
    if(w.wind > 22){
      push('wind','warn', `Wind expected around ${w.wind} km/h — secure canopies, signage, lightweight decor and any hanging structures.`);
    }
    if(venue === 'outdoor-open'){
      push('sun','warn', `No overhead cover — plan shaded seating and keep ponchos or umbrellas on standby for guests.`);
    }
  } else {
    push('check','good', `Indoor venue — weather has minimal effect on the event itself. Confirm the venue's backup power and entrance drainage.`);
  }

  if(guests > 250){
    push('users','warn', `${guests} expected guests is a large crowd — plan a first-aid/cooling station and clear crowd-flow paths.`);
  }
  if(w.temp >= 32 && venue !== 'indoor'){
    push('thermometer','warn', `Expected temperature ${w.temp}°C — arrange drinking water, shaded rest areas and misting fans.`);
  }
  if(type === 'Concert / festival' || type === 'Sports event'){
    push('radio-tower','warn', `Weatherproof sound/AV equipment, and set a lightning-safety pause protocol with the crew.`);
  }
  if(type === 'Wedding' || type === 'Religious / cultural'){
    push('umbrella','good', `Keep a few umbrellas and a small canopy near the entrance for guest arrival, regardless of forecast.`);
  }
  if(type === 'Corporate event'){
    push('zap','good', `Confirm backup power for AV and electronics, especially for any outdoor component.`);
  }
  push('clock','good', `Re-check this forecast again 24 hours before the event — conditions can shift.`);
  return items;
}
function renderEventPlan(){
  const name = escapeHtml($('#eventName').value.trim() || 'Your event');
  const type = $('#eventType').value;
  const venue = $('#eventVenue').value;
  const locRaw = $('#eventLoc').value.trim() || state.user.location;
  const loc = escapeHtml(locRaw);
  const dateVal = $('#eventDate').value || new Date().toISOString().slice(0,10);
  const time = $('#eventTime').value || '18:00';
  const guests = Math.max(1, parseInt($('#eventGuests').value,10) || 1);
  const backup = $('#eventBackup').checked;

  const w = weatherForDate(locRaw, dateVal);
  const risk = computeEventRisk(w, venue, guests);
  const checklist = buildEventChecklist({type, venue, guests, w, backup});

  const eventDate = new Date(dateVal + 'T' + time);
  const dateLabel = isNaN(eventDate) ? dateVal : eventDate.toLocaleDateString(undefined, {weekday:'short', day:'numeric', month:'short'}) + ' · ' + time;

  
  const dayMs = 86400000;
  const base = new Date(dateVal + 'T00:00:00');
  const days = [-1,0,1].map(off=>{
    const d = new Date(base.getTime() + off*dayMs);
    const ds = d.toISOString().slice(0,10);
    const dw = weatherForDate(locRaw, ds);
    return { offset:off, date:d, weather:dw, riskScore: venue!=='indoor' ? dw.rain + dw.wind*0.5 : 0 };
  });
  const bestOffset = venue==='indoor' ? 0 : days.slice().sort((a,b)=>a.riskScore-b.riskScore)[0].offset;

  const riskLabel = { low:'Low risk', moderate:'Moderate risk', high:'High risk' }[risk];

  const box = $('#eventResult');
  box.classList.add('show');
  box.innerHTML = `
    <div class="result-card">
      <div class="event-summary">
        <div class="event-summary-main">
          <span class="icon-tile lg">${ic(EVENT_TYPE_ICON[type] || 'party-popper','icon-lg')}</span>
          <div>
            <h4>${name}</h4>
            <div class="event-when">${type} · ${dateLabel} · ${loc}</div>
          </div>
        </div>
        <span class="risk-badge ${risk}">${riskLabel}</span>
      </div>

      ${!w.matched ? `<p class="muted small" style="margin-top:.4rem">No exact weather station match for "${loc}" — showing estimates based on your home location (${escapeHtml(w.resolvedName)}) instead.</p>` : ''}

      <div class="event-weather-row">
        <div><small>Condition</small><strong>${w.desc}</strong></div>
        <div><small>Temp</small><strong>${fmtTemp(w.temp)}</strong></div>
        <div><small>Rain chance</small><strong>${w.rain}%</strong></div>
        <div><small>Wind</small><strong>${w.wind} km/h</strong></div>
      </div>

      <div class="event-section-label">Preparation checklist</div>
      <ul class="checklist">
        ${checklist.map(c=>`<li><span class="icon-tile ${c.tone==='bad'?'danger':c.tone==='warn'?'warn':'safe'}">${ic(c.icon)}</span><span>${c.text}</span></li>`).join('')}
      </ul>

      <div class="event-section-label">If your date is flexible</div>
      <div class="day-compare">
        ${days.map(d=>{
          const isBest = d.offset===bestOffset;
          const label = d.offset===0 ? 'Your date' : d.date.toLocaleDateString(undefined,{weekday:'short', day:'numeric', month:'short'});
          return `<div class="day-compare-card ${isBest?'best':''}">
            ${isBest?'<span class="dc-best-tag">Best</span>':''}
            <div class="dc-label">${label}</div>
            <div class="dc-icon">${ic(d.weather.icon,'icon-md')}</div>
            <div class="dc-temp">${fmtTemp(d.weather.temp)}</div>
            <div class="dc-rain">${d.weather.rain}% rain</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderClimate(){
  const metricKey = $('#climateMetric').value;
  const years = +$('#climateRange').value;
  const series = CLIMATE_SERIES[metricKey];
  // Seeded (not Math.random()) so the same metric+range always redraws the
  // same chart instead of visibly reshuffling every time you reopen it.
  const rnd = seededRandom('climate|'+metricKey+'|'+years);
  const data = [];
  for(let i=years-1;i>=0;i--){
    const val = series.base + series.trend*(years-1-i) + (Math.sin(i*0.7)*series.noise*0.5) + (rnd()*2-1)*series.noise*0.5;
    data.push(Math.max(0,val));
  }
  drawChart(data, series, years);

  const avg = data.reduce((a,b)=>a+b,0)/data.length;
  const first = data[0], last = data[data.length-1];
  const changePct = (((last-first)/Math.max(first,0.001))*100).toFixed(1);
  $('#climateStats').innerHTML = `
    <div class="climate-stat"><strong>${avg.toFixed(1)}</strong><span>${years}${t('climate_yr_average')} (${series.unit})</span></div>
    <div class="climate-stat"><strong>${changePct>0?'+':''}${changePct}%</strong><span>${t('climate_change_vs').replace('{n}', years)}</span></div>
    <div class="climate-stat"><strong>${Math.max(...data).toFixed(1)}</strong><span>${t('climate_peak_value')}</span></div>
    <div class="climate-stat"><strong>${Math.min(...data).toFixed(1)}</strong><span>${t('climate_lowest_value')}</span></div>`;
}
function drawChart(data, series, years){
  const canvas = $('#climateChart');
  if(!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  // Canvas fills its card via CSS (width:100%); measure that box rather than
  // guessing from the parent, and fall back to a sane minimum so a chart
  // drawn while its panel is still hidden (clientWidth === 0) never ends up
  // with a negative/zero size that renders blank.
  const w = Math.max(canvas.clientWidth || canvas.parentElement.clientWidth - 48, 240);
  const h = 260;
  canvas.width = w*dpr; canvas.height = h*dpr;
  canvas.style.width = w+'px'; canvas.style.height=h+'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);

  const pad = {l:44,r:16,t:16,b:30};
  const max = Math.max(...data)*1.12, min = Math.min(...data)*0.9;
  const xStep = (w-pad.l-pad.r)/(data.length-1);
  const yFor = v => h-pad.b - ((v-min)/(max-min||1))*(h-pad.t-pad.b);
  const thisYear = new Date().getFullYear();

  // Horizontal gridlines + y-axis value labels
  ctx.strokeStyle = 'rgba(109,132,194,.12)'; ctx.lineWidth=1;
  ctx.fillStyle = 'rgba(154,168,199,.8)'; ctx.font='11px IBM Plex Mono, monospace';
  ctx.textAlign = 'left';
  for(let i=0;i<=4;i++){
    const y = pad.t + (h-pad.t-pad.b)*i/4;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
    const val = max - (max-min)*i/4;
    ctx.fillText(val.toFixed(0), 4, y+3);
  }

  // X-axis year labels — without these there was no way to tell which
  // point on the line corresponded to which year, which is why the chart
  // read as "just a squiggle." Show start / midpoint / current year.
  ctx.textAlign = 'center';
  const tickIdxs = data.length > 2 ? [0, Math.floor((data.length-1)/2), data.length-1] : [0, data.length-1];
  tickIdxs.forEach(i=>{
    const x = pad.l+i*xStep;
    const yearLabel = i===data.length-1 ? String(thisYear) : String(thisYear-(data.length-1-i));
    ctx.fillText(yearLabel, Math.min(Math.max(x, pad.l+18), w-pad.r-18), h-8);
  });
  ctx.textAlign = 'left';

  // Area fill under the line
  const grad = ctx.createLinearGradient(0,pad.t,0,h-pad.b);
  grad.addColorStop(0,'rgba(75,172,206,.28)'); grad.addColorStop(1,'rgba(75,172,206,0)');
  ctx.beginPath();
  data.forEach((v,i)=>{ const x=pad.l+i*xStep, y=yFor(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.lineTo(pad.l+(data.length-1)*xStep, h-pad.b); ctx.lineTo(pad.l,h-pad.b); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // The actual (noisy) data line
  ctx.beginPath();
  data.forEach((v,i)=>{ const x=pad.l+i*xStep, y=yFor(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.strokeStyle = '#4bacce'; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.stroke();

  // Dashed straight-line trend from first to last point
  ctx.setLineDash([4,4]);
  ctx.beginPath();
  ctx.moveTo(pad.l, yFor(data[0]));
  ctx.lineTo(pad.l+(data.length-1)*xStep, yFor(data[data.length-1]));
  ctx.strokeStyle = 'rgba(201,143,78,.7)'; ctx.lineWidth=1.4; ctx.stroke();
  ctx.setLineDash([]);

  renderChartLegend(series);
}
function renderChartLegend(series){
  const card = $('#climateChart')?.parentElement;
  if(!card) return;
  let legend = card.querySelector('.chart-legend');
  if(!legend){
    legend = document.createElement('div');
    legend.className = 'chart-legend';
    card.appendChild(legend);
  }
  legend.innerHTML = `
    <span class="lg-actual" style="color:#4bacce"><i></i>${series.label}</span>
    <span class="lg-trend" style="color:#c98f4e"><i></i>Overall trend</span>`;
}
function initClimate(){
  $('#climateMetric').addEventListener('change', renderClimate);
  $('#climateRange').addEventListener('change', renderClimate);
  window.addEventListener('resize', debounce(()=>{ if(!$('#panel-climate').hidden) renderClimate(); }, 200));
}
function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

const INCIDENTS = [
  {p:'critical', name:'SOS #4821', meta:'Zone 7 · No cellular · mesh relay', action:'Dispatch'},
  {p:'high', name:'SOS #4819', meta:'Riverside Ward 4 · weak signal', action:'Assign'},
  {p:'medium', name:'Damage report #211', meta:'Road blockage, MG Road', action:'Review'},
  {p:'high', name:'SOS #4823', meta:'Coastal sector · battery low', action:'Assign'},
  {p:'medium', name:'Damage report #212', meta:'Power outage reported, Sector 5', action:'Review'},
];
const RESOURCES = [
  {name:'Ambulances available', status:'14 / 20', low:false},
  {name:'Boats ready', status:'3 / 6', low:true},
  {name:'Shelters open', status:'6 / 8', low:false},
  {name:'Responders on duty', status:'42 / 50', low:false},
];
const UNDERSERVED = ['Ward 9 — shelter capacity below demand','Riverside sector C — road accessibility limited','North colony — 1 responder per 4,200 residents'];

function renderCommand(){
  $('#commandStats').innerHTML = `
    <div class="cstat"><strong>${INCIDENTS.length}</strong><span>${t('command_open_incidents')}</span></div>
    <div class="cstat"><strong>3</strong><span>${t('command_active_hazard_zones')}</span></div>
    <div class="cstat"><strong>92%</strong><span>${t('command_mesh_uptime')}</span></div>
    <div class="cstat"><strong>68%</strong><span>${t('command_shelter_capacity')}</span></div>`;
  $('#incidentCount').textContent = `(${INCIDENTS.length})`;
  $('#incidentQueue').innerHTML = INCIDENTS.map(i=>`
    <div class="incident-row">
      <div class="incident-priority p-${i.p}"></div>
      <div class="incident-info"><strong>${i.name}</strong><small>${i.meta}</small></div>
      <button class="incident-action">${i.action}</button>
    </div>`).join('');
  $('#resourceStatus').innerHTML = RESOURCES.map(r=>`
    <div class="resource-row"><span>${r.name}</span><span class="r-status ${r.low?'low':''}">${r.status}</span></div>`).join('');
  $('#underservedList').innerHTML = UNDERSERVED.map(u=>`<div class="underserved-row"><span>${u}</span>${ic('triangle-alert','icon icon-sm')}</div>`).join('');

  $$('.incident-action').forEach(btn=> btn.addEventListener('click', ()=> toast(`${btn.previousElementSibling.querySelector('strong').textContent} → action logged`)));
}

const SOS_STEPS = ['Triggered','Queued locally','Direct delivery attempted','Mesh discovery','Relayed via nearby device','Gateway received','Server acknowledged','Responder assigned'];
let sosTapTimer = null, sosCancelTimer = null, sosCountdownVal = 5;

function initSos(){
  $('#sosButton').addEventListener('click', handleSosTap);
  $('#btnCancelSos').addEventListener('click', cancelSos);
  $('#btnResolveSos').addEventListener('click', resolveSos);
}
function urgencyFromTaps(n){
  if(n>=6) return {label:t('urgency_critical'), cls:'bad'};
  if(n>=3) return {label:t('urgency_high'), cls:'warn'};
  if(n>=1) return {label:t('urgency_standard'), cls:''};
  return {label:'—', cls:''};
}
function handleSosTap(){
  if(state.sos.sending || state.sos.sent) return;
  state.sos.taps++;
  $('#sosTapCount').textContent = state.sos.taps;
  const u = urgencyFromTaps(state.sos.taps);
  const tag = $('#sosUrgencyLabel');
  tag.textContent = u.label;
  tag.style.color = u.cls==='bad' ? 'var(--danger)' : u.cls==='warn' ? 'var(--warn)' : 'var(--text-dim)';

  clearTimeout(sosTapTimer);
  sosTapTimer = setTimeout(()=> beginSosCountdown(), 1100);
}
function beginSosCountdown(){
  if(state.sos.sending || state.sos.sent) return;
  state.sos.sending = true;
  $('#sosCancelRow').hidden = false;
  sosCountdownVal = 5;
  $('#sosCountdown').textContent = sosCountdownVal;
  sosCancelTimer = setInterval(()=>{
    sosCountdownVal--;
    $('#sosCountdown').textContent = Math.max(sosCountdownVal,0);
    if(sosCountdownVal<=0){
      clearInterval(sosCancelTimer);
      dispatchSos();
    }
  },1000);
}
function cancelSos(){
  clearInterval(sosCancelTimer);
  state.sos = {taps:0, sending:false, sent:false, lifecycleStep:-1};
  $('#sosCancelRow').hidden = true;
  $('#sosTapCount').textContent = '0';
  $('#sosUrgencyLabel').textContent = '—';
  $('#sosStatus').hidden = true;
  toast(t('toast_sos_cancelled'));
}
function dispatchSos(){
  state.sos.sending = false;
  state.sos.sent = true;
  $('#sosCancelRow').hidden = true;
  $('#sosStatus').hidden = false;
  $('#sosLifecycle').innerHTML = SOS_STEPS.map(s=>`<li>${s}</li>`).join('');
  const battery = pick(['High (82%)','Medium (46%)','Low (18%)']);
  $('#ctxBattery').textContent = battery;
  $('#ctxConn').textContent = pick(['Direct (weak)','Mesh only','Direct (stable)']);
  $('#ctxHops').textContent = Math.floor(rand(1,4))+' nearby devices';
  $('#ctxLoc').textContent = state.user.location.split(',')[0] + ' · approx.';
  toast(t('toast_sos_transmitted'));
  progressLifecycle(0);
}
function progressLifecycle(i){
  const items = $$('#sosLifecycle li');
  if(i>0) items[i-1].classList.replace('active','done');
  if(i>=items.length) return;
  items[i].classList.add('active');
  setTimeout(()=> progressLifecycle(i+1), 1400);
}
function resolveSos(){
  state.sos = {taps:0, sending:false, sent:false, lifecycleStep:-1};
  $('#sosStatus').hidden = true;
  $('#sosTapCount').textContent = '0';
  $('#sosUrgencyLabel').textContent = '—';
  toast(t('toast_sos_resolved'));
}

/**
 * Single source of truth for "the user picked a new home location" — used by
 * the Home switcher, its search box, and Settings. Adds the location to
 * savedLocations if it's new, updates chrome/state, and kicks off a live
 * weather fetch for it.
 */
function switchLocation(loc, opts={}){
  if(!loc) return;
  state.user.location = loc;
  if(!state.savedLocations.includes(loc)) state.savedLocations.unshift(loc);
  applyUserToChrome();
  renderHome();
  buildLocationPopover();
  saveState();
  if(!opts.silent) toast(t('toast_location_switched')+' '+loc.split(',')[0]);
  refreshWeatherFor(loc);
}

/**
 * Wires a text input up to WeatherAPI.searchLocations for a live "search any
 * city" dropdown — used by both the Home switcher and Settings' location
 * field. Debounced, and guards against a slow response overwriting a newer
 * one if the user keeps typing.
 */
function initLocationSearchBox(inputEl, resultsEl, onSelect){
  if(!inputEl || !resultsEl) return;
  const runSearch = debounce(async ()=>{
    const q = inputEl.value.trim();
    if(q.length < 2){ resultsEl.hidden = true; resultsEl.innerHTML=''; return; }
    if(!(window.WeatherAPI && window.WeatherAPI.searchLocations)){ resultsEl.hidden = true; return; }
    resultsEl.hidden = false;
    resultsEl.innerHTML = `<div class="loc-loading">${t('empty_search_searching')}</div>`;
    const results = await window.WeatherAPI.searchLocations(q);
    if(inputEl.value.trim() !== q) return; // input changed while this was in flight — drop the stale response
    if(!results.length){
      resultsEl.innerHTML = `<div class="loc-empty">${t('empty_search_no_results')}</div>`;
      return;
    }
    resultsEl.innerHTML = results.map(r=>`<button class="loc-item" data-loc="${escapeHtml(r.label)}">${ic('map-pin','icon icon-sm')} ${escapeHtml(r.label)}</button>`).join('');
    $$('.loc-item', resultsEl).forEach(b=>{
      b.addEventListener('click', ()=>{ resultsEl.hidden = true; onSelect(b.dataset.loc); });
    });
  }, 350);
  inputEl.addEventListener('input', runSearch);
  inputEl.addEventListener('focus', ()=>{ if(inputEl.value.trim().length>=2) runSearch(); });
}

function buildLocationPopover(){
  const list = $('#locationPopoverList');
  list.innerHTML = state.savedLocations.map(loc=>`<button class="loc-item" data-loc="${loc}">${ic('map-pin','icon icon-sm')} ${loc}</button>`).join('');
  $$('.loc-item', list).forEach(b=>{
    b.addEventListener('click', ()=>{
      $('#locationPopover').hidden = true;
      switchLocation(b.dataset.loc);
    });
  });
}
function initLocationSwitch(){
  $('#btnLocationSwitch').addEventListener('click', (e)=>{
    const pop = $('#locationPopover');
    const btnRect = e.currentTarget.getBoundingClientRect();
    pop.style.top = (btnRect.bottom+8)+'px';
    pop.style.left = Math.min(btnRect.left, window.innerWidth-260)+'px';
    pop.hidden = !pop.hidden;
    if(!pop.hidden) $('#locationSearchInput').focus();
  });
  document.addEventListener('click', (e)=>{
    const pop = $('#locationPopover');
    if(!pop.hidden && !pop.contains(e.target) && e.target.id!=='btnLocationSwitch' && !e.target.closest('#btnLocationSwitch')){
      pop.hidden = true;
    }
  });

  initLocationSearchBox($('#locationSearchInput'), $('#locationSearchResults'), (label)=>{
    $('#locationPopover').hidden = true;
    $('#locationSearchInput').value = '';
    $('#locationSearchResults').hidden = true;
    switchLocation(label);
  });
}

function initQuickSettings(){
  const popover = $('#settingsPopover');
  const triggers = $$('.js-settings-trigger');
  if(!popover || !triggers.length) return;

  const quickLangSelect = $('#quickLanguageSelect');
  if(quickLangSelect){
    quickLangSelect.innerHTML = I18N_DATA.langs.map(l=>`<option value="${l.code}">${l.native} — ${l.english}</option>`).join('');
    quickLangSelect.value = state.lang;
    quickLangSelect.addEventListener('change', e=> applyLanguage(e.target.value));
  }

  function syncThemeButtons(){
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    $$('#quickThemeSwitch .seg-btn').forEach(b=> b.classList.toggle('active', b.dataset.theme===theme));
  }

  $$('#quickThemeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> setTheme(btn.dataset.theme));
  });

  function closeSettingsPopover(){
    popover.hidden = true;
    triggers.forEach(tr=> tr.setAttribute('aria-expanded','false'));
  }
  function openSettingsPopover(trigger){
    syncThemeButtons();
    if(quickLangSelect) quickLangSelect.value = state.lang;
    popover.hidden = false;
    const popW = popover.offsetWidth || 272;
    const r = trigger.getBoundingClientRect();
    let left = r.right - popW;
    left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));
    let top = r.bottom + 8;
    const popH = popover.offsetHeight || 220;
    if(top + popH > window.innerHeight - 12) top = Math.max(12, r.top - popH - 8);
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
    triggers.forEach(tr=> tr.setAttribute('aria-expanded', tr===trigger ? 'true' : 'false'));
  }

  triggers.forEach(trigger=>{
    trigger.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(!popover.hidden){ closeSettingsPopover(); return; }
      openSettingsPopover(trigger);
    });
  });

  document.addEventListener('click', (e)=>{
    if(!popover.hidden && !popover.contains(e.target) && !e.target.closest('.js-settings-trigger')){
      closeSettingsPopover();
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !popover.hidden) closeSettingsPopover();
  });
  window.addEventListener('resize', closeSettingsPopover);

  $('#quickLogoutBtn').addEventListener('click', ()=>{
    closeSettingsPopover();
    doLogout();
  });
}

function initProfile(){
  $('#settingName').addEventListener('change', e=>{ state.user.name=e.target.value; applyUserToChrome(); saveState(); });
  $('#settingLocation').addEventListener('change', e=>{
    const val = e.target.value.trim();
    if(val) switchLocation(val);
  });
  initLocationSearchBox($('#settingLocation'), $('#settingLocationResults'), (label)=>{
    $('#settingLocation').value = label;
    switchLocation(label);
  });
  $$('#settingRoleGrid .role-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      $$('#settingRoleGrid .role-card').forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
      state.user.role = card.dataset.role;
      applyUserToChrome(); renderHome(); renderCommand(); saveState();
      const restricted = ['command','climate'];
      const activePanel = $$('.panel').find(p=>!p.hidden);
      if(activePanel && restricted.includes(activePanel.id.replace('panel-','')) && $('#nav'+({command:'Command',climate:'Climate'}[activePanel.id.replace('panel-','')])).hidden){
        gotoView('chat');
        toast(t('toast_role_updated')+' '+card.dataset.role+' — '+t('toast_role_updated_restricted'));
      } else {
        toast(t('toast_role_updated')+' '+card.dataset.role);
      }
    });
  });

  $$('#unitSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('#unitSwitch .seg-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); state.unit = btn.dataset.unit;
      renderHome(); saveState();
    });
  });
  $$('#themeSwitch .seg-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> setTheme(btn.dataset.theme));
  });
  $('#settingLanguage').addEventListener('change', e=> applyLanguage(e.target.value));
  $('#btnOpenLanguagePicker').addEventListener('click', ()=> openLanguageGate('app'));

  $('#toggleLargeText').addEventListener('change', e=> document.body.classList.toggle('large-text', e.target.checked));
  $('#toggleContrast').addEventListener('change', e=> document.body.classList.toggle('high-contrast', e.target.checked));
  $('#toggleMotion').addEventListener('change', e=> document.body.classList.toggle('reduced-motion', e.target.checked));
  $('#toggleLowData').addEventListener('change', e=> toast(e.target.checked?t('toast_low_data_on'):t('toast_low_data_off')));
  $('#toggleBattery').addEventListener('change', e=> toast(e.target.checked?t('toast_battery_sos_on'):t('toast_battery_sos_off')));

  renderSavedLocations();
  $('#btnAddLocation').addEventListener('click', ()=>{
    const v = $('#newLocationInput').value.trim();
    if(!v) return;
    if(!state.savedLocations.includes(v)) state.savedLocations.push(v);
    $('#newLocationInput').value='';
    renderSavedLocations(); buildLocationPopover(); saveState();
  });

  $('#btnLogout').addEventListener('click', doLogout);
}
function doLogout(){
  if(confirm(t('confirm_logout'))){
    localStorage.removeItem('weathergpt_state');
    location.reload();
  }
}
function renderSavedLocations(){
  if(!state.savedLocations.length){
    $('#savedLocationsList').innerHTML = `<div class="empty-state empty-state-sm">
      <svg class="icon-md empty-state-icon"><use href="#i-map-pin"></use></svg>
      <p class="empty-state-title">${t('empty_locations_title')}</p>
      <p class="empty-state-sub">${t('empty_locations_sub')}</p>
    </div>`;
    return;
  }
  $('#savedLocationsList').innerHTML = state.savedLocations.map(loc=>`
    <div class="saved-location-row"><span>${ic('map-pin','icon icon-sm')} ${loc}</span><button data-loc="${loc}" aria-label="Remove">${ic('x','icon icon-sm')}</button></div>`).join('');
  $$('#savedLocationsList button').forEach(b=>{
    b.addEventListener('click', ()=>{
      state.savedLocations = state.savedLocations.filter(l=>l!==b.dataset.loc);
      renderSavedLocations(); buildLocationPopover(); saveState();
    });
  });
}

/** Registers the service worker so the app shell + last-seen data work offline. No-op on file:// or unsupported browsers. */
function initServiceWorker(){
  if(!('serviceWorker' in navigator)) return;
  if(location.protocol === 'file:') return; // service workers require http(s)/localhost
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(err=> console.warn('Service worker registration failed:', err));
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadState();
  initServiceWorker();
  buildLanguageGate();
  buildSettingsLanguageOptions();
  initAuth();
  initLandingNav();
  initNav();
  initAlertTabs();
  initChat();
  initMap();
  initPlan();
  initClimate();
  initSos();
  initLocationSwitch();
  initProfile();
  initQuickSettings();

  
  setInterval(()=>{
    const el = $('#scopeTemp');
    if(el) el.textContent = (30 + Math.random()*3).toFixed(1)+'°C';
  }, 4000);

  let savedLang = null;
  try{ savedLang = localStorage.getItem('weathergpt_lang'); }catch(e){}
  if(savedLang){
    applyLanguage(savedLang);
    showView('landing');
  } else {
    showView('language');
  }

  
  
  initSplash(()=>{});
});

})();
