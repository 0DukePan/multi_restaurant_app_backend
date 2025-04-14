import express from "express"
import { addAddress, removeAddress, getAddresses, updateAddress } from "../controllers/address.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Protected routes
router.use(protect)

router.get("/", getAddresses)
router.post("/", addAddress)
router.put("/:id", updateAddress)
router.delete("/:id", removeAddress)

export default router
