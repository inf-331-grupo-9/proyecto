require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const raceRoutes = require("./routes/raceRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/races", raceRoutes);
app.use("/users", userRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:"runtrack"
});

module.exports = app;
