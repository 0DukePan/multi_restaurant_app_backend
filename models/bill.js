import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
    tableSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TableSession",
        required: true,
    },
    total: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "partially_paid", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "credit_card", "debit_card", "mobile_payment", "online"],
    },
    paymentTime: { type: Date },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // cashier ID
});

const Bill = mongoose.model("Bill", BillSchema);    

export default Bill;