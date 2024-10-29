const express = require("express");
const { TaskController } = require("../../controllers");

const { AuthMiddleware } = require("../../middlewares");

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
  TaskController.updateCard
);
taskRouter.patch(
  "/update/status/:cardId",
  AuthMiddleware.checkAuthentication,
  TaskController.updateTaskStatus
);

taskRouter.delete(
  "/delete/:cardId",
  AuthMiddleware.checkAuthentication,
  TaskController.deleteCard
);
taskRouter.patch(
  "/assignee/update",
  AuthMiddleware.checkAuthentication,
  TaskController.addAssignee
);

module.exports = taskRouter;
