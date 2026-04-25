// routes/transactionRoutes.js - Transaction CRUD routes (all protected)

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiter: max 100 requests per IP per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(protect);
router.use(apiLimiter);

router.get('/summary', getSummary);
router.route('/').get(getTransactions).post(addTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
