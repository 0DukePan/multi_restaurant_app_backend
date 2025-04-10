import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderType: {
      type: String,
      enum: ["Take Away", "Delivery", "Dine-in"],
      required: true,
    },
    TableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    deleveryAddress: { type: Object },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        specialInstructions: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
