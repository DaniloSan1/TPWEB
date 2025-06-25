document.addEventListener("DOMContentLoaded", async function () {
  const ERROR_MESSAGES = {
    CONTRA_INVALIDA: "La contraseña debe tener mínimo 2 letras, 2 números y 2 caracteres especiales.",
    REPETIR_CONTRA_INVALIDA: "Las contraseñas deben ser iguales.",
  };

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (!usuarioActivo) {
    window.location.href = "../login.html";
    return;
  }

  // Referencias
  const emailInput = document.getElementById("email");
  const nombreUsuario = document.querySelector(".texto");
  const nuevaContraInput = document.getElementById("nueva_contrasena");
  const repetirContraInput = document.getElementById("repetir_contrasena");
  const form = document.querySelector(".form_usuario");
  const errorContrasena = document.querySelector(".js-contrasena-error");
  const errorRepetirContra = document.querySelector(".js-repetircontra-error");
  const btnCancelar = document.querySelector(".btn_cancelar");
  const contenedorPrincipal = document.querySelector('.contenedor_principal');

  // Mostrar datos actuales
  emailInput.value = usuarioActivo.email;
  nombreUsuario.textContent = usuarioActivo.usuario;

  // Mostrar método de pago
  if (usuarioActivo.metodoPago) {
    const metodo = usuarioActivo.metodoPago;
    const radio = document.querySelector(
      `input[name="metodo_pago"][value="${metodo}"]`
    );
    if (radio) radio.checked = true;
  }

  // Función para validar contraseña
  function validarContrasena(nuevaContra) {
    if (nuevaContra.length < 8) return false;

    let letras = 0;
    let numeros = 0;
    let especiales = 0;

    for (let i = 0; i < nuevaContra.length; i++) {
      const char = nuevaContra[i];
      if (/[a-zA-Z]/.test(char)) {
        letras++;
      } else if (/[0-9]/.test(char)) {
        numeros++;
      } else if (/[^a-zA-Z0-9]/.test(char)) {
        especiales++;
      }
    }

    return letras >= 2 && numeros >= 2 && especiales >= 2;
  }

  // Guardar cambios
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevaContra = nuevaContraInput.value.trim();
    const repetirContra = repetirContraInput.value.trim();
    errorContrasena.textContent = "";
    errorRepetirContra.textContent = "";

    let isFormValid = true;

    if (!validarContrasena(nuevaContra)) {
      errorContrasena.textContent = ERROR_MESSAGES.CONTRA_INVALIDA;
      isFormValid = false;
    }

    if (nuevaContra !== repetirContra) {
      errorRepetirContra.textContent = ERROR_MESSAGES.REPETIR_CONTRA_INVALIDA;
      isFormValid = false;
    }

    if (!isFormValid) return;

    const nuevoMetodoPago = document.querySelector(
      'input[name="metodo_pago"]:checked'
    )?.value;

    const actualizado = {
      ...usuarioActivo,
      contrasena: nuevaContra,
      metodoPago: nuevoMetodoPago,
    };

    usuarios = usuarios.map((u) =>
      u.usuario === usuarioActivo.usuario ? actualizado : u
    );

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(actualizado));
    alert("Cambios guardados correctamente.");
    window.location.reload();
  });

  // Cancelar suscripción
  btnCancelar.addEventListener("click", function (e) {
    e.preventDefault();

    const nuevoListadoUsuarios = usuarios.filter(
      (u) => u.usuario !== usuarioActivo.usuario
    );

    localStorage.setItem("usuarios", JSON.stringify(nuevoListadoUsuarios));
    localStorage.removeItem("usuarioActivo");

    alert("Tu suscripción fue cancelada con éxito.");
    window.location.href = "../index.html";
  });

  // --- FAVORITOS ---
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"))?.usuario;
  const contenedorPrin = document.querySelector('.contenedor_principal');

  const [peliculas, series] = await Promise.all([
    fetch("../json/data_pelicula.json").then(r => r.json()),
    fetch("../json/data_detalle.json").then(r => r.json())
  ]);

  const favPeliculas = JSON.parse(localStorage.getItem(`favoritos_peliculas_${usuario}`)) || [];
  const favSeries = JSON.parse(localStorage.getItem(`favoritos_series_${usuario}`)) || [];

  const favoritosDiv = document.createElement('div');
  favoritosDiv.style.width = "100%";
  favoritosDiv.style.marginTop = "2em";
  favoritosDiv.innerHTML = `
      <h3>Películas favoritas</h3>
      <ul id="lista-fav-peliculas" class="lista-favoritos"></ul>
      <h3>Series favoritas</h3>
      <ul id="lista-fav-series" class="lista-favoritos"></ul>
  `;
  contenedorPrin.appendChild(favoritosDiv);

  const ulPeliculas = document.getElementById('lista-fav-peliculas');
  favPeliculas.forEach(key => {
      const peli = peliculas[key];
      if (!peli) return;
      const li = document.createElement('li');
      li.innerHTML = `
          <a href="../pages/detalle_pelicula.html?pelicula=${key}" class="fav-link">
              ${peli.titulo}
          </a>
          <svg class="corazon favorito" data-tipo="pelicula" data-key="${key}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9z"/>
          </svg>
      `;
      ulPeliculas.appendChild(li);
  });

  const ulSeries = document.getElementById('lista-fav-series');
  favSeries.forEach(key => {
      const serie = series[key];
      if (!serie) return;
      const li = document.createElement('li');
      li.innerHTML = `
          <a href="../pages/detalle_serie.html?serie=${key}" class="fav-link">
              ${serie.titulo}
          </a>
          <svg class="corazon favorito" data-tipo="serie" data-key="${key}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:1.2em;height:1.2em;vertical-align:middle;cursor:pointer;fill:#e53935;margin-left:0.5em;">
              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9z"/>
          </svg>
      `;
      ulSeries.appendChild(li);
  });

  favoritosDiv.addEventListener('click', function(e) {
      if (e.target.classList.contains('corazon')) {
          const tipo = e.target.getAttribute('data-tipo');
          const key = e.target.getAttribute('data-key');
          const usuario = JSON.parse(localStorage.getItem("usuarioActivo"))?.usuario;
          let storageKey = tipo === "pelicula" ? `favoritos_peliculas_${usuario}` : `favoritos_series_${usuario}`;
          let favoritos = JSON.parse(localStorage.getItem(storageKey)) || [];
          const idx = favoritos.findIndex(fav => {
              if (typeof fav === "string") return fav === key;
              if (typeof fav === "object" && fav.key) return fav.key === key;
              return false;
          });
          if (idx >= 0) {
              favoritos.splice(idx, 1);
              localStorage.setItem(storageKey, JSON.stringify(favoritos));
              e.target.parentElement.remove();
          }
      }
  });
});