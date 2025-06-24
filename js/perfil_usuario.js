const ERROR_MESSAGES = {
  CONTRA_INVALIDA:
    "La contraseña debe tener minimo 2 letras, 2 numeros y 2 caracteres especiales.",
  REPETIR_CONTRA_INVALIDA: "Las contraseñas deben ser iguales.",
};

//Validar Contraseña
  const nuevaContra = document.querySelector("#nueva_contrasena").value.trim();
  const repeContra = document.querySelector("#repetir_contrasena").value.trim();
  const errorContrasena = document.querySelector(".js-contrasena-error");
  const errorRepetirContra = document.querySelector(
      ".js-repetircontra-error"
    );

      errorContrasena.textContent = "";
      errorRepetirContra.textContent = "";

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

    if (repeContra !== contra) {
      errorRepetirContra.textContent = ERROR_MESSAGES.REPETIR_CONTRA_INVALIDA;
      isFormValid = false;
    };
    
    validarContrasena(nuevaContra);



document.addEventListener("DOMContentLoaded", function () {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (!usuarioActivo) {
    window.location.href = "../login.html";
    return;
  }

  // Referencias
  const emailInput = document.getElementById("email");
  const nombreUsuario = document.querySelector(".texto");
  const nuevaContra = document.getElementById("nueva_contrasena");
  const repetirContra = document.getElementById("repetir_contrasena");
  const form = document.querySelector(".form_usuario");

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

  // Guardar cambios
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (nuevaContra.value !== repetirContra.value) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const nuevoMetodoPago = document.querySelector(
      'input[name="metodo_pago"]:checked'
    )?.value;

    const actualizado = {
      ...usuarioActivo,
      contrasena: nuevaContra.value,
      metodoPago: nuevoMetodoPago,
    };

    // Actualizar array de usuarios
    usuarios = usuarios.map((u) =>
      u.usuario === usuarioActivo.usuario ? actualizado : u
    );

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(actualizado));
    alert("Cambios guardados correctamente.");
    window.location.reload();
  });

  // Cancelar suscripción
  const btnCancelar = document.querySelector(".btn_cancelar");
  btnCancelar.addEventListener("click", function (e) {
    e.preventDefault();

    if (confirm("¿Estás seguro de que querés cancelar tu suscripción?")) {
      usuarios = usuarios.filter((u) => u.usuario !== usuarioActivo.usuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.removeItem("usuarioActivo");
      window.location.href = "../index.html";
    }
  });
});
