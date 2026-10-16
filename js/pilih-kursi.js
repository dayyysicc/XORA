const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const bioskopIdDariUrl = urlParams.get("bioskop");
const viaFilm = urlParams.get("via") === "film";
const asalDariUrl = urlParams.get("asal");

const jumlahTiket = Number(localStorage.getItem("jumlahTiket")) || 1;
document.getElementById("jumlahTiket").textContent = jumlahTiket;

const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", function () {
    let urlTujuan = `pemesanan.html?id=${id}`;
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

const movie = movies[id];
document.getElementById("hargaTiket").textContent =
    "Rp " + movie.harga.toLocaleString("id-ID");

if (movie) {
    document.getElementById("posterFilm").src = movie.poster;
    document.getElementById("posterFilm").alt = movie.judul;
    document.getElementById("judulFilm").textContent = movie.judul;
}

// mengambil semua tombol kursi
const seats = document.querySelectorAll(".seat");
const kursiTerpilih = document.getElementById("kursiTerpilih");
const btnLanjut = document.querySelector(".btn-lanjut");

// tombol tidak bisa ditekan saat awal
btnLanjut.disabled = true;

// jumlah tiket 
const maxSeat = Number(localStorage.getItem("jumlahTiket")) || 1;

const namaLokasi = {
    ciledug: "Ciledug",
    jaksel: "Jakarta Selatan"
};

// daftar studio yang tersedia
const daftarStudio = ["1", "2", "3", "4"];

// tentukan studio otomatis berdasarkan data pemesanan (konsisten, bukan acak tiap reload)
function tentukanStudio(bioskop, lokasi, tanggal, jam){
    const gabungan = bioskop + lokasi + tanggal + jam;
    let hash = 0;
    for(let i = 0; i < gabungan.length; i++){
        hash = (hash * 31 + gabungan.charCodeAt(i)) % daftarStudio.length;
    }
    return daftarStudio[Math.abs(hash)];
}

const bioskopValue = localStorage.getItem("bioskop");
const tanggalValue = localStorage.getItem("tanggal");
const jamValue = localStorage.getItem("jam");

const studioTerpilih = tentukanStudio(bioskopValue, localStorage.getItem("lokasi"), tanggalValue, jamValue);
localStorage.setItem("studio", studioTerpilih);
document.getElementById("studio").textContent = studioTerpilih;

// looping semua kursi
seats.forEach(function (seat) {
    seat.addEventListener("click", function () {
        // kalau kursi terisi, jangan bisa dipilih
        if (seat.classList.contains("terisi")) {
            return;
        }

        // kalau kursi sudah dipilih, boleh dibatalkan
        if (seat.classList.contains("pilih")) {
            seat.classList.remove("pilih");
        } else {
            // ambil semua kursi yang sedang dipilih
            const selectedSeats = document.querySelectorAll(".seat.pilih");
            // kalau sudah mencapai batas, hapus kursi pertama
            if (selectedSeats.length >= maxSeat) {
                selectedSeats[0].classList.remove("pilih");
            }
            // pilih kursi baru
            seat.classList.add("pilih");
        }

        // update No. Kursi
        const selectedSeats = document.querySelectorAll(".seat.pilih");
        if (selectedSeats.length === 0) {
            kursiTerpilih.innerHTML = "<span>Belum dipilih</span>";
        } else {
            kursiTerpilih.innerHTML = "";
            selectedSeats.forEach(function (seat) {
                kursiTerpilih.innerHTML += `<span>${seat.dataset.seat}</span>`;
            });
        }

        if(selectedSeats.length === 0){
            btnLanjut.disabled = true;
        }else{
            btnLanjut.disabled = false;
        }     
    });
});

const lokasi = localStorage.getItem("lokasi");

document.getElementById("lokasi").textContent =
namaLokasi[lokasi];

document.getElementById("bioskop").textContent =
localStorage.getItem("bioskop");

document.getElementById("tanggal").textContent =
localStorage.getItem("tanggal");

document.getElementById("jam").textContent =
localStorage.getItem("jam");

btnLanjut.addEventListener("click", function(){

    const selectedSeats = document.querySelectorAll(".seat.pilih");

    const kursi = [];

    selectedSeats.forEach(function(seat){
        kursi.push(seat.dataset.seat);
    });

    localStorage.setItem("kursi", JSON.stringify(kursi));

    window.location.href = `pembayaran.html?id=${id}`;

});