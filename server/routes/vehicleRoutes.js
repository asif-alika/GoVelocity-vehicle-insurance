const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/makes', vehicleController.getMakes);
router.get('/models/:makeId', vehicleController.getModels);
router.get('/', auth, requireRole('customer'), vehicleController.getMyVehicles);
router.post('/', auth, requireRole('customer'), vehicleController.addVehicle);
router.get('/:id', auth, vehicleController.getVehicle);

module.exports = router;
