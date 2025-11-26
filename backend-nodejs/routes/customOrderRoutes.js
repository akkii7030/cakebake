const express = require('express');
const { body } = require('express-validator');
const CustomOrder = require('../models/CustomOrder');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const customOrderValidation = [
  body('cake_size').isIn(['Small', 'Medium', 'Large', 'Extra Large']),
  body('cake_flavor').trim().isLength({ min: 1 }),
  body('cake_design').trim().isLength({ min: 1 }),
  body('estimated_price').isFloat({ min: 0 }),
  body('delivery_date').isISO8601()
];

// Create custom order
const createCustomOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      cake_size,
      cake_flavor,
      cake_design,
      special_instructions,
      estimated_price,
      delivery_date
    } = req.body;

    const customOrder = new CustomOrder({
      customer: req.user._id,
      cake_size,
      cake_flavor,
      cake_design,
      special_instructions,
      estimated_price,
      delivery_date,
      images: req.file ? [req.file.filename] : []
    });

    await customOrder.save();
    await customOrder.populate('customer', 'first_Name last_Name email');

    res.status(201).json(customOrder);
  } catch (error) {
    console.error('Create custom order error:', error);
    res.status(500).json({ message: 'Server error during custom order creation' });
  }
};

// Get all custom orders
const getAllCustomOrders = async (req, res) => {
  try {
    const customOrders = await CustomOrder.find()
      .populate('customer', 'first_Name last_Name email phone_Number')
      .sort({ createdAt: -1 });
    
    res.status(200).json(customOrders);
  } catch (error) {
    console.error('Get custom orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get custom order details
const getCustomOrderDetails = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const customOrder = await CustomOrder.findById(pk)
      .populate('customer', 'first_Name last_Name email phone_Number');
    
    if (!customOrder) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    res.status(200).json(customOrder);
  } catch (error) {
    console.error('Get custom order details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update custom order status
const updateCustomOrderStatus = async (req, res) => {
  try {
    const { pk } = req.params;
    const { status, estimated_price } = req.body;

    const customOrder = await CustomOrder.findById(pk);
    if (!customOrder) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    if (status) customOrder.status = status;
    if (estimated_price) customOrder.estimated_price = estimated_price;

    await customOrder.save();

    res.status(200).json(customOrder);
  } catch (error) {
    console.error('Update custom order error:', error);
    res.status(500).json({ message: 'Server error during custom order update' });
  }
};

// Get user's custom orders
const getUserCustomOrders = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const customOrders = await CustomOrder.find({ customer: pk })
      .sort({ createdAt: -1 });
    
    res.status(200).json(customOrders);
  } catch (error) {
    console.error('Get user custom orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete custom order
const deleteCustomOrder = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const customOrder = await CustomOrder.findByIdAndDelete(pk);
    if (!customOrder) {
      return res.status(404).json({ message: 'Custom order not found' });
    }

    res.status(200).json({ message: 'Custom order deleted successfully' });
  } catch (error) {
    console.error('Delete custom order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes
router.post('/create', 
  authenticateToken, 
  uploadSingle, 
  handleUploadError, 
  customOrderValidation, 
  createCustomOrder
);

// Legacy route for compatibility
router.post('/post', 
  authenticateToken, 
  uploadSingle, 
  handleUploadError, 
  customOrderValidation, 
  createCustomOrder
);

router.get('/all', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'STAFF'), 
  getAllCustomOrders
);

router.get('/details/:pk', 
  authenticateToken, 
  getCustomOrderDetails
);

router.put('/update/:pk', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'STAFF'), 
  updateCustomOrderStatus
);

router.get('/user/:pk', 
  authenticateToken, 
  getUserCustomOrders
);

router.delete('/delete/:pk', 
  authenticateToken, 
  authorizeRoles('ADMIN'), 
  deleteCustomOrder
);

module.exports = router;