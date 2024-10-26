const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide task title name"],
      trim: true,
    },
    priority: {
      type: String,
      required: true,
    },
    tasks: [
      {
        content: {
          type: String,
          required: [true, "Please provide task content details"],
        },
        isDone: {
          type: Boolean,
          default: false,
        },
      },
    ],
    dueDate: {
      type: String,
    },
    status: {
      type: String,
    },
    refUserId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide task owner"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    minimize: true,
  }
);

const taskModel = mongoose.model("taskModel", taskSchema);
module.exports = taskModel;
