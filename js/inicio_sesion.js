document.addEventListener('DOMContentLoaded', function () {

    const usuarioInput = document.getElementById('usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const mensajeError = document.getElementById('mensaje_error');
    const formulario = document.getElementById('form_inicio_sesion');
    const botonEnviar = document.getElementById('btn_inicio_sesion');

    function chequeoDeInputs() {
        const valorUsuario = usuarioInput.value.trim();
        const valorContrasena = contrasenaInput.value.trim();
       const deshabilitado = !(valorUsuario && valorContrasena);
    botonEnviar.disabled = deshabilitado;
    if (deshabilitado) {
        botonEnviar.classList.add('btn_gris')

    } else {
        botonEnviar.classList.remove('btn_gris');
    }
    mensajeError.textContent = "";
}



    usuarioInput.addEventListener('input', chequeoDeInputs);
    contrasenaInput.addEventListener('input', chequeoDeInputs);

    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        const usuario = usuarioInput.value.trim();
        const contrasena = contrasenaInput.value.trim();

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (!Array.isArray(usuarios)) usuarios = [];

        const usuarioValido = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);

        if (usuarioValido) {
            window.location.href = "./pages/home.html";
        } else {
            mensajeError.textContent = "Usuario o contraseña incorrectos";
        }
    });
});