const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function createToken(input) {
  try {
    const token = jwt.sign(input, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
  } catch (error) {
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
}

function checkPassword(plainPassword, encryptedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createToken,
  verifyToken,
  checkPassword,
};
