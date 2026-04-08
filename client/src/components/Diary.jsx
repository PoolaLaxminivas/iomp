import React, { useState, useEffect } from 'react';
import { getDiaryEntries, createDiaryEntry, deleteDiaryEntry } from '../services/api';

const moodEmoji = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  excited: '🎉',
  anxious: '😰',
  grateful: '🙏',
};

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', mood: 'neutral', tags: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await getDiaryEntries();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await createDiaryEntry(payload);
      setForm({ title: '', content: '', mood: 'neutral', tags: '' });
      setShowForm(false);
      fetchEntries();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiaryEntry(id);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">📓 Diary</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + New Entry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3">
          <input
            type="text"
            placeholder="Entry title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="What's on your mind? *"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex gap-3">
            <select
              value={form.mood}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
            >
              {Object.keys(moodEmoji).map((m) => (
                <option key={m} value={m}>{moodEmoji[m]} {m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-600 dark:text-white outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
              {loading ? 'Saving…' : 'Save Entry'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {entries.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No diary entries yet.</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
            onClick={() => setExpanded(expanded === entry._id ? null : entry._id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{moodEmoji[entry.mood]}</span>
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">{entry.title}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(entry._id); }}
                className="text-gray-400 hover:text-red-500 transition text-sm p-1"
              >
                ✕
              </button>
            </div>
            {expanded === entry._id && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {entry.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;
