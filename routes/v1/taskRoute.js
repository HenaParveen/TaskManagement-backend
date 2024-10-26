const express = require("express");
const { TaskController } = require("../../controllers");

const { AuthMiddleware } = require("../../middlewares");

/* to send the req to proper controllers */

const taskRouter = express.Router();

taskRouter.get(
  "/all/:datePreference/:status",
  AuthMiddleware.checkAuthentication,
  TaskController.getAllCards
);

taskRouter.get(
  "/analytics",
  AuthMiddleware.checkAuthentication,
  TaskController.getAnalytics
);

taskRouter.get("/:cardId", TaskController.getCard);

taskRouter.post(
  "/add",
  AuthMiddleware.checkAuthentication,
  TaskController.addCard
);
taskRouter.patch(
  "/update/:cardId",
  AuthMiddleware.checkAuthentication,
  TaskController
);
taskRouter.patch(
  "/update/status/:cardId",
  AuthMiddleware.checkAuthentication,
  TaskController
);

taskRouter.delete(
  "/delete/:cardId",
  AuthMiddleware.checkAuthentication,
  TaskController
);

module.exports = taskRouter;

// http://localhost:5173/api/v1/task/all/thismonth/inprogress
// http://localhost:5173/api/v1/task/analytics
// http://localhost:5173/api/v1/task/QWERTYUI!@#$%^&*asdfghjk234567
