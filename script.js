// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').textContent = result.message;
    }
});

// Signup Form Submission
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('backend/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('error').textContent = result.message;
    }
});

// Income Form Submission
document.getElementById('incomeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const income = document.getElementById('income').value;

    const response = await fetch('backend/income.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income })
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('savings').textContent = result.savings;
    } else {
        document.getElementById('error').textContent = result.message;
    }
});