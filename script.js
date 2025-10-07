// ======= LOGIN & REGISTRO =======

// Inicializar usuarios en localStorage
if(!localStorage.getItem("users")){
    const admin = {username:"admin", password:"1234", role:"admin"};
    localStorage.setItem("users", JSON.stringify([admin]));
}

// Login
document.getElementById("loginBtn")?.addEventListener("click", ()=>{
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const users = JSON.parse(localStorage.getItem("users"));
    const user = users.find(u => u.username === username && u.password === password);
    if(user){
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "inventario.html";
    } else {
        document.getElementById("errorMsg").textContent = "Usuario o contraseña incorrectos";
    }
});

// Registro
document.getElementById("registerBtn")?.addEventListener("click", ()=>{
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    let users = JSON.parse(localStorage.getItem("users"));
    if(username && password && !users.find(u=>u.username===username)){
        users.push({username, password, role:"user"});
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("regMsg").textContent = "Usuario registrado con éxito";
        document.getElementById("regUsername").value="";
        document.getElementById("regPassword").value="";
    } else {
        document.getElementById("regMsg").textContent = "Usuario ya existe o datos incorrectos";
    }
});

// ======= INVENTARIO =======

let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
let productos = JSON.parse(localStorage.getItem("productos")) || [];

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(currentUser){
    document.getElementById("userRole").textContent = `Usuario: ${currentUser.username} - Rol: ${currentUser.role}`;
}

// Mostrar/ocultar secciones según rol
if(currentUser && currentUser.role !== "admin"){
    document.getElementById("proveedorSection").style.display="none";
    document.getElementById("productoSection").style.display="none";
}

// PROVEEDORES
const addProveedorBtn = document.getElementById("addProveedorBtn");
if(addProveedorBtn){
    addProveedorBtn.addEventListener("click", ()=>{
        const nombre = document.getElementById("newProveedor").value.trim();
        if(nombre){
            proveedores.push(nombre);
            localStorage.setItem("proveedores", JSON.stringify(proveedores));
            document.getElementById("newProveedor").value="";
            renderProveedores();
        }
    });
}

function renderProveedores(){
    const ul = document.getElementById("proveedoresList");
    ul.innerHTML="";
    proveedores.forEach((prov,index)=>{
        const li = document.createElement("li");
        li.textContent = prov + " ";
        if(currentUser.role==="admin"){
            const delBtn = document.createElement("button");
            delBtn.textContent="Eliminar";
            delBtn.addEventListener("click", ()=>{
                proveedores.splice(index,1);
                localStorage.setItem("proveedores", JSON.stringify(proveedores));
                renderProveedores();
            });
            li.appendChild(delBtn);
        }
        ul.appendChild(li);
    });
}
renderProveedores();

// PRODUCTOS
const addProductoBtn = document.getElementById("addProductoBtn");
if(addProductoBtn){
    addProductoBtn.addEventListener("click", ()=>{
        const name = document.getElementById("productoName").value.trim();
        const cant = parseInt(document.getElementById("productoCantidad").value);
        if(name && !isNaN(cant)){
            productos.push({nombre:name, stock:cant, entradas:cant, salidas:0});
            localStorage.setItem("productos", JSON.stringify(productos));
            document.getElementById("productoName").value="";
            document.getElementById("productoCantidad").value="";
            renderProductos();
        }
    });
}

function renderProductos(){
    const tbody = document.querySelector("#productosTable tbody");
    tbody.innerHTML="";
    productos.forEach((prod,index)=>{
        const tr = document.createElement("tr");
        tr.innerHTML=`
        <td>${prod.nombre}</td>
        <td>${prod.stock}</td>
        <td>${prod.entradas}</td>
        <td>${prod.salidas}</td>
        <td></td>
        `;
        if(currentUser.role==="admin"){
            const td = tr.querySelector("td:last-child");
            const entradaBtn = document.createElement("button");
            entradaBtn.textContent="+Entrada";
            entradaBtn.addEventListener("click", ()=>{
                prod.entradas++;
                prod.stock++;
                localStorage.setItem("productos", JSON.stringify(productos));
                renderProductos();
            });
            const salidaBtn = document.createElement("button");
            salidaBtn.textContent="-Salida";
            salidaBtn.addEventListener("click", ()=>{
                if(prod.stock>0){
                    prod.salidas++;
                    prod.stock--;
                    localStorage.setItem("productos", JSON.stringify(productos));
                    renderProductos();
                }
            });
            td.appendChild(entradaBtn);
            td.appendChild(salidaBtn);
        }
        tbody.appendChild(tr);
    });
}
renderProductos();


