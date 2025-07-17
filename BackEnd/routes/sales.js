const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/purchase', salesController.purchase);
router.get('/', salesController.getSales);
router.post('/approve', salesController.setSalesApprove);
router.post('/cancel', salesController.setSalesCancelled);
router.post('/complete', salesController.setSalesCompleted);

module.exports = router; 