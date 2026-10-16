// data film 
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
// jumlah tiket
const jumlahTiket = Number(localStorage.getItem("jumlahTiket")) || 1;
const harga = Number(localStorage.getItem("harga")) || 0;

document.getElementById("jumlahTiket").textContent = jumlahTiket;
document.getElementById("studio").textContent = localStorage.getItem("studio");
document.getElementById("rincianHargaTiket").textContent =
    jumlahTiket + " Tiket x Rp" + (harga / jumlahTiket).toLocaleString("id-ID");
document.getElementById("totalHargaTiket").textContent =
    "Rp" + harga.toLocaleString("id-ID");

// backbtn
const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function () {
    window.location.href = `pilih-kursi.html?id=${id}`;
});

const movie = movies[id];

if (movie) {
    document.getElementById("posterFilm").src = movie.poster;
    document.getElementById("posterFilm").alt = movie.judul;
    document.getElementById("judulFilm").textContent = movie.judul;
}

// data film dari local storage
const bioskop = localStorage.getItem("bioskop");
const lokasi = localStorage.getItem("lokasi");
const tanggal = localStorage.getItem("tanggal");
const jam = localStorage.getItem("jam");
const kursi =
    JSON.parse(localStorage.getItem("kursi")) || [];

// nama lokasi
const namaLokasi = {
    ciledug: "Ciledug",
    jaksel: "Jakarta Selatan"
};

// tampilan data film
document.getElementById("bioskop").textContent =
    bioskop;
document.getElementById("lokasi").textContent =
    namaLokasi[lokasi];
document.getElementById("tanggal").textContent =
    tanggal;
document.getElementById("jam").textContent =
    jam;

// tampilan kursi
document.getElementById("kursiTerpilih").textContent =
    kursi.length
        ? kursi.join(", ")
        : "Belum dipilih";

// harga tiket
const totalHargaTiket = harga;

// nomor pembelian (dibuat sekali, dipakai konsisten di popup & riwayat)
const noPembelian = Date.now();

// saldo dummy
const saldo = {
    Dana: 11067,
    Gopay: 21070467
};

// voucher dummy
const voucher = {
    "Voucher Dana": 10000,
    "Voucher Gopay": 1500
};
// keterangan voucher
const voucherKeterangan = {
    "Voucher Dana": "Hemat Rp10.000",
    "Voucher Gopay": "Gratis Biaya Admin XXI (1 Tiket)"
};

// variabel pembayaran
let biayaAdmin = 1500;
let potongan = 0;
let metodeAktif = "";
let voucherAktif = "";
let totalBayar = 0;

// dropdown
const metodeBtn =
    document.getElementById("metodeBtn");
const metodeMenu =
    document.getElementById("metodeMenu");
const metodeText =
    document.getElementById("metodeText");
const metodeImg =
    document.getElementById("metodeImg");
const metodeIcon =
    document.getElementById("metodeIcon");
const saldoInfo =
    document.getElementById("saldoInfo");
const voucherBtn =
    document.getElementById("voucherBtn");
const voucherMenu =
    document.getElementById("voucherMenu");
const voucherText =
    document.getElementById("voucherText");
const voucherImg =
    document.getElementById("voucherImg");
const voucherIcon =
    document.getElementById("voucherIcon");
const voucherError =
    document.getElementById("voucherError");

