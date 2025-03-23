<?php
session_start();

// Check if the user is already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php"); // Redirect to dashboard if logged in
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Budget Tracker - Home</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to the Budget Tracker</h1>
    <p>Track your income and savings efficiently!</p>
    <div>
        <h2>Get Started</h2>
        <p><a href="login.php">Login</a> to access your dashboard.</p>
        <p>Don't have an account? <a href="signup.php">Signup here</a>.</p>
    </div>
</body>
</html>