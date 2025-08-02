<?php
session_start();
include 'config.php';

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if (!isset($_SESSION['user_id'])) {
    sendJsonResponse(false, "Unauthorized access. Please login first.");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendJsonResponse(false, "Invalid JSON data");
    }
    
    $user_id = $_SESSION['user_id'];
    $previous_balance = floatval($input['previous_balance'] ?? 0);
    $income = floatval($input['income'] ?? 0);
    $general_expenses = floatval($input['general_expenses'] ?? 0);
    $miscellaneous_expenses = floatval($input['miscellaneous_expenses'] ?? 0);
    
    // Validate input
    if ($income < 0 || $general_expenses < 0 || $miscellaneous_expenses < 0) {
        sendJsonResponse(false, "Values cannot be negative");
    }
    
    if ($income > 1000000 || $general_expenses > 1000000 || $miscellaneous_expenses > 1000000) {
        sendJsonResponse(false, "Values are too large");
    }

    $savings = $income - ($general_expenses + $miscellaneous_expenses);
    $balance = $previous_balance + $savings;

    try {
        $stmt = $conn->prepare("INSERT INTO transactions (user_id, previous_balance, income, general_expenses, miscellaneous_expenses, savings, balance, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("idddddd", $user_id, $previous_balance, $income, $general_expenses, $miscellaneous_expenses, $savings, $balance);

        if ($stmt->execute()) {
            sendJsonResponse(true, "Transaction saved successfully!", [
                'savings' => number_format($savings, 2),
                'balance' => number_format($balance, 2)
            ]);
        } else {
            sendJsonResponse(false, "Failed to save transaction. Please try again.");
        }

        $stmt->close();
    } catch (Exception $e) {
        error_log("Transaction save error: " . $e->getMessage());
        sendJsonResponse(false, "An error occurred while saving. Please try again.");
    }
} else {
    sendJsonResponse(false, "Invalid request method");
}
?>