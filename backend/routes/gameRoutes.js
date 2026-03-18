// backend/routes/gameRoutes.js

const express = require("express");
const { startGame, takeTurn } = require("../controllers/gameController");

const router = express.Router();

router.post("/start", startGame);
router.post("/turn", takeTurn);

module.exports = router;
