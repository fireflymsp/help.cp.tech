// Sample Data module - testing utilities and form population

function fillSampleForm(type) {
    const samples = {
        wifi: {
            fullName: 'John Smith',
            companyName: 'Acme Corp',
            email: 'john.smith@acme.com',
            phone: '555-123-4567',
            notes: 'I\'m having trouble connecting to the WiFi at my desk. Sometimes it connects but then drops after a few minutes. Other people in the office seem to be working fine. I\'ve tried restarting my computer but it didn\'t help. This started happening about 2 days ago.'
        },
        printer: {
            fullName: 'Sarah Johnson',
            companyName: 'Tech Solutions Inc',
            email: 'sarah.j@techsolutions.com',
            phone: '555-987-6543',
            notes: 'The office printer on the 2nd floor is not working. When I try to print, it says "printer offline" on my computer. I can see the printer is turned on and has paper. I need to print some important documents for a meeting this afternoon. Other people are also having the same issue.'
        },
        email: {
            fullName: 'Mike Chen',
            companyName: 'Global Industries',
            email: 'mike.chen@global.com',
            phone: '555-456-7890',
            notes: 'I can\'t log into my work email account. When I try to access Outlook, it keeps asking for my password but won\'t accept it. I\'m sure I\'m typing it correctly. I can access other company systems fine, just not email. This is preventing me from checking important messages from clients.'
        },
        urgent: {
            fullName: 'Jennifer Martinez',
            companyName: 'Financial Services Corp',
            email: 'jennifer.m@financialcorp.com',
            phone: '555-789-0123',
            notes: 'Our customer database system is completely down. I cannot access any customer records, process payments, or view account information. This is affecting our entire sales team of 25 people and we have customers calling in who need immediate assistance. We are losing business every minute this is down. This started about 30 minutes ago and we need this resolved immediately. The entire company is impacted and we cannot serve any customers.'
        },
        proxy: {
            fullName: 'Sarah Wilson',
            companyName: 'Tech Solutions Inc',
            email: 'sarah.w@techsolutions.com',
            phone: '555-234-5678',
            notes: 'I\'m submitting this on behalf of our impacted user, John Davis. He\'s having trouble accessing their company email system and says he keeps getting "access denied" errors. He mentioned this started happening yesterday and he needs to check important client emails. I don\'t have all the technical details, but he\'s quite frustrated and needs this resolved quickly.'
        },
        software: {
            fullName: 'Lisa Rodriguez',
            companyName: 'Creative Design Studio',
            email: 'lisa.r@creativedesign.com',
            phone: '555-321-0987',
            notes: 'Adobe Photoshop keeps crashing every time I try to open large image files. It works fine with smaller files, but when I try to open anything over 50MB, it just closes without any error message. I\'ve tried reinstalling the software but the problem continues. I need this for client work and it\'s really slowing me down.'
        }
    };
    
    const sample = samples[type];
    if (sample) {
        document.getElementById('fullName').value = sample.fullName;
        document.getElementById('companyName').value = sample.companyName;
        document.getElementById('email').value = sample.email;
        document.getElementById('phone').value = sample.phone;
        document.getElementById('notes').value = sample.notes;
        
        // Clear any existing file preview
        document.getElementById('filePreview').classList.remove('show');
        document.getElementById('screenshotBase64').value = '';
        
        // Show success message
        showTempMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} sample loaded! Click "Next" to test the AI questions.`);
    }
}

function clearForm() {
    document.getElementById('ticketForm').reset();
    document.getElementById('filePreview').classList.remove('show');
    document.getElementById('screenshotBase64').value = '';
    showTempMessage('🗑️ Form cleared!');
}
