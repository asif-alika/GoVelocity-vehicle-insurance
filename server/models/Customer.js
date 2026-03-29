const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone:        { type: String, required: true },
  dateOfBirth:  { type: Date, required: true },
  gender:       { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: {
    line1:   { type: String, required: true },
    line2:   { type: String, default: '' },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true }
  },
  idProof: {
    type:   { type: String, enum: ['Aadhaar', 'PAN', 'Passport', 'DL', ''], default: '' },
    number: { type: String, default: '' }
  },
  profileImage: { type: String, default: null }
}, { timestamps: true });



module.exports = mongoose.model('Customer', customerSchema);
