const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payment_Status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  payment_Type: { type: String, default: 'Cash On Delivery' },
  amount_Paid: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
  order_Status: {
    type: String,
    enum: [
      'Order Pending',
      'Order Placed',
      'Under Package',
      'On The way to deliver',
      'Delivered',
      'Canceled'
    ],
    default: 'Order Placed'
  },
  order_Placement_Date: { type: Date, default: Date.now },
  order_Placement_Time: { type: Date, default: Date.now },
  order_Delivery_Date: { type: Date, default: Date.now },
  order_Delivery_Time: { type: String, default: '2PM - 4PM' },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  address: {
    city: { type: String, required: true },
    area: { type: String, required: true },
    street_Number: { type: Number, required: true },
    house_Number: { type: Number, required: true }
  },
  payment: paymentSchema,
  delivery_Charges: { type: Number, default: 50 },
  total_Amount: { type: Number, required: true, min: 0 },
  note: { type: String, maxlength: 1000, default: '' }
}, {
  timestamps: true
});

const orderedProductSchema = new mongoose.Schema({
  product_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  order_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  quantity: { type: Number, required: true, min: 1, default: 1 }
});

// Ensure unique product per order
orderedProductSchema.index({ product_Id: 1, order_Id: 1 }, { unique: true });

const Order = mongoose.model('Order', orderSchema);
const OrderedProduct = mongoose.model('OrderedProduct', orderedProductSchema);

module.exports = { Order, OrderedProduct };