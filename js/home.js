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

function getUsuarioActivo() {
    const usuarioActualObj = JSON.parse(localStorage.getItem("usuarioActivo"));
    return usuarioActualObj ? usuarioActualObj.usuario : null;
}

function getFavoritos(tipo) {
    const usuario = getUsuarioActivo();
    if (!usuario) return [];
    const key = tipo === "pelicula" ? `favoritos_peliculas_${usuario}` : `favoritos_series_${usuario}`;
    const favoritos = localStorage.getItem(key);
    return favoritos ? JSON.parse(favoritos) : [];
}
function saveFavoritos(tipo, favoritos) {
    const usuario = getUsuarioActivo();
    if (!usuario) return;
    const key = tipo === "pelicula" ? `favoritos_peliculas_${usuario}` : `favoritos_series_${usuario}`;
    localStorage.setItem(key, JSON.stringify(favoritos));
}
function toggleFavorito(tipo, id) {
    const usuario = getUsuarioActivo();
    if (!usuario) return false;
    const favoritos = getFavoritos(tipo);
    const idx = favoritos.indexOf(id);
    if(idx >= 0){
        favoritos.splice(idx, 1);
    }else{
        favoritos.push(id);
    }
    saveFavoritos(tipo, favoritos);
    return idx < 0;
}
function isFavorito(tipo, id) {
    return getFavoritos(tipo).includes(id);
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
        card.style.position = "relative";

        const corazon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        corazon.setAttribute("viewBox", "0 0 512 512");
        corazon.setAttribute("class", "corazon");
        corazon.style.position = "absolute";
        corazon.style.top = "10px";
        corazon.style.right = "10px";
        corazon.style.width = "32px";
        corazon.style.height = "32px";
        corazon.style.cursor = "pointer";
        corazon.innerHTML = `<path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>`;
        if (isFavorito(item.tipo, item.nombre)) {
            corazon.classList.add("favorito");
        }

        corazon.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            const usuario = getUsuarioActivo();
            if (!usuario) {
                alert("Debes iniciar sesión para agregar favoritos.");
                return;
            }
            const esFavorito = toggleFavorito(item.tipo, item.nombre);
            corazon.classList.toggle("favorito", esFavorito);
        });

        card.innerHTML = `
            <a href="detalle_${item.tipo}.html?${item.tipo}=${encodeURIComponent(item.nombre)}">
                <img src="${item.imagen}" alt="${item.nombre}" title="${item.nombre}">
            </a>
        `;
        card.appendChild(corazon);
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

