import { body } from 'express-validator';

export const validateSendOTP = [
  body('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Must be 10 digits')
    .isNumeric().withMessage('Must contain only numbers'),
  
  body('countryCode')
    .notEmpty().withMessage('Country code is required')
];

export const validateVerifyOTP = [
  body('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Must be 10 digits'),
    
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('Must be 6 digits')
];

export const validateRegister = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Must be at least 3 characters'),
    
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
    
  body('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Must be 10 digits')
];

export const validateSocialLogin = [
  body('provider')
    .notEmpty().withMessage('Provider is required')
    .isIn(['google', 'facebook']).withMessage('Invalid provider'),
    
  body('accessToken')
    .notEmpty().withMessage('Access token is required')
];