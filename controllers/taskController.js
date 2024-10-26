const { StatusCodes } = require("http-status-codes");
const { TaskService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function getAllCards(req, res) {
  try {
    //Code Logic

    /* Call the Service for User Registration */
    let { datePreference, status } = req.params;
    let userId = req.user._id;
    console.log("-----------------", datePreference, status, userId);
    const response = await TaskService.getAllCards(
      datePreference,
      status,
      userId
    );

    /*  Once the call is successfull like User Registration has completed customise the user data and 
    send back to client via res object and also set the JWT Token inside res cookie */
    SuccessResponse.data = response;
    SuccessResponse.message = "Retrieved all the card details";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("EUnable to fetch all the card details:", error);
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
    //Code Logic
    let userId = req.user._id;
    const response = await TaskService.getAnalytics(userId);

    /*  Once the call is successfull like User Registration has completed customise the user data and 
      send back to client via res object and also set the JWT Token inside res cookie */
    SuccessResponse.data = response;
    SuccessResponse.message = "Retrieved all the analytics";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to fetch the analytics:", error);
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
    //Code Logic
    let { cardId } = req.params;
    const response = await TaskService.getCard(cardId);

    /*  Once the call is successfull like User Registration has completed customise the user data and 
    send back to client via res object and also set the JWT Token inside res cookie */
    SuccessResponse.data = response;
    SuccessResponse.message = "Retrieved card details";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to card details:", error);
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

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to Add card", error);
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
    const response = await TaskService.updateCard(cardId, cardDetails);

    SuccessResponse.data = response;
    SuccessResponse.message = "Card updated successfully";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to update card", error);
    ErrorResponse.message = error.explanation;
    ErrorResponse.data = error;
    ErrorResponse.stack =
      process.env.NODE_ENV === "development" ? error.stack : null;

    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function updateCardStatus(req, res) {
  try {
    const { task, status } = req.body;
    const { cardId } = req.params;
    const response = await TaskService.updateCardStatus(cardId, task, status);

    SuccessResponse.data = response;
    SuccessResponse.message = "Card status updated successfully";

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to update status of card", error);
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

    /* Remember the sequence */
    res.status(StatusCodes.OK);
    res.json(SuccessResponse);
    return res;
  } catch (error) {
    console.log("Unable to delete the card", error);
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
  updateCardStatus,
  deleteCard,
};
