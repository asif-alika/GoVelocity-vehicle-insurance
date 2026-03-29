const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { auth, requireRole } = require('../middleware/auth');
const { uploadClaimImage } = require('../middleware/upload');

router.post('/', auth, requireRole('customer'), claimController.fileClaim);
router.get('/', auth, claimController.getClaims);
router.get('/:id', auth, claimController.getClaim);
router.post('/:id/images', auth, requireRole('customer'), uploadClaimImage.array('images', 20), claimController.uploadClaimImages);
router.post('/:id/review', auth, requireRole('agent'), claimController.reviewClaim);

module.exports = router;
