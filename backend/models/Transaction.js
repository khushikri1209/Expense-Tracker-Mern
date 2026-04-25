// models/Transaction.js - Mongoose schema for an income/expense transaction

const mongoose = require('mongoose');

// Predefined expense categories
const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Utilities',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    // Each transaction belongs to one user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    // Either 'income' or 'expense'
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      enum: [...EXPENSE_CATEGORIES, 'Salary', 'Freelance', 'Investment', 'Other Income'],
      default: 'Other',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
