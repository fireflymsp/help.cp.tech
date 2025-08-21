<?php
// Configuration endpoint - returns non-sensitive configuration values
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Access your credentials directly (Azure App Service handles the loading)
$WEBHOOK_URL = getenv('WEBHOOK_URL');

// Return only the webhook URL (not the API key)
$response = [
    'webhookUrl' => $WEBHOOK_URL ?? '',
    'status' => 'success'
];

echo json_encode($response);
?>
