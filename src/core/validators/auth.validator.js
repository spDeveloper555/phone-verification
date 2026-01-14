const { body } = require('express-validator');

exports.sendOTPValidator = [
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Phone number must be in E.164 format (e.g. +919876543210)')
];

exports.verifyOTPValidator = [
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),

  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must be numeric')
];
