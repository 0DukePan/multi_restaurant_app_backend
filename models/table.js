import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
    qrCode: { type: String, required: true, unique: true },
    tableNumber: { type: Number, required: true },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved", "cleaning"],
        default: "available",
    },
    currentSession: { type: mongoose.Schema.Types.ObjectId, ref: "TableSession" },
    isActive: { type: Boolean, default: false },
});

const Table = mongoose.model("Table", TableSchema);

export default Table;