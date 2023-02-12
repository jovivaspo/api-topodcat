const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const convertVideo = require("./services/convertVideo");

const User = require("./models/User");
const verifyToken = require("./services/verifyToken");
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
  if (token) {
    const res = verifyToken(token);
    if (res.error) return next(new Error(res.error));
    socket.decoded = res.decodedToken;
    next();
  } else {
    console.log("No existe token");
    next(new Error("Error de autenticación"));
  }
});

io.use(async (socket, next) => {
  const duration = socket.handshake.query.duration;
  const { id } = socket.decoded;
  const user = await User.findById(id).populate("podcastsList");
  if (!user) {
    next(new Error("Error al buscar el usuario"));
  }
  const list = user.podcastsList;
  let totalTime = parseInt(duration);
  list.forEach((el) => {
    totalTime += parseInt(el.duration);
    console.log(totalTime);
  });
  if (totalTime > process.env.LIMIT_TIME) {
    console.log("Espacio insuficiente", totalTime);
    next(new Error("Espacio insuficiente, borre algún podcast"));
  } else {
    console.log("Espacio ocupado:", totalTime);
    next();
  }
}).on("connection", (socket) => {
  console.log("connected to socket.io user,: ", socket.decoded);

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
