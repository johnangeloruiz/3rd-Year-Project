const { body } = require('express-validator');

exports.addToCartValidator = [
  body('productName').trim().notEmpty().withMessage('Product name is required.'),
  body('productStock').isInt({ min: 0 }).withMessage('Product stock must be a non-negative integer.'),
  body('productPrice').isFloat({ min: 0 }).withMessage('Product price must be a non-negative number.'),
  body('userEmail').isEmail().withMessage('Valid user email is required.').normalizeEmail(),
]; 