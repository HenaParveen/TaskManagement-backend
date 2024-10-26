const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const User = require("../models/userModel");

async function register(req, res) {
  try {
    //Code Logic

    /* Call the Service for User Registration */
    const { user, JWT_Token } = await UserService.register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    /*  Once the call is successfull like User Registration has completed customise the user data and 
    send back to client via res object and also set the JWT Token inside res cookie */
    const { _id, name, email } = user;
    SuccessResponse.data = {
      _id,
      name,
      email,
      JWT_Token,
    };
    SuccessResponse.message = "User registration Successful";

    /* Remember the sequence */
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
    console.log("Error Occurred during User Registration:", error);
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
    //Code Logic

    /* Call the Service for User Registration */
    const { user, JWT_Token } = await UserService.signIn({
      email: req.body.email,
      password: req.body.password,
    });

    /*  Once the call is successfull like User Registration has completed customise the user data and 
    send back to client via res object and also set the JWT Token inside res cookie */
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
    console.log("Error Occurred during User Login:", error);
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
    //Code Logic

    /*  Once the call is successfull like User Registration has completed customise the user data and 
    send back to client via res object and also set the JWT Token inside res cookie */

    SuccessResponse.data = {
      JWT_Token: "",
    };
    SuccessResponse.message = "User Logout Successful";

    res.status(StatusCodes.OK);
    res.cookie("token", "", {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "none",
      expiresIn: process.env.JWT_EXPIRY,
    });
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Error Occurred during User Logout:", error);
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
    //Code Logic

    /* Call the Service for User Registration */
    const user = await UserService.update({
      name: req.body.name,
      email: req.body.email,
      newPassword: req.body.newPassword,
      currentPassword: req.body.currentPassword,
      userId: req.user._id,
    });

    /*  Once the call is successfull like User Registration has completed customise the user data and 
    send back to client via res object and also set the JWT Token inside res cookie */
    const { _id, name, email } = user;
    SuccessResponse.data = {
      _id,
      name,
      email,
    };
    SuccessResponse.message = "User updated Successful";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to update user due to:", error);
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
    //Code Logic
    const { _id, name, email } = req.user;
    SuccessResponse.data = {
      _id,
      name,
      email,
    };
    SuccessResponse.message = "User info retrieved";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to retrieve user due to:", error);
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
};