// hitung total
function hitungTotal(){
    totalBayar =
        totalHargaTiket +
        biayaAdmin -
        potongan;

    // harga tiket (per satuan)
    document.getElementById("hargaTiket").textContent =
        "Rp" +
        (totalHargaTiket / jumlahTiket).toLocaleString("id-ID");

    // biaya admin
    document.getElementById("admin").textContent =
        "Rp" +
        biayaAdmin.toLocaleString("id-ID");

    // potongan voucher
    document.getElementById("diskon").textContent =
        "- Rp" +
        potongan.toLocaleString("id-ID");
    document.getElementById("rincianVoucher").textContent =
        voucherKeterangan[voucherAktif] || "";;

    // total
    document.getElementById("totalBayar").textContent =
        "Rp" +
        totalBayar.toLocaleString("id-ID");

    // cek saldo
    const saldoError =
        document.getElementById("saldoError");
    if(
        metodeAktif !== "" &&
        metodeAktif !== "Qris"
    ){
        if(
            totalBayar >
            saldo[metodeAktif]
        ){
            saldoError.textContent =
                "Saldo " +
                metodeAktif +
                " tidak cukup";
            saldoError.style.display =
                "block";
        }else{
            saldoError.textContent =
                "";
            saldoError.style.display =
                "none";
        }
    }else{
        saldoError.textContent =
            "";
        saldoError.style.display =
            "none";
    }
}
hitungTotal();

// dropsown metode pembayaran
metodeBtn.addEventListener(
    "click",
    function(){
        if(
            metodeMenu.style.display ===
            "block"
        ){
            metodeMenu.style.display =
                "none";
        }else{
            metodeMenu.style.display =
                "block";
        }
    }
);

// pilih metode pembayaran
const metodeItems =
    metodeMenu.querySelectorAll(
        ".dropdown-item"
    );

metodeItems.forEach(
    function(item){
        item.addEventListener(
            "click",
            function(){
                metodeAktif =
                    item.dataset.value;

                // hapus pesan voucher
                voucherError.textContent =
                    "";
                voucherError.style.display =
                    "none";

                // tampilan metode pembayaran
                metodeText.textContent =
                    item.dataset.value;
                metodeImg.src =
                    item.dataset.img;
                metodeImg.style.display =
                    "block";

                // icon jadi X
                metodeIcon.classList.remove(
                    "fa-chevron-down"
                );
                metodeIcon.classList.add(
                    "fa-xmark"
                );

                // saldo pada metode pembayaran
                if(
                    metodeAktif === "Dana"
                ){
                    saldoInfo.textContent =
                        "Saldo: Rp" +
                        saldo.Dana.toLocaleString(
                            "id-ID"
                        );
                }
                else if(
                    metodeAktif === "Gopay"
                ){
                    saldoInfo.textContent =
                        "Saldo: Rp" +
                        saldo.Gopay.toLocaleString(
                            "id-ID"
                        );
                }
                else{
                    saldoInfo.textContent =
                        "";
                }

                // sinkronisasi metode pembayaran dengan voucher
                if(
                    metodeAktif === "Dana"
                ){
                    voucherAktif =
                        "Voucher Dana";
                    voucherText.textContent =
                        "Voucher Dana";
                    voucherImg.src =
                        "images/voucher dana.png";
                    voucherImg.style.display =
                        "block";
                    voucherIcon.classList.remove(
                        "fa-chevron-down"
                    );
                    voucherIcon.classList.add(
                        "fa-xmark"
                    );
                    potongan =
                        voucher["Voucher Dana"] || 0;
                }
                else if(
                    metodeAktif === "Gopay"
                ){
                    voucherAktif =
                        "Voucher Gopay";
                    voucherText.textContent =
                        "Voucher Gopay";
                    voucherImg.src =
                        "images/voucher gopay.png";
                    voucherImg.style.display =
                        "block";
                    voucherIcon.classList.remove(
                        "fa-chevron-down"
                    );
                    voucherIcon.classList.add(
                        "fa-xmark"
                    );
                    potongan =
                        voucher["Voucher Gopay"] || 0;
                }
                else{
                    voucherAktif =
                        "";
                    voucherText.textContent =
                        "Pilih Voucher";
                    voucherImg.style.display =
                        "none";
                    voucherIcon.classList.remove(
                        "fa-xmark"
                    );
                    voucherIcon.classList.add(
                        "fa-chevron-down"
                    );
                    potongan =
                        0;
                }

                // hitung ulang
                hitungTotal();

                // tutup dropdown
                metodeMenu.style.display =
                    "none";
            }
        );
    }
);

