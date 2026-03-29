const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  customer:     { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  documentType: { type: String, required: true },
  documentName: { type: String, required: true },
  filePath:     { type: String, required: true },
  isVerified:   { type: Boolean, default: false },
  verifiedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null },
  verifiedAt:   { type: Date, default: null }
}, { timestamps: true });

documentSchema.index({ customer: 1 });

module.exports = mongoose.model('Document', documentSchema);
