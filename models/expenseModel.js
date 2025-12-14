const pool = require('../config/db');

const ExpenseModel = {
    // 1. Create Expense
    create: async (amount, category, description, date) => {
        const query = `
            INSERT INTO expenses (amount, category, description, date)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const values = [amount, category, description, date];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // 2. Find All with Dynamic Filtering & Sorting
    findAll: async (filters) => {
        let query = 'SELECT * FROM expenses WHERE 1=1'; 
        const values = [];
        let paramIndex = 1;

        // Dynamic Filtering
        if (filters.category) {
            query += ` AND category = $${paramIndex}`;
            values.push(filters.category);
            paramIndex++;
        }
        if (filters.min_amount) {
            query += ` AND amount >= $${paramIndex}`;
            values.push(filters.min_amount);
            paramIndex++;
        }
        if (filters.max_amount) {
            query += ` AND amount <= $${paramIndex}`;
            values.push(filters.max_amount);
            paramIndex++;
        }
        if (filters.start_date) {
            query += ` AND date >= $${paramIndex}`;
            values.push(filters.start_date);
            paramIndex++;
        }
        if (filters.end_date) {
            query += ` AND date <= $${paramIndex}`;
            values.push(filters.end_date);
            paramIndex++;
        }

        const sortableColumns = ['date', 'amount'];
        const sortBy = sortableColumns.includes(filters.sort_by) ? filters.sort_by : 'date';
        const order = filters.order && filters.order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortBy} ${order}`;

        const result = await pool.query(query, values);
        return result.rows;
    },

    // 3. Find by ID
    findById: async (id) => {
        const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
        return result.rows[0];
    },

    // 4. Update
    update: async (id, data) => {
        const query = `
            UPDATE expenses 
            SET amount = $1, category = $2, description = $3, date = $4
            WHERE id = $5 RETURNING *`;
        const values = [data.amount, data.category, data.description, data.date, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // 5. Delete
    delete: async (id) => {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    },

    // 6. Aggregation: By Category
    sumByCategory: async () => {
        const query = `
            SELECT category, SUM(amount) as total 
            FROM expenses 
            GROUP BY category`;
        const result = await pool.query(query);

        const summary = {};
        result.rows.forEach(row => {
            summary[row.category] = parseFloat(row.total); 
        });
        return summary;
    },

    sumMonthly: async () => {
        const query = `
            SELECT TO_CHAR(date, 'Month') as month, SUM(amount) as total
            FROM expenses
            WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY TO_CHAR(date, 'Month'), EXTRACT(MONTH FROM date)
            ORDER BY EXTRACT(MONTH FROM date)`; 
        
        const result = await pool.query(query);
        const summary = {};
        result.rows.forEach(row => {
            summary[row.month.trim()] = parseFloat(row.total);
        });
        return summary;
    }
};

module.exports = ExpenseModel;