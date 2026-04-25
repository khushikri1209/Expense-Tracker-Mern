// components/TransactionList.js - Displays a list of transactions

import React from 'react';

// Format a date string to readable format
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format currency
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-list">
        <div className="transaction-list-header">
          <h3>Transactions</h3>
        </div>
        <div className="empty-state">
          <p>No transactions found. Add one to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list-header">
        <h3>Transactions ({transactions.length})</h3>
      </div>

      {transactions.map((t) => (
        <div key={t._id} className="transaction-item">
          <div className="transaction-info">
            <h4>
              {t.title}
              <span className={`transaction-badge badge-${t.type}`}>{t.type}</span>
            </h4>
            <span>
              {t.category} &bull; {formatDate(t.date)}
              {t.note && ` • ${t.note}`}
            </span>
          </div>

          <div className="transaction-right">
            <span className={`transaction-amount amount-${t.type}`}>
              {t.type === 'income' ? '+' : '-'} {fmt(t.amount)}
            </span>
            <div className="transaction-actions">
              <button className="btn btn-edit" onClick={() => onEdit(t)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(t._id)}>
                Del
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
