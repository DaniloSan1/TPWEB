const ERROR_MESSAGES = {
NOMBRE_INVALIDO: "Solo se permiten letras.",
CAMPO_VACIO: "El campo no puede estar vacio.",
APELLIDO_INVALIDO: "Solo se permiten letras.",
EMAIL_INVALIDO: "El formato es incorrecto.",
USUARIO_INVALIDO: "Solo se permiten letras y numeros.",
CONTRA_INVALIDA: "La contraseña debe tener minimo 2 letras, 2 numeros y 2 caracteres especiales.",
REPETIR_CONTRA_INVALIDA: "Las contraseñas deben ser iguales.",
CODIGO_INVALIDO: "El código debe tener 3 números distintos de cero."
};


const regexLetras = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexUsuario = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/;
const regexCodigo = /^[1-9]{3}$/;


function registroValidate(){
const registroForm = document.getElementById("formulario");
registroForm.addEventListener("submit", e => {
e.preventDefault(); 

//Validar Inputs
const nombre = document.querySelector("#nombre").value.trim();
const apellido = document.querySelector("#apellido").value.trim();
const usuario = document.querySelector("#usuario").value.trim();
const email = document.querySelector("#email").value.trim();
const contra = document.querySelector("#contrasena").value.trim();
const repe_contra = document.querySelector("#repetir_contrasena").value.trim();
const codigoTarjeta = document.querySelector("#codigo_tarjeta").value.trim();

//Mensajes de error
const errorNombre = document.querySelector(".js-nombre-error");
const errorApellido = document.querySelector(".js-apellido-error");
const errorUsuario = document.querySelector(".js-usuario-error");
const errorEmail= document.querySelector(".js-email-error");
const errorContrasena = document.querySelector(".js-contrasena-error");
const errorCodigo = document.querySelector(".js-codigo-error");
const errorRepetirContra = document.querySelector(".js-repetircontra-error");


errorNombre.textContent = "";
errorApellido.textContent = "";
errorUsuario.textContent = "";
errorEmail.textContent = "";
errorContrasena.textContent = "";
errorCodigo.textContent = "";
errorRepetirContra.textContent = "";

function validarContrasena(contra) {
  if (contra.length < 8) return false;

  let letras = 0;
  let numeros = 0;
  let especiales = 0;

  for (let i = 0; i < contra.length; i++) {
    const char = contra[i];
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

let isFormValid = true;

if (nombre == "") {
    errorNombre.textContent = ERROR_MESSAGES.CAMPO_VACIO;
    isFormValid = false;
} else if (!regexLetras.test(nombre)) {
    errorNombre.textContent = ERROR_MESSAGES.NOMBRE_INVALIDO;
    isFormValid = false;
}

if (apellido == ""){
    errorApellido.textContent = ERROR_MESSAGES.CAMPO_VACIO;
    isFormValid=false;
} else if(!regexLetras.test(apellido)){
    errorApellido.textContent = ERROR_MESSAGES.APELLIDO_INVALIDO;
    isFormValid=false;
}

if (email == ""){
    errorEmail.textContent = ERROR_MESSAGES.CAMPO_VACIO;
    isFormValid = false;
} else if (!regexEmail.test(email)){
    errorEmail.textContent = ERROR_MESSAGES.EMAIL_INVALIDO;
    isFormValid=false;
}

if (usuario == ""){
    errorUsuario.textContent = ERROR_MESSAGES.CAMPO_VACIO;
    isFormValid=false;
} else if (!regexUsuario.test(usuario)){
    errorUsuario.textContent = ERROR_MESSAGES.USUARIO_INVALIDO;
    isFormValid=false;
}
if (contra === "") {
errorContrasena.textContent = ERROR_MESSAGES.CAMPO_VACIO;
  isFormValid = false;
} else if (!validarContrasena(contra)) {
errorContrasena.textContent = ERROR_MESSAGES.CONTRA_INVALIDA;
isFormValid = false;
}

if (repe_contra === "") {
  errorRepetirContra.textContent = ERROR_MESSAGES.CAMPO_VACIO;
  isFormValid = false;
} else if (repe_contra !== contra) {
  errorRepetirContra.textContent = ERROR_MESSAGES.REPETIR_CONTRA_INVALIDA;
  isFormValid = false;
}

if (codigoTarjeta == ""){
    errorCodigo.textContent = ERROR_MESSAGES.CAMPO_VACIO;
    isFormValid=false;
} else if (!regexCodigo.test(codigoTarjeta)){
    errorCodigo.textContent = ERROR_MESSAGES.CODIGO_INVALIDO;
}
if (isFormValid) {
    const datosUsuario = {
        nombre,
        apellido,
        usuario,
        email,
        contrasena: contra,
        codigoTarjeta
    };

    localStorage.setItem("usuarioRegistrado", JSON.stringify(datosUsuario));
    console.log("Datos guardados en localStorage");
    registroForm.submit(); 
}


registroValidate();
