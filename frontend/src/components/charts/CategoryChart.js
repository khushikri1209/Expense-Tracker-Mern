// components/charts/CategoryChart.js - Doughnut chart of expenses by category

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#4f46e5', '#10b981', '#ef4444', '#f59e0b',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

const CategoryChart = ({ transactions }) => {
  // Aggregate expense amounts grouped by category
  const { labels, amounts } = useMemo(() => {
    const categoryMap = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

    return {
      labels: Object.keys(categoryMap),
      amounts: Object.values(categoryMap),
    };
  }, [transactions]);

  if (labels.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
        No expense data to display
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 12, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toFixed(2)}`,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default CategoryChart;
