document.addEventListener("DOMContentLoaded", function () {
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
});