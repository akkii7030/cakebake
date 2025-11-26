const express = require('express');
const { body } = require('express-validator');
const {
  addProduct,
  getAllProducts,
  getDetailedProduct,
  updateProduct,
  deleteProduct,
  getAllCategories
} = require('../controllers/productController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadProductImages, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const productValidation = [
  body('product_Name').trim().isLength({ min: 1, max: 50 }),
  body('product_Description').trim().isLength({ min: 1, max: 700 }),
  body('product_Price').isFloat({ min: 0 }),
  body('product_Stock').isInt({ min: 0 }),
  body('category_Name').trim().isLength({ min: 1 })
];

// Public routes
router.get('/getAllproduct', getAllProducts);
router.get('/getDetailedProduct/:pk', getDetailedProduct);
router.get('/categories', getAllCategories);

// Protected routes (Admin/Staff only)
router.post('/add', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'STAFF'),
  uploadProductImages,
  handleUploadError,
  productValidation,
  addProduct
);

router.put('/update/:pk', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'STAFF'),
  uploadProductImages,
  handleUploadError,
  updateProduct
);

router.delete('/delete/:pk', 
  authenticateToken, 
  authorizeRoles('ADMIN', 'STAFF'),
  deleteProduct
);

module.exports = router;