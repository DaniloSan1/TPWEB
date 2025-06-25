let catalogo = [];
let filtroCategoria = "";
let filtroNombre = "";

const galeria = document.getElementById('galeria');
const selectCategoria = document.getElementById('categoria');
const buscador = document.getElementById('buscar');
const formBuscar = document.querySelector('form');

async function cargarCatalogo() {
    const res = await fetch('../json/peliculas.json');
    catalogo = await res.json();
    renderGaleria();
}

function renderGaleria() {
    galeria.innerHTML = "";
    let filtrados = catalogo
        .filter(item => item.nombre && item.categoria && item.imagen) // Solo items completos
        .filter(item => !filtroCategoria || item.categoria === filtroCategoria)
        .filter(item => !filtroNombre || item.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));

    if (filtrados.length === 0) {
        galeria.innerHTML = "<p style='color:white;text-align:center;width:100%'>No se encontraron resultados.</p>";
        return;
    }

    filtrados.forEach(item => {
        const card = document.createElement('article');
        card.className = "card_peliculaYserie";
        card.innerHTML = `
            <a href="detalle_pelicula.html?pelicula=${encodeURIComponent(item.nombre)}">
                <img src="${item.imagen}" alt="${item.nombre}" title="${item.nombre}">
            </a>
        `;
        galeria.appendChild(card);
    });
}

selectCategoria.addEventListener('change', function () {
    filtroCategoria = this.value;
    renderGaleria();
});

formBuscar.addEventListener('submit', function (e) {
    e.preventDefault();
    filtroNombre = buscador.value.trim();
    renderGaleria();
});
buscador.addEventListener('input', function () {
    filtroNombre = buscador.value.trim();
    renderGaleria();
});

cargarCatalogo();