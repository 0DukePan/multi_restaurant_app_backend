import mongoose from "mongoose";
import Counter from "./counter";
//import Recipe from "./recipe";
const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ["appetizer", "main", "dessert", "beverage", "side"]
    },
    price: { type: Number, required: true },
    dietaryInfo: {
      vegetarian: Boolean,
      vegan: Boolean,
      glutenFree: Boolean,
      lactoseFree: Boolean
    },
    HealthInfo:{
      low_carb: Boolean,
      low_fat: Boolean,
      low_sugar: Boolean,
      low_sodium: Boolean,
    },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    matrixIndex: { type: Number, unique: true, sparse: true },
    cfFeatures: { 
      type: [Number], 
      default: () => Array(10).fill(0).map(() => Math.random())
    },
    ingredients: [String],
    preparationTime: Number,
    imageUrl: String
  });
  
  MenuItemSchema.pre("save", async function() {
    if (!this.matrixIndex) {
      const counter = await Counter.findOneAndUpdate(
        "menu_items",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.matrixIndex= counter.seq;
    }
  });
  
  const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
  export default MenuItem