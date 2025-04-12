import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import VerificationToken from '../models/VerificationToken.model.js';
import { sendOTP as sendSMSOTP } from '../services/smsService.js';
import { generateOTP} from '../lib/utils/helpers.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Social login config
const SOCIAL_CONFIG = {
  google: {
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    requiredFields: ['sub', 'email', 'name']
  },
  facebook: {
    userInfoUrl: 'https://graph.facebook.com/v12.0/me',
    fields: 'id,name,email',
    requiredFields: ['id', 'name']
  }
};

// ================== MOBILE OTP FLOW ================== //
export const sendOTP = async (req, res, next) => {
  try {
    const { mobileNumber, countryCode } = req.body;
    
    const otp = generateOTP(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOneAndUpdate(
      { mobileNumber },
      { 
        countryCode, 
        isVerified: false,
        $setOnInsert: { 
          createdAt: new Date(),
          walletBalance: 0,
          favoriteRestaurants: [],
          savedAddresses: []
        }
      },
      { upsert: true, new: true }
    );

    await VerificationToken.findOneAndUpdate(
      { userId: user._id },
      { token: otp, expiresAt: otpExpiry },
      { upsert: true }
    );

    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${mobileNumber}: ${otp}`);
      return res.json({ 
        success: true,
        message: 'OTP logged to console',
        otp 
      });
    }

    await sendSMSOTP(mobileNumber, countryCode, otp);

    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { mobileNumber, otp } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const verification = await VerificationToken.findOne({
      userId: user._id,
      token: otp,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ error: 'Invalid/expired OTP' });
    }

    user.isVerified = true;
    await user.save();
    await VerificationToken.deleteOne({ _id: verification._id });

    const token = jwt.sign(
      { userId: user._id },               
      process.env.ACCESS_TOKEN_SECRET,   
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' } 
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        mobileNumber: user.mobileNumber,
        isVerified: true,
        profileComplete: !!user.fullName,
        fullName: user.fullName,
        email: user.email,
        walletBalance: user.walletBalance,
        favoriteRestaurants: user.favoriteRestaurants,
        savedAddresses: user.savedAddresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================== SOCIAL LOGIN FLOW ================== //
export const socialLogin = async (req, res, next) => {
  try {
    const { provider, accessToken, mobileNumber } = req.body;
    
    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const userInfo = await fetchSocialUserInfo(provider, accessToken);
    if (!validateSocialUserInfo(provider, userInfo)) {
      return res.status(400).json({ error: 'Invalid provider data' });
    }

    const providerId = userInfo.sub || userInfo.id;
    const email = userInfo.email?.toLowerCase();
    const name = userInfo.name || 'User';

    const user = await User.findOneAndUpdate(
      { 
        $or: [
          { email },
          { [`social.${provider}.id`]: providerId },
          ...(mobileNumber ? [{ mobileNumber }] : [])
        ]
      },
      {
        $set: {
          email,
          fullName: name,
          isVerified: true,
          [`social.${provider}`]: {
            id: providerId,
            email,
            name
          },
          ...(mobileNumber && { 
            mobileNumber,
            isMobileVerified: true 
          })
        },
        $setOnInsert: {
          createdAt: new Date(),
          walletBalance: 0,
          favoriteRestaurants: [],
          savedAddresses: []
        }
      },
      { upsert: true, new: true }
    );

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET, // <- THIS
      { expiresIn: '30d' }
    );
    

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        isVerified: true,
        profileComplete: true,
        walletBalance: user.walletBalance,
        favoriteRestaurants: user.favoriteRestaurants,
        savedAddresses: user.savedAddresses
      }
    });

  } catch (error) {
    next(error);
  }
};

// ================== REGISTRATION FLOW ================== //
export const register = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobileNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email 
          ? 'Email already in use' 
          : 'Mobile number already in use'
      });
    }

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      isVerified: false,
      walletBalance: 0,
      favoriteRestaurants: [],
      savedAddresses: []
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET, // <- THIS
      { expiresIn: '30d' }
    );
    

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        isVerified: false,
        profileComplete: false,
        walletBalance: user.walletBalance,
        favoriteRestaurants: user.favoriteRestaurants,
        savedAddresses: user.savedAddresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================== HELPER FUNCTIONS ================== //
const fetchSocialUserInfo = async (provider, accessToken) => {
  const config = SOCIAL_CONFIG[provider];
  let url = config.userInfoUrl;
  
  if (provider === 'facebook') {
    url += `?fields=${config.fields}&access_token=${accessToken}`;
  }

  const response = await axios.get(url, {
    headers: provider === 'google' 
      ? { Authorization: `Bearer ${accessToken}` } 
      : {},
    timeout: 5000
  });

  return response.data;
};

const validateSocialUserInfo = (provider, userInfo) => {
  const requiredFields = SOCIAL_CONFIG[provider].requiredFields;
  return requiredFields.every(field => userInfo[field]);
};