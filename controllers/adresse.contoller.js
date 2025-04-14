import User from "../models/user.model.js"

// Add address
export const addAddress = async (req, res) => {
  try {
    const { address, latitude, longitude, addressType } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { savedAddresses: { address, latitude, longitude, addressType } } },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.status(201).json({ success: true, data: user.savedAddresses })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Remove address
export const removeAddress = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedAddresses: { _id: id } } },
      { new: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({ success: true, data: user.savedAddresses })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("savedAddresses")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, data: user.savedAddresses })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params
    const { address, latitude, longitude, addressType } = req.body

    const user = await User.findOneAndUpdate(
      { _id: req.user.id, "savedAddresses._id": id },
      {
        $set: {
          "savedAddresses.$.address": address,
          "savedAddresses.$.latitude": latitude,
          "savedAddresses.$.longitude": longitude,
          "savedAddresses.$.addressType": addressType,
        },
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User or address not found" })
    }

    res.json({ success: true, data: user.savedAddresses })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
