import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["cashier", "cook","waiter","delivery","receptionist", "manager"], required: true },
});

const Staff = mongoose.model("Staff", StaffSchema);

export default Staff;