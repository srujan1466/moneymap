// Utility functions
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.input-error');
    errorElements.forEach(el => el.textContent = '');
}

function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + '-error');
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function setButtonLoading(button, loading) {
    const textEl = button.querySelector('.btn-text');
    const loadingEl = button.querySelector('.btn-loading');
    
    if (loading) {
        textEl.style.display = 'none';
        loadingEl.style.display = 'inline';
        button.disabled = true;
    } else {
        textEl.style.display = 'inline';
        loadingEl.style.display = 'none';
        button.disabled = false;
    }
}

function validateForm(formData, rules) {
    clearErrors();
    let isValid = true;
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = formData[field];
        
        if (rule.required && (!value || value.trim() === '')) {
            showError(field.replace('_', '-'), `${rule.label} is required`);
            isValid = false;
            continue;
        }
        
        if (rule.minLength && value.length < rule.minLength) {
            showError(field.replace('_', '-'), `${rule.label} must be at least ${rule.minLength} characters`);
            isValid = false;
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
            showError(field.replace('_', '-'), `${rule.label} must be no more than ${rule.maxLength} characters`);
            isValid = false;
        }
        
        if (rule.min !== undefined && parseFloat(value) < rule.min) {
            showError(field.replace('_', '-'), `${rule.label} must be at least ${rule.min}`);
            isValid = false;
        }
        
        if (rule.max !== undefined && parseFloat(value) > rule.max) {
            showError(field.replace('_', '-'), `${rule.label} must be no more than ${rule.max}`);
            isValid = false;
        }
    }
    
    return isValid;
}

// Form switching functionality
document.getElementById('showSignup').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    clearErrors();
});

document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    clearErrors();
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const button = e.target.querySelector('button[type="submit"]');
    
    // Validate form
    const formData = { username, password };
    const rules = {
        username: { required: true, label: 'Username', minLength: 3, maxLength: 50 },
        password: { required: true, label: 'Password', minLength: 6 }
    };
    
    if (!validateForm(formData, rules)) {
        return;
    }
    
    setButtonLoading(button, true);

    fetch('login.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        setButtonLoading(button, false);
        
        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                window.location.href = data.data.redirect;
            }, 1000);
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        setButtonLoading(button, false);
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    });
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const button = e.target.querySelector('button[type="submit"]');
    
    // Validate form
    const formData = { username, password };
    const rules = {
        username: { required: true, label: 'Username', minLength: 3, maxLength: 50 },
        password: { required: true, label: 'Password', minLength: 6 }
    };
    
    if (!validateForm(formData, rules)) {
        return;
    }
    
    setButtonLoading(button, true);

    fetch('register.php', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        setButtonLoading(button, false);
        
        if (data.success) {
            showMessage(data.message, 'success');
            // Switch to login form after successful registration
            setTimeout(() => {
                document.getElementById('signup-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
                document.getElementById('newUsername').value = '';
                document.getElementById('newPassword').value = '';
            }, 2000);
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        setButtonLoading(button, false);
        console.error('Registration error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    });
});

// Budget form handler (for dashboard)
const budgetForm = document.getElementById('budgetForm');
if (budgetForm) {
    budgetForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const previousBalance = parseFloat(document.getElementById('previous_balance').value) || 0;
        const income = parseFloat(document.getElementById('income').value) || 0;
        const generalExpenses = parseFloat(document.getElementById('general_expenses').value) || 0;
        const miscellaneousExpenses = parseFloat(document.getElementById('miscellaneous_expenses').value) || 0;
        const button = e.target.querySelector('button[type="submit"]');
        
        // Validate form
        const formData = {
            previous_balance: previousBalance,
            income: income,
            general_expenses: generalExpenses,
            miscellaneous_expenses: miscellaneousExpenses
        };
        
        const rules = {
            previous_balance: { required: true, label: 'Previous Balance', min: 0 },
            income: { required: true, label: 'Income', min: 0 },
            general_expenses: { required: true, label: 'General Expenses', min: 0 },
            miscellaneous_expenses: { required: true, label: 'Miscellaneous Expenses', min: 0 }
        };
        
        if (!validateForm(formData, rules)) {
            return;
        }
        
        // Calculate and display results immediately
        const savings = income - (generalExpenses + miscellaneousExpenses);
        const balance = previousBalance + savings;
        
        document.getElementById('savings').textContent = `$${savings.toFixed(2)}`;
        document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
        
        setButtonLoading(button, true);
        
        fetch('save_transaction.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                previous_balance: previousBalance,
                income: income,
                general_expenses: generalExpenses,
                miscellaneous_expenses: miscellaneousExpenses
            })
        })
        .then(response => response.json())
        .then(data => {
            setButtonLoading(button, false);
            
            if (data.success) {
                showMessage(data.message, 'success');
                // Reset form
                budgetForm.reset();
                // Reload transactions
                loadTransactions();
            } else {
                showMessage(data.message, 'error');
            }
        })
        .catch(error => {
            setButtonLoading(button, false);
            console.error('Save transaction error:', error);
            showMessage('An error occurred while saving. Please try again.', 'error');
        });
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        fetch('logout.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Force redirect even if logout fails
            window.location.href = 'index.html';
        });
    });
}

