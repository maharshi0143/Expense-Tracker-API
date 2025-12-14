const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');

router.get('/summary/by-category', controller.getSummaryByCategory);
router.get('/summary/monthly', controller.getMonthlySummary);

// CRUD Routes
router.post('/', controller.createExpense);
router.get('/', controller.getAllExpenses);
router.get('/:id', controller.getExpenseById);
router.put('/:id', controller.updateExpense);
router.delete('/:id', controller.deleteExpense);

module.exports = router;