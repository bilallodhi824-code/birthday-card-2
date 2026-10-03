<?php
header('Content-Type: application/json');
require_once 'db.php';

if ($_POST['name'] && $_POST['message']) {
    try {
        $stmt = $pdo->prepare("INSERT INTO wishes (name, message) VALUES (?, ?)");
        $result = $stmt->execute([$_POST['name'], $_POST['message']]);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Wish saved successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save wish']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Name and message are required']);
}
?>