const Plan = require('../models/Plan');

const mapPlanToFrontend = (plan) => ({
  plan_id: plan._id,
  plan_name: plan.planName,
  tier: plan.tier,
  description: plan.description,
  base_price: plan.basePrice,
  duration_months: plan.durationMonths,
  vehicle_type: plan.vehicleType,
  is_active: plan.isActive,
  icon: plan.icon,
  features: plan.features.map(f => ({
    feature_id: f._id,
    feature_name: f.featureName,
    feature_desc: f.featureDesc,
    is_included: f.isIncluded,
    coverage_limit: f.coverageLimit
  }))
});

// Get all active coverage plans
exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort('basePrice');
    res.json(plans.map(mapPlanToFrontend));
  } catch (error) {
    next(error);
  }
};

// Get features for a plan
exports.getPlanFeatures = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    res.json(plan.features.map(f => ({
      feature_id: f._id,
      plan_id: plan._id,
      feature_name: f.featureName,
      feature_desc: f.featureDesc,
      is_included: f.isIncluded,
      coverage_limit: f.coverageLimit
    })));
  } catch (error) {
    next(error);
  }
};

// Compare all plans
exports.comparePlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort('basePrice');
    res.json(plans.map(mapPlanToFrontend)); // features are already embedded
  } catch (error) {
    next(error);
  }
};
