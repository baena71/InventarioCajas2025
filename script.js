// LOGIN
document.getElementById("loginBtn")?.addEventListener("click", function() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    if(username === "admin" && password === "1234") {
        window.location.href = "inventario.html";
    } else {
        errorMsg.textContent = "Usuario o contraseña incorrectos";
    }
});

// INVENTARIO
let proveedores = [];
let productos = [];

// Funciones Proveedores
const addProveedorBtn = document.getElementById("addProveedorBtn");
if(addProveedorBtn){
    addProveedorBtn.addEventListener("click", () => {
        const nombre = document.getElementById("newProveedor").value.trim();
        if(nombre){
            proveedores.push(nombre);
            document.getElementById("newProveedor").value = "";
            renderProveedores();
        }
    });
}

function renderProveedores(){
    const ul = document.getElementById("proveedoresList");
    ul.innerHTML = "";
    proveedores.forEach((prov, index)=>{
        const li = document.createElement("li");
        li.textContent = prov + " ";
        const delBtn = document.createElement("button");
        delBtn.textContent = "Eliminar";
        delBtn.addEventListener("click", ()=> {
            proveedores.splice(index,1);
            renderProveedores();
        });
        li.appendChild(delBtn);
        ul.appendChild(li);
    });
}

// Funciones Productos
const addProductoBtn = document.getElementById("addProductoBtn");
if(addProductoBtn){
    addProductoBtn.addEventListener("click", ()=>{
        const name = document.getElementById("productoName").value.trim();
        const cant = parseInt(document.getElementById("productoCantidad").value);
        if(name && !isNaN(cant)){
            productos.push({nombre:name, stock:cant, entradas:cant, salidas:0});
            document.getElementById("productoName").value="";
            document.getElementById("productoCantidad").value="";
            renderProductos();
        }
    });
}

function renderProductos(){
    const tbody = document.querySelector("#productosTable tbody");
    tbody.innerHTML = "";
    productos.forEach((prod,index)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${prod.nombre}</td>
        <td>${prod.stock}</td>
        <td>${prod.entradas}</td>
        <td>${prod.salidas}</td>
        <td>
            <button class="entradaBtn">+Entrada</button>
            <button class="salidaBtn">-Salida</button>
        </td>`;
        // Eventos botones
        tr.querySelector(".entradaBtn").addEventListener("click", ()=>{
            prod.entradas++;
            prod.stock++;
            renderProductos();
        });
        tr.querySelector(".salidaBtn").addEventListener("click", ()=>{
            if(prod.stock>0){
                prod.salidas++;
                prod.stock--;
                renderProductos();
            }
        });
        tbody.appendChild(tr);
    });
}

