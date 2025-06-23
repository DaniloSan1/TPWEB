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
