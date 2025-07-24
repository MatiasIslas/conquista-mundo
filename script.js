// 🌍 INICIALIZAR MAPA
const map = L.map('map', {
  center: [20, 0],
  zoom: 3,
  minZoom: 2.5,
  maxZoom: 9,
  zoomControl: true,
  attributionControl: false
});

// 🎨 PALETA DE COLORES
const palette = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6"];

// 📚 DATOS DE PAÍSES (sólo para traducciones visuales)
const traducciones = {
  "Argentina": "Argentina", "Brazil": "Brasil", "United States": "Estados Unidos", "Russia": "Rusia",
  "China": "China", "Japan": "Japón", "Germany": "Alemania", "France": "Francia", "Spain": "España",
  "Italy": "Italia", "United Kingdom": "Reino Unido", "Canada": "Canadá", "Mexico": "México",
  "Australia": "Australia", "India": "India"
};

const flagEmojis = {
  "Argentina": "🇦🇷", "Brazil": "🇧🇷", "United States": "🇺🇸", "Russia": "🇷🇺",
  "China": "🇨🇳", "Japan": "🇯🇵", "Germany": "🇩🇪", "France": "🇫🇷",
  "Spain": "🇪🇸", "Italy": "🇮🇹", "United Kingdom": "🇬🇧", "Canada": "🇨🇦",
  "Mexico": "🇲🇽", "Australia": "🇦🇺", "India": "🇮🇳"
};

const currencies = {
  "Argentina": "Peso argentino", "Brazil": "Real", "United States": "Dólar",
  "Russia": "Rublo", "China": "Yuan", "Japan": "Yen", "Germany": "Euro",
  "France": "Euro", "Spain": "Euro", "Italy": "Euro", "United Kingdom": "Libra esterlina",
  "Canada": "Dólar canadiense", "Mexico": "Peso mexicano", "Australia": "Dólar australiano", "India": "Rupia"
};

let selectedCountry = null, selectedColor = null, selectedCurrency = null;

// 🧠 FUNCIÓN PARA ENCONTRAR VECINOS
function getNeighbors(features) {
  const neighbors = {};
  features.forEach((a, i) => {
    neighbors[a.properties.name] = new Set();
    features.forEach((b, j) => {
      if (i !== j && turf.booleanIntersects(a, b)) {
        neighbors[a.properties.name].add(b.properties.name);
      }
    });
  });
  return neighbors;
}

// Variable global para guardar países al cargar
let allCountries = [];

// 🌍 CARGAR MAPA Y COLOREAR PAÍSES
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(data => {
    const countries = data.features;
    allCountries = countries; // guardamos para luego usar

    const neighbors = getNeighbors(countries);
    const countryColors = {};

    countries.forEach(c => {
      const usedColors = new Set();
      neighbors[c.properties.name]?.forEach(n => {
        if (countryColors[n]) usedColors.add(countryColors[n]);
      });
      for (const color of palette) {
        if (!usedColors.has(color)) {
          countryColors[c.properties.name] = color;
          break;
        }
      }
    });

    L.geoJSON(countries, {
      style: f => {
        const clr = countryColors[f.properties.name] || "#ccc";
        return { color: clr, fillColor: clr, weight: 0.8, fillOpacity: 0.8 };
      },
      onEachFeature: (f, l) => {
        const nombre = traducciones[f.properties.name] || f.properties.name;
        const center = l.getBounds().getCenter();
        L.marker(center, {
          icon: L.divIcon({
            className: 'country-label',
            html: `<span>${nombre}</span>`,
            iconSize: [100, 20]
          })
        }).addTo(map);
      }
    }).addTo(map);

    // ** Aquí llenamos el select usando los nombres reales **
    populateCountrySelect(countries);
  });

