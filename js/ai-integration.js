// AI Integration module - question generation, urgency assessment, proxy detection

function showAIElements() {
    // Show the AI questions section
    const aiQuestionsSection = document.getElementById('summaryQuestionsContainer');
    if (aiQuestionsSection) {
        aiQuestionsSection.style.display = 'block';
    }
}

async function generateFollowUpQuestions(notesText) {
    try {
        // Show AI elements since AI review is enabled
        showAIElements();
        
        // Collapse the summary section when AI review is enabled
        const summaryDetails = document.getElementById('summaryDetails');
        const toggleArrow = document.getElementById('toggleArrow');
        
        if (summaryDetails && toggleArrow) {
            summaryDetails.classList.remove('expanded');
            toggleArrow.classList.remove('expanded');
            toggleArrow.textContent = '▶';
            console.log('Summary section collapsed for AI workflow');
        }
        
        // API key is now secured on the server side
        
        const response = await fetch('generate-questions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notes: notesText
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Validate response structure before accessing nested properties
            if (!data || !Array.isArray(data.choices) || data.choices.length === 0 || 
                !data.choices[0] || !data.choices[0].message || 
                typeof data.choices[0].message.content !== 'string') {
                console.error('Unexpected API response structure:', data);
                throw new Error('Unexpected API response structure');
            }
            
            const content = data.choices[0].message.content.trim();
            
            console.log('Full AI response:', content);
            console.log('Response length:', content.length);
            console.log('Response contains "SUBJECT:":', content.includes('SUBJECT:'));
            console.log('Response contains "URGENCY:":', content.includes('URGENCY:'));
            console.log('Response contains "REASON:":', content.includes('REASON:'));
            
            // Parse subject, urgency assessment, and questions
            const lines = content.split('\n').filter(line => line.trim().length > 0);
            
            // Extract subject, urgency information
            let generatedSubject = 'Support Request';
            let urgencyLevel = 'MEDIUM';
            let urgencyReason = 'Standard support request';
            
            if (lines[0] && lines[0].startsWith('SUBJECT:')) {
                generatedSubject = lines[0].replace('SUBJECT:', '').trim();
            }
            if (lines[1] && lines[1].startsWith('URGENCY:')) {
                urgencyLevel = lines[1].replace('URGENCY:', '').trim();
            }
            if (lines[2] && lines[2].startsWith('REASON:')) {
                urgencyReason = lines[2].replace('REASON:', '').trim();
            }
            
            // Store subject and urgency in hidden fields
            document.getElementById('generatedSubjectHidden').value = generatedSubject;
            document.getElementById('urgencyHidden').value = `${urgencyLevel}: ${urgencyReason}`;
            
            // Update the summary title with the AI-generated subject
            document.getElementById('summarySubjectTitle').textContent = generatedSubject;
            
            // Extract questions (skip first 3 lines which are subject and urgency info)
            const questionLines = lines.slice(3).filter(line => line.trim().length > 0);
            
            console.log('Raw lines:', lines);
            console.log('Lines count:', lines.length);
            console.log('Question lines:', questionLines);
            console.log('Question count:', questionLines.length);
            console.log('First 3 lines (subject/urgency):', lines.slice(0, 3));
            console.log('Remaining lines (questions):', lines.slice(3));
            
            // Check if this is a proxy submission by analyzing both the original notes and AI questions
            const originalNotes = document.getElementById('notes').value.toLowerCase();
            console.log('Original notes for proxy detection:', originalNotes);
            
            const isProxySubmission = 
                // Check original notes for proxy indicators
                originalNotes.includes('on behalf of') ||
                originalNotes.includes('submitting for') ||
                originalNotes.includes('our client') ||
                originalNotes.includes('my colleague') ||
                originalNotes.includes('they need help') ||
                originalNotes.includes('client having trouble') ||
                originalNotes.includes('submitting this on behalf') ||
                // Also check AI questions for contact info requests
                questionLines.some(question => 
                    question.toLowerCase().includes('actual user') ||
                    question.toLowerCase().includes('information') ||
                    question.toLowerCase().includes('name, email, and phone') ||
                    question.toLowerCase().includes('so we can contact them')
                );
            
            console.log('Is proxy submission:', isProxySubmission);
            console.log('Proxy indicators found in notes:', {
                'on behalf of': originalNotes.includes('on behalf of'),
                'submitting for': originalNotes.includes('submitting for'),
                'our client': originalNotes.includes('our client'),
                'my colleague': originalNotes.includes('my colleague'),
                'they need help': originalNotes.includes('they need help'),
                'client having trouble': originalNotes.includes('client having trouble'),
                'submitting this on behalf': originalNotes.includes('submitting this on behalf')
            });
            
            // If it's a proxy submission, show the detection confirmation section
            if (isProxySubmission) {
                console.log('Proxy submission detected - showing "Submitting for someone else?" section');
                const proxyDetectionSection = document.getElementById('proxyDetectionSection');
                if (proxyDetectionSection) {
                    proxyDetectionSection.style.display = 'block';
                }
            }
            
            // Format and display the questions in summary page
            const summaryQuestionsContent = document.getElementById('summaryQuestionsContent');
            const summaryAnswersContainer = document.getElementById('summaryAnswersContainer');
            
            if (summaryQuestionsContent && summaryAnswersContainer) {
                // We're on the summary page - only show questions with answer fields
                // Hide the loading message first
                const loadingMessage = document.getElementById('aiLoadingMessage');
                if (loadingMessage) {
                    loadingMessage.style.display = 'none';
                }
                
                // Clear the content and prepare for questions
                summaryQuestionsContent.innerHTML = '';
                
                // Show urgency confirmation section
                const urgencySection = document.getElementById('urgencyConfirmationSection');
                const urgencyText = document.getElementById('urgencyConfirmationText');
                
                if (!urgencySection || !urgencyText) {
                    console.error('Urgency section elements not found');
                    return;
                }
                
                if (urgencyLevel === 'HIGH') {
                    urgencyText.innerHTML = `
                        <div style="background: #dc3545; color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);">
                            <strong>High Priority Issue Detected</strong><br>
                            <small style="font-size: 14px; opacity: 0.9; margin-top: 6px; display: block;"></small>
                        </div>
                        <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;"><strong>We've identified this as a high-priority issue.</strong> To help us respond appropriately, please confirm if this urgency level is correct and tell us about the business impact.</p>
                    `;
                    urgencyText.querySelector('small').textContent = urgencyReason;
                } else if (urgencyLevel === 'MEDIUM') {
                    urgencyText.innerHTML = `
                        <div style="background: #ffc107; color: #212529; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);">
                            <strong>Medium Priority Issue</strong><br>
                            <small style="font-size: 14px; opacity: 0.8; margin-top: 6px; display: block;"></small>
                        </div>
                        <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;"><strong>We've identified this as a medium-priority issue.</strong> Please confirm if this urgency level seems correct to you.</p>
                    `;
                    urgencyText.querySelector('small').textContent = urgencyReason;
                } else {
                    urgencyText.innerHTML = `
                        <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);">
                            <strong>Low Priority Issue</strong><br>
                            <small style="font-size: 14px; opacity: 0.9; margin-top: 6px; display: block;"></small>
                        </div>
                        <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;"><strong>We've identified this as a low-priority issue.</strong> Please confirm if this urgency level seems correct to you.</p>
                    `;
                    urgencyText.querySelector('small').textContent = urgencyReason;
                }
                
                urgencySection.style.display = 'block';
                

                
                // Create answer fields for each question using DocumentFragment for better performance
                summaryAnswersContainer.innerHTML = '';
                const questionFragment = document.createDocumentFragment();
                
                questionLines.forEach((question, index) => {
                    if (question.trim().length > 0) { 
                        const questionDiv = document.createElement('div');
                        questionDiv.style.cssText = `
                            margin-bottom: 20px;
                        `;
                        
                        const questionText = document.createElement('div');
                        questionText.innerHTML = question;
                        questionText.style.cssText = `
                            margin-bottom: 15px;
                            font-weight: 600;
                            color: #165D7D;
                            font-size: 16px;
                            line-height: 1.5;
                        `;
                        
                        // Add the question text first
                        questionDiv.appendChild(questionText);
                        
                        // No special styling needed - proxy detection is handled separately
                        
                        const answerInput = document.createElement('textarea');
                        answerInput.name = `aiAnswer${index + 1}`;
                        answerInput.placeholder = 'Your answer (optional)';
                        answerInput.rows = '3';
                        answerInput.style.cssText = `
                            width: 100%;
                            padding: 15px;
                            border: 2px solid #E0E0E0;
                            font-size: 16px;
                            border-radius: 8px;
                            font-family: 'Mukta Malar', sans-serif;
                            resize: vertical;
                            min-height: 100px;
                            transition: all 0.3s ease;
                        `;
                        
                        // Add focus styles
                        answerInput.addEventListener('focus', function() {
                            this.style.borderColor = '#165D7D';
                            this.style.boxShadow = '0 0 0 3px rgba(22, 93, 125, 0.1)';
                        });
                        
                        answerInput.addEventListener('blur', function() {
                            this.style.borderColor = '#E0E0E0';
                            this.style.boxShadow = 'none';
                        });
                        
                        questionDiv.appendChild(answerInput);
                        questionFragment.appendChild(questionDiv);
                    }
                });
                
                // Batch append all questions at once to minimize reflows
                summaryAnswersContainer.appendChild(questionFragment);
            }
            
                            // Questions generated successfully
                console.log('AI questions generated successfully');
                
                // Use requestAnimationFrame for non-critical UI updates to improve responsiveness
                requestAnimationFrame(() => {
                    // Any additional UI updates can go here if needed
                    console.log('AI processing complete - UI updated');
                });
        } else {
            throw new Error('Failed to get questions');
        }
    } catch (error) {
        console.error('Error generating questions:', error);
        
        // Hide loading message and show error state
        const loadingMessage = document.getElementById('aiLoadingMessage');
        if (loadingMessage) {
            loadingMessage.innerHTML = `
                <div style="text-align: center; color: #A3623F; font-style: italic;">
                    <div style="margin-bottom: 15px;"></div>
                    <div style="font-size: 16px; font-weight: 500;">AI questions unavailable</div>
                    <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">You can still submit your ticket - we'll help you!</div>
                </div>
            `;
        }
    }
}

