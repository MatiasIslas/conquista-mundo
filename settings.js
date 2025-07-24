// settings.js

const settings = {
  sonido: {
    musica: true,
    efectos: true,
    volumenGeneral: 0.8,
    volumenMusica: 0.7,
    volumenEfectos: 0.9,
  },
  visualizacion: {
    esquemaColor: 'clasico', // 'colorblind', 'nocturno'
    mostrarNombresPaises: true,
    mostrarCapitales: true,
    mostrarOceanos: true,
    mostrarConquistados: 'todos', // 'conquistados', 'noConquistados'
    animarFronteras: true,
  },
  idioma: {
    actual: 'es',
    estiloGeografico: 'original', // 'adaptado', 'historico'
  },
  controles: {
    sensibilidadZoom: 1.0,
    invertirMovimiento: false,
  },
  datos: {
    cuentaVinculada: null,
  },
  dificultadIA: {
    nivel: 'medio', // 'facil', 'dificil'
    comportamiento: 'aleatorio', // 'agresivo', 'defensivo'
  },
  sistema: {
    modoBajoRendimiento: false,
    mostrarFPS: false,
    autoActualizarMapa: true,
  },
  privacidad: {
    mostrarIP: false,
    compartirDatosAnonimos: false,
    notificaciones: false,
  },
  compatibilidad: {
    modoMovil: true,
    tamañoInterfaz: 'medio', // 'grande', 'pequeño'
  }
};

// 🧠 Guardar ajustes en localStorage
function guardarAjustes() {
  try {
    localStorage.setItem('ajustes', JSON.stringify(settings));
    console.log("✅ Ajustes guardados correctamente.");
  } catch (error) {
    console.error("❌ Error al guardar ajustes:", error);
  }
}

// 🔁 Cargar ajustes desde localStorage
function cargarAjustes() {
  try {
    const guardado = localStorage.getItem('ajustes');
    if (guardado) {
      const cargado = JSON.parse(guardado);
      Object.assign(settings, cargado);
      console.log("✅ Ajustes cargados correctamente.");
    } else {
      console.warn("⚠️ No se encontraron ajustes guardados.");
    }
  } catch (error) {
    console.error("❌ Error al cargar ajustes:", error);
  }
}

// 🗑️ Restaurar ajustes por defecto
function restaurarAjustes() {
  localStorage.removeItem('ajustes');
  location.reload(); // recarga el juego con valores por defecto
}

// 📤 Exportar ajustes como JSON (descarga)
function exportarAjustes() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "ajustes.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

// 📥 Importar ajustes desde JSON
function importarAjustes(archivo) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      Object.assign(settings, data);
      guardarAjustes();
      alert("✅ Ajustes importados correctamente. Se aplicarán al recargar.");
      location.reload();
    } catch (error) {
      alert("❌ Error al importar el archivo. Verifica el formato JSON.");
    }
  };
  reader.readAsText(archivo);
}

// 📦 Detectar si hay ajustes guardados al iniciar
window.addEventListener('DOMContentLoaded', () => {
  cargarAjustes();
});
