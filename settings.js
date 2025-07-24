// settings.js

// Crear el contenedor de ajustes y agregarlo al body
const settingsMenu = document.createElement('div');
settingsMenu.id = 'settings-menu';
settingsMenu.innerHTML = `
  <div class="menu-container settings-container">
    <h2>Ajustes ⚙️</h2>
    <button onclick="closeSettings()" style="float: right;">✖️</button>

    <div class="settings-section">
      <h3>🔊 Sonido y Música</h3>
      <label><input type="checkbox" id="musicToggle" checked> Música de fondo</label><br>
      <label><input type="checkbox" id="soundToggle" checked> Efectos de sonido</label><br>
      <label>Volumen general: <input type="range" id="generalVolume" min="0" max="100" value="80"></label><br>
      <label>Volumen música: <input type="range" id="musicVolume" min="0" max="100" value="70"></label><br>
      <label>Volumen efectos: <input type="range" id="sfxVolume" min="0" max="100" value="70"></label>
    </div>

    <div class="settings-section">
      <h3>🖥️ Visualización y Mapa</h3>
      <label><select id="colorScheme">
        <option value="default">Clásico</option>
        <option value="colorblind">Daltonismo</option>
        <option value="night">Nocturno</option>
      </select></label><br>
      <label><input type="checkbox" id="toggleCountryNames" checked> Nombres de países</label><br>
      <label><input type="checkbox" id="toggleCapitals" checked> Capitales</label><br>
      <label><input type="checkbox" id="toggleOceans" checked> Nombres de océanos</label><br>
      <label><input type="checkbox" id="showConqueredOnly"> Solo países conquistados</label><br>
      <label><input type="checkbox" id="animateBorders"> Fronteras animadas</label>
    </div>

    <div class="settings-section">
      <h3>🌐 Idioma</h3>
      <label><select id="languageSelect">
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="pt">Português</option>
      </select></label><br>
      <label><select id="geoNameStyle">
        <option value="original">Original</option>
        <option value="adapted">Adaptado</option>
        <option value="historical">Histórico</option>
      </select></label>
    </div>

    <div class="settings-section">
      <h3>🕹️ Controles del Juego</h3>
      <label>Sensibilidad del zoom: <input type="range" id="zoomSensitivity" min="1" max="10" value="5"></label><br>
      <label><input type="checkbox" id="invertMap"> Invertir movimiento del mapa</label><br>
      <button onclick="resetMapView()">Restablecer vista inicial</button>
    </div>

    <div class="settings-section">
      <h3>💾 Datos y Cuenta</h3>
      <button onclick="saveGame()">Guardar partida</button>
      <button onclick="continueGame()">Cargar partida</button>
      <button onclick="exportProgress()">Exportar</button>
      <button onclick="importProgress()">Importar</button>
      <br><br>
      <button>Vincular cuenta</button>
      <button>Cerrar sesión</button>
    </div>

    <div class="settings-section">
      <h3>🧠 Dificultad y IA</h3>
      <label><select id="difficultySelect">
        <option>Fácil</option>
        <option>Medio</option>
        <option>Difícil</option>
      </select></label><br>
      <label><select id="aiBehaviorSelect">
        <option>Agresivo</option>
        <option>Defensivo</option>
        <option>Aleatorio</option>
      </select></label>
    </div>

    <div class="settings-section">
      <h3>⚙️ Sistema y Desempeño</h3>
      <label><input type="checkbox" id="lowPerformance"> Modo bajo rendimiento</label><br>
      <label><input type="checkbox" id="showFPS"> Mostrar contador FPS</label><br>
      <label><input type="checkbox" id="autoUpdate"> Actualizar mapa automáticamente</label>
    </div>

    <div class="settings-section">
      <h3>🔒 Privacidad y Seguridad</h3>
      <label><input type="checkbox" id="showIP"> Mostrar IP</label><br>
      <label><input type="checkbox" id="shareData"> Compartir datos anónimos</label><br>
      <label><input type="checkbox" id="browserNotif"> Notificaciones del navegador</label>
    </div>

    <div class="settings-section">
      <h3>📱 Compatibilidad</h3>
      <label><input type="checkbox" id="responsiveMode" checked> Activar modo móvil/tablet</label><br>
      <label><select id="interfaceSize">
        <option>Pequeño</option>
        <option selected>Medio</option>
        <option>Grande</option>
      </select></label>
    </div>

  </div>
`;
document.body.appendChild(settingsMenu);

// Estilo oculto por defecto
settingsMenu.style.display = "none";

// Mostrar ajustes
function openSettings() {
  settingsMenu.style.display = "flex";
}

// Cerrar ajustes
function closeSettings() {
  settingsMenu.style.display = "none";
}

// Restablecer vista inicial del mapa
function resetMapView() {
  map.setView([20, 0], 3);
}
