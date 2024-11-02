const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const { AUTH } = require("../utils/common");
const User = require("../models/userModel");
const { ErrorResponse } = require("../utils/common");

async function checkAuthentication(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError(
        "Please provide access Token or login first",
        StatusCodes.BAD_REQUEST
      );
    }

    const isCorrectToken = AUTH.verifyToken(token);

    if (!isCorrectToken)
      throw new AppError(
        "Unable to authenticate to the server, please try again or token is invalid",
        StatusCodes.BAD_REQUEST
      );

    let user;
    if (isCorrectToken)
      user = await User.findById(isCorrectToken._id).select("-password");

    if (!user)
      throw new AppError(
        "User Doesn't found in Database",
        StatusCodes.NOT_FOUND
      );

    if (token && isCorrectToken && user) {
      req.user = user;
      next();
    }
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.error = error;
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : "";

    if (error.name === "JsonWebTokenError") {
      ErrorResponse.message = "Invalid JWT Token";
      statusCode = StatusCodes.UNAUTHORIZED;
    }
    if (error.name === "TokenExpiredError") {
      ErrorResponse.message = "JWT Token has been expired";
      statusCode = StatusCodes.UNAUTHORIZED;
    }
    return res.status(statusCode).json(ErrorResponse);
  }
}

module.exports = {
  checkAuthentication,
};
