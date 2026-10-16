const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e){

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const tanggalLahir = document.getElementById("tanggalLahir").value;
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if(
        username === "" ||
        email === "" ||
        tanggalLahir === "" ||
        password === "" ||
        confirmPassword === ""
    ){
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Lengkapi semua data!"
        });
        return;
    }

    if(password !== confirmPassword){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Konfirmasi password tidak sama!"
        });
        return;
    }

    Swal.fire({
    icon: "success",
    title: "Registrasi Berhasil!",
    text: "Anda telah berhasil mendaftar.",
    showConfirmButton: false,
    timer: 1500
    }).then(() => {
        window.location.href = "login.html";
    });

});