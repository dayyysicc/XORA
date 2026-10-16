const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validasi input kosong
    if(username === "" || password === ""){
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Lengkapi username dan password!"
        });

        return;
    }

    // Login berhasil
    Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang di XORA.",
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        window.location.href = "beranda.html";
    });

});