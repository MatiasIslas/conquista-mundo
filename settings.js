// === CONFIGURACIÓN GLOBAL ===
const settings = {
  sound: {
    musicEnabled: true,
    sfxEnabled: true,
    volumeGeneral: 1,
    volumeMusic: 1,
    volumeSfx: 1,
  },
  view: {
    colorScheme: "clásico",
    showCountryNames: true,
    showCapitals: true,
    showOceans: true,
    showOnlyConquered: false,
    animateBorders: true,
  },
  language: {
    selected: "es",
    geoNameStyle: "original",
  },
  controls: {
    zoomSensitivity: 1,
    invertMapMovement: false,
    resetViewOnClick: true,
  },
  account: {
    autoSave: true,
  },
  ai: {
    difficulty: "medio",
    behavior: "aleatorio",
  },
  system: {
    lowPerformance: false,
    showFPS: false,
    autoUpdate: true,
  },
  privacy: {
    showIP: false,
    shareData: false,
    allowNotifications: false,
  },
  compatibility: {
    mobileMode: false,
    uiSize: "medio",
  }
};

// === CARGAR AJUSTES DESDE LOCALSTORAGE ===
function loadSettings() {
  const saved = localStorage.getItem("gameSettings");
  if (saved) Object.assign(settings, JSON.parse(saved));
}

// === GUARDAR AJUSTES EN LOCALSTORAGE ===
function saveSettings() {
  localStorage.setItem("gameSettings", JSON.stringify(settings));
}

// === APLICAR CAMBIOS EN EL JUEGO ===
function applySettings() {
  // SONIDO
  musicPlayer.volume = settings.sound.musicEnabled ? settings.sound.volumeMusic * settings.sound.volumeGeneral : 0;
  sfxPlayer.volume = settings.sound.sfxEnabled ? settings.sound.volumeSfx * settings.sound.volumeGeneral : 0;

  // VISTA
  document.body.classList.toggle("modo-nocturno", settings.view.colorScheme === "nocturno");
  document.body.classList.toggle("modo-colorblind", settings.view.colorScheme === "colorblind");
  toggleCountryLabels(settings.view.showCountryNames);
  toggleCapitalLabels(settings.view.showCapitals);
  toggleOceanNames(settings.view.showOceans);
  toggleOnlyConquered(settings.view.showOnlyConquered);
  toggleAnimatedBorders(settings.view.animateBorders);

  // LENGUAJE
  changeLanguage(settings.language.selected);
  applyGeoNameStyle(settings.language.geoNameStyle);

  // CONTROLES
  map.scrollWheelZoom.setSpeed(settings.controls.zoomSensitivity);
  map.dragging._draggable._direction = settings.controls.invertMapMovement ? -1 : 1;

  // SISTEMA
  toggleLowPerformanceMode(settings.system.lowPerformance);
  toggleFPSCounter(settings.system.showFPS);
  if (settings.system.autoUpdate) autoUpdateGameData();

  // PRIVACIDAD
  toggleIPDisplay(settings.privacy.showIP);
  toggleDataSharing(settings.privacy.shareData);
  toggleBrowserNotifications(settings.privacy.allowNotifications);

  // COMPATIBILIDAD
  document.body.classList.toggle("modo-movil", settings.compatibility.mobileMode);
  document.documentElement.style.setProperty('--ui-size', settings.compatibility.uiSize);
}

// === FUNCIONES INDIVIDUALES (ejemplos, deben existir en el resto del juego) ===
function toggleCountryLabels(state) {
  document.querySelectorAll('.country-label').forEach(el => el.style.display = state ? "block" : "none");
}
function toggleCapitalLabels(state) {
  document.querySelectorAll('.capital-label').forEach(el => el.style.display = state ? "block" : "none");
}
function toggleOceanNames(state) {
  document.querySelectorAll('.ocean-label').forEach(el => el.style.display = state ? "block" : "none");
}
function toggleOnlyConquered(state) {
  document.querySelectorAll('.country').forEach(el => {
    el.style.display = state && !el.classList.contains("conquered") ? "none" : "block";
  });
}
function toggleAnimatedBorders(state) {
  document.querySelectorAll('.country-border').forEach(el => {
    el.classList.toggle("animate-border", state);
  });
}
function changeLanguage(lang) {
  // Traduce todo el juego al idioma elegido
}
function applyGeoNameStyle(style) {
  // Cambia nombres geográficos a "original", "adaptado" o "histórico"
}
function toggleLowPerformanceMode(state) {
  document.body.classList.toggle("low-performance", state);
}
function toggleFPSCounter(state) {
  const fps = document.getElementById("fps-counter");
  if (fps) fps.style.display = state ? "block" : "none";
}
function autoUpdateGameData() {
  // Lógica para actualización automática del mapa
}
function toggleIPDisplay(state) {
  const ip = document.getElementById("user-ip");
  if (ip) ip.style.display = state ? "block" : "none";
}
function toggleDataSharing(state) {
  // Enviar datos anónimos si está activado
}
function toggleBrowserNotifications(state) {
  if (state) Notification.requestPermission();
}

// === EVENTOS UI (EJEMPLOS) ===
document.querySelectorAll(".settings-toggle").forEach(toggle => {
  toggle.addEventListener("change", (e) => {
    const key = e.target.dataset.setting;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const [group, option] = key.split(".");
    settings[group][option] = value;
    saveSettings();
    applySettings();
  });
});

// === INICIALIZACIÓN ===
loadSettings();
applySettings();

