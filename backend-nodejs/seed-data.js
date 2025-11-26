const mongoose = require('mongoose');
const User = require('./models/User');
const { Category, Product } = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bake_take_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = new User({
      first_Name: 'Akhilesh',
      last_Name: 'Admin',
      email: 'akhilesh@gmail.com',
      password: 'Akhilesh',
      phone_Number: '9876543210',
      type: 'ADMIN',
      is_staff: true,
      is_active: true,
      address: {
        city: 'Karachi',
        area: 'Admin Area',
        street_Number: 1,
        house_Number: 1
      }
    });
    await adminUser.save();

    // Create categories
    const categories = [
      { category_Name: 'Birthday Cakes' },
      { category_Name: 'Wedding Cakes' },
      { category_Name: 'Cupcakes' },
      { category_Name: 'Pastries' }
    ];

    const savedCategories = [];
    for (const cat of categories) {
      const category = new Category(cat);
      await category.save();
      savedCategories.push(category);
    }

    // Create sample products
    const products = [
      {
        product_Name: 'Chocolate Birthday Cake',
        product_Description: 'Delicious chocolate cake perfect for birthdays',
        product_category: savedCategories[0]._id,
        product_Price: 2500,
        product_Stock: 10,
        product_isSale: 'No',
        imageGallery: {
          image1: '/assets/img/products/product_01.jpg',
          image2: '/assets/img/products/product_11.jpg',
          image3: '/assets/img/products/product_12.jpg',
          image4: '/assets/img/products/product_13.jpg'
        }
      },
      {
        product_Name: 'Vanilla Wedding Cake',
        product_Description: 'Elegant vanilla cake for special occasions',
        product_category: savedCategories[1]._id,
        product_Price: 5000,
        product_Stock: 5,
        product_isSale: 'Yes',
        imageGallery: {
          image1: '/assets/img/products/product_21.JPG',
          image2: '/assets/img/products/product_22.JPG',
          image3: '/assets/img/products/product_23.JPG',
          image4: '/assets/img/products/product_24.JPG'
        }
      },
      {
        product_Name: 'Strawberry Cupcakes',
        product_Description: 'Fresh strawberry cupcakes with cream frosting',
        product_category: savedCategories[2]._id,
        product_Price: 150,
        product_Stock: 24,
        product_isSale: 'No',
        imageGallery: {
          image1: '/assets/img/products/product_31.jpg',
          image2: '/assets/img/products/product_32.jpg',
          image3: '/assets/img/products/product_33.jpg',
          image4: '/assets/img/products/product_34.jpg'
        }
      }
    ];

    for (const prod of products) {
      const product = new Product(prod);
      await product.save();
    }

    console.log('Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email: akhilesh@gmail.com');
    console.log('Password: Akhilesh');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();