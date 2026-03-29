const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const { auth } = require('../middleware/auth');

router.post('/', auth, policyController.createPolicy);
router.get('/', auth, policyController.getPolicies);
router.get('/:id', auth, policyController.getPolicy);

module.exports = router;
