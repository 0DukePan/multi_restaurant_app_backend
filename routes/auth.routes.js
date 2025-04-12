import express from 'express';
import { 
  sendOTP, 
  verifyOTP, 
  register,
  socialLogin as handleSocialLogin
} from '../controllers/auth.controller.js';
import {
  validateSendOTP,
  validateVerifyOTP,
  validateRegister,
  validateSocialLogin
} from '../validators/auth.validator.js';
import { otpRateLimiter, apiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/send-otp', otpRateLimiter, validateSendOTP, sendOTP);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/register', apiRateLimiter, validateRegister, register);
router.post('/social-login', apiRateLimiter, validateSocialLogin, handleSocialLogin);

export default router;