const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const { Category, Product } = require('./models/Product');
const { Order, OrderedProduct } = require('./models/Order');
const Feedback = require('./models/Feedback');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bake_take_db');

// Connect to SQLite
const db = new sqlite3.Database('../backend/db.sqlite3');

const migrateData = async () => {
  try {
    console.log('Starting data migration...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await OrderedProduct.deleteMany({});
    await Feedback.deleteMany({});

    // Migrate Categories
    console.log('Migrating categories...');
    const categories = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM product_category", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const categoryMap = {};
    for (const cat of categories) {
      const newCategory = new Category({
        category_Name: cat.category_Name
      });
      await newCategory.save();
      categoryMap[cat.catrgort_id] = newCategory._id;
    }

    // Migrate Users
    console.log('Migrating users...');
    const users = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM users_user", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const userMap = {};
    for (const user of users) {
      // Get address if exists
      let address = null;
      if (user.address_id) {
        const addressData = await new Promise((resolve, reject) => {
          db.get("SELECT * FROM order_address WHERE address_Id = ?", [user.address_id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
        
        if (addressData) {
          address = {
            city: addressData.city,
            area: addressData.area,
            street_Number: addressData.street_Number,
            house_Number: addressData.house_Number
          };
        }
      }

      const newUser = new User({
        first_Name: user.first_Name,
        last_Name: user.last_Name,
        email: user.email,
        password: user.password, // Already hashed in Django
        phone_Number: user.phone_Number,
        type: user.type,
        address: address,
        is_staff: user.is_staff,
        is_active: user.is_active,
        data_Joined: user.data_Joind ? new Date(user.data_Joind) : new Date(),
        last_login: user.last_login ? new Date(user.last_login) : new Date()
      });

      // Skip password hashing since it's already hashed
      newUser.save({ validateBeforeSave: false });
      userMap[user.id] = newUser._id;
    }

    // Migrate Image Galleries and Products
    console.log('Migrating products...');
    const imageGalleries = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM product_image_gallery", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const products = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM product_product", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const productMap = {};
    for (const product of products) {
      // Find corresponding image gallery
      const imageGallery = imageGalleries.find(img => img.id === product.imageGallery_id);
      
      const newProduct = new Product({
        product_Name: product.product_Name,
        product_Description: product.product_Description,
        product_category: categoryMap[product.product_category_id],
        product_Price: product.product_Price,
        product_Stock: product.product_Stock,
        product_isSale: product.product_isSale,
        imageGallery: imageGallery ? {
          image1: imageGallery.image1,
          image2: imageGallery.image2,
          image3: imageGallery.image3,
          image4: imageGallery.image4
        } : {},
        added_at: product.added_at ? new Date(product.added_at) : new Date(),
        updated_at: product.updated_at ? new Date(product.updated_at) : new Date()
      });

      await newProduct.save();
      productMap[product.product_Id] = newProduct._id;
    }

    // Migrate Orders
    console.log('Migrating orders...');
    const orders = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM order_order", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const payments = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM order_payment", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const addresses = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM order_address", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const orderMap = {};
    for (const order of orders) {
      const payment = payments.find(p => p.payment_Id === order.payment_id);
      const address = addresses.find(a => a.address_Id === order.address_id);

      // Helper function to safely parse dates
      const safeDate = (dateStr) => {
        if (!dateStr) return new Date();
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date() : date;
      };

      const newOrder = new Order({
        order_Status: order.order_Status,
        order_Placement_Date: safeDate(order.order_Placment_Date),
        order_Placement_Time: safeDate(order.order_Placment_Time),
        order_Delivery_Date: safeDate(order.order_Delivery_Date),
        order_Delivery_Time: order.order_Delivery_Time || '2PM - 4PM',
        customer: userMap[order.customer_id],
        address: address ? {
          city: address.city,
          area: address.area,
          street_Number: address.street_Number,
          house_Number: address.house_Number
        } : {},
        payment: payment ? {
          payment_Status: payment.payment_Status,
          payment_Type: payment.payment_Type,
          amount_Paid: payment.amount_Paid
        } : {},
        delivery_Charges: order.delivery_Charges,
        total_Amount: order.total_Amount,
        note: order.note || ''
      });

      await newOrder.save();
      orderMap[order.order_Id] = newOrder._id;
    }

    // Migrate Ordered Products
    console.log('Migrating ordered products...');
    const orderedProducts = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM order_ordered_product", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const orderedProduct of orderedProducts) {
      const newOrderedProduct = new OrderedProduct({
        product_Id: productMap[orderedProduct.product_Id_id],
        order_Id: orderMap[orderedProduct.order_Id_id],
        quantity: orderedProduct.quantity
      });

      await newOrderedProduct.save();
    }

    // Migrate Feedback (if exists)
    console.log('Migrating feedback...');
    try {
      const feedbacks = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM feedback_feedback", (err, rows) => {
          if (err) {
            if (err.message.includes('no such table')) {
              resolve([]);
            } else {
              reject(err);
            }
          } else {
            resolve(rows);
          }
        });
      });

      for (const feedback of feedbacks) {
        const newFeedback = new Feedback({
          customer: userMap[feedback.customer_id],
          product: productMap[feedback.product_id],
          rating: feedback.rating,
          comment: feedback.comment,
          is_approved: feedback.is_approved || false
        });

        await newFeedback.save();
      }
    } catch (error) {
      console.log('Feedback table not found, skipping...');
    }

    console.log('Migration completed successfully!');
    console.log(`Migrated:
    - ${Object.keys(categoryMap).length} categories
    - ${Object.keys(userMap).length} users
    - ${Object.keys(productMap).length} products
    - ${Object.keys(orderMap).length} orders
    - ${orderedProducts.length} ordered products`);

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    db.close();
    mongoose.connection.close();
  }
};

// Run migration
migrateData();