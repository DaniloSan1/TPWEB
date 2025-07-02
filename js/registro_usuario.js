const ERROR_MESSAGES = {
  NOMBRE_INVALIDO: "Solo se permiten letras.",
  APELLIDO_INVALIDO: "Solo se permiten letras.",
  EMAIL_INVALIDO: "El formato es incorrecto.",
  USUARIO_INVALIDO: "Solo se permiten letras y números.",
  CONTRA_INVALIDA: "La contraseña debe tener mínimo 2 letras, 2 números y 2 caracteres especiales.",
  REPETIR_CONTRA_INVALIDA: "Las contraseñas deben ser iguales.",
  CODIGO_INVALIDO: "El código es incorrecto.",
  NRO_TARJETA_INVALIDO: "El número de tarjeta es inválido.",
  CAMPO_VACIO: "El campo no puede estar vacío.",
};

const regex = {
  letras: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  usuario: /^[a-zA-Z0-9]+$/,
  codigo: /^[1-9]{3}$/,
  tarjeta: /^\d{16}$/,
};

const validadores = {
  texto: (texto) => regex.letras.test(texto),
  email: (email) => regex.email.test(email),
  usuario: (usuario) => regex.usuario.test(usuario),
  codigo: (codigo) => regex.codigo.test(codigo),
  tarjeta: (numeroTarjeta) => regex.tarjeta.test(numeroTarjeta),
  contrasena: (contrasena) => {
    if (contrasena.length < 8) return false;
    const letras = (contrasena.match(/[a-zA-Z]/g) || []).length;
    const numeros = (contrasena.match(/[0-9]/g) || []).length;
    const especiales = (contrasena.match(/[^a-zA-Z0-9]/g) || []).length;
    return letras >= 2 && numeros >= 2 && especiales >= 2;
  },
};

function mostrarError(elemento, mensaje) {
  const error = document.querySelector(`.js-${elemento}-error`);
  if (error) error.textContent = mensaje;
}

function limpiarErrorIndividual(id) {
  const error = document.querySelector(`.js-${id}-error`);
  if (error) error.textContent = "";
}

function limpiarErrores() {
  document.querySelectorAll("[class^='js-'][class$='-error']").forEach(e => e.textContent = "");
}

function validarCampo(valor, validador, msgVacio, msgInvalido, elemento) {
  if (!valor) {
    mostrarError(elemento, msgVacio);
    return false;
  }
  if (!validador(valor)) {
    mostrarError(elemento, msgInvalido);
    return false;
  }
  limpiarErrorIndividual(elemento);
  return true;
}

function validarFormulario() {
  limpiarErrores();
  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    usuario: document.getElementById("usuario").value.trim(),
    email: document.getElementById("email").value.trim(),
    contrasena: document.getElementById("contrasena").value.trim(),
    repetirContrasena: document.getElementById("repetir_contrasena").value.trim(),
    metodoPago: document.querySelector('input[name="metodo_pago"]:checked')?.value,
    numeroTarjeta: document.getElementById("numero_tarjeta").value.trim(),
    codigoTarjeta: document.getElementById("codigo_tarjeta").value.trim(),
    
  };

  let valido = true;

  valido &= validarCampo(datos.nombre, validadores.texto, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.NOMBRE_INVALIDO, "nombre");
  valido &= validarCampo(datos.apellido, validadores.texto, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.APELLIDO_INVALIDO, "apellido");
  valido &= validarCampo(datos.usuario, validadores.usuario, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.USUARIO_INVALIDO, "usuario");
  valido &= validarCampo(datos.email, validadores.email, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.EMAIL_INVALIDO, "email");

  if (!datos.contrasena) {
    mostrarError("contrasena", ERROR_MESSAGES.CAMPO_VACIO);
    valido = false;
  } else if (!validadores.contrasena(datos.contrasena)) {
    mostrarError("contrasena", ERROR_MESSAGES.CONTRA_INVALIDA);
    valido = false;
  } else {
    limpiarErrorIndividual("contrasena");
  }

  if (!datos.repetirContrasena) {
    mostrarError("repetircontra", ERROR_MESSAGES.CAMPO_VACIO);
    valido = false;
  } else if (datos.repetirContrasena !== datos.contrasena) {
    mostrarError("repetircontra", ERROR_MESSAGES.REPETIR_CONTRA_INVALIDA);
    valido = false;
  } else {
    limpiarErrorIndividual("repetircontra");
  }

  if (datos.metodoPago === "tarjeta") {
    valido &= validarCampo(datos.codigoTarjeta, validadores.codigo, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.CODIGO_INVALIDO, "codigo");

    if (!datos.numeroTarjeta) {
      mostrarError("tarjeta", ERROR_MESSAGES.CAMPO_VACIO);
      valido = false;
    } else if (!validadores.tarjeta(datos.numeroTarjeta)) {
      mostrarError("tarjeta", ERROR_MESSAGES.NRO_TARJETA_INVALIDO);
      valido = false;
    } else {
      const numeros = datos.numeroTarjeta.split("").map(Number);
      const suma = numeros.slice(0, 15).reduce((a, b) => a + b, 0);
      const ultimo = numeros[15];
      if ((suma % 2 === 0 && ultimo % 2 === 0) || (suma % 2 !== 0 && ultimo % 2 !== 0)) {
        mostrarError("tarjeta", ERROR_MESSAGES.NRO_TARJETA_INVALIDO);
        valido = false;
      } else {
        limpiarErrorIndividual("tarjeta");
      }
    }
  }

  if (datos.metodoPago === "cupon") {
    const pagoFacil = document.getElementById("pago_facil");
    const rapipago = document.getElementById("rapipago");
    const algunoMarcado = (pagoFacil.checked && !pagoFacil.disabled) || (rapipago.checked && !rapipago.disabled);
    if (!algunoMarcado) valido = false;
  }

  return valido;
}

