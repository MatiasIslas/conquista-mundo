const map = L.map('map', {
  center: [20, 0],
  zoom: 2.2,
  minZoom: 2.5,
  maxZoom: 9,
  zoomControl: true,
  attributionControl: false
});

// Traducciones de países al español
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
  "India": "India",
  "South Africa": "Sudáfrica",
  "Norway": "Noruega",
  "Sweden": "Suecia",
  "Finland": "Finlandia",
  "Chile": "Chile",
  "Peru": "Perú",
  "Colombia": "Colombia",
  "Venezuela": "Venezuela",
  "Ukraine": "Ucrania",
  "Poland": "Polonia",
  "Greece": "Grecia",
  "Turkey": "Turquía",
  "New Zealand": "Nueva Zelanda",
  "South Korea": "Corea del Sur",
  "North Korea": "Corea del Norte",
  "Saudi Arabia": "Arabia Saudita",
  "Egypt": "Egipto",
  "Iran": "Irán",
  "Iraq": "Irak",
  "Pakistan": "Pakistán",
  "Indonesia": "Indonesia",
  "Philippines": "Filipinas"
  // Agregá más si lo necesitás
};

// Generar color aleatorio vibrante
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 75%, 65%)`;
}

// Colores únicos por país
const paisColores = {};

fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: feature => {
        const nombre = feature.properties.name;
        const color = paisColores[nombre] || (paisColores[nombre] = getRandomColor());
        return {
          color: color,         // Borde del mismo color que el país
          weight: 0.5,
          fillColor: color,
          fillOpacity: 0.8
        };
      },
      onEachFeature: (feature, layer) => {
        const nombreOriginal = feature.properties.name;
        const nombreTraducido = traducciones[nombreOriginal] || nombreOriginal;
        const center = layer.getBounds().getCenter();
        const label = L.marker(center, {
          icon: L.divIcon({
            className: 'country-label',
            html: `<span>${nombreTraducido}</span>`,
            iconSize: [100, 20]
          })
        });
        label.addTo(map);
      }
    }).addTo(map);
  });

// Capitales destacadas
const capitals = {
  "type": "FeatureCollection",
  "features": [
    {"type":"Feature","properties":{"capital":"Buenos Aires"},"geometry":{"type":"Point","coordinates":[-58.4173,-34.6118]}},
    {"type":"Feature","properties":{"capital":"Brasilia"},"geometry":{"type":"Point","coordinates":[-47.9292,-15.7801]}},
    {"type":"Feature","properties":{"capital":"Washington D.C."},"geometry":{"type":"Point","coordinates":[-77.0369,38.9072]}},
    {"type":"Feature","properties":{"capital":"Moscú"},"geometry":{"type":"Point","coordinates":[37.6173,55.7558]}},
    {"type":"Feature","properties":{"capital":"Pekín"},"geometry":{"type":"Point","coordinates":[116.4074,39.9042]}},
    {"type":"Feature","properties":{"capital":"Tokio"},"geometry":{"type":"Point","coordinates":[139.6917,35.6895]}},
    {"type":"Feature","properties":{"capital":"Berlín"},"geometry":{"type":"Point","coordinates":[13.4050,52.5200]}},
    {"type":"Feature","properties":{"capital":"París"},"geometry":{"type":"Point","coordinates":[2.3522,48.8566]}},
    {"type":"Feature","properties":{"capital":"Madrid"},"geometry":{"type":"Point","coordinates":[-3.7038,40.4168]}},
    {"type":"Feature","properties":{"capital":"Roma"},"geometry":{"type":"Point","coordinates":[12.4964,41.9028]}},
    {"type":"Feature","properties":{"capital":"Londres"},"geometry":{"type":"Point","coordinates":[-0.1276,51.5074]}},
    {"type":"Feature","properties":{"capital":"Canberra"},"geometry":{"type":"Point","coordinates":[149.1300,-35.2809]}},
    {"type":"Feature","properties":{"capital":"Nueva Delhi"},"geometry":{"type":"Point","coordinates":[77.2090,28.6139]}},
    {"type":"Feature","properties":{"capital":"Ottawa"},"geometry":{"type":"Point","coordinates":[-75.6972,45.4215]}},
    {"type":"Feature","properties":{"capital":"Ciudad de México"},"geometry":{"type":"Point","coordinates":[-99.1332,19.4326]}}
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

// Etiquetas fijas de océanos
const oceanos = [
  { nombre: "Océano Atlántico", coords: [0, -30] },
  { nombre: "Océano Pacífico", coords: [0, -150] },
  { nombre: "Océano Índico", coords: [-20, 80] },
  { nombre: "Océano Ártico", coords: [75, 0] },
  { nombre: "Océano Antártico", coords: [-70, 0] }
];

oceanos.forEach(oceano => {
  const div = L.marker(oceano.coords, {
    icon: L.divIcon({
      className: 'ocean-label',
      html: `<div>${oceano.nombre}</div>`,
      iconSize: [200, 30]
    })
  }).addTo(map);
});
