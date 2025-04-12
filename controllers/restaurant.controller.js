import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

export const getAllRestaurants = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000, type, search } = req.query;

    let query = {};

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // Search by name if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Geo query if coordinates provided
    let geoQuery = {};
    if (latitude && longitude) {
      geoQuery = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: parseInt(maxDistance),
          },
        },
      };
    }

    const restaurants = await Restaurant.find({ ...query, ...geoQuery }).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: error.message,
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant',
      error: error.message,
    });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const menuItems = await MenuItem.find({ restaurant: req.params.id });

    // Group by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        menu: menuByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant menu',
      error: error.message,
    });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const restaurantId = req.params.id;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Add to favorites if not already
    await User.findByIdAndUpdate(userId, {
      $addToSet: { favorites: restaurantId },
    });

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites',
      error: error.message,
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const restaurantId = req.params.id;

    // Remove from favorites
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: restaurantId },
    });

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites',
      error: error.message,
    });
  }
};
export const getRestaurantReviews = async (req, res) => {
    try {
      const restaurantId = req.params.id;
  
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found',
        });
      }
  
      const reviews = await Review.find({ restaurant: restaurantId })
        .populate('user', 'name avatar') // include user's name/avatar if available
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
        error: error.message,
      });
    }
  };
  export const getRatingStats = async (restaurantId) => {
    const stats = await Review.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: '$restaurant',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
  
    return stats[0] || { avgRating: 0, totalReviews: 0 };
  };