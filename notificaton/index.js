import { Server } from "socket.io";

const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

io.listen(3000);
