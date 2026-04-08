const Diary = require('../models/Diary');
const { validationResult } = require('express-validator');

// @desc  Get all diary entries for user
// @route GET /api/diary
// @access Private
const getEntries = async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a diary entry
// @route POST /api/diary
// @access Private
const createEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, content, mood, tags } = req.body;
  try {
    const entry = await Diary.create({ user: req.user.id, title, content, mood, tags });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a diary entry
// @route DELETE /api/diary/:id
// @access Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await entry.deleteOne();
    res.json({ message: 'Entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEntries, createEntry, deleteEntry };
