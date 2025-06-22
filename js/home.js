let catalogo = [];
let filtroTipo = ""; // "" para mostrar todo
let filtroCategoria = "";
let filtroNombre = "";

const galeria = document.getElementById('galeria');
const selectCategoria = document.getElementById('categoria');
const buscador = document.getElementById('buscar');
const formBuscar = document.querySelector('form');

async function cargarCatalogo() {
    const [peliculasRes, seriesRes] = await Promise.all([
        fetch('../json/peliculas.json'),
        fetch('../json/series.json')
    ]);
    const peliculas = await peliculasRes.json();
    const series = await seriesRes.json();
    catalogo = [...peliculas, ...series];
    renderGaleria();
}

function renderGaleria() {
    galeria.innerHTML = "";
    let filtrados = catalogo
        .filter(item => !filtroTipo || item.tipo === filtroTipo)
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
            <a href="detalle_${item.tipo}.html?nombre=${encodeURIComponent(item.nombre)}">
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

