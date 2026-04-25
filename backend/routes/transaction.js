const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route   POST api/transactions
// @desc    Add new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    const newTx = new Transaction({
      userId: req.user.id, // Linked to the logged-in user
      type, amount, category, date, note
    });
    const savedTx = await newTx.save();
    res.json(savedTx);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/transactions
// @desc    Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/transactions/:id
// @desc    Update a transaction for a user
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;

    const updatedTx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { type, amount, category, date, note },
      { new: true, runValidators: true }
    );

    if (!updatedTx) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    return res.json(updatedTx);
  } catch (err) {
    return res.status(500).send('Server Error');
  }
});

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction for a user
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTx = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedTx) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    return res.json({ msg: 'Transaction deleted successfully' });
  } catch (err) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;