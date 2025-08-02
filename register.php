<?php
include 'config.php';

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendJsonResponse(false, "Invalid JSON data");
    }
    
    $username = sanitizeInput($input['username'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validate input
    if (empty($username) || empty($password)) {
        sendJsonResponse(false, "Username and password are required");
    }
    
    if (strlen($username) < 3 || strlen($username) > 50) {
        sendJsonResponse(false, "Username must be between 3 and 50 characters");
    }
    
    if (strlen($password) < 6) {
        sendJsonResponse(false, "Password must be at least 6 characters long");
    }
    
    // Check if username already exists
    try {
        $checkStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $checkStmt->bind_param("s", $username);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows > 0) {
            sendJsonResponse(false, "Username already exists");
        }
        $checkStmt->close();
        
        // Hash password and insert user
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("INSERT INTO users (username, password, created_at) VALUES (?, ?, NOW())");
        $stmt->bind_param("ss", $username, $hashedPassword);

        if ($stmt->execute()) {
            sendJsonResponse(true, "Registration successful! You can now login.");
        } else {
            sendJsonResponse(false, "Registration failed. Please try again.");
        }

        $stmt->close();
    } catch (Exception $e) {
        error_log("Registration error: " . $e->getMessage());
        sendJsonResponse(false, "An error occurred during registration. Please try again.");
    }
} else {
    sendJsonResponse(false, "Invalid request method");
}
?>
