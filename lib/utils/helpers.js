/**
 * Generate a random OTP of specified length
 * @param {number} length - Length of OTP
 * @returns {string} - Generated OTP
 */
export const generateOTP = (length = 6) => {
  const digits = "0123456789"
  let OTP = ""

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }

  return OTP
}

/**
 * Generate a reference ID with prefix
 * @param {string} prefix - Prefix for the reference ID
 * @returns {string} - Generated reference ID
 */
export const generateReferenceId = (prefix = "REF") => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}${timestamp}${random}`
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency amount
 */
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}
