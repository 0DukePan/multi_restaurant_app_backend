import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    images: [String],
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate reviews
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true })

const Review = mongoose.model("Review", reviewSchema)
export default Review
