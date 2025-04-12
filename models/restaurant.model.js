import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  cuisineType: [String],
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  estimatedDeliveryTime: {
    type: Number, // in minutes
    default: 30
  },
  image: String,
  menu: [{
    category: String,
    items: [{
      name: String,
      description: String,
      price: Number,
      image: String,
      isVegetarian: Boolean,
      isVegan: Boolean,
      isGlutenFree: Boolean
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model('Restaurant', restaurantSchema);