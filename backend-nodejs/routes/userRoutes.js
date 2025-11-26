const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getSpecificUserProfile,
  updateUserProfile,
  deleteUser,
  getAllCustomers,
  getAllStaff,
  registerStaff
} = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_Name').trim().isLength({ min: 1 }),
  body('last_Name').trim().isLength({ min: 1 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.get('/Uprofile/:pk', authenticateToken, getSpecificUserProfile);
router.put('/update/:pk', authenticateToken, updateUserProfile);
router.delete('/delete/:pk', authenticateToken, authorizeRoles('ADMIN'), deleteUser);

// Admin routes
router.get('/getAllcustomers', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), getAllCustomers);
router.get('/getAllstaff', authenticateToken, authorizeRoles('ADMIN'), getAllStaff);
router.post('/registerStaff', authenticateToken, authorizeRoles('ADMIN'), registerStaff);

module.exports = router;