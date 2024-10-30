const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./db/Database");
const cors = require("cors");
const apiRoutes = require("./routes");

const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const createHttpError = require("http-errors");

const app = express();
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.use(
//   cors({
//     origin: origin,
//     credentials: true,
//     optionSuccessStatus: 200,
//     methods: "*",
//     preflightContinue: true,
//   })
// );

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

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
app.listen(port, (err) => {
  if (err) {
    console.log("Error has been occurred:" + err);
  }
  console.log(`Server has started successfully in ${process.env.PORT} port`);
});
