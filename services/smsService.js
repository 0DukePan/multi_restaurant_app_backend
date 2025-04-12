import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
// Initialize Twilio client once (not inside the function)
const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured in environment variables');
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const client = getTwilioClient();

export const sendOTP = async (mobileNumber, countryCode, otp) => {
  // Validate input parameters
  if (!mobileNumber || !countryCode || !otp) {
    throw new Error('Missing required parameters');
  }

  // Clean and format number
  const cleanNumber = `${countryCode}${mobileNumber}`.replace(/[^\d+]/g, '');
  
  console.log(`[SMS Service] Attempting to send OTP to: ${cleanNumber}`);

  try {
    const message = await client.messages.create({
      body: `Your verification code: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: cleanNumber
    });

    console.log(`[SMS Service] Message sent successfully. SID: ${message.sid}`);
    return { 
      success: true,
      messageSid: message.sid,
      to: cleanNumber
    };
  } catch (error) {
    console.error('[SMS Service] Failed to send message:', {
      errorCode: error.code,
      errorMessage: error.message,
      moreInfo: error.moreInfo || 'No additional info',
      attemptedNumber: cleanNumber,
      twilioNumber: process.env.TWILIO_PHONE_NUMBER
    });

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        moreInfo: error.moreInfo
      },
      isRecoverable: isRecoverableError(error.code)
    };
  }
};

// Helper function to determine if error is recoverable
function isRecoverableError(errorCode) {
  const recoverableCodes = [
    20404, // Message not found
    21211, // Invalid 'To' phone number
    21606, // Message blocked
    21610, // 'From' phone number not verified
  ];
  return !recoverableCodes.includes(errorCode);
}