// AI Review Functions
function initializeAIReview() {
    const aiReviewCheckbox = document.getElementById('aiReviewEnabled');
    if (aiReviewCheckbox) {
        // Add change listener only (no initial message)
        aiReviewCheckbox.addEventListener('change', function() {
            updateAIReviewState(this.checked);
        });
    }
}

function updateAIReviewState(enabled) {
    // Update the AI questions section visibility immediately
    const aiQuestionsSection = document.getElementById('summaryQuestionsContainer');
    
    console.log('updateAIReviewState - AI questions section found:', !!aiQuestionsSection);
    
    if (aiQuestionsSection) {
        if (enabled) {
            aiQuestionsSection.style.display = 'block';
            console.log('AI questions section shown');
        } else {
            aiQuestionsSection.style.display = 'none';
            console.log('AI questions section hidden');
        }
    } else {
        console.log('AI questions section not found - cannot update visibility');
    }
    
    // Update summary section collapse/expand state based on AI review
    const summaryDetails = document.getElementById('summaryDetails');
    const toggleArrow = document.getElementById('toggleArrow');
    
    if (summaryDetails && toggleArrow) {
        if (enabled) {
            // Collapse summary when AI review is enabled
            summaryDetails.classList.remove('expanded');
            toggleArrow.classList.remove('expanded');
            toggleArrow.textContent = '▶';
            console.log('Summary section collapsed for AI workflow');
        } else {
            // Expand summary when AI review is disabled
            summaryDetails.classList.add('expanded');
            toggleArrow.classList.add('expanded');
            toggleArrow.textContent = '▼';
            console.log('Summary section expanded for non-AI workflow');
        }
    }
    
    console.log('AI Review state changed:', enabled ? 'enabled' : 'disabled');
}