// Función para llenar select con nombres reales, y mostrar traducciones en texto
function populateCountrySelect(countries) {
  const select = document.getElementById('countrySelect');
  select.innerHTML = '<option disabled selected>Selecciona un país</option>';
  countries.forEach(country => {
    const nameReal = country.properties.name;
    const nombreMostrar = traducciones[nameReal] || nameReal;
    const option = document.createElement('option');
    option.value = nameReal;        // valor EXACTO del GeoJSON
    option.textContent = nombreMostrar;  // nombre traducido para mostrar
    select.appendChild(option);
  });

  updateFlagAndCurrency();
}

// 🌊 OCÉANOS
[
  { nombre: "Océano Atlántico", coords: [0, -30] },
  { nombre: "Océano Pacífico", coords: [0, -150] },
  { nombre: "Océano Índico", coords: [-20, 80] },
  { nombre: "Océano Ártico", coords: [75, 0] },
  { nombre: "Océano Antártico", coords: [-70, 0] }
].forEach(o => {
  L.marker(o.coords, {
    icon: L.divIcon({
      className: 'ocean-label',
      html: `<div>${o.nombre}</div>`,
      iconSize: [200, 30]
    })
  }).addTo(map);
});

// 🏛️ CAPITALES
L.geoJSON({
  "type": "FeatureCollection",
  "features": [
    {"type":"Feature","properties":{"capital":"Buenos Aires"},"geometry":{"type":"Point","coordinates":[-58.4173,-34.6118]}},
    {"type":"Feature","properties":{"capital":"Washington D.C."},"geometry":{"type":"Point","coordinates":[-77.0369,38.9072]}},
    {"type":"Feature","properties":{"capital":"Brasilia"},"geometry":{"type":"Point","coordinates":[-47.9292,-15.7801]}},
    {"type":"Feature","properties":{"capital":"Madrid"},"geometry":{"type":"Point","coordinates":[-3.7038,40.4168]}},
    {"type":"Feature","properties":{"capital":"París"},"geometry":{"type":"Point","coordinates":[2.3522,48.8566]}},
    {"type":"Feature","properties":{"capital":"Londres"},"geometry":{"type":"Point","coordinates":[-0.1276,51.5074]}}
  ]
}, {
  pointToLayer: (f, latlng) => L.circleMarker(latlng, {
    radius: 5, fillColor: "#d50000", color: "#fff", weight: 1, fillOpacity: 0.9
  }),
  onEachFeature: (f, l) => {
    if (f.properties.capital) {
      l.bindTooltip(f.properties.capital, { permanent: false, direction: 'top', offset: [0, -5] });
    }
  }
}).addTo(map);

// 📦 SISTEMA DE GUARDADO Y MENÚ
function continueGame() {
  const saved = localStorage.getItem("conqorSave");
  if (!saved) {
    alert("No hay ninguna partida guardada.");
    return;
  }

  const game = JSON.parse(saved);
  selectedCountry = game.country;
  selectedColor = game.color;
  selectedCurrency = game.currency;

  // Restaurar menú superior
  document.querySelector('.nav-left').innerHTML = `
    ${flagEmojis[selectedCountry] || "🏳️"} ${traducciones[selectedCountry] || selectedCountry} — ${game.leaderType} <strong>${game.leaderName}</strong>
  `;

  document.querySelector('.nav-right').insertAdjacentHTML("afterbegin", `
    <div style="margin-right: 10px; font-weight: bold;">💰 Economía: ${game.economy} ${game.currency}</div>
  `);

  document.getElementById('main-menu').style.display = 'none';

  // Pintar el mapa de nuevo
  if (window.mapLayer) map.removeLayer(window.mapLayer);

  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
      const countries = data.features;
      window.mapLayer = L.geoJSON(countries, {
        style: f => f.properties.name === selectedCountry
          ? { color: selectedColor, fillColor: selectedColor, weight: 1, fillOpacity: 0.8 }
          : { color: "#ccc", fillColor: "#ccc", weight: 0.5, fillOpacity: 0.3 }
      }).addTo(map);

      const selFeat = countries.find(f => f.properties.name === selectedCountry);
      if (selFeat) {
        const bounds = L.geoJSON(selFeat).getBounds();
        map.flyToBounds(bounds, { duration: 2 });
      }
    });
}


