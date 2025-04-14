import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true,
    },
    orderType: {
      type: String,
      enum: ["DELIVERY", "TAKEAWAY"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    deliveryAddress: {
      address: String,
      latitude: Number,
      longitude: Number,
      addressType: String,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

const Order = mongoose.model("Order", orderSchema)
export default Order
