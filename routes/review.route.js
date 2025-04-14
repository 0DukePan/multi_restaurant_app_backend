import express from "express"
import { createReview, getReviewById, updateReview, deleteReview } from "../controllers/review.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Protected routes
router.use(protect)

router.post("/", createReview)
router.get("/:id", getReviewById)
router.put("/:id", updateReview)
router.delete("/:id", deleteReview)

export default router
