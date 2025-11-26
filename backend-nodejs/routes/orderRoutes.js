const express = require('express');
const { body } = require('express-validator');
const {
  getAllOrders,
  getDetailedOrder,
  getOrderedProducts,
  updateOrder,
  deleteOrder,
  placeOrder,
  updatePayment,
  getUserOrders
} = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const placeOrderValidation = [
  body('customer').isMongoId(),
  body('total_Amount').isFloat({ min: 0 }),
  body('products').isArray({ min: 1 })
];

// Public/Customer routes
router.post('/placeOrder', authenticateToken, placeOrderValidation, placeOrder);
router.get('/user/orders/:pk', authenticateToken, getUserOrders);

// Admin/Staff routes
router.get('/getAllorder', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), getAllOrders);
router.get('/getDetaildOrder/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), getDetailedOrder);
router.get('/orderdProducts/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), getOrderedProducts);
router.put('/update/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), updateOrder);
router.delete('/delete/:pk', authenticateToken, authorizeRoles('ADMIN'), deleteOrder);
router.put('/paymentUpdate/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), updatePayment);

module.exports = router;