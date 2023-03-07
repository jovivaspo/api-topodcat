const app = require("./app");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const server = http.createServer(app);
const config = require("./config");

const User = require("./models/User");
const getAudio = require("./services/getAudio");

//CREATE SOCKETS///
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No hay token en la petición"));
  }
  try {
    const { uid, name } = jwt.verify(token, config.KEY_SECRET);
    if (!uid || !name) {
      next(new Error("Token inválido"));
    }
    socket.uid = uid;
    socket.name = name;
    next();
  } catch (error) {
    console.log(error);
    next(new Error("Token inválido"));
  }
});

io.use(async (socket, next) => {
  const duration = socket.handshake.query.duration;
  const { uid } = socket;
  const user = await User.findById(uid).populate("podcastsList");
  if (!user) {
    next(new Error("Error al buscar el usuario"));
  }
  const list = user.podcastsList;
  let totalTime = parseInt(duration);
  list.forEach((el) => {
    totalTime += parseInt(el.duration);
  });
  console.log(totalTime);
  if (totalTime > process.env.LIMIT_TIME) {
    return next(new Error("Espacio insuficiente, borre algún podcast"));
  }
  next();
}).on("connection", (socket) => {
  console.log("Usuario conectado: ", socket.name);

  socket.emit("message_converting", "Convirtiendo video...");

  socket.on("sending_infovideo", (video) => {
    getAudio(video, socket);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
