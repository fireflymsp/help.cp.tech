<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start error logging
error_log('=== generate-questions.php started ===');

// Secure OpenAI API proxy - API key is stored server-side
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Basic test to ensure script is running
error_log('generate-questions.php script started successfully');

// Get the request data
error_log('Reading input data...');
$input = json_decode(file_get_contents('php://input'), true);
$notes = $input['notes'] ?? '';

// Log the notes for debugging
error_log("AI Request Notes: " . $notes);

if (empty($notes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Notes are required']);
    exit;
}

// Access your credentials directly (Azure App Service handles the loading)
$AZURE_OPENAI_ENDPOINT = getenv('AZURE_OPENAI_ENDPOINT');
$AZURE_OPENAI_API_KEY = getenv('AZURE_OPENAI_API_KEY');
$AZURE_OPENAI_DEPLOYMENT_NAME = getenv('AZURE_OPENAI_DEPLOYMENT_NAME') ?: 'gpt-4';
$OPENAI_API_KEY = getenv('OPENAI_API_KEY');
$WEBHOOK_URL = getenv('WEBHOOK_URL');

error_log('Configuration loaded from Azure App Service');
error_log('Azure OpenAI Endpoint found: ' . (empty($AZURE_OPENAI_ENDPOINT) ? 'NO' : 'YES'));
error_log('Azure OpenAI API Key found: ' . (empty($AZURE_OPENAI_API_KEY) ? 'NO' : 'YES'));
error_log('Azure OpenAI Deployment found: ' . (empty($AZURE_OPENAI_DEPLOYMENT_NAME) ? 'NO' : 'YES'));
error_log('OpenAI API Key found: ' . (empty($OPENAI_API_KEY) ? 'NO' : 'YES'));
error_log('Webhook found: ' . (empty($WEBHOOK_URL) ? 'NO' : 'YES'));

// Determine which service to use (Azure OpenAI preferred, fallback to OpenAI)
$use_azure_openai = !empty($AZURE_OPENAI_ENDPOINT) && !empty($AZURE_OPENAI_API_KEY);
$use_openai = !empty($OPENAI_API_KEY);

if (!$use_azure_openai && !$use_openai) {
    error_log('No AI service configuration found');
    http_response_code(500);
    echo json_encode(['error' => 'AI service configuration error - no API keys found']);
    exit;
}

// Log which service will be used
if ($use_azure_openai) {
    error_log('Using Azure OpenAI Service');
} else {
    error_log('Using OpenAI API (fallback)');
}

// Prepare the AI request data
$ai_data = [
    'model' => $use_azure_openai ? $AZURE_OPENAI_DEPLOYMENT_NAME : 'gpt-4o',
    'messages' => [
        [
            'role' => 'system',
            'content' => "You are a helpful IT support specialist. First, generate a clear subject line, then assess urgency, then generate questions.\n\nRESPONSE FORMAT:\nFirst line: SUBJECT: [Clear, concise subject line based on the issue]\nSecond line: URGENCY: [HIGH/MEDIUM/LOW]\nThird line: REASON: [Brief explanation]\n\nThen provide up to 2 questions that you are highly confident will help solve the issue more expeditiously. Only ask questions that are essential for understanding and resolving the problem.\n\nURGENCY ASSESSMENT:\n- HIGH: Business-critical, security issues, system down, data loss, urgent deadlines, MULTIPLE USERS AFFECTED, revenue impact, customer-facing issues\n- MEDIUM: Work disruption, productivity impact, single user affected, non-critical systems\n- LOW: Minor inconvenience, non-critical features, personal preference, cosmetic issues\n\nIMPORTANT: Ask ONLY about things the user can actually observe or experience directly. DO NOT ask them to diagnose technical issues, assess signal strength, check settings, or perform technical troubleshooting.\n\nFocus on:\n- When things started happening\n- What they see on their screen\n- What they're trying to do\n- What happens when they try\n- Whether it works in other locations\n- Whether other people have the same issue\n- For HIGH urgency: What is the business impact? (deadlines, customers, revenue, etc.)\n\nUse plain, everyday language. Do NOT include any statements, apologies, or explanatory text - ONLY the subject, urgency assessment, and numbered questions.\n\nCRITICAL: You must follow this EXACT format with no additional text:\nSUBJECT: [subject]\nURGENCY: [urgency]\nREASON: [reason]\n1. [question]\n2. [question]"
        ],
        [
            'role' => 'user',
            'content' => "Based on this problem description, what questions might help us understand the issue better? 

IMPORTANT: Generate up to 2 questions that you are highly confident will help solve the issue more expeditiously. Only ask questions that are essential for understanding and resolving the problem.

Problem description: {$notes}"
        ]
    ],
    'max_tokens' => 400,
    'temperature' => 0.3
];

// Determine the API endpoint and headers
if ($use_azure_openai) {
    $api_url = rtrim($AZURE_OPENAI_ENDPOINT, '/') . '/openai/deployments/' . $AZURE_OPENAI_DEPLOYMENT_NAME . '/chat/completions?api-version=2024-12-01-preview';
    $api_headers = [
        'api-key: ' . $AZURE_OPENAI_API_KEY,
        'Content-Type: application/json'
    ];
} else {
    $api_url = 'https://api.openai.com/v1/chat/completions';
    $api_headers = [
        'Authorization: Bearer ' . $OPENAI_API_KEY,
        'Content-Type: application/json'
    ];
}

// Make the AI API call
$response = '';
$http_code = 0;

if (function_exists('curl_init')) {
    // Use cURL if available
    error_log('Using cURL for API request...');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $api_headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($ai_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($response === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Curl error: ' . $curl_error]);
        exit;
    }
} else {
    // Fallback to file_get_contents() if cURL not available
    error_log('cURL not available, using file_get_contents() fallback...');
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $api_headers) . "\r\nUser-Agent: PHP/AI-Client",
            'content' => json_encode($ai_data),
            'timeout' => 30
        ]
    ]);
    
    $response = file_get_contents($api_url, false, $context);
    
    if ($response === false) {
        http_response_code(500);
        echo json_encode(['error' => 'file_get_contents() failed to make API request']);
        exit;
    }
    
    // file_get_contents() doesn't return HTTP status, assume success if we got a response
    $http_code = 200;
}

if ($http_code !== 200) {
    http_response_code($http_code);
    echo json_encode(['error' => 'AI API error', 'status' => $http_code, 'response' => $response]);
    exit;
}

// Return the AI response
echo $response;
?>
