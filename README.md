# Personal Expense Tracker API

A robust RESTful API built with Node.js, Express, and PostgreSQL to manage personal finances. This API supports complex filtering, sorting, and aggregation to provide meaningful insights into spending habits.

## 🚀 Setup & Installation

### Prerequisites
* Node.js (v14 or higher)
* PostgreSQL installed and running

### 1. Clone the Repository
```bash
git clone <your-repo-link-here>
cd expense-tracker-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1.  Create a PostgreSQL database named `expense_tracker`.
2.  Run the provided schema file to create the table:
    ```bash
    psql -U postgres -d expense_tracker -f schema.sql
    ```
3.  (Optional) Load sample data for testing:
    ```bash
    psql -U postgres -d expense_tracker -f data.sql
    ```

### 4. Environment Variables
Create a `.env` file in the root directory with your database credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PORT=5432
PORT=3000
```

### 5. Run the Server
```bash
npm start
# Server will run on http://localhost:3000
```

---

## 📖 API Documentation

### Base URL
`http://localhost:3000/expenses`

### 1. Create Expense
**POST** `/`
Creates a new expense record.

* **Body:**
    ```json
    {
      "amount": 150.00,
      "category": "Food",
      "description": "Team Lunch",
      "date": "2023-12-01"
    }
    ```
* **Example Curl:**
    ```bash
    curl -X POST http://localhost:3000/expenses \
    -H "Content-Type: application/json" \
    -d '{"amount": 50, "category": "Transport", "description": "Taxi", "date": "2023-12-10"}'
    ```

### 2. Get All Expenses (Filtering & Sorting)
**GET** `/`
Retrieves a list of expenses. Supports query parameters for filtering and sorting.

* **Query Parameters:**
    * `category`: Filter by category (e.g., `Food`, `Bills`)
    * `min_amount`: Filter expenses above this amount
    * `max_amount`: Filter expenses below this amount
    * `start_date` & `end_date`: Filter within a date range (YYYY-MM-DD)
    * `sort_by`: Sort by `date` or `amount`
    * `order`: `asc` or `desc`

* **Example: Get high-value Food expenses sorted by date**
    ```bash
    curl "http://localhost:3000/expenses?category=Food&min_amount=20&sort_by=date&order=desc"
    ```

### 3. Get Expense by ID
**GET** `/:id`
Retrieves a single expense.

* **Example:**
    ```bash
    curl http://localhost:3000/expenses/1
    ```

### 4. Update Expense
**PUT** `/:id`
Updates an existing expense.

* **Body:** (All fields required)
    ```json
    {
      "amount": 200.00,
      "category": "Food",
      "description": "Updated Description",
      "date": "2023-12-01"
    }
    ```
* **Example:**
    ```bash
    curl -X PUT http://localhost:3000/expenses/1 \
    -H "Content-Type: application/json" \
    -d '{"amount": 200, "category": "Food", "description": "Updated", "date": "2023-12-01"}'
    ```

### 5. Delete Expense
**DELETE** `/:id`
Removes an expense from the database.

* **Example:**
    ```bash
    curl -X DELETE http://localhost:3000/expenses/1
    ```

---

## 📊 Aggregation Endpoints

### 1. Summary by Category
**GET** `/summary/by-category`
Returns total spending grouped by category.

* **Response:**
    ```json
    {
      "Food": 450.50,
      "Transport": 120.00,
      "Bills": 1500.00
    }
    ```
* **Example:**
    ```bash
    curl http://localhost:3000/expenses/summary/by-category
    ```

### 2. Monthly Summary
**GET** `/summary/monthly`
Returns total spending grouped by month for the current year.

* **Response:**
    ```json
    {
      "October": 1200.00,
      "November": 950.00
    }
    ```
* **Example:**
    ```bash
    curl http://localhost:3000/expenses/summary/monthly
    ```