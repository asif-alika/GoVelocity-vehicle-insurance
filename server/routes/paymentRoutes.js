const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, requireRole } = require('../middleware/auth');

router.post('/', auth, requireRole('customer'), paymentController.processPayment);
router.get('/', auth, requireRole('customer'), paymentController.getPayments);

module.exports = router;
