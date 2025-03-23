<?php
$host = 'sql101.infinityfree.com';
$dbname = 'if0_38586786_moneymap';
$username = 'if0_38586786';
$password = 'maps1011';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>