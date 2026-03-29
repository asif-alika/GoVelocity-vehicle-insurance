const Policy = require('../models/Policy');
const Plan = require('../models/Plan');
const Vehicle = require('../models/Vehicle');
const Agent = require('../models/Agent');
const Payment = require('../models/Payment');

// Generate policy number
const generatePolicyNumber = () => {
  const prefix = 'GV';
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${year}${random}`;
};

// Create new policy
exports.createPolicy = async (req, res, next) => {
  try {
    const { vehicle_id, plan_id, agent_id, start_date, nominee } = req.body;
    const customer_id = req.user.id;

    const plan = await Plan.findById(plan_id);
    if (!plan) return res.status(404).json({ message: 'Coverage plan not found.' });

    const vehicle = await Vehicle.findOne({ _id: vehicle_id, customer: customer_id });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    const agent = await Agent.findOne({ _id: agent_id, coveragePlanIds: plan_id });
    if (!agent) return res.status(400).json({ message: 'Selected agent does not handle this plan.' });

    const policy_number = generatePolicyNumber();
    const premium_amount = plan.basePrice;
    const duration = plan.durationMonths;
    const sDate = new Date(start_date);
    const eDate = new Date(sDate);
    eDate.setMonth(eDate.getMonth() + duration);

    const nomineeData = nominee ? {
      fullName: nominee.full_name,
      relationship: nominee.relationship,
      dateOfBirth: nominee.date_of_birth || null,
      phone: nominee.phone || '',
      email: nominee.email || '',
      idProof: {
        type: nominee.id_proof_type || '',
        number: nominee.id_proof_number || ''
      }
    } : undefined;

    const policy = await Policy.create({
      policyNumber: policy_number,
      customer: customer_id,
      vehicle: vehicle_id,
      plan: plan_id,
      agent: agent_id,
      startDate: sDate,
      endDate: eDate,
      premiumAmount: premium_amount,
      status: 'Pending',
      nominee: nomineeData
    });

    // Update agent's customer count (count unique customers)
    const uniqueCustomers = await Policy.distinct('customer', { agent: agent_id });
    agent.totalCustomers = uniqueCustomers.length;
    await agent.save();

    res.status(201).json({
      message: 'Policy created successfully',
      policy_id: policy._id,
      policy_number,
      premium_amount
    });
  } catch (error) {
    next(error);
  }
};

// Get user's policies
exports.getPolicies = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let query = role === 'customer' ? { customer: id } : { agent: id };

    const policies = await Policy.find(query)
      .populate('plan')
      .populate('vehicle')
      .populate('customer')
      .populate('agent')
      .sort('-createdAt');

    const mapped = policies.map(p => ({
      policy_id: p._id,
      policy_number: p.policyNumber,
      status: p.status,
      premium_amount: p.premiumAmount,
      start_date: p.startDate,
      end_date: p.endDate,
      created_at: p.createdAt,
      
      plan_name: p.plan?.planName,
      tier: p.plan?.tier,
      icon: p.plan?.icon,
      
      registration_number: p.vehicle?.registrationNumber,
      make_name: p.vehicle?.makeName,
      model_name: p.vehicle?.modelName,
      vehicle_type: p.vehicle?.vehicleType,

      agent_first_name: p.agent?.firstName,
      agent_last_name: p.agent?.lastName,

      customer_first_name: p.customer?.firstName,
      customer_last_name: p.customer?.lastName,
      customer_email: p.customer?.email,

      nominee_name: p.nominee?.fullName,
      nominee_relationship: p.nominee?.relationship
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

// Get single policy details
exports.getPolicy = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    
    // Check access directly in query
    const query = { _id: req.params.id };
    if (role === 'customer') query.customer = id;
    else query.agent = id;

    const policy = await Policy.findOne(query)
      .populate('plan')
      .populate('vehicle')
      .populate('agent')
      .populate('customer');

    if (!policy) return res.status(404).json({ message: 'Policy not found.' });

    const payments = await Payment.find({ policy: policy._id }).sort('-paymentDate');

    res.json({
      policy_id: policy._id,
      policy_number: policy.policyNumber,
      start_date: policy.startDate,
      end_date: policy.endDate,
      premium_amount: policy.premiumAmount,
      status: policy.status,
      created_at: policy.createdAt,
      
      plan_name: policy.plan?.planName,
      tier: policy.plan?.tier,
      plan_description: policy.plan?.description,
      
      registration_number: policy.vehicle?.registrationNumber,
      make_name: policy.vehicle?.makeName,
      model_name: policy.vehicle?.modelName,
      vehicle_type: policy.vehicle?.vehicleType,
      fuel_type: policy.vehicle?.fuelType,
      year_of_manufacture: policy.vehicle?.yearOfManufacture,

      agent_first_name: policy.agent?.firstName,
      agent_last_name: policy.agent?.lastName,
      agent_phone: policy.agent?.phone,
      agent_email: policy.agent?.email,

      customer_first_name: policy.customer?.firstName,
      customer_last_name: policy.customer?.lastName,
      customer_email: policy.customer?.email,

      features: policy.plan?.features?.map(f => ({
        feature_name: f.featureName,
        feature_desc: f.featureDesc,
        is_included: f.isIncluded
      })) || [],

      nominee: policy.nominee ? {
        full_name: policy.nominee.fullName,
        relationship: policy.nominee.relationship,
        phone: policy.nominee.phone,
        date_of_birth: policy.nominee.dateOfBirth
      } : null,

      payments: payments.map(pay => ({
        payment_id: pay._id,
        amount: pay.amount,
        payment_method: pay.paymentMethod,
        transaction_id: pay.transactionId,
        status: pay.status,
        payment_date: pay.paymentDate
      }))
    });
  } catch (error) {
    next(error);
  }
};
