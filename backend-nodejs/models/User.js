const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  area: { type: String, required: true },
  street_Number: { type: Number, required: true },
  house_Number: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  first_Name: { type: String, required: true, maxlength: 50 },
  last_Name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 200 },
  password: { type: String, required: true },
  phone_Number: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /^((\+91)?(0091)?(91)?(0)?)?[6-9][0-9]{9}$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  type: {
    type: String,
    enum: ['ADMIN', 'CUSTOMER', 'STAFF', 'DELIVER_BOY'],
    default: 'CUSTOMER'
  },
  address: addressSchema,
  is_staff: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  data_Joined: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);