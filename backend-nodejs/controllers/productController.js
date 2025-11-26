const { Product, Category } = require('../models/Product');
const { validationResult } = require('express-validator');

// Add new product
const addProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      product_Name, 
      product_Description, 
      category_Name, 
      product_Price, 
      product_Stock, 
      product_isSale 
    } = req.body;

    // Find or create category
    let category = await Category.findOne({ category_Name });
    if (!category) {
      category = new Category({ category_Name });
      await category.save();
    }

    // Handle image uploads
    const imageGallery = {};
    if (req.files) {
      imageGallery.image1 = req.files.image1 ? req.files.image1[0].filename : '';
      imageGallery.image2 = req.files.image2 ? req.files.image2[0].filename : '';
      imageGallery.image3 = req.files.image3 ? req.files.image3[0].filename : '';
      imageGallery.image4 = req.files.image4 ? req.files.image4[0].filename : '';
    }

    // Create product
    const product = new Product({
      product_Name,
      product_Description,
      product_category: category._id,
      product_Price: parseFloat(product_Price),
      product_Stock: parseInt(product_Stock),
      product_isSale: product_isSale || 'Yes',
      imageGallery
    });

    await product.save();
    
    // Populate category for response
    await product.populate('product_category');

    res.status(201).json(product);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error during product creation' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('product_category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed product
const getDetailedProduct = async (req, res) => {
  try {
    const { pk } = req.params;
    
    // Validate ObjectId format
    if (!pk.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    
    const product = await Product.findById(pk).populate('product_category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Get detailed product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { pk } = req.params;
    const { 
      product_Name, 
      product_Description, 
      category_Name, 
      product_Price, 
      product_Stock, 
      product_isSale,
      imageGallery_Id 
    } = req.body;

    const product = await Product.findById(pk);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create category
    let category = await Category.findOne({ category_Name });
    if (!category) {
      category = new Category({ category_Name });
      await category.save();
    }

    // Update product fields
    product.product_Name = product_Name;
    product.product_Description = product_Description;
    product.product_category = category._id;
    product.product_Price = parseFloat(product_Price);
    product.product_Stock = parseInt(product_Stock);
    product.product_isSale = product_isSale;
    product.updated_at = new Date();

    // Handle image updates
    if (req.files) {
      if (req.files.image1) product.imageGallery.image1 = req.files.image1[0].filename;
      if (req.files.image2) product.imageGallery.image2 = req.files.image2[0].filename;
      if (req.files.image3) product.imageGallery.image3 = req.files.image3[0].filename;
      if (req.files.image4) product.imageGallery.image4 = req.files.image4[0].filename;
    }

    await product.save();
    await product.populate('product_category');

    res.status(200).json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error during product update' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const product = await Product.findByIdAndDelete(pk);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(202).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error during product deletion' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getDetailedProduct,
  updateProduct,
  deleteProduct,
  getAllCategories
};