const bioskopList = document.getElementById("bioskopList");
const searchBioskop = document.getElementById("searchBioskop");

function renderBioskop(daftar){
    bioskopList.innerHTML = "";

    daftar.forEach(function(b){
        const card = document.createElement("a");
        card.className = "bioskop-card";
        card.href = `detail-bioskop.html?id=${b.id}`;

        card.innerHTML = `
            <div class="bioskop-icon">
                <i class="fa-solid fa-building"></i>
            </div>
            <div class="bioskop-info">
                <h3>${b.nama}</h3>
                <p>${b.lokasi}</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
        `;

        bioskopList.appendChild(card);
    });
}

renderBioskop(daftarBioskop);

const lokasiTersimpan = localStorage.getItem("lokasiDipilih");
const namaLokasiMap = {
    ciledug: "Ciledug",
    jaksel: "Jakarta Selatan"
};

if(lokasiTersimpan){
    const hasilFilter = daftarBioskop.filter(function(b){
        return b.lokasi === namaLokasiMap[lokasiTersimpan];
    });
    renderBioskop(hasilFilter);
} else {
    renderBioskop(daftarBioskop);
}