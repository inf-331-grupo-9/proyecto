//require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const raceRoutes = require("./routes/raceRoutes");
const userRoutes = require("./routes/userRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/races", raceRoutes);
app.use("/users", userRoutes);
app.use("/ratings", ratingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/applications", applicationRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:"runtrack"
});

module.exports = app;
