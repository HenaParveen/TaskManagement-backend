const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function createToken(input) {
  try {
    const token = jwt.sign(input, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
  } catch (error) {
    console.log("Error has been occurred while creating token:", error);
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); //This will return boolean value either true or false
  } catch (error) {
    console.log("Unable top verify user:", error);
    throw error;
  }
}

function checkPassword(plainPassword, encryptedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    console.log("Error has been occurred while comparing password:", error);
    throw error;
  }
}

module.exports = {
  createToken,
  verifyToken,
  checkPassword,
};
