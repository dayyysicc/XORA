// ambil data riwayat dari localStorage
const riwayat = JSON.parse(localStorage.getItem("riwayatTransaksi")) || [];
const riwayatList = document.getElementById("riwayatList");
const riwayatKosong = document.getElementById("riwayatKosong");

// tampilkan nama dari profil (kalau sudah diisi), fallback ke "Guest"
const profilTersimpan = JSON.parse(localStorage.getItem("profilUser")) || {};
const namaSidebar = document.querySelector(".profile-name");
if(namaSidebar && profilTersimpan.namaLengkap){
    namaSidebar.textContent = profilTersimpan.namaLengkap;
}

// cek apakah QR transaksi ini masih berlaku (belum lewat jadwal tayang)
function qrMasihBerlaku(trx){
    // format trx.tanggal: "2026-08-13", trx.jam: "21.00"
    const [jamStr, menitStr] = trx.jam.split(".");
    const waktuTayang = new Date(trx.tanggal);
    waktuTayang.setHours(Number(jamStr), Number(menitStr), 0, 0);

    return new Date() <= waktuTayang;
}

if(riwayat.length === 0){
    riwayatKosong.style.display = "block";
} else {
    // tampilkan yang terbaru duluan
    // Card transaksi di-generate di sini (JS), bukan di HTML,
    // karena jumlah transaksi dinamis (tergantung isi localStorage).
    // Tiap transaksi = 1 card, di-loop otomatis lewat forEach di bawah.
    riwayat.slice().reverse().forEach(function(trx){
        const item = document.createElement("div");
        item.className = "riwayat-item";

    const btnDownloadHTML = qrMasihBerlaku(trx)
        ? `<button class="btn-download-qr" data-id="${trx.id}"><i class="fa-solid fa-download"></i> Download QR</button>`
        : `<button class="btn-download-qr" disabled>QR Kedaluwarsa</button>`;

    item.innerHTML = `
        <img src="${trx.poster}" alt="${trx.judul}">
        <div class="riwayat-detail">
            <h3>${trx.judul}</h3>
            <p>${trx.bioskop} - ${trx.lokasi}</p>
            <p>${trx.tanggal} - ${trx.jam}</p>
            <p>Kursi: ${trx.kursi}</p>
            <p class="riwayat-total">Rp${trx.totalBayar.toLocaleString("id-ID")}</p>
        </div>
        <div class="riwayat-aksi">
            <button class="btn-detail" data-id="${trx.id}">Lihat Detail Pembelian</button>
            <button class="btn-ulasan" data-id="${trx.id}">Tambah Ulasan</button>
            ${btnDownloadHTML}
        </div>
    `;
        riwayatList.appendChild(item);
    });
}

// ========================================
// POPUP DETAIL PEMBELIAN
// ========================================
const detailPopup = document.getElementById("detailPopup");
const closeDetailPopup = document.getElementById("closeDetailPopup");

// pakai event delegation: 1 listener di riwayatList,
// biar tetap kedeteksi walau tombolnya baru dibuat lewat JS
riwayatList.addEventListener("click", function(e){
    const tombol = e.target.closest(".btn-detail");
    if(!tombol) return;

    const id = Number(tombol.dataset.id);
    const trx = riwayat.find(function(item){ return item.id === id; });
    if(!trx) return;

    document.getElementById("detailJudulFilm").textContent = trx.judul;
    document.getElementById("detailNoPembelian").textContent = "#" + trx.noPembelian;
    document.getElementById("detailLokasi").textContent = trx.lokasi;
    document.getElementById("detailBioskop").textContent = trx.bioskop;
    document.getElementById("detailStudio").textContent = trx.studio;
    document.getElementById("detailKursi").textContent = trx.kursi;
    document.getElementById("detailTanggal").textContent = trx.tanggal;
    document.getElementById("detailJam").textContent = trx.jam;
    document.getElementById("detailJumlahTiket").textContent = trx.jumlahTiket;
    document.getElementById("detailHargaTiket").textContent =
        "Rp" + trx.totalHargaTiket.toLocaleString("id-ID");
    document.getElementById("detailAdmin").textContent =
        "Rp" + trx.biayaAdmin.toLocaleString("id-ID");
    document.getElementById("detailMetode").textContent = trx.metode;
    document.getElementById("detailTotalBayar").textContent =
        "Rp" + trx.totalBayar.toLocaleString("id-ID");

    detailPopup.style.display = "flex";
});

closeDetailPopup.addEventListener("click", function(){
    detailPopup.style.display = "none";
});

// ========================================
// POPUP TAMBAH ULASAN
// ========================================
const ulasanPopup = document.getElementById("ulasanPopup");
const closeUlasanPopup = document.getElementById("closeUlasanPopup");
const starRating = document.getElementById("starRating");
const stars = document.querySelectorAll("#starRating i");
const ulasanText = document.getElementById("ulasanText");
const btnKirimUlasan = document.getElementById("btnKirimUlasan");

let idTransaksiAktif = null;
let ratingTerpilih = 0;

// buka popup ulasan
riwayatList.addEventListener("click", function(e){
    const tombol = e.target.closest(".btn-ulasan");
    if(!tombol) return;

    idTransaksiAktif = Number(tombol.dataset.id);

    // cek apakah transaksi ini sudah pernah diulas, biar bisa diedit
    const semuaUlasan = JSON.parse(localStorage.getItem("ulasanTransaksi")) || {};
    const ulasanLama = semuaUlasan[idTransaksiAktif];

    ratingTerpilih = ulasanLama ? ulasanLama.rating : 0;
    ulasanText.value = ulasanLama ? ulasanLama.teks : "";
    tampilkanBintang(ratingTerpilih);

    ulasanPopup.style.display = "flex";
});

