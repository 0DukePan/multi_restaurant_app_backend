import mongoose from "mongoose";

const KitchenOrderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending","preparing", "ready"],
        default: "pending",
    },
});

const KitchenOrder = mongoose.model("KitchenOrder", KitchenOrderSchema);

export default KitchenOrder;