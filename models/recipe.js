import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true },
      unit: { type: String, required: true },
    },
  ],
  instructions: [{ type: String, required: true }],
  image: { type: String },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
