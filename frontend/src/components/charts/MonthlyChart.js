// components/charts/MonthlyChart.js - Bar chart of income vs expense per month

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MonthlyChart = ({ transactions }) => {
  // Aggregate income and expense totals by month for the current year
  const { incomeData, expenseData, labels } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const income = Array(12).fill(0);
    const expense = Array(12).fill(0);

    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() !== currentYear) return;
      const m = d.getMonth(); // 0-11
      if (t.type === 'income') income[m] += t.amount;
      else expense[m] += t.amount;
    });

    return { incomeData: income, expenseData: expense, labels: MONTHS };
  }, [transactions]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthlyChart;
