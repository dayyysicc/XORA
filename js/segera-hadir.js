const segeraGrid = document.getElementById("segeraGrid");
const ingatkanBtn = document.getElementById("ingatkanBtn");

// ========================================
// TAMPILKAN GRID FILM
// ========================================
// Card di-generate di sini, bukan di HTML, karena sumber data
// (movies-segera.js) bisa berubah/nambah kapan saja.
Object.keys(moviesSegera).forEach(function(id){
    const movie = moviesSegera[id];

    const card = document.createElement("div");
    card.className = "segera-card";
    card.dataset.id = id;

    card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.judul}">
        <h4>${movie.judul}</h4>
        <p class="segera-genre">${movie.genre.split(" • ")[0]}</p>
        <p class="segera-tanggal">${movie.tanggalTayang}</p>
    `;

    card.addEventListener("click", function(){
        bukaSinopsis(id);
    });

    segeraGrid.appendChild(card);
});

// ========================================
// POPUP SINOPSIS
// ========================================
const sinopsisPopup = document.getElementById("sinopsisPopup");
const closeSinopsisPopup = document.getElementById("closeSinopsisPopup");

function bukaSinopsis(id){
    const movie = moviesSegera[id];

    document.getElementById("popupPoster").src = movie.poster;
    document.getElementById("popupPoster").alt = movie.judul;
    document.getElementById("popupJudul").textContent = movie.judul;
    document.getElementById("popupGenre").textContent = movie.genre;
    document.getElementById("popupTanggal").textContent =
        "Tayang: " + movie.tanggalTayang;
    document.getElementById("popupSinopsis").textContent =
        movie.sinopsis;

    ingatkanBtn.dataset.id = id;
    updateTombolPengingat(id);

    sinopsisPopup.style.display = "flex";
}

closeSinopsisPopup.addEventListener("click", function(){
    sinopsisPopup.style.display = "none";
});

// ========================================
// FILTER GENRE
// ========================================
const filterSemua = document.getElementById("filterSemua");
const genreBtn = document.getElementById("genreBtn");
const genreMenu = document.getElementById("genreMenu");

let genreAktif = null;

const semuaGenre = new Set();
Object.values(moviesSegera).forEach(function(movie){
    movie.genre.split("•").forEach(function(g){
        semuaGenre.add(g.trim());
    });
});

semuaGenre.forEach(function(genre){
    const opsi = document.createElement("div");
    opsi.className = "filter-option";
    opsi.textContent = genre;
    opsi.addEventListener("click", function(){
        genreAktif = genre;
        genreMenu.classList.remove("open");
        terapkanFilter();
    });
    genreMenu.appendChild(opsi);
});

genreBtn.addEventListener("click", function(e){
    e.stopPropagation();
    genreMenu.classList.toggle("open");
});

document.addEventListener("click", function(){
    genreMenu.classList.remove("open");
});

filterSemua.addEventListener("click", function(){
    genreAktif = null;
    terapkanFilter();
});

function terapkanFilter(){
    filterSemua.classList.toggle("active", !genreAktif);
    genreBtn.classList.toggle("active", !!genreAktif);
    genreBtn.innerHTML = (genreAktif || "Genre") + ' <i class="fa-solid fa-chevron-down"></i>';

    document.querySelectorAll(".segera-card").forEach(function(card){
        const id = card.dataset.id;
        const movie = moviesSegera[id];
        const cocok = !genreAktif || movie.genre.includes(genreAktif);
        card.style.display = cocok ? "block" : "none";
    });
}

function updateTombolPengingat(id){

    const pengingat =
        JSON.parse(localStorage.getItem("pengingatFilm")) || [];

    const aktif = pengingat.includes(id);

    if(aktif){
        ingatkanBtn.classList.add("aktif");

        ingatkanBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            <span>Pengingat Aktif</span>
        `;
    }else{
        ingatkanBtn.classList.remove("aktif");

        ingatkanBtn.innerHTML = `
            <i class="fa-regular fa-bell"></i>
            <span>Ingatkan Saya</span>
        `;
    }
}

ingatkanBtn.addEventListener("click", function(){

    const id = this.dataset.id;

    let pengingat =
        JSON.parse(localStorage.getItem("pengingatFilm")) || [];

    if(pengingat.includes(id)){

        // hapus pengingat
        pengingat = pengingat.filter(function(item){
            return item !== id;
        });

    }else{

        // tambah pengingat
        pengingat.push(id);
    }

    localStorage.setItem(
        "pengingatFilm",
        JSON.stringify(pengingat)
    );

    updateTombolPengingat(id);
});

// ========================================
// TOMBOL BACK
// ========================================
document.getElementById("backBtn").addEventListener("click", function(){
    window.location.href = "beranda.html";
});