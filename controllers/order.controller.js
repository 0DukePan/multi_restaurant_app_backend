// import Order from '../models/Order.js';

// // Create new order
// export const createOrder = async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get user orders
// export const getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate('restaurant', 'name image')
//       .sort({ createdAt: -1 });
    
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get order details
// export const getOrderDetails = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('user', 'name email')
//       .populate('restaurant', 'name address');
    
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
    
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update order status
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
    
//     res.json(order);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Rate order
// export const rateOrder = async (req, res) => {
//   try {
//     const { rating, review } = req.body;
    
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { rating, review },
//       { new: true }
//     );
    
//     res.json(order);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };