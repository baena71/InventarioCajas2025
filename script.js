// script.js
document.getElementById("loginBtn").addEventListener("click", function() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if(username === "admin" && password === "1234") {
        // Redirige al inventario
        window.location.href = "inventario.html";
    } else {
        errorMsg.textContent = "Usuario o contraseña incorrectos";
    }
});

