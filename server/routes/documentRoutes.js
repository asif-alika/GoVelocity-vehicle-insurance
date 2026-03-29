const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { auth, requireRole } = require('../middleware/auth');
const { uploadDocument } = require('../middleware/upload');

router.post('/', auth, requireRole('customer'), uploadDocument.single('document'), documentController.uploadDocument);
router.get('/', auth, documentController.getDocuments);
router.get('/:id/file', auth, documentController.getDocumentFile);
router.put('/:id/verify', auth, requireRole('agent'), documentController.verifyDocument);

module.exports = router;
