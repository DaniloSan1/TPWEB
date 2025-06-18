document.addEventListener('DOMContentLoaded', () => {
    cambiarImagen();
    actualizarBotones();
});
const imagenes = [
    '../assets/img/series/arcane.webp',
    '../assets/img/series/americanhorrorstory.webp',
    '../assets/img/series/eleternauta.webp',
    '../assets/img/series/envidiosa.webp',
    '../assets/img/series/sabrina.webp',
    '../assets/img/series/thegoodplace.webp',
]
const botones = document.querySelectorAll('.btn-indicador');
let imagenActual = 0;
const contenedorImagen = document.querySelector('.contenedor-galeria');
function cambiarImagen() {
   contenedorImagen.innerHTML = '';
   const grupo = imagenes.slice(imagenActual, imagenActual + 3);
    grupo.forEach(src => {
        const article = document.createElement('article');
        article.classList.add('card_peliculaYserie');
        const link = document.createElement('a');
        link.href = '../pages/detalle_serie.html';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Imagen de la serie';

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
        if (index === imagenActual / 3) {
            boton.classList.add('activo');
        }
    });
}
function avanzarGrupo(){
    imagenActual += 3;
    if (imagenActual >= imagenes.length) {
        imagenActual = 0;
    }
    cambiarImagen();
    actualizarBotones();
}
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

let data = {};
let serieActualKey = null;

const iframe = document.getElementById('iframe_trailer');
const titulo = document.getElementById('titulo');
const actores = document.getElementById('actores');
const cantTemporadas = document.getElementById('temporadas');
const cantCapitulos = document.getElementById('capitulos');
const descripcion = document.getElementById('descripcion');
const btnComenzar = document.getElementById('btn_comenzar');

document.addEventListener('DOMContentLoaded', init);
async function init() {
    const info = await fetch('../json/data_detalle.json');
    data = await info.json();
    console.log(data)
}