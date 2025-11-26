const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  cake_size: { 
    type: String, 
    required: true,
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  cake_flavor: { 
    type: String, 
    required: true 
  },
  cake_design: { 
    type: String, 
    required: true 
  },
  special_instructions: { 
    type: String, 
    maxlength: 1000 
  },
  estimated_price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: {
    type: String,
    enum: [
      'Pending Review',
      'In Progress',
      'Ready for Pickup',
      'Completed',
      'Cancelled'
    ],
    default: 'Pending Review'
  },
  delivery_date: { 
    type: Date, 
    required: true 
  },
  images: [{
    type: String // URLs to uploaded design images
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);