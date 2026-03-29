const mongoose = require('mongoose');

const modelSubSchema = new mongoose.Schema({
  modelName: { type: String, required: true }
}, { _id: true });

const vehicleCatalogSchema = new mongoose.Schema({
  makeName:    { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['Car', 'Bike', 'Truck', 'Bus', 'Three-Wheeler'], required: true },
  country:     { type: String, default: 'India' },
  models:      [modelSubSchema]
});



module.exports = mongoose.model('VehicleCatalog', vehicleCatalogSchema);
