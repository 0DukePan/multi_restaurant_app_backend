import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  addToFavorites,
  removeFromFavorites,
  getRestaurantReviews // 👈 added
} from '../controllers/restaurant.controller.js';

import { protect } from '../middleware/protect.js';

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);
router.get('/:id/reviews', getRestaurantReviews); // 👈 added route for fetching reviews

// Protected routes (require authentication)
router.use(protect);

router.post('/:id/favorite', addToFavorites);
router.delete('/:id/favorite', removeFromFavorites);

export default router;
