const Document = require('../models/Document');
const Policy = require('../models/Policy');
const path = require('path');
const fs = require('fs');

// Upload document
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const doc = await Document.create({
      customer: req.user.id,
      documentType: req.body.document_type,
      documentName: req.file.originalname,
      filePath: req.file.path
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document_id: doc._id
    });
  } catch (error) {
    next(error);
  }
};

// Get customer's documents
exports.getDocuments = async (req, res, next) => {
  try {
    const customerId = req.user.role === 'customer' ? req.user.id : req.query.customer_id;
    if (!customerId) return res.status(400).json({ message: 'Customer ID required.' });

    const documents = await Document.find({ customer: customerId })
      .populate('verifiedBy', 'firstName lastName')
      .sort('-createdAt');

    res.json(documents.map(d => ({
      document_id: d._id,
      document_type: d.documentType,
      document_name: d.documentName,
      file_path: d.filePath,
      is_verified: d.isVerified,
      uploaded_at: d.createdAt,
      verified_by_name: d.verifiedBy ? `${d.verifiedBy.firstName} ${d.verifiedBy.lastName}` : null
    })));
  } catch (error) {
    next(error);
  }
};

// Download/view document file
exports.getDocumentFile = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    if (req.user.role === 'customer' && doc.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (!fs.existsSync(doc.filePath)) {
      return res.status(404).json({ message: 'File not found on server.' });
    }

    res.sendFile(path.resolve(doc.filePath));
  } catch (error) {
    next(error);
  }
};

// Agent verifies document
exports.verifyDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    const access = await Policy.findOne({ customer: doc.customer, agent: req.user.id });
    if (!access) return res.status(403).json({ message: 'You do not manage this customer.' });

    doc.isVerified = true;
    doc.verifiedBy = req.user.id;
    doc.verifiedAt = new Date();
    await doc.save();

    res.json({ message: 'Document verified successfully' });
  } catch (error) {
    next(error);
  }
};
