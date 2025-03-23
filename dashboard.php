<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $income = $_POST['income'];
    $savings = $income * 0.2; // Assuming 20% savings

    $stmt = $conn->prepare("INSERT INTO income (user_id, income_amount, savings) VALUES (?, ?, ?)");
    $stmt->bind_param("idd", $user_id, $income, $savings);

    if ($stmt->execute()) {
        echo "Income and savings recorded successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h2>Welcome to Your Dashboard</h2>
    <form method="POST" action="">
        <label>Income:</label>
        <input type="number" name="income" step="0.01" required><br>
        <button type="submit">Calculate Savings</button>
    </form>
    <p><a href="logout.php">Logout</a></p>
</body>
</html>