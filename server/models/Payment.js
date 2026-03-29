const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  policy:        { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount:        { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'], required: true },
  transactionId: { type: String, required: true, unique: true },
  status:        { type: String, enum: ['Success', 'Failed', 'Pending', 'Refunded'], default: 'Pending' },
  paymentDate:   { type: Date, default: Date.now }
}, { timestamps: true });

paymentSchema.index({ policy: 1 });
paymentSchema.index({ customer: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
