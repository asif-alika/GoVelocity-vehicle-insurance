const Vehicle = require('../models/Vehicle');
const VehicleCatalog = require('../models/VehicleCatalog');

// Get customer's vehicles
exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ customer: req.user.id })
      .populate('catalogEntry', 'makeName')
      .sort('-createdAt');

    // Map to frontend expectations
    const mapped = vehicles.map(v => ({
      vehicle_id: v._id,
      make_name: v.makeName,
      model_name: v.modelName,
      vehicle_type: v.vehicleType,
      fuel_type: v.fuelType,
      registration_number: v.registrationNumber,
      year_of_manufacture: v.yearOfManufacture,
      engine_number: v.engineNumber,
      chassis_number: v.chassisNumber,
      color: v.color,
      created_at: v.createdAt
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

// Add vehicle
exports.addVehicle = async (req, res, next) => {
  try {
    const {
      make_id, model_id, vehicle_type, fuel_type,
      registration_number, year_of_manufacture,
      engine_number, chassis_number, color
    } = req.body;

    // We assume the frontend sends make details in some way,
    // but originally it sent make_id and model_id integer IDs.
    // Let's lookup the catalog entry using the frontend make_id.
    const catalogEntry = await VehicleCatalog.findById(make_id);
    if (!catalogEntry) return res.status(404).json({ message: 'Make not found' });
    
    // Find the modelName from the embedded models array
    const model = catalogEntry.models.id(model_id);
    const modelName = model ? model.modelName : 'Unknown Model';

    const vehicle = await Vehicle.create({
      customer: req.user.id,
      catalogEntry: catalogEntry._id,
      makeName: catalogEntry.makeName,
      modelName,
      vehicleType: vehicle_type,
      fuelType: fuel_type,
      registrationNumber: registration_number,
      yearOfManufacture: year_of_manufacture,
      engineNumber: engine_number || '',
      chassisNumber: chassis_number || '',
      color: color || ''
    });

    res.status(201).json({
      message: 'Vehicle added successfully',
      vehicle_id: vehicle._id
    });
  } catch (error) {
    next(error);
  }
};

// Get vehicle details
exports.getVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.findOne({ _id: req.params.id, customer: req.user.id });

    if (!v) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json({
      vehicle_id: v._id,
      make_name: v.makeName,
      model_name: v.modelName,
      vehicle_type: v.vehicleType,
      fuel_type: v.fuelType,
      registration_number: v.registrationNumber,
      year_of_manufacture: v.yearOfManufacture,
      engine_number: v.engineNumber,
      chassis_number: v.chassisNumber,
      color: v.color,
      created_at: v.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// Get all makes
exports.getMakes = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.vehicleType = type;

    const makes = await VehicleCatalog.find(filter).sort('makeName');
    
    // Map to original format
    res.json(makes.map(m => ({
      make_id: m._id,
      make_name: m.makeName,
      vehicle_type: m.vehicleType,
      country: m.country
    })));
  } catch (error) {
    next(error);
  }
};

// Get models for a make
exports.getModels = async (req, res, next) => {
  try {
    const make = await VehicleCatalog.findById(req.params.makeId);
    if (!make) return res.status(404).json({ message: 'Make not found' });

    // Map embedded models to expected output
    const models = make.models.map(m => ({
      model_id: m._id,
      make_id: make._id,
      model_name: m.modelName
    })).sort((a, b) => a.model_name.localeCompare(b.model_name));

    res.json(models);
  } catch (error) {
    next(error);
  }
};
