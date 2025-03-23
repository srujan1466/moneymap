<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$income = $data['income'];
$savings = $income * 0.2; // 20% savings

$stmt = $conn->prepare("INSERT INTO income (user_id, income_amount, savings) VALUES (?, ?, ?)");
$stmt->bind_param("idd", $_SESSION['user_id'], $income, $savings);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'savings' => $savings]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error recording income.']);
}

$stmt->close();
?>