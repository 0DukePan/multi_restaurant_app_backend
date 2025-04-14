import express from "express"
import {
  getProfile,
  updateProfile,
  toggleDarkMode,
  addAddress,
  removeAddress,
  addToFavorites,
  removeFromFavorites,
} from "../controllers/user.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

router.use(protect)

router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.put("/theme", toggleDarkMode)
router.post("/address", addAddress)
router.delete("/address/:id", removeAddress)
router.post("/favorites/:restaurantId", addToFavorites)
router.delete("/favorites/:restaurantId", removeFromFavorites)

export default router
