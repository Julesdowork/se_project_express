const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use(requestLogger); // enable the request logger
app.use("/", mainRouter); // my routes
app.use(errorLogger); // enable the error logger
app.use(errors()); // celebrate error handler
app.use(errorHandler); // my centralized error handler

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
