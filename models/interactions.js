import mongoose from "mongoose";
const InteractionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    type: {
      type: String,
      enum: ["view", "order", "explicit_rating", "favorite"],
      required: true
    },
    value: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 5.0
    },
    context: {
      sessionId: String,
      deviceType: String,
      location: String
    },
    timestamp: { type: Date, default: Date.now }
  });
  
InteractionSchema.index({ user: 1, item: 1 });
InteractionSchema.index({ timestamp: -1 });
  
const Interaction = mongoose.model("Interaction", InteractionSchema);
  
export default Interaction;