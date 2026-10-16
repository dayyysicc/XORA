const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type") || "snack";

const judulHalaman = document.getElementById("judulHalaman");
const filterRow = document.getElementById("filterRow");
const lainGrid = document.getElementById("lainGrid");



let dataAktif, filterOptions;

if(type === "voucher"){
    judulHalaman.textContent = "Promo & Voucher";
    dataAktif = promoVoucherItems;
    filterOptions = [
        { label: "Semua", value: null },
        { label: "Promo", value: "promo" },
        { label: "Voucher", value: "voucher" }
    ];
} else {
    judulHalaman.textContent = "Drink & Snack";
    dataAktif = drinkSnackItems;
    filterOptions = [
        { label: "Semua", value: null },
        { label: "Drink", value: "drink" },
        { label: "Snack", value: "snack" }
    ];
}
lainGrid.classList.add(type === "voucher" ? "grid-promo" : "grid-makanan");

// ========================================
// FILTER TABS
// ========================================
let kategoriAktif = null;

filterOptions.forEach(function(opsi, index){
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (index === 0 ? " active" : "");
    btn.textContent = opsi.label;

    btn.addEventListener("click", function(){
        kategoriAktif = opsi.value;
        document.querySelectorAll(".filter-btn").forEach(function(b){
            b.classList.remove("active");
        });
        btn.classList.add("active");
        renderGrid();
    });

    filterRow.appendChild(btn);
});

// ========================================
// RENDER GRID
// ========================================
function renderGrid(){
    lainGrid.innerHTML = "";

    const hasil = kategoriAktif
        ? dataAktif.filter(function(item){ return item.kategori === kategoriAktif; })
        : dataAktif;

    hasil.forEach(function(item){
        const card = document.createElement("div");
        card.className = "lain-card " + (type === "voucher" ? "tipe-promo" : "tipe-makanan");

        if(type === "voucher"){
            card.innerHTML = `<img src="${item.poster}" alt="${item.kategori}">`;
        } else {
            card.innerHTML = `
                <img src="${item.poster}" alt="${item.nama}">
                <h4>${item.nama}</h4>
                <p class="lain-harga">Rp${item.harga.toLocaleString("id-ID")}</p>
            `;
        }

        lainGrid.appendChild(card);
    });
}

renderGrid();

// ========================================
// TOMBOL BACK
// ========================================
document.getElementById("backBtn").addEventListener("click", function(){
    window.location.href = "beranda.html";
});