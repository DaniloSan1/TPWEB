const ERROR_MESSAGES = {
NOMBRE_INVALIDO: "Solo se permiten letras.",
NOMBRE_VACIO: "El campo no puede estar vacio.",
APELLIDO_INVALIDO: "Solo se permiten letras.",
APELLIDO_VACIO: "El campo no puede estar vacio.",
EMAIL_INVALIDO: "El formato es incorrecto.",
EMAIL_VACIO: "El campo no puede estar vacio.",
USUARIO_INVALIDO: "Solo se permiten letras y numeros.",
USUARIO_VACIO: "El campo no puede estar vacio.",
CONTRA_INVALIDA: "La contraseña debe tener minimo 2 letras, 2 numeros y 2 caracteres especiales.",
CONTRA_VACIA: "El campo no puede estar vacio.",
REPETIR_CONTRA: "Las contraseñas deben ser iguales.",
REPETIR_CONTRA_VACIA: "El campo no puede estar vacio"
};


const regexLetras = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexUsuario = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/;


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

//Mensajes de error
const errorNombre = document.querySelector(".js-nombre-error");
const errorApellido = document.querySelector(".js-apellido-error");
const errorUsuario = document.querySelector(".js-usuario-error");
const errorEmail= document.querySelector(".js-email-error");
const errorContrasena = document.querySelector(".js-contrasena-error");

errorNombre.textContent = "";
errorApellido.textContent = "";
errorUsuario.textContent = "";
errorEmail.textContent = "";
errorContrasena.textContent = "";

let isFormValid = true;

if (nombre == "") {
    errorNombre.textContent = ERROR_MESSAGES.NOMBRE_VACIO;
    isFormValid = false;
} else if (!regexLetras.test(nombre)) {
    errorNombre.textContent = ERROR_MESSAGES.NOMBRE_INVALIDO;
    isFormValid = false;
}

if (apellido == ""){
    errorApellido.textContent = ERROR_MESSAGES.APELLIDO_VACIO;
    isFormValid=false;
} else if(!regexLetras.test(apellido)){
    errorApellido.textContent = ERROR_MESSAGES.APELLIDO_INVALIDO;
    isFormValid=false;
}

if (email == ""){
    errorEmail.textContent = ERROR_MESSAGES.EMAIL_VACIO;
    isFormValid = false;
} else if (!regexEmail.test(email)){
    errorEmail.textContent = ERROR_MESSAGES.EMAIL_INVALIDO;
    isFormValid=false;
}

if (usuario == ""){
    errorUsuario.textContent = ERROR_MESSAGES.USUARIO_VACIO;
    isFormValid=false;
} else if (!regexUsuario.test(usuario)){
    errorUsuario.textContent = ERROR_MESSAGES.USUARIO_IVALIDO;
    isFormValid=false;
}
if (isFormValid) {
    console.log("Formulario válido, enviar datos...");
}
})
};

registroValidate();
