const filmList = document.getElementById("filmList");

// looping semua film dari movies.js, tampilkan sebagai card
Object.keys(movies).forEach(function(id){
    const movie = movies[id];

    const card = document.createElement("div");
    card.className = "film-card";
    card.dataset.id = id;

    card.innerHTML = `
        <div class="film-card-link">
            <img src="${movie.poster}" alt="${movie.judul}">
        </div>
        <div class="film-card-info">
            <h3>${movie.judul}</h3>
            <p class="film-genre">${movie.genre} • ${movie.rating}</p>
            <p class="film-sinopsis">${movie.sinopsis}</p>
            <a class="baca-selengkapnya" href="detail-film.html?id=${id}">Baca Selengkapnya</a>
            <div class="film-card-footer">
                <p class="film-harga">Rp${movie.harga.toLocaleString("id-ID")}</p>
                <a class="btn-beli-tiket" href="pemesanan.html?id=${id}&asal=sedang-tayang">Beli Tiket</a>
            </div>
        </div>
    `;

    filmList.appendChild(card);
});

// ========================================
// FILTER GENRE & RATING
// ========================================
const filterSemua = document.getElementById("filterSemua");
const genreBtn = document.getElementById("genreBtn");
const ratingBtn = document.getElementById("ratingBtn");
const genreMenu = document.getElementById("genreMenu");
const ratingMenu = document.getElementById("ratingMenu");

let genreAktif = null;
let ratingAktif = null;

// ambil daftar genre unik dari semua film (genre.js formatnya "Thriller • Biography")
const semuaGenre = new Set();
Object.values(movies).forEach(function(movie){
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

// daftar rating tetap (minimum rating)
const daftarRating = [5.0, 4.0, 3.0, 2.0];
daftarRating.forEach(function(nilai){
    const opsi = document.createElement("div");
    opsi.className = "filter-option";
    opsi.textContent = nilai.toFixed(1);
    opsi.addEventListener("click", function(){
        ratingAktif = nilai;
        ratingMenu.classList.remove("open");
        terapkanFilter();
    });
    ratingMenu.appendChild(opsi);
});

// buka/tutup dropdown
genreBtn.addEventListener("click", function(e){
    e.stopPropagation();
    ratingMenu.classList.remove("open");
    genreMenu.classList.toggle("open");
});

ratingBtn.addEventListener("click", function(e){
    e.stopPropagation();
    genreMenu.classList.remove("open");
    ratingMenu.classList.toggle("open");
});

// klik di luar dropdown -> tutup semua
document.addEventListener("click", function(){
    genreMenu.classList.remove("open");
    ratingMenu.classList.remove("open");
});

// tombol Semua -> reset filter
filterSemua.addEventListener("click", function(){
    genreAktif = null;
    ratingAktif = null;
    terapkanFilter();
});

// ambil angka rating dari string "⭐⭐⭐⭐⭐ 5.0" -> 5.0
function ambilAngkaRating(ratingText){
    const cocok = ratingText.match(/[\d.]+/);
    return cocok ? Number(cocok[0]) : 0;
}

function terapkanFilter(){
    // update tampilan tombol aktif
    filterSemua.classList.toggle("active", !genreAktif && !ratingAktif);
    genreBtn.classList.toggle("active", !!genreAktif);
    ratingBtn.classList.toggle("active", !!ratingAktif);

    genreBtn.innerHTML = (genreAktif || "Genre") + ' <i class="fa-solid fa-chevron-down"></i>';
    ratingBtn.innerHTML = (ratingAktif ? ratingAktif.toFixed(1) + "+" : "Rating") + ' <i class="fa-solid fa-chevron-down"></i>';

    // filter card yang sudah ada di halaman
    document.querySelectorAll(".film-card").forEach(function(card){
        const id = card.dataset.id;
        const movie = movies[id];

        const cocokGenre = !genreAktif || movie.genre.includes(genreAktif);
        const cocokRating = !ratingAktif || ambilAngkaRating(movie.rating) >= ratingAktif;

        card.style.display = (cocokGenre && cocokRating) ? "flex" : "none";
    });
}

// tombol back
document.getElementById("backBtn").addEventListener("click", function(){
    window.location.href = "beranda.html";
});