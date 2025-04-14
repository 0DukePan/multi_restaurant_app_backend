import express from "express"
import { createOrder, getUserOrders, getOrderDetails, cancelOrder } from "../controllers/order.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Protected routes
router.use(protect)

router.post("/", createOrder)
router.get("/my-orders", getUserOrders)
router.get("/:id", getOrderDetails)
router.put("/:id/cancel", cancelOrder)

export default router