// reset metode pembayaran
metodeIcon.addEventListener(
    "click",
    function(event){
        event.stopPropagation();

        if(metodeAktif !== ""){
            metodeAktif =
                "";
            metodeText.textContent =
                "Pilih Metode Pembayaran";
            metodeImg.style.display =
                "none";

            // reset saldo
            saldoInfo.textContent =
                "";

            // reset icon
            metodeIcon.classList.remove(
                "fa-xmark"
            );
            metodeIcon.classList.add(
                "fa-chevron-down"
            );

            // reset voucher
            voucherAktif =
                "";
            voucherText.textContent =
                "Pilih Voucher";
            voucherImg.style.display =
                "none";
            voucherIcon.classList.remove(
                "fa-xmark"
            );
            voucherIcon.classList.add(
                "fa-chevron-down"
            );

            // reset potongan
            potongan =
                0;
            // hitung ulang
            hitungTotal();
        }
    }
);

// dropdown voucher
voucherBtn.addEventListener("click", function(){
    if(voucherMenu.style.display === "block"){
        voucherMenu.style.display = "none";
    }else{
        voucherMenu.style.display = "block";
    }
});

// pilih voucher
const voucherItems =
    voucherMenu.querySelectorAll(
        ".dropdown-item"
    );

voucherItems.forEach(function(item){
        item.addEventListener("click",function(){
                const voucherDipilih =
                    item.dataset.value;

                // notif pilih metode pembayaran 
                if(
                    metodeAktif === ""
                ){
                    voucherError.textContent =
                        "Pilih metode pembayaran terlebih dahulu.";
                    voucherError.style.display =
                        "block";
                    voucherMenu.style.display =
                        "none";
                    return;
                }

                // cek voucher untuk dana
                if(
                    metodeAktif === "Dana" &&
                    voucherDipilih !== "Voucher Dana"
                ){
                    voucherError.textContent =
                        "Voucher ini hanya dapat digunakan untuk pembayaran Dana.";
                    voucherError.style.display =
                        "block";
                    voucherMenu.style.display =
                        "none";
                    return;
                }

                // cek voucher untuk gopay
                if(
                    metodeAktif === "Gopay" &&
                    voucherDipilih !== "Voucher Gopay"
                ){
                    voucherError.textContent =
                        "Voucher ini hanya dapat digunakan untuk pembayaran Gopay.";
                    voucherError.style.display =
                        "block";
                    voucherMenu.style.display =
                        "none";
                    return;
                }

                // cek voucher untuk qris
                if(
                    metodeAktif === "Qris"
                ){
                    voucherError.textContent =
                        "Voucher tidak dapat digunakan untuk pembayaran QRIS.";
                    voucherError.style.display =
                        "block";
                    voucherMenu.style.display =
                        "none";
                    return;
                }

                // voucher valid
                voucherError.textContent =
                    "";
                voucherError.style.display =
                    "none";
                voucherAktif =
                    voucherDipilih;
                voucherText.textContent =
                    voucherDipilih;
                voucherImg.src =
                    item.dataset.img;
                voucherImg.style.display =
                    "block";
                // icon jadi X
                voucherIcon.classList.remove(
                    "fa-chevron-down"
                );
                voucherIcon.classList.add(
                    "fa-xmark"
                );
                // ambil potongan
                potongan =
                    voucher[voucherAktif] || 0;
                // hitung ulang
                hitungTotal();
                // tutup dropdown
                voucherMenu.style.display =
                    "none";
            }
        );
    }
);

// hapus voucher
voucherIcon.addEventListener(
    "click",
    function(event){
        event.stopPropagation();
        if(voucherAktif !== ""){
            voucherAktif =
                "";
            voucherText.textContent = "Pilih Voucher";
            voucherImg.style.display = "none";
            voucherIcon.classList.remove("fa-xmark");
            voucherIcon.classList.add("fa-chevron-down");
            potongan =
                0;
            hitungTotal();
        }
    }
);

