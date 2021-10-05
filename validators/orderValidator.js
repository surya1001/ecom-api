const {body} = require("express-validator")

exports.placeOrderValidator = [
  body("productId")
    .exists().withMessage("Product Id is required")
    .notEmpty().withMessage("Product Id cannot be empty"),

  body("shippingAddress")
    .exists().withMessage("Shipping address is required")
    .notEmpty().withMessage("Shipping address cannnot be emoty"),

  body("pincode")
    .exists().withMessage("Pincode is required")
    .notEmpty().withMessage("Pin code cannot be emoty")
    .isLength({min: 6, max: 6}).withMessage("Pincode should be 6 characters long")
]

exports.updatestatusValidator = [
  body("status")
  .isIn(['dispatched', 'delivered']).withMessage("Status can only dispatched or delivered")
]