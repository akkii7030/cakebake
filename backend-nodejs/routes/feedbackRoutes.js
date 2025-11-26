const express = require('express');
const { body } = require('express-validator');
const Feedback = require('../models/Feedback');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const feedbackValidation = [
  body('product').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 1, max: 500 })
];

// Add feedback
const addFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product, rating, comment } = req.body;

    const feedback = new Feedback({
      customer: req.user._id,
      product,
      rating,
      comment
    });

    await feedback.save();
    await feedback.populate('customer', 'first_Name last_Name');
    await feedback.populate('product', 'product_Name');

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error during feedback creation' });
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('customer', 'first_Name last_Name')
      .populate('product', 'product_Name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback for a product
const getProductFeedback = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const feedback = await Feedback.find({ 
      product: productId, 
      is_approved: true 
    })
      .populate('customer', 'first_Name last_Name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Get product feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve feedback
const approveFeedback = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const feedback = await Feedback.findByIdAndUpdate(
      pk,
      { is_approved: true },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { pk } = req.params;
    
    const feedback = await Feedback.findByIdAndDelete(pk);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Placeholder functions for questions (since no Question model exists)
const getAllQuestions = async (req, res) => {
  res.status(200).json([]);
};

const addQuestion = async (req, res) => {
  res.status(201).json({ message: 'Question functionality not implemented' });
};

const deleteQuestion = async (req, res) => {
  res.status(200).json({ message: 'Question deleted' });
};

// Routes
router.post('/add', authenticateToken, feedbackValidation, addFeedback);
router.get('/all', getAllFeedback);
router.get('/product/:productId', getProductFeedback);
router.put('/approve/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), approveFeedback);
router.delete('/delete/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), deleteFeedback);

// Question routes (placeholder)
router.get('/questions', getAllQuestions);
router.post('/question/add', authenticateToken, addQuestion);
router.delete('/question/delete/:pk', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), deleteQuestion);

module.exports = router;