function openSettings() {
  alert("Ajustes aún no disponibles.");
}

function showCredits() {
  alert("Conqor — Desarrollado por Axlan Studios");
}

function toggleMainMenu() {
  const menu = document.getElementById('main-menu');
  menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
}

function saveGame() {
  const leaderName = document.getElementById('leaderName').value || "Sin nombre";
  const leaderType = document.querySelector('input[name="leader"]:checked')?.value || "👨‍💼 Joven político";
  const color = document.getElementById('colorPicker').value || "#ff0000";
  const country = selectedCountry;
  const currency = selectedCurrency;

  if (!country) {
    alert("Primero debes iniciar una partida para poder guardarla.");
    return;
  }

  const gameState = {
    timestamp: new Date().toISOString(),
    country,
    color,
    currency,
    leaderName,
    leaderType,
    economy: 100 // Puedes hacerlo dinámico si tienes lógica para modificar economía
  };

  localStorage.setItem("conqorSave", JSON.stringify(gameState));
  alert("¡Partida guardada correctamente!");
}


// 🔄 RESET Y NUEVO JUEGO
function resetGameData() {
  localStorage.clear();
  selectedCountry = selectedColor = selectedCurrency = null;

  document.getElementById('leaderName').value = '';
  document.getElementById('countrySelect').selectedIndex = 0;
  document.getElementById('colorPicker').value = '#ff0000';
  document.querySelector('input[name="leader"][value="👨‍💼 Joven político"]').checked = true;
  document.getElementById('flagEmoji').textContent = "🏳️";
  document.getElementById('currencyName').textContent = "-";

  document.querySelector('.nav-left').innerHTML = "CONQOR";
  const econ = document.querySelector('.nav-right div');
  if (econ) econ.remove();

  if (window.mapLayer) {
    map.removeLayer(window.mapLayer);
    window.mapLayer = null;
  }

  map.setView([20, 0], 3);
}

function startNewGame() {
  resetGameData();
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('setup-menu').style.display = 'block';

  // No llenamos aquí el select porque ya se llena cuando se carga el GeoJSON
  // pero por si acaso forzamos actualización
  if (allCountries.length) {
    populateCountrySelect(allCountries);
  }
}

function updateFlagAndCurrency() {
  const country = document.getElementById('countrySelect').value;
  selectedCountry = country;
  selectedCurrency = currencies[country] || "Moneda desconocida";

  document.getElementById('flagEmoji').textContent = flagEmojis[country] || "🏳️";
  document.getElementById('currencyName').textContent = selectedCurrency;
}

function confirmSetup() {
  selectedColor = document.getElementById('colorPicker').value;
  const leader = document.querySelector('input[name="leader"]:checked').value;
  const name = document.getElementById('leaderName').value || "Sin nombre";

  document.querySelector('.nav-left').innerHTML = `
    ${flagEmojis[selectedCountry] || "🏳️"} ${traducciones[selectedCountry] || selectedCountry} — ${leader} <strong>${name}</strong>
  `;

  document.querySelector('.nav-right').insertAdjacentHTML("afterbegin", `
    <div style="margin-right: 10px; font-weight: bold;">💰 Economía: 100 ${selectedCurrency}</div>
  `);

  document.getElementById('setup-menu').style.display = 'none';

  if (window.mapLayer) map.removeLayer(window.mapLayer);

  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
      const countries = data.features;
      window.mapLayer = L.geoJSON(countries, {
        style: f => f.properties.name === selectedCountry
          ? { color: selectedColor, fillColor: selectedColor, weight: 1, fillOpacity: 0.8 }
          : { color: "#ccc", fillColor: "#ccc", weight: 0.5, fillOpacity: 0.3 }
      }).addTo(map);

      const selFeat = countries.find(f => f.properties.name === selectedCountry);
      if (selFeat) {
        const bounds = L.geoJSON(selFeat).getBounds();
        map.flyToBounds(bounds, { duration: 2 });
      }
    });
}
