const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register/customer', authController.registerCustomer);
router.post('/register/agent', authController.registerAgent);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
