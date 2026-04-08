const Goal = require('../models/Goal');
const { validationResult } = require('express-validator');

// @desc  Get all goals for user
// @route GET /api/goals
// @access Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a goal
// @route POST /api/goals
// @access Private
const createGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, description, targetDate, category } = req.body;
  try {
    const goal = await Goal.create({
      user: req.user.id,
      title,
      description,
      targetDate,
      category,
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a goal (progress, status, etc.)
// @route PUT /api/goals/:id
// @access Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await goal.deleteOne();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
