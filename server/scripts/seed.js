const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const Plan = require('../models/Plan');
const VehicleCatalog = require('../models/VehicleCatalog');
const Customer = require('../models/Customer');
const Agent = require('../models/Agent');
const Vehicle = require('../models/Vehicle');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Payment = require('../models/Payment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/govelocity_insurance';

const plansData = [
  {
    planName: 'Basic Liability', tier: 'Basic', description: 'Mandatory third-party coverage for your vehicle.',
    basePrice: 2499, durationMonths: 12, vehicleType: 'All', icon: 'Shield',
    features: [
      { featureName: 'Third Party Damage', featureDesc: 'Covers property damage/injuries to third parties', isIncluded: true, coverageLimit: '₹7.5 Lakhs' },
      { featureName: 'Personal Accident', featureDesc: 'Owner-driver accident cover', isIncluded: true, coverageLimit: '₹15 Lakhs' },
      { featureName: 'Own Damage Cover', featureDesc: 'Damage to your own vehicle', isIncluded: false }
    ]
  },
  {
    planName: 'Standard Comprehensive', tier: 'Standard', description: 'Balanced protection covering own damage and third-party liabilities.',
    basePrice: 5999, durationMonths: 12, vehicleType: 'All', icon: 'CheckCircle',
    features: [
      { featureName: 'Third Party Damage', featureDesc: 'Covers property damage/injuries to third parties', isIncluded: true, coverageLimit: '₹7.5 Lakhs' },
      { featureName: 'Own Damage Cover', featureDesc: 'Damage caused by accidents, fire, theft', isIncluded: true, coverageLimit: 'IDV (Declared Value)' },
      { featureName: 'Zero Depreciation', featureDesc: 'Full settlement without deduction for wear & tear', isIncluded: false }
    ]
  },
  {
    planName: 'Premium Zero-Dep', tier: 'Premium', description: 'Comprehensive coverage with zero depreciation on parts replacing.',
    basePrice: 11999, durationMonths: 12, vehicleType: 'All', icon: 'Award',
    features: [
      { featureName: 'Own Damage Cover', featureDesc: 'Damage to own vehicle', isIncluded: true, coverageLimit: 'IDV' },
      { featureName: 'Zero Depreciation', featureDesc: 'No deduction on parts replacement', isIncluded: true, coverageLimit: 'Unlimited' },
      { featureName: '24/7 Roadside Assist', featureDesc: 'Towing, flat tire, battery jump start', isIncluded: true, coverageLimit: '' }
    ]
  },
  {
    planName: 'Ultimate Protection', tier: 'Ultimate', description: 'The absolute best package with Engine Protect, Consumables cover, and more.',
    basePrice: 19999, durationMonths: 12, vehicleType: 'All', icon: 'Star',
    features: [
      { featureName: 'Zero Depreciation', featureDesc: 'No deduction on parts', isIncluded: true, coverageLimit: 'Unlimited' },
      { featureName: 'Engine Protection', featureDesc: 'Cover for engine damage due to water logging or oil leak', isIncluded: true, coverageLimit: 'Full Repair' },
      { featureName: 'Consumables Cover', featureDesc: 'Nuts, bolts, engine oil covered during claims', isIncluded: true, coverageLimit: '' },
      { featureName: 'Return to Invoice', featureDesc: 'Get on-road price if vehicle is stolen/total loss', isIncluded: true, coverageLimit: 'Original Value' }
    ]
  }
];

const vehicleCatalogData = [
  {
    makeName: 'Maruti Suzuki', vehicleType: 'Car',
    models: [{ modelName: 'Swift' }, { modelName: 'Baleno' }, { modelName: 'Wagon R' }]
  },
  {
    makeName: 'Hyundai', vehicleType: 'Car',
    models: [{ modelName: 'i20' }, { modelName: 'Creta' }, { modelName: 'Venue' }]
  },
  {
    makeName: 'Royal Enfield', vehicleType: 'Bike',
    models: [{ modelName: 'Classic 350' }, { modelName: 'Meteor 350' }]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Dropping existing db...');
    await mongoose.connection.db.dropDatabase();

    // 1. Seed Plans
    console.log('Seeding Plans...');
    const plans = await Plan.insertMany(plansData);

    // 2. Seed Vehicle Catalog
    console.log('Seeding Vehicle Catalog...');
    const catalogs = await VehicleCatalog.insertMany(vehicleCatalogData);

    // 3. Seed Users
    console.log('Seeding Customers & Agents...');
    const defaultPassword = await bcrypt.hash('Test@1234', 10);

    const customer1 = await Customer.create({
      firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@test.com',
      passwordHash: defaultPassword, phone: '9876543210', dateOfBirth: new Date('1995-06-15'),
      gender: 'Male', address: { line1: '42, MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
    });
    
    const customer2 = await Customer.create({
      firstName: 'Priya', lastName: 'Patel', email: 'priya@test.com',
      passwordHash: defaultPassword, phone: '9876543211', dateOfBirth: new Date('1992-03-22'),
      gender: 'Female', address: { line1: '15, Park Street', city: 'Bangalore', state: 'Karnataka', pincode: '560001' }
    });

    const agent1 = await Agent.create({
      firstName: 'Vikram', lastName: 'Singh', email: 'vikram@agent.com',
      passwordHash: defaultPassword, phone: '9988776655', licenseNumber: 'AGT-MH-2024-001',
      region: 'Western India', officeAddress: '101, Insurance Tower', city: 'Mumbai', state: 'Maharashtra', pincode: '400051',
      coveragePlanIds: plans.map(p => p._id),
      totalCustomers: 2
    });

    // 4. Seed Vehicles
    console.log('Seeding Vehicles...');
    const vehicle1 = await Vehicle.create({
      customer: customer1._id, catalogEntry: catalogs[0]._id, makeName: 'Maruti Suzuki', modelName: 'Swift',
      vehicleType: 'Car', fuelType: 'Petrol', registrationNumber: 'MH01AB1234', yearOfManufacture: 2022
    });

    const vehicle2 = await Vehicle.create({
      customer: customer2._id, catalogEntry: catalogs[2]._id, makeName: 'Royal Enfield', modelName: 'Classic 350',
      vehicleType: 'Bike', fuelType: 'Petrol', registrationNumber: 'KA01EF9012', yearOfManufacture: 2023
    });

    // 5. Seed Policies
    console.log('Seeding Policies...');
    const policy1 = await Policy.create({
      policyNumber: 'GV-POL-2024-0001', customer: customer1._id, vehicle: vehicle1._id, plan: plans[2]._id, agent: agent1._id,
      startDate: new Date('2024-01-15'), endDate: new Date('2025-01-14'), premiumAmount: plans[2].basePrice,
      status: 'Active',
      nominee: { fullName: 'Sanya Sharma', relationship: 'Spouse', phone: '9876543220' }
    });

    const policy2 = await Policy.create({
      policyNumber: 'GV-POL-2024-0002', customer: customer2._id, vehicle: vehicle2._id, plan: plans[0]._id, agent: agent1._id,
      startDate: new Date('2024-06-10'), endDate: new Date('2025-06-09'), premiumAmount: plans[0].basePrice,
      status: 'Active'
    });

    // 6. Seed Payments
    console.log('Seeding Payments...');
    await Payment.create({
      policy: policy1._id, customer: customer1._id, amount: policy1.premiumAmount, paymentMethod: 'UPI',
      transactionId: 'TXN-UPI-001', status: 'Success'
    });

    await Payment.create({
      policy: policy2._id, customer: customer2._id, amount: policy2.premiumAmount, paymentMethod: 'Net Banking',
      transactionId: 'TXN-NB-002', status: 'Success'
    });

    // 7. Seed Claims
    console.log('Seeding Claims...');
    await Claim.create({
      claimNumber: 'GV-CLM-2024-0001', policy: policy1._id, customer: customer1._id, agent: agent1._id,
      claimType: 'Accident', description: 'Minor rear-end collision.', incidentDate: new Date('2024-09-15'),
      incidentLocation: 'Andheri West, Mumbai', estimatedAmount: 35000, status: 'Under Review'
    });

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
