import mongoose from "mongoose";


const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'vegetables', 'meat', 'dairy'
  unit: { type: String, required: true }, // e.g., 'kg', 'liter', 'piece'
  currentStock: { type: Number, required: true },
  supplier: { type: String },
  lastRestocked: { type: Date },
  costPerUnit: { type: Number },
  usedInMenuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
  shelfLife: { type: Number }, 
}, { timestamps: true });

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);

export default InventoryItem;