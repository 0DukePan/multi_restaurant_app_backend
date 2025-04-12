import { body, validationResult } from 'express-validator';

export const validateSendOTP = [
  body('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits')
    .isNumeric().withMessage('Mobile number must contain only numbers'),
  
  body('countryCode')
    .notEmpty().withMessage('Country code is required')
];

export const validateRegister = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  body('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits')
];