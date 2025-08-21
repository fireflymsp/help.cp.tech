// Main initialization and event binding
document.addEventListener('DOMContentLoaded', function() {
    // Set current date/time
    document.getElementById('submissionDate').value = new Date().toISOString();
    
    // Initialize all modules
    initializeModules();
    
    // Bind main event listeners
    bindMainEventListeners();
});

function initializeModules() {
    // Parse URL parameters and populate hidden fields
    parseURLParameters();
    
    // Initialize AI review functionality
    initializeAIReview();
    

    
    // Set initial state of AI questions section based on checkbox
    initializeAIQuestionsSection();
}

function bindMainEventListeners() {
    // Handle file upload and preview
    document.getElementById('screenshot').addEventListener('change', handleFileUpload);
    
    // Add visual feedback on input focus
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Main navigation buttons
    document.getElementById('nextBtn').addEventListener('click', handleNextButton);
    document.getElementById('backToEditBtn').addEventListener('click', handleBackToEdit);
    document.getElementById('submitTicketBtn').addEventListener('click', handleSubmitTicket);
}

function initializeAIQuestionsSection() {
    // Check if AI review is enabled on page load
    const aiReviewCheckbox = document.getElementById('aiReviewEnabled');
    console.log('initializeAIQuestionsSection - checkbox found:', !!aiReviewCheckbox);
    
    if (aiReviewCheckbox) {
        console.log('Initial checkbox state:', aiReviewCheckbox.checked);
        // Set initial state based on checkbox
        if (!aiReviewCheckbox.checked) {
            console.log('AI review disabled initially - hiding questions section');
            // Hide AI questions section initially if AI review is disabled
            const aiQuestionsSection = document.getElementById('summaryQuestionsContainer');
            
            if (aiQuestionsSection) {
                aiQuestionsSection.style.display = 'none';
                console.log('AI questions section hidden on initialization');
            } else {
                console.log('AI questions section not found during initialization');
            }
        } else {
            console.log('AI review enabled initially - questions section visible');
        }
    } else {
        console.log('AI review checkbox not found during initialization');
    }
}

// Toggle summary details visibility
function toggleSummaryDetails() {
    const summaryDetails = document.getElementById('summaryDetails');
    const toggleArrow = document.getElementById('toggleArrow');
    
    if (summaryDetails && toggleArrow) {
        const isExpanded = summaryDetails.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse the details
            summaryDetails.classList.remove('expanded');
            toggleArrow.classList.remove('expanded');
            toggleArrow.textContent = '▶';
        } else {
            // Expand the details
            summaryDetails.classList.add('expanded');
            toggleArrow.classList.add('expanded');
            toggleArrow.textContent = '▼';
        }
    }
}

// Toggle sample data visibility
function toggleSampleData() {
    const sampleDataContent = document.getElementById('sampleDataContent');
    const sampleToggleArrow = document.getElementById('sampleToggleArrow');
    
    if (sampleDataContent && sampleToggleArrow) {
        const isExpanded = sampleDataContent.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse the content
            sampleDataContent.classList.remove('expanded');
            sampleToggleArrow.classList.remove('expanded');
            sampleToggleArrow.textContent = '▶';
        } else {
            // Expand the content
            sampleDataContent.classList.add('expanded');
            sampleToggleArrow.classList.add('expanded');
            sampleToggleArrow.textContent = '▼';
        }
    }
}
