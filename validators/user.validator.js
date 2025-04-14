import { body, param } from "express-validator"

export const updateProfileValidator = [
  body("fullName").optional().isLength({ min: 3 }).withMessage("Full name must be at least 3 characters"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("darkMode").optional().isBoolean().withMessage("Dark mode must be a boolean value"),
]

export const addAddressValidator = [
  body("address").notEmpty().withMessage("Address is required"),

  body("latitude").notEmpty().withMessage("Latitude is required").isFloat().withMessage("Latitude must be a number"),

  body("longitude").notEmpty().withMessage("Longitude is required").isFloat().withMessage("Longitude must be a number"),

  body("addressType")
    .notEmpty()
    .withMessage("Address type is required")
    .isIn(["home", "work", "other"])
    .withMessage("Invalid address type"),
]

export const removeAddressValidator = [
  param("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid address ID format"),
]
