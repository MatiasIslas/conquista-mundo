// Agrega íconos de edificios 🏛️ en cada capital del mundo

const capitales = [
  { nombre: "Buenos Aires", coords: [-34.6118, -58.4173] },
  { nombre: "Washington D.C.", coords: [38.9072, -77.0369] },
  { nombre: "Brasilia", coords: [-15.7801, -47.9292] },
  { nombre: "Madrid", coords: [40.4168, -3.7038] },
  { nombre: "París", coords: [48.8566, 2.3522] },
  { nombre: "Londres", coords: [51.5074, -0.1276] },
  { nombre: "Berlin", coords: [52.52, 13.405] },
  { nombre: "Roma", coords: [41.9028, 12.4964] },
  { nombre: "Moscú", coords: [55.7558, 37.6173] },
  { nombre: "Beijing", coords: [39.9042, 116.4074] },
  { nombre: "Tokio", coords: [35.6895, 139.6917] },
  { nombre: "Canberra", coords: [-35.2809, 149.13] },
  { nombre: "Ottawa", coords: [45.4215, -75.6972] },
  { nombre: "Ciudad de México", coords: [19.4326, -99.1332] },
  { nombre: "Nueva Delhi", coords: [28.6139, 77.209] },
  { nombre: "El Cairo", coords: [30.0444, 31.2357] },
  { nombre: "Pretoria", coords: [-25.7479, 28.2293] },
  { nombre: "Ankara", coords: [39.9208, 32.8541] },
  { nombre: "Seúl", coords: [37.5665, 126.978] },
  { nombre: "Riad", coords: [24.7136, 46.6753] }
  // Puedes seguir agregando más capitales...
];

capitales.forEach(c => {
  const icon = L.divIcon({
    className: 'capital-icon',
    html: '🏛️',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  L.marker(c.coords, { icon }).addTo(map)
    .bindTooltip(`${c.nombre}`, { direction: 'top', offset: [0, -8] });
});
