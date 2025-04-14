import User from "../models/user.model.js"

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Return user data in the format expected by the Flutter app
    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        countryCode: user.countryCode,
        isVerified: user.isVerified,
        walletBalance: user.walletBalance,
        favoriteRestaurants: user.favoriteRestaurants,
        savedAddresses: user.savedAddresses,
        profileImage: user.profileImage,
        language: user.language,
        darkMode: user.darkMode,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Return updated user data in the format expected by the Flutter app
    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        countryCode: user.countryCode,
        isVerified: user.isVerified,
        walletBalance: user.walletBalance,
        favoriteRestaurants: user.favoriteRestaurants,
        savedAddresses: user.savedAddresses,
        profileImage: user.profileImage,
        language: user.language,
        darkMode: user.darkMode,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Toggle dark mode
 * @route PUT /api/users/theme
 * @access Private
 */
export const toggleDarkMode = async (req, res) => {
  try {
    const { darkMode } = req.body

    if (darkMode === undefined) {
      return res.status(400).json({ success: false, message: "Dark mode preference is required" })
    }

    const user = await User.findByIdAndUpdate(req.user._id, { darkMode }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Return updated user data in the format expected by the Flutter app
    res.json({
      success: true,
      message: "Theme updated successfully",
      data: { darkMode: user.darkMode },
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Add address
 * @route POST /api/users/address
 * @access Private
 */
export const addAddress = async (req, res) => {
  try {
    const { address, latitude, longitude, addressType } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { savedAddresses: { address, latitude, longitude, addressType } } },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Return updated user data in the format expected by the Flutter app
    res.status(201).json({
      success: true,
      data: user.savedAddresses,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Remove address
 * @route DELETE /api/users/address/:id
 * @access Private
 */
export const removeAddress = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedAddresses: { _id: id } } },
      { new: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Return updated user data in the format expected by the Flutter app
    res.json({
      success: true,
      data: user.savedAddresses,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Add restaurant to favorites
 * @route POST /api/users/favorites/:restaurantId
 * @access Private
 */
export const addToFavorites = async (req, res) => {
  try {
    const { restaurantId } = req.params

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favoriteRestaurants: restaurantId } },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({
      success: true,
      message: "Added to favorites",
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Remove restaurant from favorites
 * @route DELETE /api/users/favorites/:restaurantId
 * @access Private
 */
export const removeFromFavorites = async (req, res) => {
  try {
    const { restaurantId } = req.params

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favoriteRestaurants: restaurantId } },
      { new: true },
    )

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({
      success: true,
      message: "Removed from favorites",
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
