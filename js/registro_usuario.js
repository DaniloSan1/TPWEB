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
  texto: (v) => regex.letras.test(v),
  email: (v) => regex.email.test(v),
  usuario: (v) => regex.usuario.test(v),
  codigo: (v) => regex.codigo.test(v),
  tarjeta: (v) => regex.tarjeta.test(v),
  contrasena: (v) => {
    if (v.length < 8) return false;
    const l = (v.match(/[a-zA-Z]/g) || []).length;
    const n = (v.match(/[0-9]/g) || []).length;
    const e = (v.match(/[^a-zA-Z0-9]/g) || []).length;
    return l >= 2 && n >= 2 && e >= 2;
  },
};

function mostrarError(el, msg) {
  const error = document.querySelector(`.js-${el}-error`);
  if (error) error.textContent = msg;
}

function limpiarErrorIndividual(id) {
  const error = document.querySelector(`.js-${id}-error`);
  if (error) error.textContent = "";
}

function limpiarErrores() {
  document.querySelectorAll("[class^='js-'][class$='-error']").forEach(e => e.textContent = "");
}

function validarCampo(v, validador, msgVacio, msgInvalido, el) {
  if (!v) {
    mostrarError(el, msgVacio);
    return false;
  }
  if (!validador(v)) {
    mostrarError(el, msgInvalido);
    return false;
  }
  limpiarErrorIndividual(el);
  return true;
}

function validarFormulario() {
  limpiarErrores();
  const d = {
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

  valido &= validarCampo(d.nombre, validadores.texto, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.NOMBRE_INVALIDO, "nombre");
  valido &= validarCampo(d.apellido, validadores.texto, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.APELLIDO_INVALIDO, "apellido");
  valido &= validarCampo(d.usuario, validadores.usuario, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.USUARIO_INVALIDO, "usuario");
  valido &= validarCampo(d.email, validadores.email, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.EMAIL_INVALIDO, "email");

  if (!d.contrasena) {
    mostrarError("contrasena", ERROR_MESSAGES.CAMPO_VACIO);
    valido = false;
  } else if (!validadores.contrasena(d.contrasena)) {
    mostrarError("contrasena", ERROR_MESSAGES.CONTRA_INVALIDA);
    valido = false;
  } else {
    limpiarErrorIndividual("contrasena");
  }

  if (!d.repetirContrasena) {
    mostrarError("repetircontra", ERROR_MESSAGES.CAMPO_VACIO);
    valido = false;
  } else if (d.repetirContrasena !== d.contrasena) {
    mostrarError("repetircontra", ERROR_MESSAGES.REPETIR_CONTRA_INVALIDA);
    valido = false;
  } else {
    limpiarErrorIndividual("repetircontra");
  }

  if (d.metodoPago === "tarjeta") {
    valido &= validarCampo(d.codigoTarjeta, validadores.codigo, ERROR_MESSAGES.CAMPO_VACIO, ERROR_MESSAGES.CODIGO_INVALIDO, "codigo");

    if (!d.numeroTarjeta) {
      mostrarError("tarjeta", ERROR_MESSAGES.CAMPO_VACIO);
      valido = false;
    } else if (!validadores.tarjeta(d.numeroTarjeta)) {
      mostrarError("tarjeta", ERROR_MESSAGES.NRO_TARJETA_INVALIDO);
      valido = false;
    } else {
      const n = d.numeroTarjeta.split("").map(Number);
      const suma = n.slice(0, 15).reduce((a, b) => a + b, 0);
      const ult = n[15];

      if ((suma % 2 === 0 && ult % 2 === 0) || (suma % 2 !== 0 && ult % 2 !== 0)) {
        mostrarError("tarjeta", ERROR_MESSAGES.NRO_TARJETA_INVALIDO);
        valido = false;
      } else {
        limpiarErrorIndividual("tarjeta");
      }
    }
  }

  if (d.metodoPago === "cupon") {
    const pagoFacil = document.getElementById("pago_facil");
    const rapipago = document.getElementById("rapipago");
    const algunoMarcado = (pagoFacil.checked && !pagoFacil.disabled) || (rapipago.checked && !rapipago.disabled);
    if (!algunoMarcado) valido = false;
  }

  return valido;
}

function guardarUsuario(d) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.some(u => u.usuario === d.usuario);
  if (existe) {
    mostrarError("usuario", "El usuario ya existe.");
    return false;
  }
  usuarios.push(d);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return true;
}

function registroValidate() {
  const form = document.getElementById("formulario");
  const btn = document.getElementById("btn_confirmar");

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

    btn.disabled = !completos;
  }

  form.addEventListener("input", actualizarBoton);
  form.addEventListener("change", actualizarBoton);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const d = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        usuario: document.getElementById("usuario").value.trim(),
        email: document.getElementById("email").value.trim(),
        contrasena: document.getElementById("contrasena").value.trim(),
        codigoTarjeta: document.getElementById("codigo_tarjeta").value.trim(),
        metodoPago: document.querySelector('input[name="metodo_pago"]:checked')?.value,
      };
      if (guardarUsuario(d)) form.submit();
    }
  });

  actualizarBoton();
}

function setDisabled(grupo, dis) {
  grupo.querySelectorAll("input, select, button, textarea").forEach(i => i.disabled = dis);
}

function gestionarMetodoPago() {
  const t = document.getElementById("pago_tarjeta");
  const c = document.getElementById("pago_cupon");
  const gT = document.getElementById("grupo_tarjeta");
  const gC = document.getElementById("grupo_cupon");

  function actualizar() {
    if (t.checked) {
      setDisabled(gT, false);
      setDisabled(gC, true);
      document.getElementById("pago_facil").checked = false;
      document.getElementById("rapipago").checked = false;
    } else if (c.checked) {
      setDisabled(gT, true);
      setDisabled(gC, false);
    } else {
      setDisabled(gT, true);
      setDisabled(gC, true);
    }
  }

  t.addEventListener("change", actualizar);
  c.addEventListener("change", actualizar);
  actualizar();
}

function activarLimpiezaErroresEnTiempoReal() {
  const campos = ["nombre", "apellido", "usuario", "email", "contrasena", "repetir_contrasena", "codigo_tarjeta", "numero_tarjeta"];
  campos.forEach(c => {
    const input = document.getElementById(c);
    if (input) {
      input.addEventListener("input", () => {
        limpiarErrorIndividual(
          c === "repetir_contrasena" ? "repetircontra" :
          c === "codigo_tarjeta" ? "codigo" :
          c === "numero_tarjeta" ? "tarjeta" : c
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
