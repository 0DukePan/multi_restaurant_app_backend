import TableBooking from "../models/TableBooking.js"

// Create a new table booking
export const createTableBooking = async (req, res) => {
  try {
    const booking = new TableBooking(req.body)
    await booking.save()
    res.status(201).json({ success: true, data: booking })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await TableBooking.find({ user: req.user.id })
      .populate("restaurant", "name image")
      .sort({ bookingDate: -1 })

    res.json({ success: true, data: bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get booking details
export const getBookingDetails = async (req, res) => {
  try {
    const booking = await TableBooking.findById(req.params.id)
      .populate("user", "name email")
      .populate("restaurant", "name address")

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    res.json({ success: true, data: booking })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await TableBooking.findByIdAndDelete(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }
    res.json({ success: true, message: "Booking cancelled" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
