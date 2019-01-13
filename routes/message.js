const express = require("express");
const router = express.Router();
const controller = require("../controllers/message");

router.get("/", controller.getAll);
router.get("/countsPerDay", controller.getCountsPerDay);
router.get("/countsPerDay/:clientId", controller.getCountsPerDayByClientId);
router.get("/:clientId", controller.getByclientId);
router.get("/create/:count/:startId/:endId", controller.createMany);

module.exports = router;