function guardarUsuario(datos) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.some(u => u.usuario === datos.usuario);
  if (existe) {
    mostrarError("usuario", "El usuario ya existe.");
    return false;
  }
  usuarios.push(datos);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return true;
}

function registroValidate() {
  const formulario = document.getElementById("formulario");
  const btnConfirmar = document.getElementById("btn_confirmar");

  function actualizarBoton() {
    const metodo = document.querySelector('input[name="metodo_pago"]:checked')?.value;
    const campos = ["nombre", "apellido", "usuario", "email", "contrasena", "repetir_contrasena"];
    let completos = campos.every(id => document.getElementById(id).value.trim());

    if (metodo === "tarjeta") {
      completos &= document.getElementById("numero_tarjeta").value.trim() &&
                   document.getElementById("codigo_tarjeta").value.trim();
    }
    if (metodo === "cupon") {
      const pagoFacil = document.getElementById("pago_facil");
      const rapipago = document.getElementById("rapipago");
      completos &= (pagoFacil.checked && !pagoFacil.disabled) ||
                   (rapipago.checked && !rapipago.disabled);
    }

    btnConfirmar.disabled = !completos;
  }

  formulario.addEventListener("input", actualizarBoton);
  formulario.addEventListener("change", actualizarBoton);

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validarFormulario()) {
    const metodo = document.querySelector('input[name="metodo_pago"]:checked')?.value;
    
    let cuponTipo = null;
    if (metodo === "cupon") {
      if (document.getElementById("pago_facil").checked) cuponTipo = "Pago Fácil";
      else if (document.getElementById("rapipago").checked) cuponTipo = "Rapipago";
    }

    const datos = {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      usuario: document.getElementById("usuario").value.trim(),
      email: document.getElementById("email").value.trim(),
      contrasena: document.getElementById("contrasena").value.trim(),
      codigoTarjeta: document.getElementById("codigo_tarjeta").value.trim(),
      metodoPago: metodo,
      cuponTipo: cuponTipo, 
    };

    if (guardarUsuario(datos)) formulario.submit();
  }
});

  actualizarBoton();
}

function setDisabled(grupo, disabled) {
  grupo.querySelectorAll("input, select, button, textarea").forEach(i => i.disabled = disabled);
}

function gestionarMetodoPago() {
  const radioTarjeta = document.getElementById("pago_tarjeta");
  const radioCupon = document.getElementById("pago_cupon");
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
    } else {
      setDisabled(grupoTarjeta, true);
      setDisabled(grupoCupon, true);
    }
  }

  radioTarjeta.addEventListener("change", actualizar);
  radioCupon.addEventListener("change", actualizar);
  actualizar();
}

function activarLimpiezaErroresEnTiempoReal() {
  const campos = ["nombre", "apellido", "usuario", "email", "contrasena", "repetir_contrasena", "codigo_tarjeta", "numero_tarjeta"];
  campos.forEach(campo => {
    const input = document.getElementById(campo);
    if (input) {
      input.addEventListener("input", () => {
        limpiarErrorIndividual(
          campo === "repetir_contrasena" ? "repetircontra" :
          campo === "codigo_tarjeta" ? "codigo" :
          campo === "numero_tarjeta" ? "tarjeta" : campo
        );
      });
    }
  });

  const metodoPagoInputs = document.querySelectorAll('input[name="metodo_pago"]');
  metodoPagoInputs.forEach(input => {
    input.addEventListener("change", () => limpiarErrores());
  });

  const cupones = ["pago_facil", "rapipago"];
  cupones.forEach(id => {
    const check = document.getElementById(id);
    if (check) check.addEventListener("change", () => limpiarErrores());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  gestionarMetodoPago();
  registroValidate();
  activarLimpiezaErroresEnTiempoReal();
});