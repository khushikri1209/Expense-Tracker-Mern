// controllers/transactionController.js - CRUD operations for transactions

const Transaction = require('../models/Transaction');

// Helper: validate that a value is a non-empty string
const isString = (v) => typeof v === 'string' && v.trim().length > 0;

// @desc   Get all transactions for the logged-in user (with optional date filter)
// @route  GET /api/transactions
// @access Private
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    // Build filter object - always filter by user
    const filter = { user: req.user._id };

    // Optional: filter by transaction type (income/expense)
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    // Optional: date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        // Include the entire end date by setting time to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add a new transaction
// @route  POST /api/transactions
// @access Private
const addTransaction = async (req, res) => {
  const { title, amount, type, category, date, note } = req.body;

  // Validate required string fields to guard against object injection
  if (!isString(title) || !isString(type)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      title: String(title).trim(),
      amount,
      type,
      category,
      date: date || Date.now(),
      note: note ? String(note).trim() : '',
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update an existing transaction
// @route  PUT /api/transactions/:id
// @access Private
const updateTransaction = async (req, res) => {
  try {
    // Coerce id to string to avoid object injection
    const id = String(req.params.id);
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure the transaction belongs to the requesting user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete a transaction
// @route  DELETE /api/transactions/:id
// @access Private
const deleteTransaction = async (req, res) => {
  try {
    // Coerce id to string to avoid object injection
    const id = String(req.params.id);
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure the transaction belongs to the requesting user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get summary stats: total income, expense, balance
// @route  GET /api/transactions/summary
// @access Private
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
