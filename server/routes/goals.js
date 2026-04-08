const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getGoals);
router.post('/', [body('title').notEmpty().withMessage('Goal title is required')], createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
