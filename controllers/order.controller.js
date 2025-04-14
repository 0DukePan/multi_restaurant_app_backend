import Order from "../models/Order.js"
import Restaurant from "../models/Restaurant.js"
import MenuItem from "../models/MenuItem.js"

/**
 * Create new order
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, orderType, paymentMethod, deliveryAddress } = req.body

    // Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" })
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" })
    }

    // Calculate order totals
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId)

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID ${item.menuItemId} not found`,
        })
      }

      const itemTotal = menuItem.price * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      })
    }

    // Apply delivery fee if applicable
    const deliveryFee = orderType === "DELIVERY" ? restaurant.deliveryFee || 0 : 0

    // Calculate tax (10% of total)
    const tax = totalAmount * 0.1

    // Calculate grand total
    const grandTotal = totalAmount + deliveryFee + tax

    // Create order
    const order = new Order({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount,
      deliveryFee,
      tax,
      grandTotal,
      paymentMethod,
      orderType,
      status: "PLACED",
      deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : null,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    })

    await order.save()

    res.status(201).json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

/**
 * Get user orders
 * @route GET /api/orders/my-orders
 * @access Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("restaurant", "name image").sort({ createdAt: -1 })

    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Get order details
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("restaurant", "name address image")

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Cancel order
 * @route PUT /api/orders/:id/cancel
 * @access Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" })
    }

    // Check if order can be cancelled
    if (!["PLACED", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      })
    }

    // Update status
    order.status = "CANCELLED"
    await order.save()

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
