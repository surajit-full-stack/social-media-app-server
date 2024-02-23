import { Server as socketIo } from "socket.io";
import { db } from "./db.js";
var io;
const users = new Map();
const pushUser = (socketId, userId) => {
  !users.has(userId) && users.set(userId, socketId);
};

const removeUser = (socketId) => {
  for (let [key, value] of users) {
    if (value === socketId) {
      users.delete(key);
      break;
    }
  }
};
export const initateSocket = (server) => {
  io = new socketIo(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("login", (userId) => {
      pushUser(socket.id, userId);
      console.log("users", users);
      //   sendPostNotification(315, "liam", 9);
    });

    socket.emit("message", "Hello, client!");

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("A client disconnected");
      console.log("users", users);
      // Additional cleanup or logic can be placed here
    });
  });
};

export const sendPostNotification = (senderId, senderName, postId, type) => {
  db.query(
    "SELECT author_id,post_caption as caption from Posts WHERE post_id=?",
    [postId],
    (err, result) => {
      if (err) return console.log("err", err);

      const [{ author_id, caption }] = result;
      console.log('author_id', author_id)
      const socketId = users.get(author_id);
      if (socketId) {
        io.to(socketId).emit("post-reaction", {
          senderId,
          senderName,
          postId,
          msg: `${senderName} reacted ${type} "${caption.slice(0, 15)}..."  `,
        });
      } else {
        console.log(`Socket ID not found for user ID: ${author_id}`);
      }
    }
  );
};
