// Inicializar Socket.io
// Para esto usé el código que figura en la documentación oficial de Socket.io
// que es más claro y conciso que el que figura en los slides del curso:
const emoji = require("node-emoji");
const express = require("express");
const app = express();
const PORT = 8080;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

httpServer.listen(PORT, () => {
  console.log("servidor http://localhost:8080/");
});

// Middlewares:

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Clase Contenedor (una instancia para productos y otra para mensajes):

const Contenedor = require("./contenedor");
const contenedorProductos = new Contenedor("./src/data/productos.json");
const contenedorMensajes = new Contenedor("./src/data/mensajes.json");

// SOCKET.IO

// No olvidar incluir "async" para poder usar los métodos asincrónicos de la clase Contenedor:

io.on("connection", async (socket) => {
  // PRODUCTOS

  // Emitir al cliente la lista de productos:
  console.log(emoji.get("pizza"), "Usuario conectado");

  let products = await contenedorProductos.getAll();

  socket.emit("productos", products);

  // Leer desde el cliente la carga de un nuevo producto:

  socket.on("nuevoProducto", async (producto) => {
    await contenedorProductos.saveProduct(producto);
    products = await contenedorProductos.getAll();
    io.emit("productos", products);
  });

  // MENSAJES

  // Emitir la lista de mensajes guardados al cliente:

  let messages = await contenedorMensajes.getAll();

  socket.emit("mensajes", messages);

  // Leer los nuevos mensajes provenientes del cliente:

  socket.on("nuevoMensaje", async (msg) => {
    // Incluir la fecha y hora en el objeto msg:

    msg.fyh = new Date().toLocaleString();

    // Reutilizar el método saveProduct de la clase Contenedor
    // para guardar los mensajes:

    await contenedorMensajes.saveProduct(msg);
    messages = await contenedorMensajes.getAll();
    // Re-emitir mensajes al cliente:

    io.emit("mensajes", messages);
  });

  socket.on("disconnect", () => {
    console.log(emoji.get("fire"), "Usuario desconectado");
  });
});
