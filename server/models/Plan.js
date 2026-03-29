const mongoose = require('mongoose');

const featureSubSchema = new mongoose.Schema({
  featureName:  { type: String, required: true },
  featureDesc:  { type: String, default: '' },
  isIncluded:   { type: Boolean, default: true },
  coverageLimit: { type: String, default: null }
}, { _id: true });

const planSchema = new mongoose.Schema({
  planName:       { type: String, required: true },
  tier:           { type: String, enum: ['Basic', 'Standard', 'Premium', 'Ultimate'], required: true },
  description:    { type: String, default: '' },
  basePrice:      { type: Number, required: true },
  durationMonths: { type: Number, default: 12 },
  vehicleType:    { type: String, default: 'All' },
  isActive:       { type: Boolean, default: true },
  icon:           { type: String, default: 'Shield' },
  features:       [featureSubSchema]
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
