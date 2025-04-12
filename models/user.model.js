import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Invalid email format'
    }
  },
  mobileNumber: { 
    type: String, 
    required: [true, 'Mobile number is required'],
    unique: true,
    validate: {
      validator: (num) => /^\d{10}$/.test(num),
      message: 'Mobile number must be 10 digits'
    }
  },
  countryCode: { 
    type: String, 
    default: '+213' 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  walletBalance: { 
    type: Number, 
    default: 0,
    min: [0, 'Wallet balance cannot be negative']
  },
  favoriteRestaurants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant' 
  }],
  savedAddresses: [{
    addressType: {
      type: String,
      enum: ['home', 'work', 'other'],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  }],
  social: {
    google: {
      id: String,
      email: String,
      name: String
    },
    facebook: {
      id: String,
      email: String,
      name: String
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});



const User = mongoose.model('User', userSchema);
export default User;