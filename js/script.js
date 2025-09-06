const productos = [
  { id: 1, nombre: "Espresso", precio: 500 },
  { id: 2, nombre: "Capuccino", precio: 700 },
  { id: 3, nombre: "Latte", precio: 800 }
];

let carrito = [];

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

const contenedorProductos = document.getElementById("productos");
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
  }
}

document.getElementById("vaciarCarrito").addEventListener("click", () => {
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
});

mostrarCarrito();