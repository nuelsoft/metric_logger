const express = require("express");
const router = express.Router();

router.use("/metric", require("./metric"));

module.exports = router;
