const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const Store = require("./_store");

const app = express();

Store.initialize({ startCleaner: true, persistenceTimePeriod: 1 });

app.use(cors());
app.use(express.json());
app.use("/api/v1/", routes);

module.exports = app;