// popup
const saldoPopup = document.getElementById(
        "saldoPopup");
const closeSaldoPopup = document.getElementById(
        "closeSaldoPopup");
const closeSaldoBtn = document.getElementById(
        "closeSaldoBtn");
const berhasilPopup = document.getElementById(
        "berhasilPopup");
const downloadQR = document.getElementById(
        "downloadQR");

// tombol konfirmasi pembayaran
const btnBayar =
    document.getElementById("btnBayar");
btnBayar.addEventListener("click", function(){

    // cek metode pembayaran
    if(metodeAktif === ""){
        alert(
            "Silakan pilih metode pembayaran terlebih dahulu."
        );
        return;
    }

    // total akhir (nominal yg harus di bayar)
    const total =
        totalHargaTiket +
        biayaAdmin -
        potongan;

    // cek saldo
    if(
        metodeAktif === "Dana" ||
        metodeAktif === "Gopay"
    ){
        const saldoSekarang =
            saldo[metodeAktif];
        if(total > saldoSekarang){
            saldoPopup.style.display =
                "flex";
            document.getElementById(
                "saldoPopupText"
            ).textContent =
                "Saldo " +
                metodeAktif +
                " kamu tidak cukup untuk melakukan pembayaran.";
            return;
        }
    }

    // success payment
    tampilkanPembayaranBerhasil();

    document.getElementById("hasilJudulFilm").textContent =
    movie.judul;

});

//popup success payment
function tampilkanPembayaranBerhasil(){
    simpanRiwayat();

    // data tiket
    document.getElementById("hasilBioskop").textContent =
        document.getElementById("bioskop").textContent;

    document.getElementById("hasilLokasi").textContent =
        document.getElementById("lokasi").textContent;

    document.getElementById("hasilTanggal").textContent =
        document.getElementById("tanggal").textContent;

    document.getElementById("hasilJam").textContent =
        document.getElementById("jam").textContent;

    document.getElementById("hasilJumlahTiket").textContent =
        jumlahTiket

    document.getElementById("hasilNoPembelian").textContent = 
        "#" + noPembelian;

    document.getElementById("hasilStudio").textContent = 
        localStorage.getItem("studio");

    document.getElementById("hasilKursi").textContent =
        document.getElementById("kursiTerpilih").textContent.trim();
    
    // ringkasan pembayaran
    document.getElementById("hasilRincianHargaTiket").textContent =
        jumlahTiket + " Tiket x Rp" + (totalHargaTiket / jumlahTiket).toLocaleString("id-ID");
    document.getElementById("hasilHargaTiket").textContent =
        "Rp" + totalHargaTiket.toLocaleString("id-ID");

    document.getElementById("hasilAdmin").textContent =
        "Rp" + biayaAdmin.toLocaleString("id-ID");

    document.getElementById("hasilDiskon").textContent =
        "- Rp" + potongan.toLocaleString("id-ID");
    document.getElementById("hasilRincianVoucher").textContent =
        voucherKeterangan[voucherAktif] || "";    

    document.getElementById("hasilMetode").textContent =
        metodeAktif;

    document.getElementById("hasilTotalPembayaran").textContent =
        "Rp" + totalBayar.toLocaleString("id-ID");
    
    // qr popup
    document.getElementById("qrTiket").src =
        "images/qr.jpeg";

    // popup
    berhasilPopup.style.display = "flex";

    // data transaksi
    const transaksi = {
        film: movie.judul,
        bioskop: bioskop,
        lokasi: lokasi,
        tanggal: tanggal,
        jam: jam,
        kursi: kursi,
        jumlahTiket: jumlahTiket,
        hargaTiket: movie.harga,
        totalHargaTiket:
            totalHargaTiket,
        metode:
            metodeAktif,
        voucher:
            voucherAktif,
        potongan:
            potongan,
        biayaAdmin:
            biayaAdmin,
        total:
            totalBayar
    };
    localStorage.setItem(
        "transaksi",
        JSON.stringify(transaksi)
    );
}

