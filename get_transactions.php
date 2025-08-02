<?php
session_start();
include 'config.php';

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (!isset($_SESSION['user_id'])) {
    sendJsonResponse(false, "Unauthorized access. Please login first.");
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_SESSION['user_id'];
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    // Validate limit
    if ($limit > 100) $limit = 100;
    if ($limit < 1) $limit = 10;
    
    try {
        // Get transactions with pagination
        $stmt = $conn->prepare("SELECT previous_balance, income, general_expenses, miscellaneous_expenses, savings, balance, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $stmt->bind_param("iii", $user_id, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[] = [
                'previous_balance' => number_format($row['previous_balance'], 2),
                'income' => number_format($row['income'], 2),
                'general_expenses' => number_format($row['general_expenses'], 2),
                'miscellaneous_expenses' => number_format($row['miscellaneous_expenses'], 2),
                'savings' => number_format($row['savings'], 2),
                'balance' => number_format($row['balance'], 2),
                'date' => date('M j, Y g:i A', strtotime($row['created_at']))
            ];
        }
        
        // Get total count
        $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM transactions WHERE user_id = ?");
        $countStmt->bind_param("i", $user_id);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $total = $countResult->fetch_assoc()['total'];
        
        sendJsonResponse(true, "Transactions retrieved successfully", [
            'transactions' => $transactions,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]);
        
        $stmt->close();
        $countStmt->close();
    } catch (Exception $e) {
        error_log("Get transactions error: " . $e->getMessage());
        sendJsonResponse(false, "An error occurred while retrieving transactions.");
    }
} else {
    sendJsonResponse(false, "Invalid request method");
}
?>