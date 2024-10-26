const Joi = require("@hapi/joi");

const cardValidation = Joi.object({
  title: Joi.string().required(),
  priority: Joi.string().valid("high", "moderate", "low").required(),
  tasks: Joi.array().items(
    Joi.object({
      content: Joi.string().required(),
      isDone: Joi.boolean().default(false),
    })
  ),
  dueDate: Joi.allow(null),
  status: Joi.string()
    .valid("backlog", "todo", "progress", "done")
    .default("todo"),
});

module.exports = cardValidation;
