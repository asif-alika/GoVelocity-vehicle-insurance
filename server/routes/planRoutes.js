const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

router.get('/', planController.getAllPlans);
router.get('/compare', planController.comparePlans);
router.get('/:id/features', planController.getPlanFeatures);

module.exports = router;
