// UI Management module - summary pages, modals, scroll indicators, urgency management

function showAIReviewModal() {
    const modal = document.getElementById('aiReviewModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Focus the modal for accessibility
        modal.setAttribute('tabindex', '-1');
        modal.focus();
        
        // Add keyboard navigation
        const handleKeydown = function(e) {
            if (e.key === 'Escape') {
                hideAIReviewModal();
            }
        };
        
        // Close modal when clicking outside
        const handleClick = function(e) {
            if (e.target === modal) {
                hideAIReviewModal();
            }
        };
        
        modal.addEventListener('keydown', handleKeydown);
        modal.addEventListener('click', handleClick);
        
        // Store event listeners for cleanup
        modal._keydownHandler = handleKeydown;
        modal._clickHandler = handleClick;
        
        // Trap focus within modal
        trapFocusInModal(modal);
    }
}

function trapFocusInModal(modal) {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
        firstElement.focus();
    }
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

function hideAIReviewModal() {
    const modal = document.getElementById('aiReviewModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Clean up event listeners
        if (modal._keydownHandler) {
            modal.removeEventListener('keydown', modal._keydownHandler);
            delete modal._keydownHandler;
        }
        if (modal._clickHandler) {
            modal.removeEventListener('click', modal._clickHandler);
            delete modal._clickHandler;
        }
        
        // Remove tabindex
        modal.removeAttribute('tabindex');
    }
}





function scrollToSubmit() {
            console.log('scrollToSubmit function called');
    
    // Check if we're on the summary page
    const summaryPage = document.getElementById('summaryPage');
    if (!summaryPage || summaryPage.style.display === 'none') {
        console.error('Summary page is not visible');
        showTempMessage('Please complete the form first');
        return;
    }
    
    // Add a small delay to ensure AI questions are generated and submit button is visible
    setTimeout(() => {
        // Look for the submit button
        const submitBtn = document.getElementById('submitTicketBtn');
        console.log('Looking for submit button:', submitBtn);
        
        if (submitBtn) {
            console.log('Submit button found, attempting to scroll');
            console.log('Button position:', submitBtn.getBoundingClientRect());
            console.log('Button visible:', submitBtn.offsetParent !== null);
            
            try {
                // Scroll to the submit button
                submitBtn.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                console.log('Scroll completed');
                
                // Highlight the submit button briefly
                submitBtn.style.transform = 'scale(1.05)';
                submitBtn.style.boxShadow = '0 6px 20px rgba(106, 154, 128, 0.4)';
                
                setTimeout(() => {
                    submitBtn.style.transform = 'scale(1)';
                    submitBtn.style.boxShadow = '0 4px 12px rgba(22, 93, 125, 0.3)';
                    console.log('Button highlight animation completed');
                }, 500);
                
                showTempMessage('Scrolled to submit button!');
                
            } catch (error) {
                            console.error('Error during scroll:', error);
            showTempMessage('Error during scroll: ' + error.message);
            }
            
        } else {
            console.error('Submit button not found');
            
            // Let's see what buttons exist on the page
            const allButtons = document.querySelectorAll('button');
            console.log('All buttons on page:', allButtons);
            
            // Look for any button with "submit" in the text or ID
            const submitLikeButtons = Array.from(allButtons).filter(btn => 
                btn.textContent.toLowerCase().includes('submit') || 
                btn.id.toLowerCase().includes('submit')
            );
            console.log('Submit-like buttons found:', submitLikeButtons);
            
            // Check if the button might be in a different container
            const summaryContainer = document.querySelector('#summaryPage button[id*="submit"]');
            console.log('Submit button in summary container:', summaryContainer);
            
            showTempMessage('Submit button not found - check console for details');
        }
    }, 500); // 500ms delay to ensure everything is loaded
}

// Urgency Management Functions
function confirmUrgency(confirmed) {
    if (confirmed === 'yes') {
        document.getElementById('urgencyConfirmedHidden').value = 'Confirmed by user';
        document.getElementById('urgencyConfirmationSection').style.display = 'none';
        
        // Show the confirmed urgency display
        showConfirmedUrgency();
        
        showTempMessage('Urgency level confirmed!');
    }
}

function showConfirmedUrgency() {
    const confirmedUrgencySection = document.getElementById('confirmedUrgencySection');
    const confirmedUrgencyText = document.getElementById('confirmedUrgencyText');
    const urgencyHidden = document.getElementById('urgencyHidden');
    
    if (confirmedUrgencySection && confirmedUrgencyText && urgencyHidden) {
        const urgencyValue = urgencyHidden.value;
        const urgencyLevel = urgencyValue.split(':')[0].trim();
        const urgencyReason = urgencyValue.split(': ')[1] || 'Confirmed by user';
        
        let urgencyDisplay = '';
        if (urgencyLevel === 'HIGH') {
            urgencyDisplay = `
                <div style="background: #dc3545; color: white; padding: 12px 20px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);">
                    <strong>Confirmed Urgency Level: High Priority</strong>
                </div>
            `;
        } else if (urgencyLevel === 'MEDIUM') {
            urgencyDisplay = `
                <div style="background: #ffc107; color: #212529; padding: 12px 20px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);">
                    <strong>Confirmed Urgency Level: Medium Priority</strong>
                </div>
            `;
        } else {
            urgencyDisplay = `
                <div style="background: #28a745; color: white; padding: 12px 20px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);">
                    <strong>Confirmed Urgency Level: Low Priority</strong>
                </div>
            `;
        }
        
        confirmedUrgencyText.innerHTML = urgencyDisplay;
        confirmedUrgencySection.style.display = 'block';
    }
}

