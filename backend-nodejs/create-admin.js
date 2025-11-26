const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bake_take_db');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'akhilesh@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      first_Name: 'Akhilesh',
      last_Name: 'Admin',
      email: 'akhilesh@gmail.com',
      password: 'Akhilesh',
      phone_Number: '03001234567',
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
    console.log('Admin user created successfully!');
    console.log('Email: akhilesh@gmail.com');
    console.log('Password: Akhilesh');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();