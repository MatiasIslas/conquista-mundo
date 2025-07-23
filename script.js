html, body, #map {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#map {
  background-color: #a6d3f5; /* Color de océano */
}

.country-label {
  font-size: 10px;
  font-weight: bold;
  color: #111;
  text-shadow: 1px 1px 2px white;
  text-align: center;
  pointer-events: none;
}

.ocean-label {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: #045a8d;
  opacity: 0.4;
  pointer-events: none;
  z-index: 999;
}
