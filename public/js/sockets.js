const socket = io.connect();

const form = document.getElementById("formulario");
const price = document.getElementById("price");
const title = document.getElementById("title");
const thumbnail = document.getElementById("thumbnail");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Nuevo producto agregado");

  const prod = {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  };

  socket.emit("nuevoProducto", prod);

  // Resetear el formulario:

  form.reset();
}),
  socket.on("productos", (products) => {
    // Llamar a la función (tableRows) que construye las filas de la tabla
    // con la información de cada producto:

    const html = tableRows(products);

    // Insertar la tabla en el DOM:

    document.getElementById("productsTable").innerHTML = html;
  });

// Construir las filas de la tabla con map y un template string para cada fila.
// El .join(' ') al final es para que no le agregue una coma entre cada item del array.

const tableRows = (products) =>
  products
    .map(
      (product) =>
        `
      <tr>
          <td>${product.title}</td>
          <td>$${product.price}</td>
          <td><img style="width:6vw;" class="img-thumbnail" src=${product.thumbnail}></td>
      </tr>
  `
    )
    .join(" ");
// MENSAJES:

// Leer los valores del formulario por su id en el DOM:

const user = document.getElementById("user");
const message = document.getElementById("msg");
const send = document.getElementById("send");
const messageForm = document.getElementById("messageForm");

// Recibir los mensajes desde el servidor con websockets:

socket.on("mensajes", (msg) => {
  // Llamar a la función (listaMensajes) que construye las filas con la data de cada mensaje:

  const html = listaMensajes(msg);

  // Insertar la lista de mensajes en el DOM:

  document.getElementById("mensajes").innerHTML = html;
});

// Construir las filas de mensajes con map y un template string con la data de cada mensaje:

const listaMensajes = (mensajes) =>
  mensajes
    .map(
      (msg) =>
        `
    <div>
      <b style="color:blue;">${msg.author}</b>
      [<span style="color:brown;">${msg.fyh}</span>] :
      <i style="color:green;">${msg.text}</i>
    </div>
  `
    )
    .join(" ");

// Crear event listener para el botón de enviar:

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Construir un objeto para el mensaje:

  const msg = {
    author: user.value,
    text: message.value,
  };

  // Emitir el mensaje desde el cliente al servidor con websockets:

  socket.emit("nuevoMensaje", msg);
  // Resetear el formulario:

  messageForm.reset();

  message.focus();
});
