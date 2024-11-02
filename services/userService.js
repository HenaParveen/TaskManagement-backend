const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { AUTH } = require("../utils/common");
const { checkEmail } = require("../utils/helpers/helper");

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
        "Please provide at least 6 character password",
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
        "User Registration is failed , Please try again",
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
        "Please provide at least 6 character password",
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
    if (!name && !email && !newPassword) {
      throw new AppError(
        "Please provide at least one field to update",
        StatusCodes.BAD_REQUEST
      );
    }

    const fieldsToUpdate = [name, email, newPassword].filter(Boolean).length;

    if (fieldsToUpdate > 1) {
      throw new AppError(
        "Please update only one field at a time",
        StatusCodes.BAD_REQUEST
      );
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new AppError(
          "Please provide current password to update your password",
          StatusCodes.BAD_REQUEST
        );
      }
      if (newPassword.length < 6) {
        throw new AppError(
          "Password must be at least 6 characters long",
          StatusCodes.BAD_REQUEST
        );
      }
    }
    if (email && !checkEmail(email)) {
      throw new AppError(
        "Please provide a valid email address",
        StatusCodes.BAD_REQUEST
      );
    }

    const userFound = await User.findById(userId);
    if (!userFound) throw new AppError("User not found", StatusCodes.NOT_FOUND);

    if (newPassword && currentPassword) {
      const passMatched = AUTH.checkPassword(
        currentPassword,
        userFound.password
      );
      if (!passMatched) {
        throw new AppError(
          "Current password is incorrect",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    if (name) userFound.name = name;
    if (email) userFound.email = email;
    if (newPassword) userFound.password = newPassword;

    return await userFound.save();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Update User:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllEmail(email) {
  try {
    const cursor = await User.find({});
    const emails = [];
    await cursor.forEach(
      (user) => user.email !== email && emails.push(user.email)
    );
    return emails;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Retrieve all the emails:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  register,
  signIn,
  update,
  getAllEmail,
};
