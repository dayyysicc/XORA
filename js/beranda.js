// sidebar
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("closeSidebar");

// tampilkan nama dari profil (kalau sudah diisi), fallback ke "Guest"
const profilTersimpan = JSON.parse(localStorage.getItem("profilUser")) || {};
const namaSidebar = document.querySelector(".profile-name");
if(namaSidebar && profilTersimpan.namaLengkap){
    namaSidebar.textContent = profilTersimpan.namaLengkap;
}

menuBtn.addEventListener("click", function(){
    sidebar.classList.add("active");
});

closeSidebar.addEventListener("click", function(){
    sidebar.classList.remove("active");
});

document.addEventListener("click", function(e){
    const klikDiDalamSidebar = sidebar.contains(e.target);
    const klikTombolMenu = menuBtn.contains(e.target);

    if(!klikDiDalamSidebar && !klikTombolMenu){
        sidebar.classList.remove("active");
    }
});

// ========================================
// SEARCH FILM
// ========================================
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", function(){
    const kata = searchInput.value.trim().toLowerCase();

    if(kata === ""){
        searchResults.innerHTML = "";
        searchResults.classList.remove("open");
        return;
    }

    const hasil = Object.keys(movies).filter(function(id){
        return movies[id].judul.toLowerCase().includes(kata);
    });

    if(hasil.length === 0){
        searchResults.innerHTML = `<p class="search-kosong">Film tidak ditemukan</p>`;
    } else {
        searchResults.innerHTML = "";
        hasil.forEach(function(id){
            const movie = movies[id];
            const item = document.createElement("a");
            item.className = "search-item";
            item.href = `detail-film.html?id=${id}`;
            item.innerHTML = `
                <img src="${movie.poster}" alt="${movie.judul}">
                <div>
                    <h4>${movie.judul}</h4>
                    <p>${movie.genre}</p>
                </div>
            `;
            searchResults.appendChild(item);
        });
    }

    searchResults.classList.add("open");
});

// cegah reload halaman kalau Enter ditekan di form
searchForm.addEventListener("submit", function(e){
    e.preventDefault();
});

// tutup dropdown kalau klik di luar area search
document.addEventListener("click", function(e){
    if(!e.target.closest(".search-wrapper")){
        searchResults.classList.remove("open");
    }
});

// ========================================
// PILIH LOKASI (prefill, bukan filter Beranda)
// ========================================
const lokasiBtn = document.getElementById("lokasiBtn");
const lokasiMenu = document.getElementById("lokasiMenu");
const lokasiText = document.getElementById("lokasiText");

const namaLokasiMap = {
    ciledug: "Ciledug",
    jaksel: "Jakarta Selatan"
};

// tampilkan lokasi yang sudah pernah dipilih sebelumnya
const lokasiTersimpan = localStorage.getItem("lokasiDipilih");
if(lokasiTersimpan){
    lokasiText.textContent = namaLokasiMap[lokasiTersimpan];
}

lokasiBtn.addEventListener("click", function(e){
    e.stopPropagation();
    lokasiMenu.classList.toggle("open");
});

document.querySelectorAll(".lokasi-option").forEach(function(opsi){
    opsi.addEventListener("click", function(){
        const value = opsi.dataset.value;

        if(value === ""){
            localStorage.removeItem("lokasiDipilih");
            lokasiText.textContent = "Pilih Lokasi";
        } else {
            localStorage.setItem("lokasiDipilih", value);
            lokasiText.textContent = namaLokasiMap[value];
        }

        lokasiMenu.classList.remove("open");
    });
});

document.addEventListener("click", function(){
    lokasiMenu.classList.remove("open");
});

// ========================================
// POPUP KONFIRMASI LOGOUT
// ========================================
const logoutBtn = document.getElementById("logoutBtn");
const logoutPopup = document.getElementById("logoutPopup");
const batalLogout = document.getElementById("batalLogout");
const konfirmasiLogout = document.getElementById("konfirmasiLogout");

logoutBtn.addEventListener("click", function(){
    logoutPopup.style.display = "flex";
});

batalLogout.addEventListener("click", function(){
    logoutPopup.style.display = "none";
});

konfirmasiLogout.addEventListener("click", function(){
    window.location.href = "index.html";
});