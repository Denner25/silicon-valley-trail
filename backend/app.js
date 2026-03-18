// backend/app.js
const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/game", gameRoutes);

module.exports = app;
