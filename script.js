const map = L.map('map', {
  center: [20, 0],
  zoom: 3,
  minZoom: 2.5,
  maxZoom: 9,
  zoomControl: true,
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
  console.log("Inicia nueva partida");
}

function continueGame() {
  document.getElementById('main-menu').style.display = 'none';
  console.log("Continúa partida existente");
}

function openSettings() {
  alert("Ajustes aún no disponibles.");
}

function showCredits() {
  alert("Conqor - Desarrollado por Matías Islas");
}
