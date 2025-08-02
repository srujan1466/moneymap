-- Database schema for MoneyMap Budget Tracker
-- This file contains the complete database structure

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    previous_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    income DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    general_expenses DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    miscellaneous_expenses DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    savings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create a view for transaction summaries
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    u.username,
    COUNT(t.id) as total_transactions,
    SUM(t.income) as total_income,
    SUM(t.general_expenses + t.miscellaneous_expenses) as total_expenses,
    SUM(t.savings) as total_savings,
    MAX(t.balance) as current_balance,
    MAX(t.created_at) as last_transaction_date
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.username;