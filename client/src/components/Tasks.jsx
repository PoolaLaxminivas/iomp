import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask(form);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (task) => {
    try {
      await updateTask(task._id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">📋 Tasks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{completed}/{tasks.length} completed</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3">
          <input
            type="text"
            placeholder="Task title *"
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
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
              {loading ? 'Saving…' : 'Save Task'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {tasks.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No tasks yet. Add one above!</p>
        )}
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`flex items-start gap-3 p-3 rounded-xl border ${
              task.status === 'completed'
                ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 opacity-70'
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}
          >
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => toggleStatus(task)}
              className="mt-1 accent-indigo-600 cursor-pointer w-4 h-4"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{task.description}</p>
              )}
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => handleDelete(task._id)} className="text-gray-400 hover:text-red-500 transition text-sm p-1">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
