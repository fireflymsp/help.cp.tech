// Utilities module - URL parsing, temporary messages, and helper functions

// Function to parse URL parameters
function parseURLParameters() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get computer and user parameters
        const computerName = urlParams.get('computer');
        const userName = urlParams.get('user');
        
        console.log('URL Parameters detected:', {
            computer: computerName,
            user: userName
        });
        
        // Populate hidden fields if parameters exist
        if (computerName) {
            document.getElementById('computerNameHidden').value = computerName;
            console.log('Computer name set:', computerName);
        }
        
        if (userName) {
            document.getElementById('userNameHidden').value = userName;
            console.log('User name set:', userName);
        }
        
        // Debug: Log the hidden field values after setting them
        if (computerName || userName) {
            setTimeout(() => {
                const computerField = document.getElementById('computerNameHidden');
                const userField = document.getElementById('userNameHidden');
                console.log('Hidden field values after setting:', {
                    computerNameHidden: computerField ? computerField.value : 'NOT FOUND',
                    userNameHidden: userField ? userField.value : 'NOT FOUND'
                });
            }, 100);
        }
        
    } catch (error) {
        console.error('Error parsing URL parameters:', error);
    }
}

function showTempMessage(message) {
    // Create temporary message element
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(msgDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Webhook debugging function
async function testWebhookConnection() {
    try {
        // Get webhook URL from configuration
        const response = await fetch('get-config.php');
        const config = await response.json();
        
        if (!config.webhookUrl) {
            console.error('Webhook URL not found in configuration');
            showTempMessage('Webhook URL not configured');
            return;
        }
        
        console.log('Testing webhook connection to:', config.webhookUrl);
        
        // Test with a simple POST request
        const testResponse = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                test: true,
                message: 'Webhook connection test',
                timestamp: new Date().toISOString()
            })
        });
        
        console.log('Webhook test response status:', testResponse.status);
        console.log('Webhook test response headers:', testResponse.headers);
        const responseText = await testResponse.text();
        console.log('Webhook test response body:', responseText);
        
        showTempMessage('Webhook connection test successful!');
        
    } catch (error) {
        console.error('Webhook test failed:', error);
        showTempMessage('Webhook connection test failed - check console');
    }
}
