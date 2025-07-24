const map = L.map('map', {
  center: [20, 0],
  zoom: 3,
  minZoom: 2.5,
  maxZoom: 9,
  zoomControl: true,
  attributionControl: false
});

// Paleta de colores
const palette = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8",
  "#f58231", "#911eb4", "#46f0f0", "#f032e6"
];

// Traducciones de países
const traducciones = {
  "Argentina": "Argentina",
  "Brazil": "Brasil",
  "United States": "Estados Unidos",
  "Russia": "Rusia",
  "China": "China",
  "Japan": "Japón",
  "Germany": "Alemania",
  "France": "Francia",
  "Spain": "España",
  "Italy": "Italia",
  "United Kingdom": "Reino Unido",
  "Canada": "Canadá",
  "Mexico": "México",
  "Australia": "Australia",
  "India": "India"
};

// Banderas
const flagEmojis = {
  "Argentina": "🇦🇷", "Brazil": "🇧🇷", "United States": "🇺🇸", "Russia": "🇷🇺",
  "China": "🇨🇳", "Japan": "🇯🇵", "Germany": "🇩🇪", "France": "🇫🇷",
  "Spain": "🇪🇸", "Italy": "🇮🇹", "United Kingdom": "🇬🇧", "Canada": "🇨🇦",
  "Mexico": "🇲🇽", "Australia": "🇦🇺", "India": "🇮🇳"
};

// Monedas
const currencies = {
  "Argentina": "Peso argentino", "Brazil": "Real", "United States": "Dólar",
  "Russia": "Rublo", "China": "Yuan", "Japan": "Yen", "Germany": "Euro",
  "France": "Euro", "Spain": "Euro", "Italy": "Euro", "United Kingdom": "Libra esterlina",
  "Canada": "Dólar canadiense", "Mexico": "Peso mexicano", "Australia": "Dólar australiano", "India": "Rupia"
};

let selectedCountry = null;
let selectedColor = null;
let selectedCurrency = null;

// --- MAPA: Países y vecinos ---
function getNeighbors(features) {
  const neighbors = {};
  features.forEach((a, i) => {
    const aName = a.properties.name;
    neighbors[aName] = new Set();
    features.forEach((b, j) => {
      if (i === j) return;
      if (turf.booleanIntersects(a, b)) {
        neighbors[aName].add(b.properties.name);
      }
    });
  });
  return neighbors;
}

fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(data => {
    const countries = data.features;
    const neighbors = getNeighbors(countries);
    const countryColors = {};

    countries.forEach(country => {
      const name = country.properties.name;
      const usedColors = new Set();
      if (neighbors[name]) {
        neighbors[name].forEach(n => {
          if (countryColors[n]) usedColors.add(countryColors[n]);
        });
      }
      for (const color of palette) {
        if (!usedColors.has(color)) {
          countryColors[name] = color;
          break;
        }
      }
    });

    L.geoJSON(countries, {
      style: feature => {
        const color = countryColors[feature.properties.name] || "#ccc";
        return { color, fillColor: color, weight: 0.8, fillOpacity: 0.8 };
      },
      onEachFeature: (feature, layer) => {
        const name = traducciones[feature.properties.name] || feature.properties.name;
        const center = layer.getBounds().getCenter();
        L.marker(center, {
          icon: L.divIcon({
            className: 'country-label',
            html: `<span>${name}</span>`,
            iconSize: [100, 20]
          })
        }).addTo(map);
      }
    }).addTo(map);
  });

// Océanos
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

// Capitales
const capitals = {
  "type": "FeatureCollection",
  "features": [
    {"type":"Feature","properties":{"capital":"Buenos Aires"},"geometry":{"type":"Point","coordinates":[-58.4173,-34.6118]}},
    {"type":"Feature","properties":{"capital":"Washington D.C."},"geometry":{"type":"Point","coordinates":[-77.0369,38.9072]}},
    {"type":"Feature","properties":{"capital":"Brasilia"},"geometry":{"type":"Point","coordinates":[-47.9292,-15.7801]}},
    {"type":"Feature","properties":{"capital":"Madrid"},"geometry":{"type":"Point","coordinates":[-3.7038,40.4168]}},
    {"type":"Feature","properties":{"capital":"París"},"geometry":{"type":"Point","coordinates":[2.3522,48.8566]}},
    {"type":"Feature","properties":{"capital":"Londres"},"geometry":{"type":"Point","coordinates":[-0.1276,51.5074]}}
  ]
};

