const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getExpenses, addExpense, deleteExpense, getAnalytics } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getExpenses);
router.get('/analytics', getAnalytics);
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  addExpense
);
router.delete('/:id', deleteExpense);

module.exports = router;
