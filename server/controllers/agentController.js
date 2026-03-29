const Agent = require('../models/Agent');
const Customer = require('../models/Customer');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Document = require('../models/Document');
const Vehicle = require('../models/Vehicle');

// Get available agents for a specific plan
exports.getAvailableAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find({
      coveragePlanIds: req.params.planId,
      isAvailable: true
    }).sort('-rating');

    res.json(agents.map(a => ({
      agent_id: a._id,
      first_name: a.firstName,
      last_name: a.lastName,
      email: a.email,
      phone: a.phone,
      region: a.region,
      city: a.city,
      state: a.state,
      rating: a.rating,
      total_customers: a.totalCustomers,
      profile_image: a.profileImage
    })));
  } catch (error) {
    next(error);
  }
};

// Get agent's linked customers
exports.getMyCustomers = async (req, res, next) => {
  try {
    // Aggregation to find distinct customers managed by this agent
    const policies = await Policy.find({ agent: req.user.id }).populate('customer');
    
    // Group by customer to calculate totals
    const customerMap = new Map();
    
    for (const policy of policies) {
      if (!policy.customer) continue;
      const cid = policy.customer._id.toString();
      if (!customerMap.has(cid)) {
        customerMap.set(cid, {
          customer: policy.customer,
          totalPolicies: 0
        });
      }
      customerMap.get(cid).totalPolicies += 1;
    }

    // Convert map to array and fetch claims count
    const result = [];
    for (const [cid, data] of customerMap.entries()) {
      const claimsCount = await Claim.countDocuments({ customer: cid, agent: req.user.id });
      result.push({
        customer_id: data.customer._id,
        first_name: data.customer.firstName,
        last_name: data.customer.lastName,
        email: data.customer.email,
        phone: data.customer.phone,
        city: data.customer.address?.city,
        state: data.customer.address?.state,
        profile_image: data.customer.profileImage,
        total_policies: data.totalPolicies,
        total_claims: claimsCount
      });
    }

    // Sort by name
    result.sort((a, b) => a.first_name.localeCompare(b.first_name));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get full customer detail for agent
exports.getCustomerDetail = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const agentId = req.user.id;

    // Verify access
    const policyCount = await Policy.countDocuments({ customer: customerId, agent: agentId });
    if (policyCount === 0) {
      return res.status(403).json({ message: 'You do not manage this customer.' });
    }

    // Queries
    const customer = await Customer.findById(customerId);
    const vehicles = await Vehicle.find({ customer: customerId });
    const policies = await Policy.find({ customer: customerId, agent: agentId }).populate('plan');
    const claims = await Claim.find({ customer: customerId, agent: agentId }).sort('-filedDate');
    const documents = await Document.find({ customer: customerId });

    res.json({
      id: customer._id,
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      date_of_birth: customer.dateOfBirth,
      gender: customer.gender,
      address_line1: customer.address?.line1,
      address_line2: customer.address?.line2,
      city: customer.address?.city,
      state: customer.address?.state,
      pincode: customer.address?.pincode,
      profile_image: customer.profileImage,
      created_at: customer.createdAt,
      
      vehicles: vehicles.map(v => ({
        vehicle_id: v._id,
        make_name: v.makeName,
        model_name: v.modelName,
        registration_number: v.registrationNumber,
        year_of_manufacture: v.yearOfManufacture
      })),
      
      policies: policies.map(p => ({
        policy_id: p._id,
        policy_number: p.policyNumber,
        plan_name: p.plan?.planName,
        tier: p.plan?.tier,
        status: p.status,
        premium_amount: p.premiumAmount,
        start_date: p.startDate,
        end_date: p.endDate
      })),
      
      claims: claims.map(c => ({
        claim_id: c._id,
        claim_number: c.claimNumber,
        status: c.status,
        claim_type: c.claimType,
        filed_date: c.filedDate,
        estimated_amount: c.estimatedAmount
      })),
      
      documents: documents.map(d => ({
        document_id: d._id,
        document_type: d.documentType,
        document_name: d.documentName,
        is_verified: d.isVerified,
        uploaded_at: d.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Update agent availability
exports.updateAvailability = async (req, res, next) => {
  try {
    await Agent.findByIdAndUpdate(req.user.id, { isAvailable: req.body.is_available });
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Update agent's handled plans
exports.updatePlans = async (req, res, next) => {
  try {
    await Agent.findByIdAndUpdate(req.user.id, { coveragePlanIds: req.body.plan_ids || [] });
    res.json({ message: 'Coverage plans updated successfully' });
  } catch (error) {
    next(error);
  }
};
