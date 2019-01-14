const express = require("express");
const router = express.Router();
const controller = require("../controllers/message");

router.get("/", controller.getAll);
router.get("/dropAll", controller.dropAll);
router.get("/countsPerDay", controller.getCountsPerDay);
router.get("/countsPerDay/:clientId/:startDate/:endDate", controller.getCountsPerDayBetweenDatesByClientId);
router.get("/CountsPerDayByClientId/:clientId", controller.getCountsPerDayByClientId);
router.get("/:clientId", controller.getByclientId);
router.get("/create/:count/:startId/:endId/:daysBack", controller.createMany);

module.exports = router;
