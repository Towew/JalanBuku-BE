require("dotenv").config();
const express = require("express");
const router = require("./src/routes");
const bp = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // define client origin if both client and server have different origin
  },
});

require("./src/socket")(io);

app.use(express.json());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use("/api/v1/", router);

server.listen(port, () => console.log(`Listening on port ${port}!`));
