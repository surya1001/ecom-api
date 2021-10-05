const {body} = require("express-validator")

exports.signupValidator = [
  body('name')
    .exists().withMessage('User name is required')
    .notEmpty().withMessage('User name cannot be empty'),

  body('email')
    .exists().withMessage('Email address is required')
    .notEmpty().withMessage('Email address cannot be empty')
    .isLength({ max: 100 }).withMessage("SIP termination reason must be less than 100 characters")
    .normalizeEmail().isEmail().withMessage('Enter vaild email address'),

  body('phone')
    .exists().withMessage('Mobile number is required')
    .notEmpty().withMessage('Mobile number cannot be empty')
    .isLength({min: 10, max: 10}).withMessage('Enter 10 digit valid mobile number'),

  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
]

exports.signinValidator = [
  body('email')
    .exists().withMessage('Email address is required')
    .notEmpty().withMessage('Email address cannot be empty')
    .isLength({ max: 100 }).withMessage("SIP termination reason must be less than 100 characters")
    .normalizeEmail().isEmail().withMessage('Enter vaild email address'),

  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
]