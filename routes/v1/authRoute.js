const express = require("express");
const { AuthController } = require("../../controllers");

const { AuthMiddleware } = require("../../middlewares");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.signIn);
router.post("/logout", AuthController.signOut);
router.patch(
  "/update",
  AuthMiddleware.checkAuthentication,
  AuthController.update
);
router.get(
  "/userinfo",
  AuthMiddleware.checkAuthentication,
  AuthController.userInfo
);
router.get(
  "/emails",
  AuthMiddleware.checkAuthentication,
  AuthController.getAllEmail
);

module.exports = router;
