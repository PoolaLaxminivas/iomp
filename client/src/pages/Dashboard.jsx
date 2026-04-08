import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Tasks from '../components/Tasks';
import Expenses from '../components/Expenses';
import Diary from '../components/Diary';
import Goals from '../components/Goals';
import Chatbot from '../components/Chatbot';

const TABS = [
  { id: 'tasks', label: '📋 Tasks' },
  { id: 'expenses', label: '💰 Expenses' },
  { id: 'diary', label: '📓 Diary' },
  { id: 'goals', label: '🎯 Goals' },
  { id: 'chat', label: '🤖 AI Chat' },
];

const Dashboard = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back{user ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-indigo-100 text-sm">
            Manage your life, track your progress, and grow every day.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Section */}
        <div>
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'expenses' && <Expenses />}
          {activeTab === 'diary' && <Diary />}
          {activeTab === 'goals' && <Goals />}
          {activeTab === 'chat' && <Chatbot />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
