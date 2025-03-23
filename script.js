document.getElementById('showSignup').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        if (data === "Login successful!") {
            window.location.href = 'dashboard.html';
        }
    });
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => alert(data));
});

document.getElementById('budgetForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const previousBalance = parseFloat(document.getElementById('previous_balance').value);
    const income = parseFloat(document.getElementById('income').value);
    const generalExpenses = parseFloat(document.getElementById('general_expenses').value);
    const miscellaneousExpenses = parseFloat(document.getElementById('miscellaneous_expenses').value);

    const savings = income - (generalExpenses + miscellaneousExpenses);
    const balance = previousBalance + savings;

    document.getElementById('savings').textContent = savings.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);

    fetch('save_transaction.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            previous_balance: previousBalance,
            income: income,
            general_expenses: generalExpenses,
            miscellaneous_expenses: miscellaneousExpenses
        })
    })
    .then(response => response.text())
    .then(data => alert(data));
});