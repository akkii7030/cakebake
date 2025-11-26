const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_Name: { type: String, required: true, maxlength: 30 }
});

const imageGallerySchema = new mongoose.Schema({
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  image4: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  product_Name: { type: String, required: true, maxlength: 50 },
  product_Description: { type: String, required: true, maxlength: 700 },
  product_category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  product_Price: { type: Number, required: true, min: 0 },
  product_Stock: { type: Number, required: true, min: 0 },
  product_isSale: { type: String, default: 'Yes', enum: ['Yes', 'No'] },
  imageGallery: imageGallerySchema,
  added_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  customer_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  delivery_Charges: { type: Number, required: true, default: 50 },
  total_Amount: { type: Number, required: true, min: 0 }
});

const productInCartSchema = new mongoose.Schema({
  product_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  cart_Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart', 
    required: true 
  },
  quantity: { type: Number, required: true, min: 1 }
});

// Ensure unique product per cart
productInCartSchema.index({ product_Id: 1, cart_Id: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const ProductInCart = mongoose.model('ProductInCart', productInCartSchema);

module.exports = { Category, Product, Cart, ProductInCart };