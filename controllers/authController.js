const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const User = require("../models/userModel");

async function register(req, res) {
  try {
    const { user, JWT_Token } = await UserService.register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const { _id, name, email } = user;
    SuccessResponse.data = {
      _id,
      name,
      email,
      JWT_Token,
    };
    SuccessResponse.message = "User Registration Successful";

    res.status(StatusCodes.OK);
    res.cookie("token", JWT_Token, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      expiresIn: process.env.JWT_EXPIRY,
    });
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function signIn(req, res) {
  try {
    const { user, JWT_Token } = await UserService.signIn({
      email: req.body.email,
      password: req.body.password,
    });

    const { _id, name, email } = user;
    SuccessResponse.data = {
      _id,
      name,
      email,
      JWT_Token,
    };
    SuccessResponse.message = "User Login Successful";

    res
      .status(StatusCodes.OK)
      .cookie("token", JWT_Token, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        expiresIn: process.env.JWT_EXPIRY,
      })
      .json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function signOut(req, res) {
  try {
    SuccessResponse.data = {
      JWT_Token: "",
    };
    SuccessResponse.message = "User Logout Successful";

    res.status(StatusCodes.OK);
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      expiresIn: 0,
    });
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function update(req, res) {
  try {
    const user = await UserService.update({
      name: req.body.name,
      email: req.body.email,
      newPassword: req.body.newPassword,
      currentPassword: req.body.currentPassword,
      userId: req.user._id,
    });

    const { _id, name, email } = user;
    SuccessResponse.data = {
      _id,
      name,
      email,
    };
    SuccessResponse.message = "User updated Successfully";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function userInfo(req, res) {
  try {
    const { _id, name, email } = req.user;
    SuccessResponse.data = {
      _id,
      name,
      email,
    };
    SuccessResponse.message = "User info retrieved";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function getAllEmail(req, res) {
  try {
    const email = req.user.email;
    const response = await UserService.getAllEmail(email);
    SuccessResponse.data = response;
    SuccessResponse.message = "All Email retrieved";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

module.exports = {
  register,
  signIn,
  signOut,
  update,
  userInfo,
  getAllEmail,
};
