const mongoose = require('mongoose');

const nomineeSubSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  relationship: { type: String, required: true },
  dateOfBirth:  { type: Date, default: null },
  phone:        { type: String, default: '' },
  email:        { type: String, default: '' },
  idProof: {
    type:   { type: String, default: '' },
    number: { type: String, default: '' }
  }
}, { _id: false });

const policySchema = new mongoose.Schema({
  policyNumber:  { type: String, required: true, unique: true },
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  vehicle:       { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  plan:          { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  agent:         { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  startDate:     { type: Date, required: true },
  endDate:       { type: Date, required: true },
  premiumAmount: { type: Number, required: true },
  status:        { type: String, enum: ['Pending', 'Active', 'Expired', 'Cancelled', 'Lapsed'], default: 'Pending' },
  nominee:       nomineeSubSchema
}, { timestamps: true });

policySchema.index({ customer: 1 });
policySchema.index({ agent: 1 });
policySchema.index({ policyNumber: 1 });

module.exports = mongoose.model('Policy', policySchema);
