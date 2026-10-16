const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const bioskopIdDariUrl = urlParams.get("bioskop");
localStorage.setItem("movieId", id);

// simpan asal halaman SEKALI aja, cuma kalau datang dari luar
// (bukan dari pemesanan.html/pilih-kursi.html, biar gak ketiban
// pas balik lagi ke sini dari alur pemesanan)
if(!document.referrer.includes("pemesanan.html") && !document.referrer.includes("pilih-kursi.html")){
    if(bioskopIdDariUrl){
        localStorage.setItem("asalFilm", "bioskop:" + bioskopIdDariUrl);
    } else if(document.referrer.includes("sedang-tayang.html")){
        localStorage.setItem("asalFilm", "sedang-tayang.html");
    } else {
        localStorage.setItem("asalFilm", "beranda.html");
    }
}

const movie = movies[id];
if (movie) {

    document.getElementById("judulFilm").textContent = movie.judul;
    document.getElementById("posterFilm").src = movie.poster;
    document.getElementById("posterFilm").alt = movie.judul;
    document.getElementById("sinopsisFilm").textContent = movie.sinopsis;
    document.getElementById("genreFilm").textContent = movie.genre;
    document.getElementById("ratingFilm").textContent = movie.rating;

}

const asalFilm = localStorage.getItem("asalFilm") || "beranda.html";
const asalDariBioskop = asalFilm.startsWith("bioskop:");
const bioskopIdAsal = asalDariBioskop ? asalFilm.split(":")[1] : null;

const buyBtn = document.getElementById("buyBtn");
buyBtn.addEventListener("click", function () {

    if(asalDariBioskop){
        window.location.href = `pemesanan.html?id=${id}&bioskop=${bioskopIdAsal}&via=film`;
    } else {
        window.location.href = `pemesanan.html?id=${id}`;
    }

});

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {

    if(asalDariBioskop){
        window.location.href = `detail-bioskop.html?id=${bioskopIdAsal}`;
    } else {
        window.location.href = asalFilm;
    }

});

// ========================================
// TAMPILKAN ULASAN MILIK FILM INI
// ========================================
const semuaUlasan = JSON.parse(localStorage.getItem("ulasanTransaksi")) || {};
const reviewList = document.getElementById("reviewList");
const reviewKosong = document.getElementById("reviewKosong");

const ulasanAsli = Object.values(semuaUlasan)
    .filter(function(u){ return u.movieId === id; })
    .map(function(u){
        return { user: "Guest", rating: u.rating, teks: u.teks, milikSaya: true };
    });

const ulasanDummy = (movie.ulasanDummy || []).map(function(u){
    return { user: u.user, rating: u.rating, teks: u.teks, milikSaya: false };
});

const semuaUntukDitampilkan = ulasanAsli.concat(ulasanDummy);

if(semuaUntukDitampilkan.length === 0){
    reviewKosong.style.display = "block";
} else {
    semuaUntukDitampilkan.forEach(function(u){
        const bintang = "⭐".repeat(u.rating) + "☆".repeat(5 - u.rating);
        const labelAnda = u.milikSaya ? `<span class="badge-anda">(Anda)</span>` : "";
        const tombolEdit = u.milikSaya
            ? `<button class="btn-edit-ulasan" id="btnEditUlasan"><i class="fa-solid fa-pen"></i> Edit</button>`
            : "";

        const item = document.createElement("div");
        item.className = "review-item";
        item.innerHTML = `
            <div class="review-header">
                <div class="review-user">
                    <i class="fa-solid fa-circle-user"></i>
                    <span>${u.user}</span>
                    ${labelAnda}
                </div>
                <div class="review-rating">${bintang}</div>
            </div>
            <p>${u.teks || "(tanpa komentar)"}</p>
            ${tombolEdit}
        `;
        reviewList.appendChild(item);
    });
}

// ========================================
// TOMBOL & POPUP EDIT ULASAN
// ========================================
// cari id transaksi (key) yang punya ulasan untuk film ini
let idTransaksiUlasanAktif = null;
Object.keys(semuaUlasan).forEach(function(key){
    if(semuaUlasan[key].movieId === id){
        idTransaksiUlasanAktif = key; // ambil yang terakhir ditemukan
    }
});

const btnEditUlasan = document.getElementById("btnEditUlasan");

const ulasanPopup = document.getElementById("ulasanPopup");
const closeUlasanPopup = document.getElementById("closeUlasanPopup");
const starRating = document.getElementById("starRating");
const stars = document.querySelectorAll("#starRating i");
const ulasanText = document.getElementById("ulasanText");
const btnKirimUlasan = document.getElementById("btnKirimUlasan");

let ratingTerpilih = 0;

if(btnEditUlasan){
    btnEditUlasan.addEventListener("click", function(){
        const ulasanLama = semuaUlasan[idTransaksiUlasanAktif];
        ratingTerpilih = ulasanLama.rating;
        ulasanText.value = ulasanLama.teks;
        tampilkanBintang(ratingTerpilih);
        ulasanPopup.style.display = "flex";
    });
}

closeUlasanPopup.addEventListener("click", function(){
    ulasanPopup.style.display = "none";
});

stars.forEach(function(star){
    star.addEventListener("click", function(){
        ratingTerpilih = Number(star.dataset.value);
        tampilkanBintang(ratingTerpilih);
    });
});

function tampilkanBintang(rating){
    stars.forEach(function(star){
        const nilai = Number(star.dataset.value);
        if(nilai <= rating){
            star.classList.add("aktif");
        } else {
            star.classList.remove("aktif");
        }
    });
}

btnKirimUlasan.addEventListener("click", function(){
    if(ratingTerpilih === 0){
        alert("Silakan pilih rating bintang dulu.");
        return;
    }

    semuaUlasan[idTransaksiUlasanAktif] = {
        rating: ratingTerpilih,
        teks: ulasanText.value.trim(),
        movieId: id
    };

    localStorage.setItem("ulasanTransaksi", JSON.stringify(semuaUlasan));

    // reload halaman biar review list ke-refresh dengan data terbaru
    location.reload();
});