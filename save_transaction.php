<?php
include 'config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    die("Unauthorized access.");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id'];
    $previous_balance = $_POST['previous_balance'];
    $income = $_POST['income'];
    $general_expenses = $_POST['general_expenses'];
    $miscellaneous_expenses = $_POST['miscellaneous_expenses'];

    $savings = $income - ($general_expenses + $miscellaneous_expenses);
    $balance = $previous_balance + $savings;

    $stmt = $conn->prepare("INSERT INTO transactions (user_id, previous_balance, income, general_expenses, miscellaneous_expenses, savings, balance) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("idddddd", $user_id, $previous_balance, $income, $general_expenses, $miscellaneous_expenses, $savings, $balance);

    if ($stmt->execute()) {
        echo "Transaction saved successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>