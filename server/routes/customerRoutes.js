const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/dashboard', auth, requireRole('customer'), customerController.getCustomerStats);
router.get('/agent-dashboard', auth, requireRole('agent'), customerController.getAgentStats);

module.exports = router;
