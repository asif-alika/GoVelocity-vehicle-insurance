const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Agent = require('../models/Agent');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register Customer
exports.registerCustomer = async (req, res, next) => {
  try {
    const {
      first_name, last_name, email, password, phone,
      date_of_birth, gender, address_line1, address_line2,
      city, state, pincode, id_proof_type, id_proof_number
    } = req.body;

    // Check existing email
    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      firstName: first_name,
      lastName: last_name,
      email: email.toLowerCase(),
      passwordHash: password_hash,
      phone,
      dateOfBirth: date_of_birth,
      gender,
      address: {
        line1: address_line1,
        line2: address_line2 || '',
        city,
        state,
        pincode
      },
      idProof: {
        type: id_proof_type || '',
        number: id_proof_number || ''
      }
    });

    const token = generateToken({
      id: customer._id,
      email: customer.email,
      role: 'customer'
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      user: {
        id: customer._id,
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        role: 'customer'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register Agent
exports.registerAgent = async (req, res, next) => {
  try {
    const {
      first_name, last_name, email, password, phone,
      license_number, region, office_address,
      city, state, pincode, plan_ids
    } = req.body;

    // Check existing email
    const existing = await Agent.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const agent = await Agent.create({
      firstName: first_name,
      lastName: last_name,
      email: email.toLowerCase(),
      passwordHash: password_hash,
      phone,
      licenseNumber: license_number,
      region,
      officeAddress: office_address || '',
      city,
      state,
      pincode,
      coveragePlanIds: plan_ids || []
    });

    const token = generateToken({
      id: agent._id,
      email: agent.email,
      role: 'agent'
    });

    res.status(201).json({
      message: 'Agent registered successfully',
      token,
      user: {
        id: agent._id,
        first_name: agent.firstName,
        last_name: agent.lastName,
        email: agent.email,
        role: 'agent'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    let user;
    if (role === 'customer') {
      user = await Customer.findOne({ email: email.toLowerCase() });
    } else if (role === 'agent') {
      user = await Agent.findOne({ email: email.toLowerCase() });
    } else {
      return res.status(400).json({ message: 'Invalid role. Must be "customer" or "agent".' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Profile
exports.getMe = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let user;

    if (role === 'customer') {
      user = await Customer.findById(id).select('-passwordHash');
    } else {
      user = await Agent.findById(id).select('-passwordHash');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Map fields back to frontend expectations
    const mappedUser = {
      id: user._id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      profile_image: user.profileImage,
      created_at: user.createdAt,
      role
    };

    if (role === 'customer') {
      mappedUser.date_of_birth = user.dateOfBirth;
      mappedUser.gender = user.gender;
      mappedUser.address_line1 = user.address?.line1;
      mappedUser.address_line2 = user.address?.line2;
      mappedUser.city = user.address?.city;
      mappedUser.state = user.address?.state;
      mappedUser.pincode = user.address?.pincode;
      mappedUser.id_proof_type = user.idProof?.type;
      mappedUser.id_proof_number = user.idProof?.number;
    } else {
      mappedUser.license_number = user.licenseNumber;
      mappedUser.region = user.region;
      mappedUser.office_address = user.officeAddress;
      mappedUser.city = user.city;
      mappedUser.state = user.state;
      mappedUser.pincode = user.pincode;
      mappedUser.is_available = user.isAvailable;
      mappedUser.rating = user.rating;
      mappedUser.total_customers = user.totalCustomers;
    }

    res.json(mappedUser);
  } catch (error) {
    next(error);
  }
};
