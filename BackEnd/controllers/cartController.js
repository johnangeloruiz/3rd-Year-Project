/**
 * Cart Controller
 * Handles cart-related business logic
 */
const { queryDatabase } = require('../db/db');

/**
 * Add item to cart
 * @route POST /api/cart/add
 */
exports.addToCart = async (req, res, next) => {
  const { productName, productStock, productPrice, userEmail } = req.body;
  try {
    const checkExistingProduct = 'SELECT * FROM cart WHERE productName = ? AND email = ?';
    const existingProduct = await queryDatabase(checkExistingProduct, [productName, userEmail]);
    if (existingProduct.length > 0) {
      // Product already exists, update quantity and price
      const updateQuery = 'UPDATE cart SET productQuantity = productQuantity + 1 WHERE productName = ?';
      await queryDatabase(updateQuery, [productName]);
      const updatePriceQuery = 'UPDATE cart SET totalPrice = ? WHERE productName = ?';
      const existingProductPrice = existingProduct[0].productPrice;
      const newProductPrice = existingProductPrice * (existingProduct[0].productQuantity + 1);
      await queryDatabase(updatePriceQuery, [newProductPrice, productName]);
      res.json({ success: true, action: 'Update' });
    } else {
      // Product doesn't exist, insert new record
      const insertQuery = 'INSERT INTO cart (productName, productStock, productPrice,totalPrice, productQuantity, isCheckOut, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [productName, productStock, productPrice, productPrice, 1, 'false', userEmail];
      await queryDatabase(insertQuery, values);
      res.json({ success: true, action: 'Insert' });
    }
  } catch (error) {
    console.error('Error during add to cart:', error);
    next(error);
  }
}; 