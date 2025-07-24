const map = L.map('map', {
  center: [20, 0],
  zoom: 3,
  minZoom: 2.5,
  maxZoom: 9,
  zoomControl: false,
  attributionControl: false
});

// Paleta de colores opuestos y vibrantes (mínimo 4 por teoría de mapas)
const palette = [
  "#e6194b", // rojo
  "#3cb44b", // verde
  "#ffe119", // amarillo
  "#4363d8", // azul
  "#f58231", // naranja
  "#911eb4", // violeta
  "#46f0f0", // celeste
  "#f032e6", // fucsia
];

// Traducciones de países (pueden expandirse)
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

// Relacionar países vecinos
function getNeighbors(features) {
  const neighbors = {};
  features.forEach((a, i) => {
    const aName = a.properties.name;
    neighbors[aName] = new Set();

    const aBounds = turf.bbox(a);
    features.forEach((b, j) => {
      if (i === j) return;
      const bName = b.properties.name;
      const bBounds = turf.bbox(b);

      // Verifica si los límites se tocan
      const intersect = turf.booleanIntersects(a, b);
      if (intersect) {
        neighbors[aName].add(bName);
      }
    });
  });
  return neighbors;
}

// Cargar países y aplicar colores que no se repitan entre vecinos
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(data => {
    const countries = data.features;
    const neighbors = getNeighbors(countries);
    const countryColors = {};

    // Algoritmo de coloreo (Greedy)
    countries.forEach(country => {
      const name = country.properties.name;
      const usedColors = new Set();

      if (neighbors[name]) {
        neighbors[name].forEach(n => {
          if (countryColors[n]) {
            usedColors.add(countryColors[n]);
          }
        });
      }

      // Asignar primer color disponible no usado
      for (const color of palette) {
        if (!usedColors.has(color)) {
          countryColors[name] = color;
          break;
        }
      }
    });

    L.geoJSON(countries, {
      style: feature => {
        const name = feature.properties.name;
        const color = countryColors[name] || "#ccc";
        return {
          color: color,
          weight: 0.8,
          fillColor: color,
          fillOpacity: 0.8
        };
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
const oceanos = [
  { nombre: "Océano Atlántico", coords: [0, -30] },
  { nombre: "Océano Pacífico", coords: [0, -150] },
  { nombre: "Océano Índico", coords: [-20, 80] },
  { nombre: "Océano Ártico", coords: [75, 0] },
  { nombre: "Océano Antártico", coords: [-70, 0] }
];

oceanos.forEach(oceano => {
  L.marker(oceano.coords, {
    icon: L.divIcon({
      className: 'ocean-label',
      html: `<div>${oceano.nombre}</div>`,
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

function startNewGame() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('new-game-setup').style.display = 'flex';
  populateCountryList();
}


function continueGame() {
  const saved = localStorage.getItem("conqorSave");
  if (saved) {
    const data = JSON.parse(saved);
    console.log("Partida cargada:", data);
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
  if (menu.style.display === 'none' || menu.style.display === '') {
    menu.style.display = 'flex';
  } else {
    menu.style.display = 'none';
  }
}

function saveGame() {
  // Simulamos un objeto de partida (podés expandir esto con más datos reales)
  const gameData = {
    timestamp: new Date().toISOString(),
    mensaje: "Esta es una partida guardada",
    ejemplo: "Aquí podrías guardar países conquistados, dinero, etc."
  };

  localStorage.setItem("conqorSave", JSON.stringify(gameData));
  alert("¡Partida guardada correctamente!");
}

function populateCountryList() {
  const select = document.getElementById('country-select');
  select.innerHTML = ''; // limpiar

  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
      data.features.forEach(f => {
        const name = traducciones[f.properties.name] || f.properties.name;
        const option = document.createElement('option');
        option.value = f.properties.name;
        option.textContent = name;
        select.appendChild(option);
      });
      updateCountryFlag(); // actualizar bandera inicial
    });
}

function updateCountryFlag() {
  const country = document.getElementById('country-select').value;
  const flagEl = document.getElementById('flag-preview');

  // Solo para países reconocidos por código ISO (limitado)
  const isoFlags = {
    "Argentina": "🇦🇷",
    "Brazil": "🇧🇷",
    "United States": "🇺🇸",
    "Russia": "🇷🇺",
    "China": "🇨🇳",
    "Japan": "🇯🇵",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "United Kingdom": "🇬🇧",
    "Canada": "🇨🇦",
    "Mexico": "🇲🇽",
    "Australia": "🇦🇺",
    "India": "🇮🇳"
  };

  flagEl.textContent = isoFlags[country] || "🏳️";
}

function confirmNewGame() {
  const country = document.getElementById('country-select').value;
  const color = document.getElementById('color-picker').value;
  const profile = document.querySelector('input[name="profile"]:checked').value;
  const name = document.getElementById('character-name').value.trim();
  const flag = document.getElementById('flag-preview').textContent;

  if (!name) {
    alert("Por favor, escribí un nombre para tu personaje.");
    return;
  }

  // Guardamos los datos
  localStorage.setItem("selectedCountry", country);
  localStorage.setItem("selectedColor", color);
  localStorage.setItem("characterProfile", profile);
  localStorage.setItem("characterName", name);
  localStorage.setItem("countryFlag", flag);

  // Ocultar menú
  document.getElementById('new-game-setup').style.display = 'none';

  // Mostrar en navbar
  const navLeft = document.querySelector('#navbar .nav-left');
  navLeft.innerHTML = `${flag} ${traducciones[country] || country} - ${profile}: ${name}`;

  // Hacer zoom al país
  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
      const target = data.features.find(f => f.properties.name === country);
      if (target) {
        const bounds = L.geoJSON(target).getBounds();
        map.flyToBounds(bounds, { duration: 1.5 });
      }
    });
}

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

let selectedCountry = null;
let selectedColor = null;
let selectedCurrency = null;

// Mostrar el menú de selección
function startNewGame() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('setup-menu').style.display = 'block';

  // Llenar select con países
  const select = document.getElementById('countrySelect');
  select.innerHTML = '';
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

// Confirmar configuración e iniciar el juego
function confirmSetup() {
  selectedColor = document.getElementById('colorPicker').value;
  const leader = document.querySelector('input[name="leader"]:checked').value;
  const name = document.getElementById('leaderName').value || "Sin nombre";

  // Mostrar en navbar
  document.querySelector('.nav-left').innerHTML = `
    ${flagEmojis[selectedCountry] || "🏳️"} ${traducciones[selectedCountry]} — ${leader} <strong>${name}</strong>
  `;

  // Mostrar economía
  document.querySelector('.nav-right').insertAdjacentHTML("afterbegin", `
    <div style="margin-right: 10px; font-weight: bold;">💰 Economía: 100 ${selectedCurrency}</div>
  `);

  document.getElementById('setup-menu').style.display = 'none';

  // Colorear el país elegido
  if (window.mapLayer) {
    window.map.removeLayer(window.mapLayer);
  }

  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => {
      const countries = data.features;

      window.mapLayer = L.geoJSON(countries, {
        style: feature => {
          if (feature.properties.name === selectedCountry) {
            return {
              color: selectedColor,
              weight: 1,
              fillColor: selectedColor,
              fillOpacity: 0.8
            };
          } else {
            return {
              color: "#ccc",
              weight: 0.5,
              fillColor: "#ccc",
              fillOpacity: 0.3
            };
          }
        }
      }).addTo(map);

      // Zoom al país seleccionado
      const selectedFeature = countries.find(f => f.properties.name === selectedCountry);
      if (selectedFeature) {
        const bounds = L.geoJSON(selectedFeature).getBounds();
        map.flyToBounds(bounds, { duration: 2 });
      }
    });
}

