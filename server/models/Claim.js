const mongoose = require('mongoose');

const imageSubSchema = new mongoose.Schema({
  imagePath:  { type: String, required: true },
  imageType:  { type: String, default: 'Damage Photo' },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

const claimSchema = new mongoose.Schema({
  claimNumber:      { type: String, required: true, unique: true },
  policy:           { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  customer:         { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  agent:            { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  claimType:        { type: String, enum: ['Accident', 'Theft', 'Natural Disaster', 'Third Party', 'Vandalism', 'Other'], required: true },
  description:      { type: String, required: true },
  incidentDate:     { type: Date, required: true },
  incidentLocation: { type: String, required: true },
  estimatedAmount:  { type: Number, required: true },
  approvedAmount:   { type: Number, default: null },
  status:           { type: String, enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Settled'], default: 'Submitted' },
  agentRemarks:     { type: String, default: '' },
  filedDate:        { type: Date, default: Date.now },
  reviewedDate:     { type: Date, default: null },
  settledDate:      { type: Date, default: null },
  images:           [imageSubSchema]
}, { timestamps: true });

claimSchema.index({ customer: 1 });
claimSchema.index({ agent: 1 });
claimSchema.index({ policy: 1 });

module.exports = mongoose.model('Claim', claimSchema);
