import express from "express"
import {
  createTableBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
} from "../controllers/booking.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Protected routes
router.use(protect)

router.post("/", createTableBooking)
router.get("/my-bookings", getUserBookings)
router.get("/:id", getBookingDetails)
router.delete("/:id", cancelBooking)

export default router
