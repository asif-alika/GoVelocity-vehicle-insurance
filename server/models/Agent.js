const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  firstName:      { type: String, required: true, trim: true },
  lastName:       { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:   { type: String, required: true },
  phone:          { type: String, required: true },
  licenseNumber:  { type: String, required: true, unique: true },
  region:         { type: String, required: true },
  officeAddress:  { type: String, default: '' },
  city:           { type: String, required: true },
  state:          { type: String, required: true },
  pincode:        { type: String, required: true },
  isAvailable:    { type: Boolean, default: true },
  rating:         { type: Number, default: 4.0 },
  totalCustomers: { type: Number, default: 0 },
  coveragePlanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
  profileImage:   { type: String, default: null }
}, { timestamps: true });

agentSchema.index({ email: 1 });

module.exports = mongoose.model('Agent', agentSchema);
