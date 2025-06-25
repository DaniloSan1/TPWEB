document.addEventListener('DOMContentLoaded', () => {
    cambiarImagen();
    actualizarBotones();
});

let data = {};
let peliculaActualKey = null;

const botones = document.querySelectorAll('.btn-indicador');
let imagenActual = 0;
const contenedorImagen = document.querySelector('.contenedor-galeria');

const vIframe      = document.getElementById('iframe_trailer');
const vTitulo      = document.getElementById('titulo');
const vGenero      = document.getElementById('genero');
const vActores     = document.getElementById('actores');
const vDescripcion = document.getElementById('descripcion');
const btnComenzar  = document.getElementById('btn_comenzar');

localStorage.removeItem("favoritos");
localStorage.removeItem("favoritos_null");

function getUsuarioActivo() {
    const usuarioActualObj = JSON.parse(localStorage.getItem("usuarioActivo"));
    return usuarioActualObj ? usuarioActualObj.usuario : null;
}
/*function getFavoritos() {
    const usuario = getUsuarioActivo();
    if (!usuario) return [];
    const favoritos = localStorage.getItem(`favoritos_${usuario}`);
    return favoritos ? JSON.parse(favoritos) : [];
}
function saveFavoritos(favoritos) {
    const usuario = getUsuarioActivo();
    if (!usuario) return;
    localStorage.setItem(`favoritos_${usuario}`, JSON.stringify(favoritos));
}
function isFavorito(id) {
    return getFavoritos().includes(id);
}
function toggleFavorito(id) {
    const usuario = getUsuarioActivo();
    if (!usuario) return false;
    const favoritos = getFavoritos();
    const index = favoritos.indexOf(id);
    if(index >= 0){
        favoritos.splice(index, 1);
    }else{
        favoritos.push(id);
    }
    saveFavoritos(favoritos);
    return index < 0;
}*/
function getFavoritosPeliculas() {
    const usuario = getUsuarioActivo();
    if (!usuario) return [];
    const favoritos = localStorage.getItem(`favoritos_peliculas_${usuario}`);
    return favoritos ? JSON.parse(favoritos) : [];
}
function saveFavoritosPeliculas(favoritos) {
    const usuario = getUsuarioActivo();
    if (!usuario) return;
    localStorage.setItem(`favoritos_peliculas_${usuario}`, JSON.stringify(favoritos));
}
function isFavoritoPelicula(id) {
    return getFavoritosPeliculas().includes(id);
}
function toggleFavoritoPelicula(id) {
    const usuario = getUsuarioActivo();
    if (!usuario) return false;
    const favoritos = getFavoritosPeliculas();
    const idx = favoritos.indexOf(id);
    if(idx >= 0){
        favoritos.splice(idx, 1);
    }else{
        favoritos.push(id);
    }
    saveFavoritosPeliculas(favoritos);
    return idx < 0;
}
function initFavorito(id){
    const corazon = document.querySelector('.corazon');
    if(!corazon) return;
    const nuevoCorazon = corazon.cloneNode(true);
    corazon.parentNode.replaceChild(nuevoCorazon, corazon);

    const usuario = getUsuarioActivo();
    if(!usuario) {
        nuevoCorazon.classList.remove('favorito');
        nuevoCorazon.addEventListener('click', () => {
            alert("Debes iniciar sesión para agregar favoritos.");
        });
        return;
    }
    const marcado = isFavoritoPelicula(id);
    nuevoCorazon.classList.toggle('favorito', marcado);
    nuevoCorazon.addEventListener('click', () => {
        const usuarioClick = getUsuarioActivo();
        if(!usuarioClick) {
            alert("Debes iniciar sesión para agregar favoritos.");
            return;
        }
        const esFavorito = toggleFavoritoPelicula(id);
        nuevoCorazon.classList.toggle('favorito', esFavorito);
    });
}

document.addEventListener('DOMContentLoaded', init);

async function init() {
    const info = await fetch('../json/data_pelicula.json');
    data = await info.json();

    const params = new URLSearchParams(location.search);
    const keyURL = params.get('pelicula');
    peliculaActualKey = keyURL && data[keyURL] ? keyURL : 'elmono';
    
    renderPelicula(peliculaActualKey);
    initFavorito(peliculaActualKey)
    cambiarImagen();
    actualizarBotones();

    botones.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            imagenActual = index * 3;
            cambiarImagen();
            actualizarBotones();
        });
    });
    setInterval(() => {
        avanzarGrupo();
    }, 5000);
}

function cambiarImagen() {
    contenedorImagen.innerHTML = '';
    const keys = Object.keys(data).filter(key => key !== peliculaActualKey);
    const grupo = keys.slice(imagenActual, imagenActual + 3);
    grupo.forEach(key => {
        const pelicula = data[key];
        const article = document.createElement('article');
        article.classList.add('card_peliculaYserie');
        const link = document.createElement('a');
        link.href = `detalle_pelicula.html?pelicula=${key}`;
        const img = document.createElement('img');
        img.src = pelicula.imagen;
        img.alt = `Imagen de la película ${pelicula.titulo}`;
        link.appendChild(img);
        article.appendChild(link);
        contenedorImagen.appendChild(article);
        setTimeout(() => {
            article.classList.add('animacion');
        }, 150);
    });
}

function actualizarBotones() {
    botones.forEach((boton, index) => {
        boton.classList.remove('activo');
        if (index === Math.floor(imagenActual / 3)) {
            boton.classList.add('activo');
        }
    });
}

function avanzarGrupo() {
    const keys = Object.keys(data).filter(key => key !== peliculaActualKey);
    imagenActual += 3;
    if (imagenActual >= keys.length) {
        imagenActual = 0;
    }
    cambiarImagen();
    actualizarBotones();
}

function renderPelicula(key) {
    const pelicula = data[key];
    if (!pelicula) return;
    peliculaActualKey = key;
    
    vIframe.src = pelicula.trailer;
    vTitulo.textContent = pelicula.titulo;
    vGenero.innerHTML = `<strong>Género:</strong> ${pelicula.genero}`;
    vDescripcion.textContent = pelicula.descripcion;
    btnComenzar.href = pelicula.trailer.replace('embed/', 'watch?v=');
    vActores.innerHTML = `<strong>Actores:</strong> ` + pelicula.actores.map(a => `<a href="${a.enlace}" target="_blank">${a.nombre}</a>`).join(', ');
}