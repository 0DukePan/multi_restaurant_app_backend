import express from "express"
import { getWalletBalance, addFunds, transferFunds, getTransactions } from "../controllers/wallet.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Protected routes
router.use(protect)

router.get("/", getWalletBalance)
router.post("/add-funds", addFunds)
router.post("/transfer", transferFunds)
router.get("/transactions", getTransactions)

export default router
