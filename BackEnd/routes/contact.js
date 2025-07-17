const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');
const { sendMessageValidator } = require('../validators/contactValidators');
const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.post('/send', sendMessageValidator, handleValidationErrors, sendMessage);

module.exports = router; 