import express from "express"
import { getMenuItemById } from "../controllers/menu.controller.js"

const router = express.Router()

router.get("/:id", getMenuItemById)

export default router
