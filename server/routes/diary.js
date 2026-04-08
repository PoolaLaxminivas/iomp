const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getEntries, createEntry, deleteEntry } = require('../controllers/diaryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getEntries);
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  createEntry
);
router.delete('/:id', deleteEntry);

module.exports = router;
