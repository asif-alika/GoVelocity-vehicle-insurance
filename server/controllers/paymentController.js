const Payment = require('../models/Payment');
const Policy = require('../models/Policy');
const { v4: uuidv4 } = require('uuid');

// Process simulated payment
exports.processPayment = async (req, res, next) => {
  try {
    const { policy_id, payment_method } = req.body;
    const customer_id = req.user.id;

    const policy = await Policy.findOne({ _id: policy_id, customer: customer_id });
    if (!policy) return res.status(404).json({ message: 'Policy not found.' });

    // Simulate payment
    const isSuccess = Math.random() < 0.9;
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const payment = await Payment.create({
      policy: policy_id,
      customer: customer_id,
      amount: policy.premiumAmount,
      paymentMethod: payment_method,
      transactionId: transactionId,
      status: isSuccess ? 'Success' : 'Failed'
    });

    if (isSuccess) {
      policy.status = 'Active';
      await policy.save();
    }

    res.status(201).json({
      message: isSuccess ? 'Payment successful! Policy activated.' : 'Payment failed. Please try again.',
      payment: {
        payment_id: payment._id,
        transaction_id: transactionId,
        amount: policy.premiumAmount,
        status: isSuccess ? 'Success' : 'Failed',
        payment_method
      },
      policy_status: isSuccess ? 'Active' : 'Pending'
    });
  } catch (error) {
    next(error);
  }
};

// Get payment history
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ customer: req.user.id })
      .populate('policy')
      .populate({ path: 'policy', populate: { path: 'plan' }})
      .sort('-paymentDate');

    res.json(payments.map(pay => ({
      payment_id: pay._id,
      amount: pay.amount,
      payment_method: pay.paymentMethod,
      transaction_id: pay.transactionId,
      status: pay.status,
      payment_date: pay.paymentDate,
      policy_number: pay.policy?.policyNumber,
      plan_name: pay.policy?.plan?.planName
    })));
  } catch (error) {
    next(error);
  }
};
