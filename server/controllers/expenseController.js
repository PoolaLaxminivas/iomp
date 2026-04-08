const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const { validationResult } = require('express-validator');

// @desc  Get all expenses + total for user
// @route GET /api/expenses
// @access Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ expenses, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add an expense
// @route POST /api/expenses
// @access Private
const addExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, amount, category, date, notes } = req.body;
  try {
    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      date,
      notes,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete an expense
// @route DELETE /api/expenses/:id
// @access Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get spending grouped by category
// @route GET /api/expenses/analytics
// @access Private
const getAnalytics = async (req, res) => {
  try {
    const analytics = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense, getAnalytics };
