let productos = [];
let carrito = [];

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

const contenedorProductos = document.getElementById("lista-productos");

fetch("data/productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos();
    mostrarCarrito();
  });

function mostrarProductos() {
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <input type="number" id="cantidad-${prod.id}" value="1" min="1">
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function mostrarCarrito() {
  const listaCarrito = document.getElementById("carrito");
  listaCarrito.innerHTML = "";

  let total = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
  });

  document.getElementById("total").textContent = `Total: $${total}`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);

  if (cantidad > 0) {
    const item = carrito.find(p => p.id === id);
    if (item) {
      item.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad: cantidad });
    }
    mostrarCarrito();
    Swal.fire("Producto agregado", `${producto.nombre} x${cantidad}`, "success");
  }
}

document.getElementById("vaciarCarrito").addEventListener("click", () => {
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
  Swal.fire("Carrito vacío", "Se han eliminado todos los productos", "info");
});

document.getElementById("finalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agrega productos antes de comprar", "warning");
    return;
  }
  let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  Swal.fire({
    title: "Compra realizada",
    text: `Gracias por tu compra. Total: $${total}`,
    icon: "success"
  });
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
});