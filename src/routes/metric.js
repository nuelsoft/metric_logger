const express = require("express");
const router = express.Router();
const { metricController } = require("../controllers");

router.get("/:key/sum", metricController.getSum);
router.post("/:key", metricController.logData);

module.exports = router;
