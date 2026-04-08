const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // all task routes require authentication

router.get('/', getTasks);
router.post('/', [body('title').notEmpty().withMessage('Task title is required')], createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
