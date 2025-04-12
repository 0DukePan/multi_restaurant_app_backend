// import User from '../models/User.js';
// import VerificationToken from '../models/VerificationToken.js';
// import jwt from 'jsonwebtoken';
// import config from '../config/config.js';
// import twilio from 'twilio';
// const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
// import { generateOTP } from '../utils/helpers.js';
// import { validationResult } from 'express-validator';

// // Authentication Controllers

// /**
//  * @desc    Send OTP to mobile number
//  * @route   POST /api/auth/send-otp
//  * @access  Public
//  */
// export const sendOTP = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { mobileNumber, countryCode } = req.body;
    
//     if (!/^\d{10}$/.test(mobileNumber)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid mobile number format'
//       });
//     }

//     const existingUser = await User.findOne({ mobileNumber });
//     const otp = generateOTP();
    
//     if (existingUser) {
//       await VerificationToken.findOneAndUpdate(
//         { userId: existingUser._id },
//         { token: otp },
//         { upsert: true, new: true }
//       );
//     } else {
//       const newUser = new User({ mobileNumber, countryCode });
//       await newUser.save();
      
//       await new VerificationToken({
//         userId: newUser._id,
//         token: otp
//       }).save();
//     }
    
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`OTP for ${mobileNumber}: ${otp}`);
//       return res.status(200).json({ 
//         success: true,
//         message: 'OTP logged in console (development mode)',
//         otp
//       });
//     }
    
//     await client.messages.create({
//       body: `Your Hungerz verification code is: ${otp}`,
//       from: config.TWILIO_PHONE_NUMBER,
//       to: `${countryCode}${mobileNumber}`
//     });
    
//     res.status(200).json({ 
//       success: true,
//       message: 'OTP sent successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // User Profile Controllers

// /**
//  * @desc    Get user profile
//  * @route   GET /api/users/profile
//  * @access  Private
//  */
// export const getProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId)
//       .select('-password -__v -createdAt -updatedAt')
//       .lean();

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * @desc    Update user profile
//  * @route   PUT /api/users/profile
//  * @access  Private
//  */
// export const updateProfile = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         success: false,
//         errors: errors.array() 
//       });
//     }

//     const { fullName, email } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { 
//         fullName: fullName?.trim(),
//         email: email?.toLowerCase().trim() 
//       },
//       { 
//         new: true,
//         runValidators: true,
//         select: '-password -__v -createdAt -updatedAt'
//       }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * @desc    Add address to user profile
//  * @route   POST /api/users/address
//  * @access  Private
//  */
// export const addAddress = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         success: false,
//         errors: errors.array() 
//       });
//     }

//     const { addressType, address, latitude, longitude } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { 
//         $push: { 
//           savedAddresses: { 
//             addressType,
//             address: address.trim(),
//             latitude,
//             longitude
//           } 
//         } 
//       },
//       { 
//         new: true,
//         select: 'savedAddresses'
//       }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Address added successfully',
//       data: user.savedAddresses
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * @desc    Remove address from user profile
//  * @route   DELETE /api/users/address/:addressId
//  * @access  Private
//  */
// export const removeAddress = async (req, res, next) => {
//   try {
//     const { addressId } = req.params;
    
//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { 
//         $pull: { 
//           savedAddresses: { _id: addressId } 
//         } 
//       },
//       { 
//         new: true,
//         select: 'savedAddresses'
//       }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Address removed successfully',
//       data: user.savedAddresses
//     });
//   } catch (error) {
//     next(error);
//   }
// };