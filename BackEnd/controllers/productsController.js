/**
 * Products Controller
 * Handles product-related business logic
 */
const { queryDatabase } = require('../db/db');

/**
 * Get all products
 * @route GET /api/products
 */
exports.getProducts = async (req, res, next) => {
  try {
    const sql = "SELECT * FROM products";
    const products = await queryDatabase(sql);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
}; 