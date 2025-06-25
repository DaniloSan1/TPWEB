document.addEventListener('DOMContentLoaded', init);

let data = {};
let serieActualKey = null;

const botones = document.querySelectorAll('.btn-indicador');
let imagenActual = 0;
const contenedorImagen = document.querySelector('.contenedor-galeria');

const vIframe = document.getElementById('iframe_trailer');
const vTitulo = document.getElementById('titulo');
const vGenero = document.getElementById('genero');
const vActores = document.getElementById('actores');
const cantTemporadas = document.getElementById('temporadas');
const cantCapitulos = document.getElementById('capitulos');
const vDescripcion = document.getElementById('descripcion');
const btnComenzar = document.getElementById('btn_comenzar');

function getUsuarioActivo() {
    const usuarioActualObj = JSON.parse(localStorage.getItem("usuarioActivo"));
    return usuarioActualObj ? usuarioActualObj.usuario : null;
}

function getFavoritos() {
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
    return getFavoritos().some(f => f.tipo === "serie" && f.key === id);
}
function toggleFavorito(id) {
    const usuario = getUsuarioActivo();
    if (!usuario) return false;
    const favoritos = getFavoritos();
    const idx = favoritos.findIndex(f => f.tipo === "serie" && f.key === id);
    if(idx >= 0){
        favoritos.splice(idx, 1);
    }else{
        favoritos.push({ tipo: "serie", key: id });
    }
    saveFavoritos(favoritos);
    return idx < 0;
}
function getFavoritosSeries() {
    const usuario = getUsuarioActivo();
    if (!usuario) return [];
    const favoritos = localStorage.getItem(`favoritos_series_${usuario}`);
    return favoritos ? JSON.parse(favoritos) : [];
}
function saveFavoritosSeries(favoritos) {
    const usuario = getUsuarioActivo();
    if (!usuario) return;
    localStorage.setItem(`favoritos_series_${usuario}`, JSON.stringify(favoritos));
}
function isFavoritoSerie(id) {
    return getFavoritosSeries().includes(id);
}
function toggleFavoritoSerie(id) {
    const usuario = getUsuarioActivo();
    if (!usuario) return false;
    const favoritos = getFavoritosSeries();
    const idx = favoritos.indexOf(id);
    if(idx >= 0){
        favoritos.splice(idx, 1);
    }else{
        favoritos.push(id);
    }
    saveFavoritosSeries(favoritos);
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
    const marcado = isFavoritoSerie(id);
    nuevoCorazon.classList.toggle('favorito', marcado);
    nuevoCorazon.addEventListener('click', () => {
        const usuarioClick = getUsuarioActivo();
        if(!usuarioClick) {
            alert("Debes iniciar sesión para agregar favoritos.");
            return;
        }
        const esFavorito = toggleFavoritoSerie(id);
        nuevoCorazon.classList.toggle('favorito', esFavorito);
    });
}

async function init() {
    const info = await fetch('../json/data_detalle.json');
    data = await info.json();

    const params = new URLSearchParams(location.search);
    const keyURL = params.get('serie');
    serieActualKey = keyURL && data[keyURL] ? keyURL : 'americanhorrorstory';

    renderSerie(serieActualKey);
    initFavorito(serieActualKey);
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
    const keys = Object.keys(data).filter(key => key !== serieActualKey);
    const grupo = keys.slice(imagenActual, imagenActual + 3);
    grupo.forEach(key => {
        const serie = data[key];
        const article = document.createElement('article');
        article.classList.add('card_peliculaYserie');
        const link = document.createElement('a');
        link.href = `detalle_serie.html?serie=${key}`;
        const img = document.createElement('img');
        img.src = serie.imagen;
        img.alt = `Imagen de la serie ${serie.titulo}`;
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
    const keys = Object.keys(data).filter(key => key !== serieActualKey);
    imagenActual += 3;
    if (imagenActual >= keys.length) {
        imagenActual = 0;
    }
    cambiarImagen();
    actualizarBotones();
}

function renderSerie(key) {
    const serie = data[key];
    if (!serie) return;
    serieActualKey = key;
    const temporadas = Object.keys(serie.temporadas);
    vIframe.src = serie.temporadas[temporadas[0]].trailer;
    vTitulo.textContent = serie.titulo;
    vGenero.innerHTML = `<strong>Género:</strong> ${serie.genero}`;
    vDescripcion.textContent = serie.descripcion;
    vActores.innerHTML = `<strong>Actores:</strong> ` + serie.actores.map(a => `<a href="${a.enlace}" target="_blank">${a.nombre}</a>`).join(', ');
    selecTemporadas(serie.temporadas);
    btnComenzar.href = serie.temporadas[temporadas[0]].trailer.replace('embed/', 'watch?v=');
}

function selecTemporadas(objTemporadas) {
    cantTemporadas.innerHTML = '';
    const temporadas = Object.keys(objTemporadas);
    temporadas.forEach((temporada, i) => {
        const option = new Option(temporada, temporada, i === 0, i === 0);
        cantTemporadas.appendChild(option);
    });
    const primerTemp = objTemporadas[temporadas[0]];
    selecCapitulos(primerTemp.capitulos);
}

function selecCapitulos(objCapitulos) {
    cantCapitulos.innerHTML = '';
    objCapitulos.forEach((cap, i) => cantCapitulos.appendChild(new Option(cap, cap)));
}

cantTemporadas.addEventListener('change', e => {
    const temporada = e.target.value;
    const temporadaData = data[serieActualKey].temporadas[temporada];
    selecCapitulos(temporadaData.capitulos);
    vIframe.src = temporadaData.trailer;
    btnComenzar.href = temporadaData.trailer.replace('embed/', 'watch?v=');
});