const { body } = require("express-validator")

exports.addproductValidator = [
  body('name')
    .exists().withMessage("Product Name is required")
    .notEmpty().withMessage("Product name cannot be empty"),

  body('categoryId')
    .exists().withMessage("Category is required")
    .notEmpty().withMessage("Category cannot be empty"),
  
  body('price')
    .exists().withMessage("Price is required! We cant sell it for free")
    .notEmpty().withMessage("Price cannot be empty"),
]

exports.editproductValidator = [
  body('name')
    .notEmpty().withMessage("Product name cannot be empty"),

  body('categoryId')
    .notEmpty().withMessage("Category cannot be empty"),
  
  body('price')
    .notEmpty().withMessage("Price cannot be empty"),
]