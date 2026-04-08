import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Tasks
export const getTasks = () => API.get('/tasks');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// Expenses
export const getExpenses = () => API.get('/expenses');
export const addExpense = (data) => API.post('/expenses', data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getAnalytics = () => API.get('/expenses/analytics');

// Diary
export const getDiaryEntries = () => API.get('/diary');
export const createDiaryEntry = (data) => API.post('/diary', data);
export const deleteDiaryEntry = (id) => API.delete(`/diary/${id}`);

// Goals
export const getGoals = () => API.get('/goals');
export const createGoal = (data) => API.post('/goals', data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// Chat
export const sendChat = (message) => API.post('/chat', { message });
