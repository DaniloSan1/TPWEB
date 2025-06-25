document.addEventListener("DOMContentLoaded", function () {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const btnCerrarSesion = document.querySelector(".btn_cerrarSesion");
  btnCerrarSesion.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.removeItem("usuarioActivo");
    window.location.href = "../index.html";
    
    });
  });

