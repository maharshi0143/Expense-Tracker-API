const express = require('express');
const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// ---------------------------------------------------------
// 1. HEALTH CHECK ROUTE (Must be in server.js)
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.json({ 
        status: "Active",
        message: "Expense Tracker API is running perfectly!",
        timestamp: new Date()
    });
});

// ---------------------------------------------------------
// 2. EXPENSE ROUTES
// ---------------------------------------------------------
// This connects your routes to the '/expenses' path
app.use('/expenses', expenseRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});