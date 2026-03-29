const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/available/:planId', auth, agentController.getAvailableAgents);
router.get('/customers', auth, requireRole('agent'), agentController.getMyCustomers);
router.get('/customers/:id', auth, requireRole('agent'), agentController.getCustomerDetail);
router.put('/availability', auth, requireRole('agent'), agentController.updateAvailability);
router.put('/plans', auth, requireRole('agent'), agentController.updatePlans);

module.exports = router;
