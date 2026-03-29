const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  customer:           { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  catalogEntry:       { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleCatalog', required: true },
  makeName:           { type: String, required: true },
  modelName:          { type: String, required: true },
  vehicleType:        { type: String, enum: ['Car', 'Bike', 'Truck', 'Bus', 'Three-Wheeler'], required: true },
  fuelType:           { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'], required: true },
  registrationNumber: { type: String, required: true, unique: true, uppercase: true },
  yearOfManufacture:  { type: Number, required: true },
  engineNumber:       { type: String, default: '' },
  chassisNumber:      { type: String, default: '' },
  color:              { type: String, default: '' }
}, { timestamps: true });



module.exports = mongoose.model('Vehicle', vehicleSchema);
