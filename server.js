const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config(); //const envInstance=require("dotenv"); envInstance.config()
const db = require("./db/Database");
const cors = require("cors");
const apiRoutes = require("./routes");

/* Important Import for Security Enhancement */
// import morgan from "morgan";
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const createHttpError = require("http-errors");

const app = express();
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

/* Read the Req input*/

app.use(express.json()); //text manual to read How the machine works?
app.use(express.urlencoded({ extended: true })); //Image Manual

//Morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Helmet
app.use(helmet());

//Sanitize Mongo DB
app.use(mongoSanitize());

//Cookie Parser
app.use(cookieParser());

//Zip
app.use(compression());

//Cors
app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST,PATCH,DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

/* Add More Middleware to Protect the server and data */

//req=Request{Server takes input from this object}, res=Response{server send any input/result from this object}

/* 1st level of routing till api keyword */
app.use("/api", apiRoutes);

//Route Doesn't found
app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This Route doesn't found"));
});

//Handle HTTP Errors
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  if (err) {
    console.log("Error has been occurred:");
  }
  console.log(`Server has started successfully in ${ServerConfig.PORT} port`);
});
