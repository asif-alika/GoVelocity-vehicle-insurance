const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const Document = require('../models/Document');

// Generate claim number
const generateClaimNumber = () => {
  const prefix = 'CLM';
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${year}${random}`;
};

// File new claim
exports.fileClaim = async (req, res, next) => {
  try {
    const {
      policy_id, claim_type, description,
      incident_date, incident_location, estimated_amount
    } = req.body;
    const customer_id = req.user.id;

    const policy = await Policy.findOne({ _id: policy_id, customer: customer_id, status: 'Active' });
    if (!policy) return res.status(400).json({ message: 'No active policy found with this ID.' });

    const claim_number = generateClaimNumber();

    const claim = await Claim.create({
      claimNumber: claim_number,
      policy: policy_id,
      customer: customer_id,
      agent: policy.agent,
      claimType: claim_type,
      description,
      incidentDate: incident_date,
      incidentLocation: incident_location || '',
      estimatedAmount: estimated_amount || 0,
      status: 'Submitted'
    });

    res.status(201).json({
      message: 'Claim submitted successfully. Your agent has been notified.',
      claim_id: claim._id,
      claim_number
    });
  } catch (error) {
    next(error);
  }
};

// Get claims
exports.getClaims = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let query = role === 'customer' ? { customer: id } : { agent: id };

    const claims = await Claim.find(query)
      .populate('policy')
      .populate({ path: 'policy', populate: { path: 'plan' }})
      .populate({ path: 'policy', populate: { path: 'vehicle' }})
      .populate('agent')
      .populate('customer')
      .sort('-filedDate');

    const mapped = claims.map(cl => ({
      claim_id: cl._id,
      claim_number: cl.claimNumber,
      claim_type: cl.claimType,
      incident_date: cl.incidentDate,
      incident_location: cl.incidentLocation,
      estimated_amount: cl.estimatedAmount,
      approved_amount: cl.approvedAmount,
      status: cl.status,
      filed_date: cl.filedDate,
      
      policy_number: cl.policy?.policyNumber,
      plan_name: cl.policy?.plan?.planName,
      
      registration_number: cl.policy?.vehicle?.registrationNumber,
      make_name: cl.policy?.vehicle?.makeName,
      model_name: cl.policy?.vehicle?.modelName,

      agent_first_name: cl.agent?.firstName,
      agent_last_name: cl.agent?.lastName,

      customer_first_name: cl.customer?.firstName,
      customer_last_name: cl.customer?.lastName,
      customer_email: cl.customer?.email,
      customer_phone: cl.customer?.phone
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

// Get claim details
exports.getClaim = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    
    const query = { _id: req.params.id };
    if (role === 'customer') query.customer = id;
    else query.agent = id;

    const claim = await Claim.findOne(query)
      .populate('policy')
      .populate({ path: 'policy', populate: { path: 'plan' }})
      .populate({ path: 'policy', populate: { path: 'vehicle' }})
      .populate('agent')
      .populate('customer');

    if (!claim) return res.status(404).json({ message: 'Claim not found.' });

    const documents = await Document.find({ customer: claim.customer._id });

    res.json({
      claim_id: claim._id,
      claim_number: claim.claimNumber,
      claim_type: claim.claimType,
      description: claim.description,
      incident_date: claim.incidentDate,
      incident_location: claim.incidentLocation,
      estimated_amount: claim.estimatedAmount,
      approved_amount: claim.approvedAmount,
      status: claim.status,
      agent_remarks: claim.agentRemarks,
      filed_date: claim.filedDate,
      reviewed_date: claim.reviewedDate,
      settled_date: claim.settledDate,

      policy_number: claim.policy?.policyNumber,
      plan_name: claim.policy?.plan?.planName,
      tier: claim.policy?.plan?.tier,

      registration_number: claim.policy?.vehicle?.registrationNumber,
      make_name: claim.policy?.vehicle?.makeName,
      model_name: claim.policy?.vehicle?.modelName,
      vehicle_type: claim.policy?.vehicle?.vehicleType,

      agent_first_name: claim.agent?.firstName,
      agent_last_name: claim.agent?.lastName,
      agent_phone: claim.agent?.phone,

      customer_first_name: claim.customer?.firstName,
      customer_last_name: claim.customer?.lastName,
      customer_email: claim.customer?.email,
      customer_phone: claim.customer?.phone,

      images: claim.images.map(img => ({
        image_id: img._id,
        image_path: img.imagePath,
        image_type: img.imageType,
        uploaded_at: img.uploadedAt
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

// Upload claim images
exports.uploadClaimImages = async (req, res, next) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, customer: req.user.id });
    if (!claim) return res.status(404).json({ message: 'Claim not found.' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

    const newImages = req.files.map(file => ({
      imagePath: file.path,
      imageType: req.body.image_type || 'Damage Photo'
    }));

    claim.images.push(...newImages);
    await claim.save();

    res.status(201).json({
      message: `${req.files.length} image(s) uploaded successfully`,
      count: req.files.length
    });
  } catch (error) {
    next(error);
  }
};

// Agent reviews claim
exports.reviewClaim = async (req, res, next) => {
  try {
    const { status, approved_amount, agent_remarks } = req.body;
    const validStatuses = ['Under Review', 'Inspection', 'Approved', 'Rejected', 'Settled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const claim = await Claim.findOne({ _id: req.params.id, agent: req.user.id });
    if (!claim) return res.status(404).json({ message: 'Claim not found or not assigned to you.' });

    claim.status = status;
    claim.agentRemarks = agent_remarks || '';
    claim.reviewedDate = new Date();

    if (status === 'Approved' || status === 'Settled') {
      claim.approvedAmount = approved_amount || null;
    }
    if (status === 'Settled') {
      claim.settledDate = new Date();
    }

    await claim.save();

    res.json({
      message: `Claim ${status.toLowerCase()} successfully`,
      status
    });
  } catch (error) {
    next(error);
  }
};
