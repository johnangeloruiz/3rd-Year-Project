const express = require('express');
const router = express.Router();
const { addToCart } = require('../controllers/cartController');
const { addToCartValidator } = require('../validators/cartValidators');
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.post('/add', addToCartValidator, handleValidationErrors, addToCart);

module.exports = router; 