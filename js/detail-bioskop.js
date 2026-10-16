const filmListSegera = document.getElementById("filmListSegera");
const sinopsisPopup = document.getElementById("sinopsisPopup");
const closeSinopsisPopup = document.getElementById("closeSinopsisPopup");
const ingatkanBtn = document.getElementById("ingatkanBtn");

const urlParams = new URLSearchParams(window.location.search);
const bioskopId = urlParams.get("id");

const bioskop = daftarBioskop.find(function(b){ return b.id === bioskopId; });
document.getElementById("namaBioskop").textContent = bioskop ? bioskop.nama : "Bioskop";

// ========================================
// SEDANG TAYANG
// ========================================
const filmListTayang = document.getElementById("filmListTayang");

Object.keys(movies).forEach(function(id){
    const movie = movies[id];

    const card = document.createElement("div");
    card.className = "film-card";

    card.innerHTML = `
        <div class="film-card-link">
            <img src="${movie.poster}" alt="${movie.judul}">
        </div>
        <div class="film-card-info">
            <h3>${movie.judul}</h3>
            <p class="film-genre">${movie.genre} • ${movie.rating}</p>
            <p class="film-sinopsis">${movie.sinopsis}</p>
            <a class="baca-selengkapnya" href="detail-film.html?id=${id}&bioskop=${bioskopId}">Baca Selengkapnya</a>            <div class="film-card-footer">
                <p class="film-harga">Rp${movie.harga.toLocaleString("id-ID")}</p>
                <a class="btn-beli-tiket" href="pemesanan.html?id=${id}&bioskop=${bioskopId}">Beli Tiket</a>
            </div>
        </div>
    `;

    filmListTayang.appendChild(card);
});

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

    filmListSegera.appendChild(card);
});

function bukaSinopsis(id){
    const movie = moviesSegera[id];

    document.getElementById("popupPoster").src = movie.poster;
    document.getElementById("popupPoster").alt = movie.judul;
    document.getElementById("popupJudul").textContent = movie.judul;
    document.getElementById("popupGenre").textContent = movie.genre;
    document.getElementById("popupTanggal").textContent = "Tayang: " + movie.tanggalTayang;
    document.getElementById("popupSinopsis").textContent = movie.sinopsis;

    ingatkanBtn.dataset.id = id;
    updateTombolPengingat(id);

    sinopsisPopup.style.display = "flex";
}

closeSinopsisPopup.addEventListener("click", function(){
    sinopsisPopup.style.display = "none";
});

function updateTombolPengingat(id){
    const pengingat = JSON.parse(localStorage.getItem("pengingatFilm")) || [];
    const aktif = pengingat.includes(id);

    if(aktif){
        ingatkanBtn.classList.add("aktif");
        ingatkanBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            <span>Pengingat Aktif</span>
        `;
    } else {
        ingatkanBtn.classList.remove("aktif");
        ingatkanBtn.innerHTML = `
            <i class="fa-regular fa-bell"></i>
            <span>Ingatkan Saya</span>
        `;
    }
}

ingatkanBtn.addEventListener("click", function(){
    const id = this.dataset.id;
    let pengingat = JSON.parse(localStorage.getItem("pengingatFilm")) || [];

    if(pengingat.includes(id)){
        pengingat = pengingat.filter(function(item){ return item !== id; });
    } else {
        pengingat.push(id);
    }

    localStorage.setItem("pengingatFilm", JSON.stringify(pengingat));
    updateTombolPengingat(id);
});

// ========================================
// TOMBOL BACK
// ========================================
document.getElementById("backBtn").addEventListener("click", function(){
    window.location.href = "bioskop.html";
});