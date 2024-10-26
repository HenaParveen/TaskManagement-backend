const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* 1st create a schema which define how the collection inside database will look, and also represent the data visualization */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email add"],
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email Address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: [6, "Password should be at-least 6 character"],
    },
  },
  {
    timestamps: true,
    minimize: true,
  }
);

//This is a kind middleware which convert the string password to hashed password with help of bcrypt library
userSchema.pre("save", function (next) {
  /* This peace of code check if password is not modified then it should return from here no need to hash again, a 
  it is already hashed during registration it seems we are doing some other curd operation on existing schema/model */
  if (!this.isModified("password")) return next();

  //Hash the Password
  const encryptPassword = bcrypt.hashSync(
    this.password,
    +process.env.SALT_ROUNDS
  );
  this.password = encryptPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
