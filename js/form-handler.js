// Form handling module - validation, navigation, and submission

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Get DOM elements
        const filePreview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const imagePreview = document.getElementById('imagePreview');
        const base64Input = document.getElementById('screenshotBase64');
        
        // Validate DOM elements exist
        if (!filePreview || !fileName || !imagePreview || !base64Input) {
            console.error('Required DOM elements for file upload not found');
            return;
        }
        
        // Set file name
        fileName.textContent = file.name;
        
        // Use single FileReader instance for both preview and base64 conversion
        const reader = new FileReader();
        
        reader.onload = function(evt) {
            try {
                // Set image preview
                imagePreview.src = evt.target.result;
                filePreview.classList.add('show');
                
                // Extract base64 from the same result (more efficient)
                const base64 = evt.target.result.split(',')[1];
                base64Input.value = base64;
                
                console.log('File uploaded successfully:', file.name);
            } catch (error) {
                console.error('Error processing file result:', error);
                // Cleanup on error
                base64Input.value = '';
                filePreview.classList.remove('show');
            }
        };
        
        reader.onerror = function() {
            console.error('Error reading file:', file.name);
            // Cleanup on error
            base64Input.value = '';
            filePreview.classList.remove('show');
            fileName.textContent = '';
        };
        
        reader.onabort = function() {
            console.warn('File reading was aborted:', file.name);
            // Cleanup on abort
            base64Input.value = '';
            filePreview.classList.remove('show');
            fileName.textContent = '';
        };
        
        // Start reading the file
        reader.readAsDataURL(file);
        
        // Cleanup: clear reference after use to allow garbage collection
        reader.onloadend = function() {
            // Clear the reference after processing is complete
            reader.onload = null;
            reader.onerror = null;
            reader.onabort = null;
            reader.onloadend = null;
        };
    }
}

function removeFile() {
    // Get DOM elements
    const screenshotInput = document.getElementById('screenshot');
    const filePreview = document.getElementById('filePreview');
    const base64Input = document.getElementById('screenshotBase64');
    const fileName = document.getElementById('fileName');
    const imagePreview = document.getElementById('imagePreview');
    
    // Clear file input
    if (screenshotInput) {
        screenshotInput.value = '';
    }
    
    // Hide preview
    if (filePreview) {
        filePreview.classList.remove('show');
    }
    
    // Clear base64 data
    if (base64Input) {
        base64Input.value = '';
    }
    
    // Clear file name and image preview
    if (fileName) {
        fileName.textContent = '';
    }
    
    if (imagePreview) {
        imagePreview.src = '';
    }
    
    console.log('File removed successfully');
}

function handleNextButton(event) {
    // Validate required fields
    if (!document.getElementById('ticketForm').checkValidity()) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Capture AI review state and content
    captureAIReviewData();
    
    // Show loading state on button
    const nextBtn = event.currentTarget;
    const originalText = nextBtn.textContent;
    nextBtn.textContent = 'Processing...';
    nextBtn.disabled = true;
    
    // Show summary page
    showSummaryPage();
    
    // Reset button after a short delay
    setTimeout(() => {
        nextBtn.textContent = originalText;
        nextBtn.disabled = false;
    }, 2000);
}

function handleBackToEdit() {
    // Hide summary page and show form, alert, and sample data section
    document.getElementById('summaryPage').style.display = 'none';
    document.querySelector('form').style.display = 'block';
    document.querySelector('.alert').style.display = 'block';
    document.querySelector('.sample-data-section').style.display = 'block';
    
    // Hide confirmed urgency section when going back to edit
    const confirmedUrgencySection = document.getElementById('confirmedUrgencySection');
    if (confirmedUrgencySection) {
        confirmedUrgencySection.style.display = 'none';
    }
}

