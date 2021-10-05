const { body } = require("express-validator");

exports.categoryValidator = [
  body("name")
    .exists().withMessage("Category name is required")
    .notEmpty().withMessage("Category name cannot be empty")
]