<?php
session_start();
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

    try {
        $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows === 0) {
            sendJsonResponse(false, "Invalid username or password");
        }
        
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            sendJsonResponse(true, "Login successful!", ['redirect' => 'dashboard.html']);
        } else {
            sendJsonResponse(false, "Invalid username or password");
        }

        $stmt->close();
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        sendJsonResponse(false, "An error occurred. Please try again.");
    }
} else {
    sendJsonResponse(false, "Invalid request method");
}
?>
