import React, { useState, useEffect } from 'react';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';

const categoryColors = {
  health: 'bg-green-500',
  finance: 'bg-yellow-500',
  career: 'bg-blue-500',
  education: 'bg-purple-500',
  personal: 'bg-pink-500',
  other: 'bg-gray-400',
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', targetDate: '', category: 'other' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGoal(form);
      setForm({ title: '', description: '', targetDate: '', category: 'other' });
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (goal, newProgress) => {
    try {
      await updateGoal(goal._id, {
        progress: newProgress,
        status: newProgress >= 100 ? 'completed' : 'active',
      });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">🎯 Goals</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {goals.filter((g) => g.status === 'completed').length}/{goals.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3">
          <input
            type="text"
            placeholder="Goal title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
          />
          <div className="flex gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
            >
              {['health', 'finance', 'career', 'education', 'personal', 'other'].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
              {loading ? 'Saving…' : 'Save Goal'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        {goals.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No goals yet. Add one above!</p>
        )}
        {goals.map((goal) => (
          <div key={goal._id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${categoryColors[goal.category] || 'bg-gray-400'}`} />
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">{goal.title}</span>
                  {goal.status === 'completed' && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                      ✓ Done
                    </span>
                  )}
                </div>
                {goal.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-4">{goal.description}</p>
                )}
              </div>
              <button onClick={() => handleDelete(goal._id)} className="text-gray-400 hover:text-red-500 transition text-sm p-1">
                ✕
              </button>
            </div>
            <div className="ml-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={goal.progress}
                onChange={(e) => handleProgressUpdate(goal, parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;
