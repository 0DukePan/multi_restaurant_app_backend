import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
    },
    pickupTime: { type: Date },
    deliveryTime: { type: Date },
    status: {
        type: String,
        enum: ["assigned", "in_transit", "delivred"],
        default: "active",
    },
},{ timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;