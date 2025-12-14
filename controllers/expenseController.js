const ExpenseModel = require('../models/expenseModel');

const handleError = (res, err, message = 'Server Error') => {
    console.error(err);
    res.status(500).json({ error: message });
};

exports.createExpense = async (req, res) => {
    const { amount, category, description, date } = req.body;
    
    if (!amount || amount <= 0) return res.status(400).json({ error: "Amount must be positive" });
    if (!category || !date) return res.status(400).json({ error: "Category and Date are required" });

    try {
        const expense = await ExpenseModel.create(amount, category, description, date);
        res.status(201).json(expense);
    } catch (err) {
        handleError(res, err);
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.findAll(req.query);
        res.json(expenses);
    } catch (err) {
        handleError(res, err);
    }
};

exports.getExpenseById = async (req, res) => {
    try {
        const expense = await ExpenseModel.findById(req.params.id);
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        res.json(expense);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const expense = await ExpenseModel.update(req.params.id, req.body);
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        res.json(expense);
    } catch (err) {
        handleError(res, err);
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const result = await ExpenseModel.delete(req.params.id);
        if (!result) return res.status(404).json({ error: "Expense not found" });
        res.status(204).send();
    } catch (err) {
        handleError(res, err);
    }
};

exports.getSummaryByCategory = async (req, res) => {
    try {
        const summary = await ExpenseModel.sumByCategory();
        res.json(summary);
    } catch (err) {
        handleError(res, err);
    }
};

exports.getMonthlySummary = async (req, res) => {
    try {
        const summary = await ExpenseModel.sumMonthly();
        res.json(summary);
    } catch (err) {
        handleError(res, err);
    }
};