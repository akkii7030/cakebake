const User = require('../models/User');
const { generateTokens } = require('../middleware/auth');
const { validationResult } = require('express-validator');

// Register user
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_Name, last_Name, email, password, phone_Number, type, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      first_Name,
      last_Name,
      email,
      password,
      phone_Number,
      type: type || 'CUSTOMER',
      address
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    res.status(201).json({
      message: 'Registration Successful',
      token: tokens,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        errors: { non_field_errors: ['Email or Password is not Valid'] }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(404).json({ 
        errors: { non_field_errors: ['Email or Password is not Valid'] }
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    res.status(200).json({
      message: 'Login Success',
      token: tokens,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user.toJSON());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific user profile
const getSpecificUserProfile = async (req, res) => {
  try {
    const { pk } = req.params;
    const user = await User.findById(pk);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.toJSON());
  } catch (error) {
    console.error('Get specific profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { pk } = req.params;
    const { address, ...userData } = req.body;

    const user = await User.findById(pk);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    Object.assign(user, userData);
    if (address) {
      user.address = address;
    }

    await user.save();

    res.status(200).json(user.toJSON());
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during update' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const user = await User.findByIdAndDelete(pk);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ type: 'CUSTOMER' });
    res.status(200).json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ type: { $ne: 'CUSTOMER' } });
    res.status(200).json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register staff
const registerStaff = async (req, res) => {
  try {
    const { address, password, ...userData } = req.body;

    // Create new staff user
    const user = new User({
      ...userData,
      password,
      address,
      type: userData.type || 'STAFF'
    });

    await user.save();

    res.status(200).json(user.toJSON());
  } catch (error) {
    console.error('Register staff error:', error);
    res.status(500).json({ message: 'Server error during staff registration' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getSpecificUserProfile,
  updateUserProfile,
  deleteUser,
  getAllCustomers,
  getAllStaff,
  registerStaff
};