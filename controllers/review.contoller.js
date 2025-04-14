import Review from "../models/Review.js"
import Restaurant from "../models/Restaurant.js"
import { getRatingStats } from "./restaurant.controller.js"

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const restaurant = req.params.restaurantId
    const user = req.user.id

    // Check if restaurant exists
    const restaurantExists = await Restaurant.findById(restaurant)
    if (!restaurantExists) {
      return res.status(404).json({ success: false, message: "Restaurant not found" })
    }

    const review = new Review({
      rating,
      comment,
      restaurant,
      user,
    })

    await review.save()

    // Update restaurant rating stats
    const { avgRating, totalReviews } = await getRatingStats(restaurant)
    restaurantExists.rating = avgRating
    restaurantExists.numReviews = totalReviews
    await restaurantExists.save()

    res.status(201).json({ success: true, data: review })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Get a review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" })
    }
    res.json({ success: true, data: review })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update a review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" })
    }
    res.json({ success: true, data: review })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" })
    }
    res.json({ success: true, message: "Review deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
