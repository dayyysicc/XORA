const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const movieId = localStorage.getItem("movieId");
const viaFilm = urlParams.get("via") === "film";
const asalDariUrl = urlParams.get("asal");

const movie = movies[id];
document.getElementById("hargaTiket").textContent =
    "Rp " + movie.harga.toLocaleString("id-ID");

if (movie) {
    document.getElementById("posterFilm").src = movie.poster;
    document.getElementById("posterFilm").alt = movie.judul;

    document.getElementById("judulFilm").textContent = movie.judul;
    document.getElementById("sinopsisFilm").textContent = movie.sinopsis;
    document.getElementById("genreFilm").textContent = movie.genre;
    document.getElementById("ratingFilm").textContent = movie.rating;
}

let jumlahTiket = 1;
const jumlahTiketText = document.getElementById("jumlahTiket");
const minusTiket = document.getElementById("minusTiket");
const plusTiket = document.getElementById("plusTiket");
minusTiket.addEventListener("click", function () {
    if (jumlahTiket > 1) {
        jumlahTiket--;
        jumlahTiketText.textContent = jumlahTiket;
    }
});
plusTiket.addEventListener("click", function () {
    if (jumlahTiket < 5) {
        jumlahTiket++;
        jumlahTiketText.textContent = jumlahTiket;
    }
});

const form = document.getElementById("formPemesanan");

const lokasi = document.getElementById("lokasi");
const bioskop = document.getElementById("bioskop");

const dataBioskop = {
    ciledug: ["XXI CBD Ciledug"],
    jaksel: ["XXI Blok M Plaza"]
};

lokasi.addEventListener("change", function () {
    bioskop.disabled = false;
    bioskop.innerHTML = '<option value="" selected disabled>Pilih Bioskop</option>';
    const daftarBioskopDiLokasi = dataBioskop[lokasi.value];
    daftarBioskopDiLokasi.forEach(function(item) {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        bioskop.appendChild(option);
    });
});

// prefill Lokasi dari preferensi tersimpan (bisa diganti manual)
const lokasiTersimpan = localStorage.getItem("lokasiDipilih");
if(lokasiTersimpan){
    lokasi.value = lokasiTersimpan;
    lokasi.dispatchEvent(new Event("change"));
}

// KUNCI LOKASI & BIOSKOP kalau datang dari halaman Detail Bioskop
const bioskopIdDariUrl = urlParams.get("bioskop");

if(bioskopIdDariUrl){
    const bioskopTerpilih = daftarBioskop.find(function(b){ return b.id === bioskopIdDariUrl; });

    if(bioskopTerpilih){
        // isi & kunci dropdown Lokasi
        lokasi.value = bioskopIdDariUrl;
        lokasi.disabled = true;

        // isi & kunci dropdown Bioskop
        bioskop.disabled = false;
        bioskop.innerHTML = `<option value="${bioskopTerpilih.nama}" selected>${bioskopTerpilih.nama}</option>`;
        bioskop.disabled = true;
    }
}

const tanggal = document.getElementById("tanggal");
const jamButtons = document.querySelectorAll(".jam-btn");
let jamTerpilih = "";

jamButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
        jamButtons.forEach(function(item){
            item.classList.remove("aktif");
        });
        btn.classList.add("aktif");
        jamTerpilih = btn.textContent.trim();
    });
});

form.addEventListener("submit", function(event){
    event.preventDefault();

    const daftarBioskop = dataBioskop[lokasi.value];

    console.log(lokasi.value);
    console.log(daftarBioskop);

    localStorage.setItem("lokasi", lokasi.value);
    localStorage.setItem("bioskop", bioskop.value);
    localStorage.setItem("tanggal", tanggal.value);
    localStorage.setItem("jam", jamTerpilih);

    const hargaSatuan = movie.harga;
    const totalHarga = jumlahTiket * hargaSatuan;

    localStorage.setItem("jumlahTiket", jumlahTiket);
    localStorage.setItem("harga", totalHarga);

    // lanjut ke halaman pilih kursi
    // lanjut ke halaman pilih kursi
    let urlTujuan = `pilih-kursi.html?id=${id}`;
    if(bioskopIdDariUrl){
        urlTujuan += `&bioskop=${bioskopIdDariUrl}`;
    }
    if(viaFilm){
        urlTujuan += `&via=film`;
    }
    if(asalDariUrl){
        urlTujuan += `&asal=${asalDariUrl}`;
    }
    window.location.href = urlTujuan;
});

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
    if(viaFilm){
        window.location.href = `detail-film.html?id=${id}`;
    } else if(bioskopIdDariUrl){
        window.location.href = `detail-bioskop.html?id=${bioskopIdDariUrl}`;
    } else if(asalDariUrl === "sedang-tayang"){
        window.location.href = "sedang-tayang.html";
    } else {
        window.location.href = `detail-film.html?id=${id}`;
    }
});