// import Category from "../models/category.model.js";
// import { validationResult } from "express-validator";

// // Helper function for error responses
// const errorResponse = (res, statusCode, message) => {
//   return res.status(statusCode).json({
//     success: false,
//     error: message
//   });
// };

// export const createCategory = async (req, res) => {
  
//   const { name, image, banner } = req.body;

//   try {
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       return errorResponse(res, 409, "Category already exists");
//     }

    
//     const category = new Category({
//       name,
//       image,
//       banner,
//       createdAt: new Date()
//     });

//     await category.save();

//     res.status(201).json({
//       success: true,
//       data: {
//         id: category._id,
//         name: category.name,
//         image: category.image,
//         banner: category.banner
//       },
//       message: "Category created successfully"
//     });

//   } catch (error) {
//     console.error(`[Category Controller] Create Error: ${error.message}`);
//     errorResponse(res, 500, "Internal server error");
//   }
// };

// export const getAllCategories = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const sort = req.query.sort || '-createdAt';

//     const categories = await Category.find({})
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // 4. Get total count for pagination info
//     const total = await Category.countDocuments();

//     res.status(200).json({
//       success: true,
//       data: categories,
//       pagination: {
//         total,
//         page,
//         pages: Math.ceil(total / limit),
//         limit
//       }
//     });

//   } catch (error) {
//     console.error(`[Category Controller] GetAll Error: ${error.message}`);
//     errorResponse(res, 500, "Internal server error");
//   }
// };