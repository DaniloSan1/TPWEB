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
    if (metodo === "tarjeta") {
      const numero = usuarioActivo.numeroTarjeta || "";
      numeroTarjetaInput.placeholder = "Tarjeta termina en: " + numero.slice(-4)
    }
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

    if (nuevoMetodoPago === "cupon") {
      const pagoFacilChecked = document.getElementById("pago_facil").checked;
      const rapipagoChecked = document.getElementById("rapipago").checked;
      const grupoCupon = document.getElementById("grupo_cupon");
      
      let cuponError = grupoCupon.querySelector(".error");
      if (!cuponError) {
        cuponError = document.createElement("div");
        cuponError.className = "error";
        grupoCupon.appendChild(cuponError);
      }
      cuponError.textContent = "";

      if ((pagoFacilChecked && rapipagoChecked) || (!pagoFacilChecked && !rapipagoChecked)) {
        cuponError.textContent = "Debes seleccionar solo un cupón de pago.";
        isFormValid = false;
      }
    }

    if (!isFormValid) return;

    const actualizado = {
      ...usuarioActivo,
      contrasena: nuevaContra,
      metodoPago: nuevoMetodoPago,
      codigoTarjeta: codigoTarjetaInput?.value.trim() || "",
      numeroTarjeta: numeroTarjetaInput?.value.trim() || "",
      cuponTipo: nuevoMetodoPago === "cupon"
    ? (document.getElementById("pago_facil").checked
        ? "Pago Fácil"
        : document.getElementById("rapipago").checked
          ? "Rapipago"
          : "")
    : null
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
          <svg class= "corazon favorito" data-tipo="pelicula" data-key="${key}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
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
          <svg class= "corazon favorito" data-tipo="serie" data-key="${key}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
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

  function setDisabled(grupo, disabled) {
    grupo.querySelectorAll("input, select, button, textarea").forEach(i => i.disabled = disabled);
  }

  function gestionarMetodoPagoPerfil() {
    const radioTarjeta = document.getElementById("pago_tarjeta");
    const radioCupon = document.getElementById("pago_cupon");
    const radioTransferencia = document.getElementById("pago_transferencia");
    const grupoTarjeta = document.getElementById("grupo_tarjeta");
    const grupoCupon = document.getElementById("grupo_cupon");

    function actualizar() {
      if (radioTarjeta.checked) {
        setDisabled(grupoTarjeta, false);
        setDisabled(grupoCupon, true);
        document.getElementById("pago_facil").checked = false;
        document.getElementById("rapipago").checked = false;
      } else if (radioCupon.checked) {
        setDisabled(grupoTarjeta, true);
        setDisabled(grupoCupon, false);
      } else if (radioTransferencia.checked) {
        setDisabled(grupoTarjeta, true);
        setDisabled(grupoCupon, true);
        document.getElementById("pago_facil").checked = false;
        document.getElementById("rapipago").checked = false;
      } else {
        setDisabled(grupoTarjeta, true);
        setDisabled(grupoCupon, true);
      }
    }

    radioTarjeta.addEventListener("change", actualizar);
    radioCupon.addEventListener("change", actualizar);
    radioTransferencia.addEventListener("change", actualizar);
    actualizar();
  }

  gestionarMetodoPagoPerfil();
});