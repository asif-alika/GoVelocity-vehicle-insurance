const Customer = require('../models/Customer');
const Agent = require('../models/Agent');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');

exports.getCustomerStats = async (req, res, next) => {
  try {
    const cid = req.user.id;

    const total_policies = await Policy.countDocuments({ customer: cid });
    const active_policies = await Policy.countDocuments({ customer: cid, status: 'Active' });
    
    const total_claims = await Claim.countDocuments({ customer: cid });
    const pending_claims = await Claim.countDocuments({ customer: cid, status: { $in: ['Submitted', 'Under Review', 'Inspection'] } });
    const approved_claims = await Claim.countDocuments({ customer: cid, status: { $in: ['Approved', 'Settled'] } });
    
    const total_vehicles = await Vehicle.countDocuments({ customer: cid });

    const policies = await Policy.find({ customer: cid })
      .populate('plan')
      .populate('vehicle')
      .sort('-createdAt').limit(3);

    const claims = await Claim.find({ customer: cid })
      .populate('policy')
      .sort('-filedDate').limit(3);

    res.json({
      stats: {
        total_policies,
        active_policies,
        total_claims,
        pending_claims,
        approved_claims,
        total_vehicles
      },
      recent_policies: policies.map(p => ({
        policy_id: p._id,
        policy_number: p.policyNumber,
        status: p.status,
        plan_name: p.plan?.planName,
        tier: p.plan?.tier,
        registration_number: p.vehicle?.registrationNumber,
        make_name: p.vehicle?.makeName,
        model_name: p.vehicle?.modelName
      })),
      recent_claims: claims.map(c => ({
        claim_id: c._id,
        claim_number: c.claimNumber,
        status: c.status,
        claim_type: c.claimType,
        policy_number: c.policy?.policyNumber,
        filed_date: c.filedDate
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.getAgentStats = async (req, res, next) => {
  try {
    const aid = req.user.id;

    // Distinct customers for this agent's policies
    const customerIds = await Policy.distinct('customer', { agent: aid });
    const total_customers = customerIds.length;

    const total_policies = await Policy.countDocuments({ agent: aid });
    const active_policies = await Policy.countDocuments({ agent: aid, status: 'Active' });

    const total_claims = await Claim.countDocuments({ agent: aid });
    const submitted_claims = await Claim.countDocuments({ agent: aid, status: 'Submitted' });
    const under_review_claims = await Claim.countDocuments({ agent: aid, status: 'Under Review' });
    const inspection_claims = await Claim.countDocuments({ agent: aid, status: 'Inspection' });
    const resolved_claims = await Claim.countDocuments({ agent: aid, status: { $in: ['Approved', 'Settled'] } });

    // Pending Claims
    const pendingClaims = await Claim.find({ agent: aid, status: { $in: ['Submitted', 'Under Review', 'Inspection'] } })
      .populate('policy')
      .populate('customer')
      .populate({ path: 'policy', populate: { path: 'vehicle' } })
      .sort('filedDate').limit(5);

    // Total Revenue calculation
    // Mongoose aggregation for sum of successful payments
    const revenueAgg = await Payment.aggregate([
      // Lookup policies to filter by agent
      { $lookup: { from: 'policies', localField: 'policy', foreignField: '_id', as: 'policyDoc' } },
      { $unwind: '$policyDoc' },
      { $match: { 'policyDoc.agent': (require('mongoose').Types.ObjectId)(aid), status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total_revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      stats: {
        total_customers,
        total_policies,
        active_policies,
        total_claims,
        submitted_claims,
        under_review_claims,
        inspection_claims,
        resolved_claims,
        total_revenue
      },
      pending_claims: pendingClaims.map(c => ({
        claim_id: c._id,
        claim_number: c.claimNumber,
        status: c.status,
        filed_date: c.filedDate,
        customer_first_name: c.customer?.firstName,
        customer_last_name: c.customer?.lastName,
        policy_number: c.policy?.policyNumber,
        registration_number: c.policy?.vehicle?.registrationNumber,
        make_name: c.policy?.vehicle?.makeName,
        model_name: c.policy?.vehicle?.modelName
      }))
    });
  } catch (error) {
    next(error);
  }
};
