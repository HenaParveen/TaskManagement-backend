const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { AUTH } = require("../utils/common");
const { checkEmail } = require("../utils/helpers/helper");
const bcrypt = require("bcrypt");

async function register({ name, email, password }) {
  try {
    if (!name || !email || !password) {
      throw new AppError(
        "One of the field is missing, Please check",
        StatusCodes.BAD_REQUEST
      );
    }

    if (password.length < 6) {
      throw new AppError(
        "Please provide atleast 6 character password",
        StatusCodes.BAD_REQUEST
      );
    }
    if (!checkEmail(email)) {
      throw new AppError(
        "Please provide correct email address",
        StatusCodes.BAD_REQUEST
      );
    }

    const userFound = await User.findOne({ email });
    if (userFound)
      throw new AppError(
        "User Already exists, Please login",
        StatusCodes.BAD_REQUEST
      );

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user)
      throw new AppError(
        "User registration is failed , Please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    const JWT_Token = AUTH.createToken({ _id: user._id.toString() });
    if (!JWT_Token)
      throw new AppError(
        "Unable to create JWT Token",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    return { user, JWT_Token };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Process User Registration:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signIn({ email, password }) {
  try {
    if (!email || !password) {
      throw new AppError(
        "One of the field is missing, Please check",
        StatusCodes.BAD_REQUEST
      );
    }

    if (password.length < 6) {
      throw new AppError(
        "Please provide atleast 6 character password",
        StatusCodes.BAD_REQUEST
      );
    }
    if (!checkEmail(email)) {
      throw new AppError(
        "Please provide correct email address",
        StatusCodes.BAD_REQUEST
      );
    }

    const userFound = await User.findOne({ email });
    if (!userFound)
      throw new AppError(
        "User not found, Please register first",
        StatusCodes.BAD_REQUEST
      );

    const isValidPassword = AUTH.checkPassword(password, userFound.password);
    if (!isValidPassword)
      throw new AppError(
        "Incorrect Password, Please try again with correct password",
        StatusCodes.BAD_REQUEST
      );

    const JWT_Token = AUTH.createToken({ _id: userFound._id.toString() });
    if (!JWT_Token)
      throw new AppError(
        "Unable to create JWT Token",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    return { user: userFound, JWT_Token };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Process User Login:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function update({ name, email, newPassword, currentPassword, userId }) {
  try {
    if (!currentPassword) {
      throw new AppError(
        "Please provide current password first",
        StatusCodes.BAD_REQUEST
      );
    }

    if (!name && !email && !newPassword) {
      throw new AppError(
        "Please provide at-least one field to update",
        StatusCodes.BAD_REQUEST
      );
    }

    if (newPassword && newPassword.length < 6) {
      throw new AppError(
        "Please provide at-least 6 character password",
        StatusCodes.BAD_REQUEST
      );
    }
    if (email && !checkEmail(email)) {
      throw new AppError(
        "Please provide correct email address",
        StatusCodes.BAD_REQUEST
      );
    }

    const userFound = await User.findById(userId);
    if (!userFound)
      throw new AppError("User not found in database", StatusCodes.BAD_REQUEST);

    const passMatched = AUTH.checkPassword(currentPassword, userFound.password);

    if (!passMatched) {
      throw new AppError(
        "Please provide correct current password to update the record",
        StatusCodes.BAD_REQUEST
      );
    }

    userFound.name = name || userFound.name;
    userFound.email = email || userFound.email;
    userFound.password = newPassword || userFound.password;
    return await userFound.save();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Update User:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  register,
  signIn,
  update,
};
