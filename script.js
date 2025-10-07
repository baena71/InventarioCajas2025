// ======== USERS ========
if(!localStorage.getItem("users")){
  localStorage.setItem("users", JSON.stringify([{username:"admin", password:"1234", role:"admin"}]));
}

// ======= DETECTAR PAGINA =======
document.addEventListener("DOMContentLoaded", () => {

  const path = window.location.pathname;

  // ===== LOGIN / REGISTRO =====
  if(path.includes("index.html") || path === "/"){
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegisterLink = document.getElementById("showRegisterLink");
    const showLoginLink = document.getElementById("showLoginLink");

    showRegisterLink.addEventListener("click", ()=>{
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", ()=>{
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });

    document.getElementById("btnRegister").addEventListener("click", ()=>{
      const username = document.getElementById("regUser").value.trim();
      const password = document.getElementById("regPass").value.trim();
      if(!username || !password) return alert("Completa todos los campos.");
      let users = JSON.parse(localStorage.getItem("users"));
      if(users.find(u=>u.username===username)) return alert("Usuario ya existe.");
      users.push({username, password, role:"user"});
      localStorage.setItem("users", JSON.stringify(users));
      alert("Usuario registrado correctamente.");
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });

    document.getElementById("btnLogin").addEventListener("click", ()=>{
      const username = document.getElementById("loginUser").value.trim();
      const password = document.getElementById("loginPass").value.trim();
      let users = JSON.parse(localStorage.getItem("users"));
      const user = users.find(u=>u.username===username && u.password===password);
      if(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href="inventario.html";
      } else alert("Usuario o contraseña incorrectos.");
    });
  }

  // ===== INVENTARIO =====
  if(path.includes("inventario.html")){
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user) window.location.href="index.html";

    const adminForm = document.getElementById("adminForm");
    if(user.role !== "admin") adminForm.style.display = "none";

    let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    const tablaBody = document.querySelector("#tablaInventario tbody");

    function mostrarInventario(){
      tablaBody.innerHTML = "";
      inventario.forEach((item,i)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.proveedor}</td>
          <td>${item.producto}</td>
          <td>${item.entrada}</td>
          <td>${item.salida}</td>
          <td>${item.stock}</td>
          <td>${user.role==="admin"?`<button onclick="eliminarFila(${i})">🗑️ Eliminar</button>`:""}</td>
        `;
        tablaBody.appendChild(tr);
      });
    }

    window.eliminarFila = function(i){
      if(!confirm("Eliminar este registro?")) return;
      inventario.splice(i,1);
      localStorage.setItem("inventario", JSON.stringify(inventario));
      mostrarInventario();
    }

    document.getElementById("btnAgregar").addEventListener("click", ()=>{
      const proveedor = document.getElementById("proveedor").value.trim();
      const producto = document.getElementById("producto").value.trim();
      const entrada = parseInt(document.getElementById("entrada").value) || 0;
      const salida = parseInt(document.getElementById("salida").value) || 0;

      if(!proveedor || !producto) return alert("Completa proveedor y producto.");

      let item = inventario.find(p=>p.proveedor===proveedor && p.producto===producto);
      if(item){
        item.entrada += entrada;
        item.salida += salida;
        item.stock = item.entrada - item.salida;
      } else {
        inventario.push({proveedor, producto, entrada, salida, stock:entrada-salida});
      }

      localStorage.setItem("inventario", JSON.stringify(inventario));
      document.getElementById("proveedor").value="";
      document.getElementById("producto").value="";
      document.getElementById("entrada").value="";
      document.getElementById("salida").value="";
      mostrarInventario();
    });

    mostrarInventario();
  }

});
