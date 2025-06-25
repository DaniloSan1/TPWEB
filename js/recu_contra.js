document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const usuarioInput = document.getElementById('usuario');
    const btnEnviar = document.getElementById('btn_enviar');
    const form = document.getElementById('form_recu_contra');
    const mensajeError = document.getElementById('mensaje_error');
    const popup = document.getElementById('popup_exito');
    const cerrarPopup = document.getElementById('cerrar_popup');
    const popupOk = document.getElementById('popup_ok');

    function checkInputs() {
        btnEnviar.disabled = !(emailInput.value.trim() && usuarioInput.value.trim());
        mensajeError.textContent = "";
    }

    emailInput.addEventListener('input', checkInputs);
    usuarioInput.addEventListener('input', checkInputs);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const usuario = usuarioInput.value.trim();
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioValido = usuarios.find(u => u.usuario === usuario && u.email === email);

        if (usuarioValido) {
            popup.style.display = "flex";
        } else {
            mensajeError.textContent = "Usuario o email incorrectos.";
        }
    });

    function cerrarYRedirigir() {
        popup.style.display = "none";
        window.location.href = "../index.html";
    }

    cerrarPopup.addEventListener('click', cerrarYRedirigir);
    popupOk.addEventListener('click', cerrarYRedirigir);

});