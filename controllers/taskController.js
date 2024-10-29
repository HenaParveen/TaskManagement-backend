const { StatusCodes } = require("http-status-codes");
const { TaskService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function getAllCards(req, res) {
  try {
    const { datePreference, status } = req.params;
    const userId = req.user._id;
    const email = req.user.email;
    const response = await TaskService.getAllCards(
      datePreference,
      status,
      userId,
      email
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Retrieved all the card details";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function getAnalytics(req, res) {
  try {
    let userId = req.user._id;
    const response = await TaskService.getAnalytics(userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Retrieved all the analytics";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function getCard(req, res) {
  try {
    let { cardId } = req.params;
    const response = await TaskService.getCard(cardId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Retrieved card details";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function addCard(req, res) {
  try {
    const cardDetails = req.body;
    const userId = req.user._id;
    const response = await TaskService.addCard(cardDetails, userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Card added successfully";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function updateCard(req, res) {
  try {
    const cardDetails = req.body;
    const { cardId } = req.params;
    const userId = req.user._id;
    const response = await TaskService.updateCard(cardId, cardDetails, userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Card updated successfully";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}
async function addAssignee(req, res) {
  try {
    const { email } = req.body;
    const userId = req.user._id;
    const response = await TaskService.addAssignee(email, userId);

    SuccessResponse.data = response;
    SuccessResponse.message = `${email} added to the board`;

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function updateTaskStatus(req, res) {
  try {
    const { tasks, status } = req.body;
    const { cardId } = req.params;
    const userId = req.user._id;
    const response = await TaskService.updateTaskStatus(
      cardId,
      tasks,
      status,
      userId
    );

    SuccessResponse.data = response;
    SuccessResponse.message = "Task status updated successfully";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const response = await TaskService.deleteCard(cardId, userId);

    SuccessResponse.data = response;
    SuccessResponse.message = "Card deleted successfully";
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
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
  getAllCards,
  getAnalytics,
  getCard,
  addCard,
  updateCard,
  updateTaskStatus,
  deleteCard,
  addAssignee,
};
