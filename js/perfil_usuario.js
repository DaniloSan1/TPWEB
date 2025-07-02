document.addEventListener("DOMContentLoaded", async function () { 
  const ERROR_MESSAGES = {
    CONTRA_INVALIDA: "La contraseña debe tener mínimo 2 letras, 2 números y 2 caracteres especiales.",
    REPETIR_CONTRA_INVALIDA: "Las contraseñas deben ser iguales.",
    NRO_TARJETA_INVALIDO: "El número de tarjeta es inválido.",
    CODIGO_INVALIDO: "El código es incorrecto.",
    CAMPO_VACIO: "El campo no puede estar vacío.",
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

  const codigoTarjetaInput = document.getElementById("codigo_tarjeta");
  const numeroTarjetaInput = document.getElementById("numero_tarjeta");
  const errorCodigo = document.querySelector(".js-codigo-error");
  const errorTarjeta = document.querySelector(".js-tarjeta-error");

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

    if (metodo === "cupon" && usuarioActivo.cuponTipo) {
      const pagoFacil = document.getElementById("pago_facil");
      const rapipago = document.getElementById("rapipago");

      if (usuarioActivo.cuponTipo === "Pago Fácil" && pagoFacil) {
        pagoFacil.checked = true;
      } else if (usuarioActivo.cuponTipo === "Rapipago" && rapipago) {
        rapipago.checked = true;
      }
    }
  }

  function validarContrasena(contrasena) {
  if (contrasena.length < 8) return false;
  const letras = (contrasena.match(/[a-zA-Z]/g) || []).length;
  const numeros = (contrasena.match(/[0-9]/g) || []).length;
  const especiales = (contrasena.match(/[^a-zA-Z0-9]/g) || []).length;
  return letras >= 2 && numeros >= 2 && especiales >= 2;
}

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevaContra = nuevaContraInput.value.trim();
    const repetirContra = repetirContraInput.value.trim();
    errorContrasena.textContent = "";
    errorRepetirContra.textContent = "";
    errorTarjeta.textContent = "";
    errorCodigo.textContent = "";

    let isFormValid = true;

    if (!validarContrasena(nuevaContra)) {
      errorContrasena.textContent = ERROR_MESSAGES.CONTRA_INVALIDA;
      isFormValid = false;
    }

    if (nuevaContra !== repetirContra) {
      errorRepetirContra.textContent = ERROR_MESSAGES.REPETIR_CONTRA_INVALIDA;
      isFormValid = false;
    }

    const nuevoMetodoPago = document.querySelector(
      'input[name="metodo_pago"]:checked'
    )?.value;

    if (nuevoMetodoPago === "tarjeta") {
      const numero = numeroTarjetaInput.value.trim();
      const codigo = codigoTarjetaInput.value.trim();

      if (!codigo) {
        errorCodigo.textContent = ERROR_MESSAGES.CAMPO_VACIO;
        isFormValid = false;
      } else if (!/^[1-9]{3}$/.test(codigo)) {
        errorCodigo.textContent = ERROR_MESSAGES.CODIGO_INVALIDO;
        isFormValid = false;
      }

      if (!numero) {
        errorTarjeta.textContent = ERROR_MESSAGES.CAMPO_VACIO;
        isFormValid = false;
      } else if (!/^\d{16}$/.test(numero)) {
        errorTarjeta.textContent = ERROR_MESSAGES.NRO_TARJETA_INVALIDO;
        isFormValid = false;
      } else {
        const numeros = numero.split("").map(Number);
        const suma = numeros.slice(0, 15).reduce((a, b) => a + b, 0);
        const ultimo = numeros[15];
        if ((suma % 2 === 0 && ultimo % 2 === 0) || (suma % 2 !== 0 && ultimo % 2 !== 0)) {
          errorTarjeta.textContent = ERROR_MESSAGES.NRO_TARJETA_INVALIDO;
          isFormValid = false;
        }
      }
    }

    if (!isFormValid) return;

    const actualizado = {
      ...usuarioActivo,
      contrasena: nuevaContra,
      metodoPago: nuevoMetodoPago,
      codigoTarjeta: codigoTarjetaInput?.value.trim() || "",
      numeroTarjeta: numeroTarjetaInput?.value.trim() || "",
    };

    usuarios = usuarios.map((u) =>
      u.usuario === usuarioActivo.usuario ? actualizado : u
    );

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(actualizado));
    alert("Cambios guardados correctamente.");
    window.location.reload();
  });

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
          <svg class= "corazon favorito" data-tipo="pelicula" data-key="${key}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="..."/></svg>
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
          <svg class= "corazon favorito" data-tipo="serie" data-key="${key}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="..."/></svg>
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

          favoritos = favoritos.filter(fav => {
              if (typeof fav === "string") return fav !== key;
              if (typeof fav === "object" && fav.key) return fav.key !== key;
              return true;
          });
          localStorage.setItem(storageKey, JSON.stringify(favoritos));
          e.target.parentElement.remove();
      }
  });
});