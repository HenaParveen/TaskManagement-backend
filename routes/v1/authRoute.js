const express = require("express");
const { AuthController } = require("../../controllers");

const { AuthMiddleware } = require("../../middlewares");

/* to send the req to proper controllers */

const router = express.Router();

/* this is 4the level of routing till user */
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

module.exports = router;
