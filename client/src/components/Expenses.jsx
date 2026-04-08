import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getExpenses, addExpense, deleteExpense, getAnalytics } from '../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
const CATEGORIES = ['food', 'transport', 'entertainment', 'health', 'utilities', 'shopping', 'other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [analytics, setAnalytics] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: 'other', notes: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [expRes, anaRes] = await Promise.all([getExpenses(), getAnalytics()]);
      setExpenses(expRes.data.expenses);
      setTotal(expRes.data.total);
      setAnalytics(anaRes.data.map((a) => ({ name: a._id, value: a.total })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense({ ...form, amount: parseFloat(form.amount) });
      setForm({ title: '', amount: '', category: 'other', notes: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">💰 Expenses</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-bold text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Expense
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Amount *"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min="0"
              step="0.01"
              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
              {loading ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
        {expenses.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No expenses yet.</p>
        )}
        {expenses.map((exp) => (
          <div key={exp._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
            <div>
              <p className="font-medium text-sm text-gray-800 dark:text-white">{exp.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {exp.category} · {new Date(exp.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-gray-800 dark:text-white">${exp.amount.toFixed(2)}</span>
              <button onClick={() => handleDelete(exp._id)} className="text-gray-400 hover:text-red-500 transition text-sm">✕</button>
            </div>
          </div>
        ))}
      </div>

      {analytics.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Spending by Category</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={analytics} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {analytics.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Expenses;
