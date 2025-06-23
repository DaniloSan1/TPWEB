document.addEventListener("DOMContentLoaded", function () {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (usuarioActivo) {
    const nombreUsuario = document.getElementById("nombre_usuario");
    const email = document.getElementById("email");

    nombreUsuario.textContent = usuarioActivo.usuario;
    email.value = usuarioActivo.email;
  } else {
    window.location.href = "../login.html";
  }
});
