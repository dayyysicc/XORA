const namaLengkap = document.getElementById("namaLengkap");
const username = document.getElementById("username");
const tanggalLahir = document.getElementById("tanggalLahir");
const email = document.getElementById("email");
const noHp = document.getElementById("noHp");

const semuaField = [namaLengkap, username, tanggalLahir, email, noHp];

const btnEdit = document.getElementById("btnEdit");
const btnSimpan = document.getElementById("btnSimpan");

// ========================================
// MUAT DATA PROFIL DARI LOCALSTORAGE
// ========================================
function muatProfil(){
    const profil = JSON.parse(localStorage.getItem("profilUser")) || {};

    namaLengkap.value = profil.namaLengkap || "";
    username.value = profil.username || "";
    tanggalLahir.value = profil.tanggalLahir || "";
    email.value = profil.email || "";
    noHp.value = profil.noHp || "";
}

muatProfil();

// ========================================
// TOMBOL EDIT / SIMPAN
// ========================================
btnEdit.addEventListener("click", function(){
    semuaField.forEach(function(field){
        field.disabled = false;
    });
    namaLengkap.focus();

    btnEdit.style.display = "none";
    btnSimpan.style.display = "block";
});

const suksesPopup = document.getElementById("suksesPopup");
const tutupSuksesPopup = document.getElementById("tutupSuksesPopup");

btnSimpan.addEventListener("click", function(){
    const profil = {
        namaLengkap: namaLengkap.value.trim(),
        username: username.value.trim(),
        tanggalLahir: tanggalLahir.value,
        email: email.value.trim(),
        noHp: noHp.value.trim()
    };

    localStorage.setItem("profilUser", JSON.stringify(profil));

    semuaField.forEach(function(field){
        field.disabled = true;
    });

    btnSimpan.style.display = "none";
    btnEdit.style.display = "block";

    suksesPopup.style.display = "flex";
});

tutupSuksesPopup.addEventListener("click", function(){
    suksesPopup.style.display = "none";
});

// ========================================
// TOMBOL BACK
// ========================================
document.getElementById("backBtn").addEventListener("click", function(){
    window.location.href = "beranda.html";
});