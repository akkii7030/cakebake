const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const { Category, Product } = require('./models/Product');
const { Order, OrderedProduct } = require('./models/Order');
const Feedback = require('./models/Feedback');

const verifyMigration = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bake_take_db');
    console.log('Connected to MongoDB');

    // Count documents in each collection
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const orderedProductCount = await OrderedProduct.countDocuments();
    const feedbackCount = await Feedback.countDocuments();

    console.log('\n=== Migration Verification ===');
    console.log(`Users: ${userCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);
    console.log(`Ordered Products: ${orderedProductCount}`);
    console.log(`Feedback: ${feedbackCount}`);

    // Sample data verification
    console.log('\n=== Sample Data ===');
    
    const sampleUser = await User.findOne().select('first_Name last_Name email type');
    console.log('Sample User:', sampleUser);

    const sampleCategory = await Category.findOne();
    console.log('Sample Category:', sampleCategory);

    const sampleProduct = await Product.findOne().populate('product_category');
    console.log('Sample Product:', {
      name: sampleProduct?.product_Name,
      price: sampleProduct?.product_Price,
      category: sampleProduct?.product_category?.category_Name
    });

    const sampleOrder = await Order.findOne().populate('customer');
    console.log('Sample Order:', {
      status: sampleOrder?.order_Status,
      customer: sampleOrder?.customer?.first_Name + ' ' + sampleOrder?.customer?.last_Name,
      total: sampleOrder?.total_Amount
    });

    console.log('\n✅ Migration verification completed successfully!');

  } catch (error) {
    console.error('Verification error:', error);
  } finally {
    mongoose.connection.close();
  }
};

verifyMigration();