closeUlasanPopup.addEventListener("click", function(){
    ulasanPopup.style.display = "none";
});

// klik bintang
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

// kirim ulasan
btnKirimUlasan.addEventListener("click", function(){
    if(ratingTerpilih === 0){
        alert("Silakan pilih rating bintang dulu.");
        return;
    }

    const semuaUlasan = JSON.parse(localStorage.getItem("ulasanTransaksi")) || {};
    const trxAktif = riwayat.find(function(item){ return item.id === idTransaksiAktif; });

    semuaUlasan[idTransaksiAktif] = {
        rating: ratingTerpilih,
        teks: ulasanText.value.trim(),
        movieId: trxAktif.movieId
    };

    localStorage.setItem("ulasanTransaksi", JSON.stringify(semuaUlasan));

    ulasanPopup.style.display = "none";
});

// tombol back
document.getElementById("backBtn").addEventListener("click", function(){
    window.location.href = "beranda.html";
});

// ========================================
// DOWNLOAD QR DARI RIWAYAT
// ========================================
const voucherKeterangan = {
    "Voucher Dana": "Hemat Rp10.000",
    "Voucher Gopay": "Gratis Biaya Admin XXI (1 Tiket)"
};

riwayatList.addEventListener("click", function(e){
    const tombol = e.target.closest(".btn-download-qr");
    if(!tombol || tombol.disabled) return;

    const id = Number(tombol.dataset.id);
    const trx = riwayat.find(function(item){ return item.id === id; });
    if(!trx) return;

    buatStrukGambarDariRiwayat(trx, function(canvas){
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "XORA-Tiket.png";
        link.click();
    });
});

function buatStrukGambarDariRiwayat(trx, callback){
    const canvas = document.createElement("canvas");
    const width = 600;
    const height = 950;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const logo = new Image();
    logo.src = "images/logo.png";

    logo.onload = function(){
        const logoWidth = 130;
        const logoHeight = logoWidth * (logo.height / logo.width);
        ctx.drawImage(logo, (width - logoWidth) / 2, 40, logoWidth, logoHeight);
        gambarSisanya(40 + logoHeight);
    };

    logo.onerror = function(){
        ctx.textAlign = "center";
        ctx.fillStyle = "#18C964";
        ctx.font = "bold 26px Arial";
        ctx.fillText("XORA", width / 2, 70);
        gambarSisanya(70);
    };

    function gambarSisanya(yAwal){
        let y = yAwal + 40;

        ctx.textAlign = "center";
        ctx.fillStyle = "#111111";
        ctx.font = "bold 24px Arial";
        ctx.fillText("Pembayaran Berhasil", width / 2, y);

        y += 50;
        ctx.textAlign = "left";
        ctx.font = "bold 22px Arial";
        ctx.fillText(trx.judul, 40, y);
        y += 35;

        function baris(label, value){
            ctx.fillStyle = "#888888";
            ctx.font = "15px Arial";
            ctx.fillText(label, 40, y);
            ctx.fillStyle = "#111111";
            ctx.font = "bold 15px Arial";
            ctx.textAlign = "right";
            ctx.fillText(value, width - 40, y);
            ctx.textAlign = "left";
            y += 30;
        }

        function barisRincian(label, value, rincian){
            baris(label, value);
            if(rincian){
                ctx.fillStyle = "#999999";
                ctx.font = "12px Arial";
                ctx.fillText(rincian, 40, y - 15);
                y += 12;
            }
        }

        baris("No. Pembelian", "#" + trx.noPembelian);
        baris("Lokasi", trx.lokasi);
        baris("Bioskop", trx.bioskop);
        baris("Studio", trx.studio);
        baris("No. Kursi", trx.kursi);
        baris("Tanggal", trx.tanggal);
        baris("Jam", trx.jam);
        baris("Jumlah Tiket", String(trx.jumlahTiket));

        y += 5;
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 40, y);
        ctx.stroke();
        y += 35;

        ctx.fillStyle = "#111111";
        ctx.font = "bold 18px Arial";
        ctx.fillText("Ringkasan Pembayaran", 40, y);
        y += 35;

        barisRincian(
            "Harga Tiket",
            "Rp" + trx.totalHargaTiket.toLocaleString("id-ID"),
            trx.jumlahTiket + " Tiket x Rp" + (trx.totalHargaTiket / trx.jumlahTiket).toLocaleString("id-ID")
        );
        baris("Biaya Admin", "Rp" + trx.biayaAdmin.toLocaleString("id-ID"));
        barisRincian(
            "Potongan Voucher",
            "- Rp" + (trx.potongan || 0).toLocaleString("id-ID"),
            voucherKeterangan[trx.voucher] || ""
        );
        baris("Metode Pembayaran", trx.metode);

        y += 5;
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 40, y);
        ctx.stroke();
        y += 35;

        ctx.fillStyle = "#18C964";
        ctx.font = "bold 18px Arial";
        ctx.fillText("Total Pembayaran", 40, y);
        ctx.textAlign = "right";
        ctx.fillText("Rp" + trx.totalBayar.toLocaleString("id-ID"), width - 40, y);
        ctx.textAlign = "left";
        y += 60;

        const qrSize = 220;
        const qrX = (width - qrSize) / 2;
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.strokeRect(qrX - 10, y - 10, qrSize + 20, qrSize + 20);

        const qr = new Image();
        qr.src = "images/qr.jpeg";
        qr.onload = function(){
            ctx.drawImage(qr, qrX, y, qrSize, qrSize);
            y += qrSize + 40;

            ctx.textAlign = "center";
            ctx.fillStyle = "#999999";
            ctx.font = "13px Arial";
            ctx.fillText("Tunjukkan QR ini ke petugas bioskop", width / 2, y);

            callback(canvas);
        };
    }
}