function isAIReviewEnabled() {
    const checkbox = document.getElementById('aiReviewEnabled');
    const isEnabled = checkbox ? checkbox.checked : false;
    console.log('AI Review enabled check:', {
        checkboxFound: !!checkbox,
        checkboxChecked: checkbox ? checkbox.checked : 'N/A',
        result: isEnabled
    });
    return isEnabled;
}

function getAIReviewableContent() {
    if (!isAIReviewEnabled()) {
        return null;
    }
    
    // Only extract content from fields marked as AI-reviewable
    const aiReviewableFields = document.querySelectorAll('[data-ai-reviewable="true"]');
    let content = '';
    
    aiReviewableFields.forEach(field => {
        if (field.value && field.value.trim()) {
            content += field.value.trim() + '\n';
        }
    });
    
    return content.trim() || null;
}

function captureAIReviewData() {
    const aiReviewEnabled = isAIReviewEnabled();
    const aiReviewContent = getAIReviewableContent();
    
    // Update hidden fields
    document.getElementById('aiReviewEnabledHidden').value = aiReviewEnabled ? 'true' : 'false';
    document.getElementById('aiReviewContentHidden').value = aiReviewContent || '';
    
    console.log('AI Review Data Captured:', {
        enabled: aiReviewEnabled,
        content: aiReviewContent ? 'Content captured (length: ' + aiReviewContent.length + ' chars)' : 'No content'
    });
}

function showSimpleConfirmation() {
    // For non-AI workflow, hide AI-related elements
    const summarySubjectTitle = document.getElementById('summarySubjectTitle');
    const mainPageTitle = document.getElementById('mainPageTitle');
    
    if (summarySubjectTitle) {
        summarySubjectTitle.textContent = 'Help Request';
    }
    
    if (mainPageTitle) {
        mainPageTitle.textContent = 'Review Your Help Request';
    }
    
    // Hide the AI questions section by finding the container with the loading message
    const aiQuestionsSection = document.getElementById('summaryQuestionsContainer');
    
    console.log('showSimpleConfirmation - AI questions section found:', !!aiQuestionsSection);
    if (aiQuestionsSection) {
        aiQuestionsSection.style.display = 'none';
        console.log('AI questions section hidden');
    } else {
        console.log('AI questions section not found - cannot hide');
    }
    
    // Expand the summary section when AI review is disabled
    const summaryDetails = document.getElementById('summaryDetails');
    const toggleArrow = document.getElementById('toggleArrow');
    
    if (summaryDetails && toggleArrow) {
        summaryDetails.classList.add('expanded');
        toggleArrow.classList.add('expanded');
        toggleArrow.textContent = '▼';
        console.log('Summary section expanded for non-AI workflow');
    }
    
    // Set default values for hidden fields
    document.getElementById('generatedSubjectHidden').value = 'Help Request';
    document.getElementById('urgencyHidden').value = 'MEDIUM: Standard support request';
    document.getElementById('aiQuestionsHidden').value = 'No AI questions generated - AI review disabled';
    document.getElementById('aiAnswersHidden').value = 'No answers provided - AI review disabled';
    
    console.log('Simple confirmation shown - AI features disabled, AI questions section hidden, summary expanded');
}
