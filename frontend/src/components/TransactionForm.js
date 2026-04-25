// components/TransactionForm.js - Modal form for adding or editing a transaction

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// Category options grouped by type
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other Income'];
const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Entertainment',
  'Health', 'Education', 'Shopping', 'Utilities', 'Other',
];

// Format a Date object to the value required by <input type="date">
const toDateInputValue = (dateStr) => {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  return new Date(dateStr).toISOString().slice(0, 10);
};

const TransactionForm = ({ transaction, onClose, onSuccess }) => {
  const isEditing = Boolean(transaction);

  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: toDateInputValue(),
    note: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill form when editing an existing transaction
  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: toDateInputValue(transaction.date),
        note: transaction.note || '',
      });
    }
  }, [transaction]);

  // When type changes, reset category to first valid option
  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      return setError('Enter a valid positive amount');

    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (isEditing) {
        await api.put(`/transactions/${transaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Prevent click on modal content from closing it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Income / Expense toggle */}
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${form.type === 'income' ? 'active-income' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              ⬆ Income
            </button>
            <button
              type="button"
              className={`type-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              ⬇ Expense
            </button>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Grocery shopping"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" className="form-control" value={form.category} onChange={handleChange}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <input
              type="text"
              name="note"
              className="form-control"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
