
document.addEventListener("DOMContentLoaded", function () {
    // =========================
    // ELEMEN HALAMAN
    // =========================
    const tabButtons = document.querySelectorAll(".filter-btn");
    const tabBantuan = document.getElementById("tab-bantuan");
    const tabTentang = document.getElementById("tab-tentang");
    const backBtn = document.getElementById("backBtn");

    // =========================
    // PERGANTIAN TAB
    // =========================
    function tampilkanTab(nama) {
    const infoTitle = document.getElementById("infoTitle");

        tabBantuan.hidden = nama !== "bantuan";
        tabTentang.hidden = nama !== "tentang";

    infoTitle.textContent =
        nama === "bantuan"
            ? "Pusat Bantuan"
            : "Tentang Aplikasi";
    }

    // =========================
    // KLIK TOMBOL TAB
    // =========================
    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            tampilkanTab(button.dataset.tab);
        });
    });

    // =========================
    // FAQ BUKA / TUTUP
    // =========================
    document.querySelectorAll(".faq-pertanyaan").forEach(function (button) {
        button.addEventListener("click", function () {
            const faqItem = button.closest(".faq-item");
            const sedangTerbuka = faqItem.classList.toggle("open");

            button.setAttribute("aria-expanded", sedangTerbuka);
        });
    });

    // =========================
    // TOMBOL KEMBALI
    // =========================
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "beranda.html";
        });
    }

    // =========================
    // TAB AWAL DARI URL
    // =========================
    const params = new URLSearchParams(window.location.search);
    const tabAwal = params.get("tab") || "bantuan";

    tampilkanTab(tabAwal);
});