function showUrgencyAdjustment() {
    document.getElementById('urgencyAdjustmentForm').style.display = 'block';
    // Pre-select current urgency level
    const currentUrgency = document.getElementById('urgencyHidden').value;
    const urgencyLevel = currentUrgency.split(':')[0].trim();
    document.getElementById('newUrgencySelect').value = urgencyLevel;
}

function hideUrgencyAdjustment() {
    document.getElementById('urgencyAdjustmentForm').style.display = 'none';
}

function applyUrgencyAdjustment() {
    const newUrgency = document.getElementById('newUrgencySelect').value;
    const context = document.getElementById('urgencyContext').value.trim();
    
    if (newUrgency) {
        const currentUrgency = document.getElementById('urgencyHidden').value;
        const currentReason = currentUrgency.split(': ')[1] || 'User adjusted';
        
        // Create new reason with context if provided
        let newReason = currentReason;
        if (context) {
            newReason = `${currentReason} - User adjusted to ${newUrgency}: ${context}`;
        } else {
            newReason = `${currentReason} - User adjusted to ${newUrgency}`;
        }
        
        document.getElementById('urgencyHidden').value = `${newUrgency}: ${newReason}`;
        document.getElementById('urgencyConfirmedHidden').value = `Adjusted by user to ${newUrgency}`;
        
        // Hide the adjustment form
        hideUrgencyAdjustment();
        
        // Update the urgency display
        updateUrgencyDisplay(newUrgency, newReason);
        
        // Show the confirmed urgency display
        showConfirmedUrgency();
        
        showTempMessage(`Urgency adjusted to ${newUrgency}`);
    }
}

function updateUrgencyDisplay(urgencyLevel, urgencyReason) {
    const urgencyText = document.getElementById('urgencyConfirmationText');
    
    if (urgencyLevel === 'HIGH') {
        urgencyText.innerHTML = `
            <div style="background: #dc3545; color: white; padding: 12px; border-radius: 6px; margin-bottom: 15px; text-align: center; font-weight: 500;">
                <strong>High Priority Issue</strong><br>
                <small>${urgencyReason}</small>
            </div>
            <p style="margin-bottom: 15px;"><strong>We've identified this as a high-priority issue.</strong> To help us respond appropriately, please confirm if this urgency level is correct and tell us about the business impact.</p>
        `;
    } else if (urgencyLevel === 'MEDIUM') {
        urgencyText.innerHTML = `
            <div style="background: #ffc107; color: #212529; padding: 12px; border-radius: 6px; margin-bottom: 15px; text-align: center; font-weight: 500;">
                <strong>Medium Priority Issue</strong><br>
                <small>${urgencyReason}</small>
            </div>
            <p style="margin-bottom: 15px;"><strong>We've identified this as a medium-priority issue.</strong> Please confirm if this urgency level seems correct to you.</p>
        `;
    } else {
        urgencyText.innerHTML = `
            <div style="background: #28a745; color: white; padding: 12px; border-radius: 6px; margin-bottom: 15px; text-align: center; font-weight: 500;">
                <strong>Low Priority Issue</strong><br>
                <small>${urgencyReason}</small>
            </div>
            <p style="margin-bottom: 15px;"><strong>We've identified this as a low-priority issue.</strong> Please confirm if this urgency level seems correct to you.</p>
        `;
    }
}

// Proxy Submission Functions
function confirmProxySubmission(confirmed) {
    // Hide the detection section regardless of choice
    const proxyDetectionSection = document.getElementById('proxyDetectionSection');
    if (proxyDetectionSection) {
        proxyDetectionSection.style.display = 'none';
    }
    
    if (confirmed === 'yes') {
        // User confirms it's a proxy submission
        document.getElementById('proxyContactSection').style.display = 'block';
        showTempMessage('Proxy submission confirmed. Please fill in the impacted user\'s information.');
    } else {
        // User says it's not a proxy submission
        document.getElementById('proxyContactSection').style.display = 'none';
        
        // Clear any proxy-related hidden fields
        document.getElementById('actualUserNameHidden').value = '';
        document.getElementById('actualUserEmailHidden').value = '';
        document.getElementById('actualUserPhoneHidden').value = '';
        
        showTempMessage('Proxy submission dismissed. This will be treated as a direct submission.');
    }
}

// Quick Submit Functions
function submitTicketDirectly() {
    // Capture AI questions and answers (even if empty)
    captureAIQuestionsAndAnswers();
    
    // Submit the form to the webhook
    const form = document.getElementById('ticketForm');
    if (form) {
        console.log('Quick submitting form to webhook...');
        
        // Submit the form
        form.submit();
        
        // Hide summary page and show confirmation
        document.getElementById('summaryPage').style.display = 'none';
        
        const confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.classList.add('show');
        
        // Update confirmation details
        const userEmail = document.getElementById('email').value;
        const userName = document.getElementById('fullName').value;
        document.getElementById('confirmEmail').textContent = userEmail;
        
            // Update the thank you message with name
    const thankYouHeading = confirmationMessage.querySelector('h2');
    thankYouHeading.textContent = `Thank You, ${userName}!`;
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Show success message
        showTempMessage('Ticket submitted successfully!');
    } else {
        console.error('Form not found for quick submit!');
        showTempMessage('Error: Form not found');
    }
}
