const { StatusCodes } = require("http-status-codes");
const {
  startOfWeek,
  endOfWeek,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
} = require("date-fns");
const TaskModel = require("../models/taskModel");
const AppError = require("../utils/error/app-error");
const cardValidation = require("../utils/helpers/cardValidation");
const { checkEmail } = require("../utils/helpers/helper");

async function getAllCards(datePreference, status, userId, email) {
  try {
    const currentDate = new Date();

    let startDate, endDate;

    if (!datePreference || datePreference.trim() === "") {
      startDate = new Date(0);
      endDate = new Date();
    } else {
      switch (datePreference) {
        case "today":
          startDate = startOfDay(currentDate);
          endDate = endOfDay(currentDate);
          break;
        case "thisweek":
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
          endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
          break;
        case "thismonth":
          startDate = startOfMonth(currentDate);
          endDate = endOfMonth(currentDate);
          break;
        default:
          throw new AppError(
            "Invalid Date, Please provide correct date",
            StatusCodes.BAD_REQUEST
          );
      }
    }
    const query = {
      createdAt: { $gte: startDate, $lt: endDate },
      ...(status && { status: status.toLowerCase() }),
      $or: [{ refUserId: userId }, { assignee: email }],
    };

    const cardsByDateAndStatus = await TaskModel.find(query);
    if (!cardsByDateAndStatus)
      throw new AppError(
        "Unable to fetch the data, please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    return cardsByDateAndStatus;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Fetch card details:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAnalytics(userId) {
  try {
    const getAllCards = await TaskModel.find({
      refUserId: userId,
    });

    const cardsWithDueDate = await TaskModel.countDocuments({
      refUserId: userId,
      dueDate: { $exists: true, $ne: null },
    });
    const statusAnalytics = getAllCards.reduce((result, card) => {
      const status = card.status || "Unknown";
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});
    const completedTasks = getAllCards.reduce((result, card) => {
      const tasks = card.tasks || [];
      const completedTasks = tasks.filter((task) => task.isDone);
      result += completedTasks.length;
      return result;
    }, 0);
    const priorityAnalytics = getAllCards.reduce((result, card) => {
      const priority = card.priority || "Unknown";
      result[priority] = (result[priority] || 0) + 1;
      return result;
    }, {});

    let data = {
      priorityAnalytics,
      cardsWithDueDate,
      statusAnalytics,
      completedTasks,
    };
    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to fetch Analytics:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getCard(cardId) {
  try {
    if (!cardId)
      throw new AppError("Please provider card Id", StatusCodes.BAD_REQUEST);
    const card = await TaskModel.findById(cardId);

    if (!card)
      throw new AppError(
        "Card doesn't found in database",
        StatusCodes.NOT_FOUND
      );

    return card;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to fetch card details:" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function addCard(cardDetails, userId) {
  try {
    const cardData = await cardValidation.validateAsync(cardDetails);
    const newCard = new TaskModel({
      ...cardData,
      assignee: cardData.assignee || "",
      refUserId: userId,
    });
    const data = await newCard.save();
    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to Add card :" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateCard(cardId, cardDetails, userId) {
  try {
    const cardData = await cardValidation.validateAsync(cardDetails);
    if (!cardId) {
      throw new AppError(
        "Please provide cardId to update it",
        StatusCodes.BAD_REQUEST
      );
    }
    const existingCard = await TaskModel.findById(cardId);
    if (!existingCard) {
      throw new AppError(
        "Can not found in database, please provide valid card Id",
        StatusCodes.BAD_REQUEST
      );
    }

    if (existingCard.refUserId.toString() !== userId.toString())
      throw new AppError(
        "Unauthorized to Update the card",
        StatusCodes.UNAUTHORIZED
      );
    existingCard.title = cardData.title || existingCard.title;
    existingCard.priority = cardData.priority || existingCard.priority;
    existingCard.tasks = cardData.tasks || existingCard.tasks;
    existingCard.dueDate = cardData.dueDate || existingCard.dueDate;
    existingCard.status = cardData.status || existingCard.status;
    existingCard.assignee = cardData.assignee
      ? cardData.assignee
      : existingCard.assignee;
    const updatedCard = await existingCard.save();
    return updatedCard;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to update card :" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function addAssignee(email, userId) {
  try {
    if (!checkEmail(email)) {
      throw new AppError(
        "Please provide Correct Email Id",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await TaskModel.updateMany(
      { refUserId: userId, assignee: { $ne: email } },
      { assignee: email }
    );
    return response;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to update assignee to current user's all card :" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function updateTaskStatus(cardId, tasks, status, userId) {
  try {
    if (!cardId) {
      throw new AppError(
        "Please provide cardId to update it",
        StatusCodes.BAD_REQUEST
      );
    }
    const existingCard = await TaskModel.findById(cardId);
    if (!existingCard) {
      throw new AppError(
        "Can not found in database, please provide valid card Id",
        StatusCodes.BAD_REQUEST
      );
    }
    if (existingCard.refUserId.toString() !== userId.toString())
      if (existingCard.assignee.toString() !== userId.toString()) {
        throw new AppError(
          "Unauthorized to delete the card",
          StatusCodes.UNAUTHORIZED
        );
      }

    existingCard.tasks = tasks || existingCard.tasks;
    existingCard.status = status || existingCard.status;
    const updatedCard = await existingCard.save();
    return updatedCard;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to update status of Task :" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function deleteCard(cardId, userId) {
  try {
    if (!cardId) {
      throw new AppError(
        "Please provide cardId to update it",
        StatusCodes.BAD_REQUEST
      );
    }
    const existingCard = await TaskModel.findById(cardId);
    if (!existingCard) {
      throw new AppError(
        "Can not found in database, please provide valid card Id",
        StatusCodes.BAD_REQUEST
      );
    }
    if (existingCard.refUserId.toString() !== userId.toString())
      if (existingCard.assignee.toString() !== userId.toString()) {
        throw new AppError(
          "Unauthorized to delete the card",
          StatusCodes.UNAUTHORIZED
        );
      }

    const deletedCard = await existingCard.deleteOne();
    return deleteCard;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to delete card :" + error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
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