async function handleSubmitTicket() {
    // Capture AI questions and answers
    captureAIQuestionsAndAnswers();
    
    // Ensure URL parameters are captured in hidden fields before submission
    const urlParams = new URLSearchParams(window.location.search);
    const computerName = urlParams.get('computer');
    const userName = urlParams.get('user');
    
    if (computerName) {
        document.getElementById('computerNameHidden').value = computerName;
        console.log('Computer name set before submission:', computerName);
    }
    
    if (userName) {
        document.getElementById('userNameHidden').value = userName;
        console.log('User name set before submission:', userName);
    }
    
    // Submit the form to the webhook
    const form = document.getElementById('ticketForm');
    if (form) {
        console.log('Submitting form to webhook...');
        
        // Show loading state
        const submitBtn = document.getElementById('submitTicketBtn');
        if (!submitBtn) {
            console.error('Submit button not found!');
            return;
        }
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Debug: Log all form data before submission
        const formData = new FormData(form);
        
        // Ensure all required fields have values
        const requiredFields = ['fullName', 'companyName', 'email', 'phone', 'notes'];
        requiredFields.forEach(field => {
            const fieldValue = formData.get(field);
            if (!fieldValue) {
                console.warn(`Required field ${field} is empty`);
            }
        });
        
        console.log('Form data being submitted:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Log the total number of form fields
        console.log(`Total form fields: ${formData.entries().length}`);
        
        // Submit the form to hidden iframe (avoids CORS issues)
        console.log('Submitting form to hidden iframe...');
        
        // Add a listener to the iframe to detect when submission completes
        const iframe = document.querySelector('iframe[name="hiddenSubmitFrame"]');
        console.log('Iframe found:', !!iframe);
        
        if (iframe) {
            // Test if iframe is accessible
            try {
                iframe.onload = function() {
                    console.log('Form submission completed via iframe');
                    console.log('Iframe content:', iframe.contentDocument?.body?.innerHTML || 'No content');
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                };
                
                iframe.onerror = function() {
                    console.error('Form submission failed via iframe');
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                };
            } catch (e) {
                console.error('Error setting up iframe listeners:', e);
            }
        } else {
            console.error('Hidden iframe not found!');
        }
        
        // Get the webhook URL from the configuration endpoint
        try {
            const response = await fetch('get-config.php');
            const config = await response.json();
            
            if (config.webhookUrl) {
                form.action = config.webhookUrl;
                console.log('Webhook URL loaded from configuration:', config.webhookUrl);
            } else {
                console.error('Webhook URL not found in configuration');
                return;
            }
        } catch (error) {
            console.error('Error loading webhook configuration:', error);
            return;
        }
        
        // Submit the form
        form.submit();
        
        // Fallback: reset button after delay if iframe events don't fire
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
        
        // Hide summary page and show confirmation
        const summaryPage = document.getElementById('summaryPage');
        if (summaryPage) {
            summaryPage.style.display = 'none';
        }
        
        // Hide confirmed urgency section when submitting
        const confirmedUrgencySection = document.getElementById('confirmedUrgencySection');
        if (confirmedUrgencySection) {
            confirmedUrgencySection.style.display = 'none';
        }
        
        // Show confirmation message
        const confirmationMessage = document.getElementById('confirmationMessage');
        if (confirmationMessage) {
            confirmationMessage.classList.add('show');
            
            // Update confirmation details
            const userEmail = document.getElementById('email')?.value || '';
            const userName = document.getElementById('fullName')?.value || '';
            
            const confirmEmail = document.getElementById('confirmEmail');
            if (confirmEmail) {
                confirmEmail.textContent = userEmail;
            }
            
            // Update the thank you message with name
            const thankYouHeading = confirmationMessage.querySelector('h2');
            if (thankYouHeading) {
                thankYouHeading.textContent = `Thank You, ${userName}!`;
            }
        }
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        console.error('Form not found!');
        showTempMessage('Error: Form not found');
    }
}

function showSummaryPage() {
    try {
        console.log('showSummaryPage called');
        
        // Populate summary
        const summaryName = document.getElementById('summaryName');
        const summaryCompany = document.getElementById('summaryCompany');
        const summaryEmail = document.getElementById('summaryEmail');
        const summaryPhone = document.getElementById('summaryPhone');
        const summaryNotes = document.getElementById('summaryNotes');
        
        console.log('Summary elements found:', {
            summaryName: !!summaryName,
            summaryCompany: !!summaryCompany,
            summaryEmail: !!summaryEmail,
            summaryPhone: !!summaryPhone,
            summaryNotes: !!summaryNotes
        });
        
        if (summaryName && summaryCompany && summaryEmail && summaryPhone && summaryNotes) {
            summaryName.textContent = document.getElementById('fullName').value;
            summaryCompany.textContent = document.getElementById('companyName').value;
            summaryEmail.textContent = document.getElementById('email').value;
            summaryPhone.textContent = document.getElementById('phone').value;
            summaryNotes.textContent = document.getElementById('notes').value;
        }
        
        // Display URL parameters if they exist
        const computerName = document.getElementById('computerNameHidden').value;
        const userName = document.getElementById('userNameHidden').value;
        const computerDisplay = document.getElementById('computerDisplay');
        const computerText = document.getElementById('computerText');
        const userDisplay = document.getElementById('userDisplay');
        const userText = document.getElementById('userText');
        
        if (computerName && computerDisplay && computerText) {
            computerText.textContent = computerName;
            computerDisplay.style.display = 'block';
        } else if (computerDisplay) {
            computerDisplay.style.display = 'none';
        }
        
        if (userName && userDisplay && userText) {
            userText.textContent = userName;
            userDisplay.style.display = 'block';
        } else if (userDisplay) {
            userDisplay.style.display = 'none';
        }
        
        // Hide form, alert, and sample data section, then show summary
        const form = document.querySelector('form');
        const alert = document.querySelector('.alert');
        const sampleDataSection = document.querySelector('.sample-data-section');
        const summaryPage = document.getElementById('summaryPage');
        
        console.log('Elements to hide/show:', {
            form: !!form,
            alert: !!alert,
            sampleDataSection: !!sampleDataSection,
            summaryPage: !!summaryPage
        });
        
        if (form) form.style.display = 'none';
        if (alert) alert.style.display = 'none';
        if (sampleDataSection) sampleDataSection.style.display = 'none';
        if (summaryPage) summaryPage.style.display = 'block';
        
        // Generate AI questions and subject only if AI review is enabled
        const aiReviewEnabled = isAIReviewEnabled();
        console.log('showSummaryPage - AI Review enabled:', aiReviewEnabled);
        
        if (aiReviewEnabled) {
            console.log('Generating AI questions...');
            generateFollowUpQuestions(document.getElementById('notes').value);
        } else {
            console.log('AI review disabled - showing simple confirmation...');
            // Show simple confirmation without AI features
            showSimpleConfirmation();
        }
        
        // Hide any previously confirmed urgency sections
        const confirmedUrgencySection = document.getElementById('confirmedUrgencySection');
        if (confirmedUrgencySection) {
            confirmedUrgencySection.style.display = 'none';
        }
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Error in showSummaryPage:', error);
        // Fallback: just show the summary page
        const summaryPage = document.getElementById('summaryPage');
        if (summaryPage) summaryPage.style.display = 'block';
    }
}

function captureAIQuestionsAndAnswers() {
    const questionsHidden = document.getElementById('aiQuestionsHidden');
    const answersHidden = document.getElementById('aiAnswersHidden');
    
    // If AI review is disabled, use simple values
    if (!isAIReviewEnabled()) {
        questionsHidden.value = 'No AI questions generated - AI review disabled';
        answersHidden.value = 'No answers provided - AI review disabled';
        document.getElementById('urgencyHidden').value = 'MEDIUM: Standard support request';
        console.log('AI review disabled - using default values for submission');
        return;
    }
    
    // Check if we're on the summary page
    const summaryQuestionsContent = document.getElementById('summaryQuestionsContent');
    const summaryAnswersContainer = document.getElementById('summaryAnswersContainer');
    
    if (summaryQuestionsContent && summaryQuestionsContent.innerHTML.trim()) {
        // We're on the summary page with questions
        const questionsText = summaryQuestionsContent.innerText;
        const answerInputs = summaryAnswersContainer.querySelectorAll('textarea');
        
        // Capture questions
        questionsHidden.value = questionsText;
        
        // Capture answers
        const answers = [];
        answerInputs.forEach((input, index) => {
            if (input.value.trim()) {
                answers.push(`Question ${index + 1}: ${input.value.trim()}`);
            }
        });
        
        answersHidden.value = answers.join('\n');
        
        // Urgency and impact are already captured in hidden fields when AI generates questions
        console.log('Urgency level captured:', document.getElementById('urgencyHidden').value);
        
        // Log URL parameters if they exist
        const computerName = document.getElementById('computerNameHidden').value;
        const userName = document.getElementById('userNameHidden').value;
        if (computerName || userName) {
            console.log('URL parameters captured:', {
                computer: computerName,
                user: userName
            });
        }
        
        // Debug: Log all hidden field values before submission
        console.log('All hidden field values before submission:', {
            computerName: document.getElementById('computerNameHidden').value,
            userName: document.getElementById('userNameHidden').value,
            aiQuestions: document.getElementById('aiQuestionsHidden').value,
            aiAnswers: document.getElementById('aiAnswersHidden').value,
            urgency: document.getElementById('urgencyHidden').value
        });
        
        // Capture proxy contact information if available
        const proxyContactSection = document.getElementById('proxyContactSection');
        if (proxyContactSection && proxyContactSection.style.display !== 'none') {
            const actualUserName = document.getElementById('actualUserName').value;
            const actualUserEmail = document.getElementById('actualUserEmail').value;
            const actualUserPhone = document.getElementById('actualUserPhone').value;
            
            // Populate hidden fields for webhook submission
            document.getElementById('actualUserNameHidden').value = actualUserName;
            document.getElementById('actualUserEmailHidden').value = actualUserEmail;
            document.getElementById('actualUserPhoneHidden').value = actualUserPhone;
            
            if (actualUserName && actualUserEmail && actualUserPhone) {
                const proxyInfo = `PROXY SUBMISSION - Impacted User: ${actualUserName}, Email: ${actualUserEmail}, Phone: ${actualUserPhone}`;
                document.getElementById('aiQuestionsHidden').value += '\n\n' + proxyInfo;
            }
        }
    } else {
        // No questions generated
        questionsHidden.value = 'No AI questions generated';
        answersHidden.value = 'No answers provided';
        document.getElementById('urgencyHidden').value = 'MEDIUM: Standard support request';
    }
}