L.geoJSON(capitals, {
  pointToLayer: (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 5,
      fillColor: "#d50000",
      color: "#fff",
      weight: 1,
      fillOpacity: 0.9
    });
  },
  onEachFeature: (feature, layer) => {
    if (feature.properties && feature.properties.capital) {
      layer.bindTooltip(feature.properties.capital, {
        permanent: false,
        direction: 'top',
        offset: [0, -5]
      });
    }
  }
}).addTo(map);

// Interfaz y lógica de juego

function continueGame() {
  const saved = localStorage.getItem("conqorSave");
  if (saved) {
    const data = JSON.parse(saved);
    alert("Partida cargada: " + data.timestamp);
  } else {
    alert("No hay ninguna partida guardada.");
  }
  document.getElementById('main-menu').style.display = 'none';
}

function openSettings() {
  alert("Ajustes aún no disponibles.");
}

function showCredits() {
  alert("Conqor - Desarrollado por Matías Islas");
}

function toggleMainMenu() {
  const menu = document.getElementById('main-menu');
  menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
}

function saveGame() {
  const gameData = {
    timestamp: new Date().toISOString(),
    mensaje: "Esta es una partida guardada"
  };
  localStorage.setItem("conqorSave", JSON.stringify(gameData));
  alert("¡Partida guardada correctamente!");
}

// 🔄 RESET GENERAL
function resetGameData() {
  localStorage.clear();
  selectedCountry = null;
  selectedColor = null;
  selectedCurrency = null;

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

// 🔁 NUEVO JUEGO
function startNewGame() {
  resetGameData();
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('setup-menu').style.display = 'block';

  const select = document.getElementById('countrySelect');
  select.innerHTML = '<option disabled selected>Selecciona un país</option>';
  Object.keys(traducciones).forEach(pais => {
    const option = document.createElement('option');
    option.value = pais;
    option.textContent = traducciones[pais];
    select.appendChild(option);
  });

  updateFlagAndCurrency();
}

// Actualiza bandera y moneda
function updateFlagAndCurrency() {
  const country = document.getElementById('countrySelect').value;
  selectedCountry = country;
  selectedCurrency = currencies[country] || "Moneda desconocida";

  document.getElementById('flagEmoji').textContent = flagEmojis[country] || "🏳️";
  document.getElementById('currencyName').textContent = selectedCurrency;
}

// Confirmar inicio
function confirmSetup() {
  selectedColor = document.getElementById('colorPicker').value;
  const leader = document.querySelector('input[name="leader"]:checked').value;
  const name = document.getElementById('leaderName').value || "Sin nombre";

  document.querySelector('.nav-left').innerHTML = `
    ${flagEmojis[selectedCountry] || "🏳️"} ${traducciones[selectedCountry]} — ${leader} <strong>${name}</strong>
  `;

  document.querySelector('.nav-right').insertAdjacentHTML("afterbegin", `
    <div style="margin-right: 10px; font-weight: bold;">💰 Economía: 100 ${selectedCurrency}</div>
  `);

  document.getElementById('setup-menu').style.display = 'none';

  if (window.mapLayer) {
    map.removeLayer(window.mapLayer);
  }

  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
      const countries = data.features;
      window.mapLayer = L.geoJSON(countries, {
        style: feature => {
          return (feature.properties.name === selectedCountry) ? {
            color: selectedColor, fillColor: selectedColor, weight: 1, fillOpacity: 0.8
          } : {
            color: "#ccc", fillColor: "#ccc", weight: 0.5, fillOpacity: 0.3
          };
        }
      }).addTo(map);

      const selectedFeature = countries.find(f => f.properties.name === selectedCountry);
      if (selectedFeature) {
        const bounds = L.geoJSON(selectedFeature).getBounds();
        map.flyToBounds(bounds, { duration: 2 });
      }
    });
}
