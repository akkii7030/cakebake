const { Order, OrderedProduct } = require('../models/Order');
const { Product } = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'first_Name last_Name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed order
const getDetailedOrder = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const order = await Order.findById(pk)
      .populate('customer', 'first_Name last_Name email phone_Number');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get detailed order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get ordered products for an order
const getOrderedProducts = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const orderedProducts = await OrderedProduct.find({ order_Id: pk })
      .populate('product_Id', 'product_Name product_Price imageGallery');
    
    res.status(200).json(orderedProducts);
  } catch (error) {
    console.error('Get ordered products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const { pk } = req.params;
    const { order_Status, ...updateData } = req.body;

    const order = await Order.findById(pk);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update payment status if order is delivered
    if (order_Status === 'Delivered') {
      order.payment.amount_Paid = order.total_Amount;
      order.payment.payment_Status = 'Paid';
    }

    // Update order fields
    Object.assign(order, updateData);
    order.order_Status = order_Status;

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error during order update' });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { pk } = req.params;
    
    // Delete ordered products first
    await OrderedProduct.deleteMany({ order_Id: pk });
    
    // Delete order
    const order = await Order.findByIdAndDelete(pk);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(202).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error during order deletion' });
  }
};

// Place new order
const placeOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      customer, 
      address, 
      payment, 
      phone_Number, 
      products, 
      delivery_Charges, 
      total_Amount, 
      note,
      order_Delivery_Date,
      order_Delivery_Time
    } = req.body;

    // Update user phone and address
    const user = await User.findById(customer);
    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (phone_Number) user.phone_Number = phone_Number;
    if (address) user.address = address;
    await user.save();

    // Create order
    const order = new Order({
      customer,
      address,
      payment,
      delivery_Charges: delivery_Charges || 50,
      total_Amount,
      note: note || '',
      order_Delivery_Date: order_Delivery_Date || new Date(),
      order_Delivery_Time: order_Delivery_Time || '2PM - 4PM'
    });

    await order.save();

    // Create ordered products (skip if products don't exist in DB for demo)
    for (const productData of products) {
      try {
        const product = await Product.findById(productData.id);
        if (product) {
          await OrderedProduct.create({
            product_Id: product._id,
            order_Id: order._id,
            quantity: productData.quantity
          });

          // Update product stock
          product.product_Stock = Math.max(0, product.product_Stock - productData.quantity);
          await product.save();
        }
      } catch (error) {
        // Skip invalid product IDs for demo purposes
        console.log(`Skipping invalid product ID: ${productData.id}`);
      }
    }

    // Populate order for response
    await order.populate('customer', 'first_Name last_Name email');

    res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error during order placement' });
  }
};

// Update payment
const updatePayment = async (req, res) => {
  try {
    const { pk } = req.params;
    const { amount_Paid, payment_Status } = req.body;

    const order = await Order.findById(pk);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.payment.amount_Paid = amount_Paid;
    order.payment.payment_Status = payment_Status;

    await order.save();

    res.status(200).json(order.payment);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error during payment update' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const orders = await Order.find({ customer: pk })
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllOrders,
  getDetailedOrder,
  getOrderedProducts,
  updateOrder,
  deleteOrder,
  placeOrder,
  updatePayment,
  getUserOrders
};