// popup gagal payment
closeSaldoBtn.addEventListener(
    "click",
    function(){
        saldoPopup.style.display =
            "none";
    }
);
closeSaldoPopup.addEventListener(
    "click",
    function(){
        saldoPopup.style.display =
            "none";
    }
);

// tombol ke beranda
document.getElementById("berandaBtn").addEventListener("click", function(){
    window.location.href = "beranda.html";
});

// tombol lihat riwayat transaksi
document.getElementById("riwayatBtn").addEventListener("click", function(){
    window.location.href = "riwayat.html";
});

// tampilan saat download qr
function buatStrukGambar(callback){
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

    // fallback kalau logo gagal dimuat
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
        ctx.fillText(movie.judul, 40, y);
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

        baris("No. Pembelian", "#" + noPembelian);
        baris("Lokasi", namaLokasi[lokasi]);
        baris("Bioskop", bioskop);
        baris("Studio", localStorage.getItem("studio"));
        baris("No. Kursi", kursi.join(", "));
        baris("Tanggal", tanggal);
        baris("Jam", jam);
        baris("Jumlah Tiket", String(jumlahTiket));

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
            "Rp" + totalHargaTiket.toLocaleString("id-ID"),
            jumlahTiket + " Tiket x Rp" + (totalHargaTiket / jumlahTiket).toLocaleString("id-ID")
        );
        baris("Biaya Admin", "Rp" + biayaAdmin.toLocaleString("id-ID"));
        barisRincian(
            "Potongan Voucher",
            "- Rp" + potongan.toLocaleString("id-ID"),
            voucherKeterangan[voucherAktif] || ""
        );
        baris("Metode Pembayaran", metodeAktif);

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
        ctx.fillText("Rp" + totalBayar.toLocaleString("id-ID"), width - 40, y);
        ctx.textAlign = "left";
        y += 60;

        const qrSize = 220;
        const qrX = (width - qrSize) / 2;
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.strokeRect(qrX - 10, y - 10, qrSize + 20, qrSize + 20);
        ctx.drawImage(document.getElementById("qrTiket"), qrX, y, qrSize, qrSize);
        y += qrSize + 40;

        ctx.textAlign = "center";
        ctx.fillStyle = "#999999";
        ctx.font = "13px Arial";
        ctx.fillText("Tunjukkan QR ini ke petugas bioskop", width / 2, y);

        callback(canvas);
    }
}

// download struk
downloadQR.addEventListener(
    "click",
    function(){
        buatStrukGambar(function(canvas){
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "XORA-Tiket.png";
            link.click();
        });
    }
);

// riwayat transaksi
function simpanRiwayat(){
    const riwayat = JSON.parse(localStorage.getItem("riwayatTransaksi")) || [];

   riwayat.push({
        id: noPembelian,
        noPembelian: noPembelian,
        movieId: id,
        studio: localStorage.getItem("studio"),
        judul: movie.judul,
        poster: movie.poster,
        bioskop: bioskop,
        lokasi: namaLokasi[lokasi],
        tanggal: tanggal,
        jam: jam,
        jumlahTiket: jumlahTiket,
        kursi: kursi.join(", "),
        totalHargaTiket: totalHargaTiket,
        biayaAdmin: biayaAdmin,
        potongan: potongan,
        voucher: voucherAktif,
        totalBayar: totalBayar,
        metode: metodeAktif,
        tanggalTransaksi: new Date().toLocaleDateString("id-ID")
    });     

    localStorage.setItem("riwayatTransaksi", JSON.stringify(riwayat));
}