// pages/Dashboard.js - Main dashboard with summary, charts, and transaction list

import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import MonthlyChart from '../components/charts/MonthlyChart';
import CategoryChart from '../components/charts/CategoryChart';

const Dashboard = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Date filter state
  const [filters, setFilters] = useState({ startDate: '', endDate: '', type: '' });

  // Fetch summary totals (no date filter applied so always shows overall balance)
  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get('/transactions/summary');
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary', err);
    }
  }, []);

  // Fetch transactions (with optional filters)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = filters.type;

      const { data } = await api.get('/transactions', { params });
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({ startDate: '', endDate: '', type: '' });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      alert('Failed to delete transaction');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchTransactions();
    fetchSummary();
  };

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>👋 Hello, {user?.name}!</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <div className="amount">{fmt(summary.totalIncome)}</div>
          </div>
          <div className="summary-card expense">
            <h3>Total Expense</h3>
            <div className="amount">{fmt(summary.totalExpense)}</div>
          </div>
          <div className="summary-card balance">
            <h3>Balance</h3>
            <div className="amount">{fmt(summary.balance)}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>📅 Monthly Overview</h3>
            <MonthlyChart transactions={transactions} />
          </div>
          <div className="chart-card">
            <h3>🗂️ Expenses by Category</h3>
            <CategoryChart transactions={transactions} />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="form-group">
            <label>From</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>To</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" className="form-control" value={filters.type} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <button className="btn btn-outline" onClick={handleClearFilters} style={{ alignSelf: 'flex-end' }}>
            Clear
          </button>
        </div>

        {/* Transaction List */}
        {loading ? (
          <div className="spinner" />
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