// Transaction history functionality
let transactionOffset = 0;
const transactionLimit = 10;

function loadTransactions(reset = false) {
    if (reset) {
        transactionOffset = 0;
    }
    
    const transactionsList = document.getElementById('transactions-list');
    if (!transactionsList) return;
    
    if (reset) {
        transactionsList.innerHTML = '<p class="loading">Loading transactions...</p>';
    }
    
    fetch(`get_transactions.php?limit=${transactionLimit}&offset=${transactionOffset}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const transactions = data.data.transactions;
            
            if (reset) {
                transactionsList.innerHTML = '';
            }
            
            if (transactions.length === 0 && transactionOffset === 0) {
                transactionsList.innerHTML = '<p class="loading">No transactions found. Add your first transaction above!</p>';
                return;
            }
            
            transactions.forEach(transaction => {
                const transactionEl = createTransactionElement(transaction);
                transactionsList.appendChild(transactionEl);
            });
            
            // Update load more button
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                if (transactionOffset + transactionLimit < data.data.total) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
            
            transactionOffset += transactions.length;
        } else {
            transactionsList.innerHTML = '<p class="loading">Error loading transactions.</p>';
        }
    })
    .catch(error => {
        console.error('Load transactions error:', error);
        transactionsList.innerHTML = '<p class="loading">Error loading transactions.</p>';
    });
}

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    div.innerHTML = `
        <div class="transaction-header">
            <span class="transaction-date">${transaction.date}</span>
        </div>
        <div class="transaction-details">
            <div class="transaction-detail">
                <span class="transaction-detail-label">Previous Balance</span>
                <span class="transaction-detail-value">$${transaction.previous_balance}</span>
            </div>
            <div class="transaction-detail">
                <span class="transaction-detail-label">Income</span>
                <span class="transaction-detail-value">$${transaction.income}</span>
            </div>
            <div class="transaction-detail">
                <span class="transaction-detail-label">General Expenses</span>
                <span class="transaction-detail-value">$${transaction.general_expenses}</span>
            </div>
            <div class="transaction-detail">
                <span class="transaction-detail-label">Misc Expenses</span>
                <span class="transaction-detail-value">$${transaction.miscellaneous_expenses}</span>
            </div>
            <div class="transaction-detail">
                <span class="transaction-detail-label">Savings</span>
                <span class="transaction-detail-value">$${transaction.savings}</span>
            </div>
            <div class="transaction-detail">
                <span class="transaction-detail-label">New Balance</span>
                <span class="transaction-detail-value">$${transaction.balance}</span>
            </div>
        </div>
    `;
    
    return div;
}

// Load more button functionality
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        loadTransactions(false);
    });
}

// Load transactions on dashboard page load
if (document.getElementById('transaction-history')) {
    loadTransactions(true);
}

// Real-time input validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Clear previous error for this field
            const errorId = this.id.replace('_', '-') + '-error';
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.textContent = '';
            }
            
            // Basic validation
            if (this.hasAttribute('required') && !this.value.trim()) {
                if (errorEl) {
                    errorEl.textContent = 'This field is required';
                }
            }
        });
    });
});

// Auto-hide messages when user starts typing
document.addEventListener('input', function() {
    const messageEl = document.getElementById('message');
    if (messageEl && messageEl.style.display !== 'none') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 2000);
    }
});

// Prevent form submission on Enter key in number inputs (to avoid accidental submissions)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.type === 'number') {
        e.preventDefault();
        // Move to next input or submit form
        const form = e.target.closest('form');
        const inputs = Array.from(form.querySelectorAll('input'));
        const currentIndex = inputs.indexOf(e.target);
        
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            form.querySelector('button[type="submit"]').click();
        }
    }
});