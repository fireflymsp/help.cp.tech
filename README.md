# AI-Powered Support Ticket Form

A modern, intelligent ticket submission form that uses OpenAI's GPT-4 to generate helpful follow-up questions for faster issue resolution. **Now with enhanced security, urgency assessment, proxy submission detection, and optimized mobile experience.**

## 🔐 Secret Management

**This project uses Azure App Service for professional secret management:**
- Secrets are stored securely in Azure App Service environment variables
- **Primary AI Service**: Azure OpenAI Service (recommended)
- **Fallback AI Service**: OpenAI API (backup option)
- **Required Secrets**: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT_NAME`, `WEBHOOK_URL`
- **Optional Fallback**: `OPENAI_API_KEY` (for backup OpenAI API access)
- Secrets are automatically available via `getenv()` calls
- **NEVER hardcode API keys or create .env files**

## 🚀 **Azure Migration (Complete!)**

**Current Status:** Successfully migrated from cPanel hosting to Azure App Service for better reliability and scalability.

**Azure Resources Created:**
1. ✅ **Resource Group:** `helpcptech-rg` (Central US)
2. ✅ **App Service Plan:** `helpcptech-plan` (B1 tier, Linux)
3. ✅ **Web App:** `helpcptech` (PHP 8.1 runtime)
4. ✅ **Environment Variables:** Set via Azure CLI for secure secret management

**Migration Steps Completed:**
1. ✅ Create resource group: `az group create --name helpcptech-rg --location centralus`
2. ✅ Register Microsoft.Web provider: `az provider register --namespace Microsoft.Web`
3. ✅ Create App Service Plan: `az appservice plan create --name helpcptech-plan --resource-group helpcptech-rg --sku B1 --is-linux`
4. ✅ Create Web App: `az webapp create --name helpcptech --resource-group helpcptech-rg --plan helpcptech-plan --runtime "PHP|8.1"`
5. ✅ Set environment variables: `az webapp config appsettings set --name helpcptech --resource-group helpcptech-rg --settings OPENAI_API_KEY="your-key" WEBHOOK_URL="your-webhook"`
6. ✅ Deploy code: `az webapp deploy --resource-group helpcptech-rg --name helpcptech --src-path deploy.zip`
7. ✅ Configure custom domain (help.cp.tech) - Domain configured and active

**File Structure (Azure):**
```
helpcptech-rg/                  # Azure Resource Group
├── helpcptech-plan            # App Service Plan
├── helpcptech                 # Web App
└── public_html/               # Deployed web files
    ├── generate-questions.php # Uses getenv() for Azure secrets
    ├── get-config.php        # Uses getenv() for Azure secrets
    └── [other web files...]
```

## 🎯 **Current Status: Fully Operational**

**Live Site:** `https://help.cp.tech` (Primary) | `https://helpcptech.azurewebsites.net` (Backup)

**Features Working:**
- ✅ **Custom Domain** - help.cp.tech configured and active with HTTPS
- ✅ **DNS Configuration** - A record pointing to correct Azure IP (13.89.172.22)
- ✅ **HTTPS Redirect** - HTTP automatically redirects to HTTPS
- ✅ **SSL Certificate** - Azure App Service managed certificate active and auto-renewing
- ✅ **Azure OpenAI Integration** - GPT-4o model working with AI question generation
- ✅ **Urgency Assessment** - AI-powered priority detection
- ✅ **Proxy Submission Detection** - Identifying tickets for others
- ✅ **Webhook Integration** - Sending data to configured endpoint
- ✅ **Responsive Design** - Mobile-optimized interface
- ✅ **Security** - Environment variables properly configured

## 🚀 Features

### Core Functionality
- **Contact Information Collection**: Name, company, email, phone
- **Ticket Details**: Subject and detailed notes
- **Screenshot Upload**: Optional image attachment with base64 encoding
- **Two-Step Submission Process**: Review before final submission
- **AI Review Opt-in**: Smart Ticket Review checkbox for AI-powered issue description analysis
- **Urgency Assessment**: AI-powered priority detection with user confirmation
- **Proxy Submission Support**: Intelligent detection and handling of tickets submitted on behalf of others
- **Multiple Submission Paths**: Direct submit, AI questions, or quick submit options
- **URL Parameter Support**: Automatic capture of computer and user information from URL parameters

### AI-Powered Intelligence
- **Automatic Question Generation**: AI analyzes notes and suggests up to 2 focused, essential questions
- **Smart Context Analysis**: Focuses on critical missing information for faster resolution
- **Urgency Detection**: Automatically identifies high/medium/low priority issues
- **Business Impact Assessment**: Evaluates criticality based on system status and deadlines
- **Proxy Detection**: Automatically detects when someone is submitting on behalf of another person
- **User-Friendly Approach**: Questions are completely optional and non-intimidating
- **MSP-Optimized**: Designed for Managed Service Provider workflows

### User Experience
- **Clean, Professional Design**: Modern UI with Creative Planning branding
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Professional transitions and visual feedback
- **Security Notices**: Clear warnings about sensitive data (without redundant labels)
- **Sample Data Testing**: Built-in test scenarios including proxy submissions
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: Graceful fallbacks when AI is unavailable
- **Smart UI Elements**: Scroll indicators and visual cues for better navigation
- **Streamlined Interface**: Removed redundant elements for cleaner user experience

## 🛠️ Technical Details

### Project Structure
```
cphelp/                          # cPanel account root (your hosting account)
├── .user.ini                   # Auto-loads doppler_loader.php for all PHP requests
├── doppler_loader.php          # Doppler integration for cloud-based secret management
├── README.md                   # This documentation
├── public_html/                # Web-accessible files (cPanel standard)
│   ├── cgi-bin/               # CGI scripts directory
│   ├── favicon_io/            # Favicon and app icons
│   ├── images/                # Logo and branding images
│   ├── js/                    # JavaScript modules
│   │   ├── ai-integration.js  # AI questions, urgency, proxy detection
│   │   ├── form-handler.js    # Form validation, navigation, submission
│   │   ├── main.js           # Main initialization and event binding
│   │   ├── sample-data.js    # Testing utilities
│   │   ├── ui-manager.js     # Summary pages, modals, scroll indicators
│   │   └── utils.js          # URL parsing, messages, helpers

│   ├── generate-questions.php # PHP backend for AI processing
│   ├── get-config.php        # Configuration endpoint
│   ├── index.html            # Main form file
│   ├── robots.txt            # Search engine blocking
│   ├── SETUP-SECURITY.md     # Security documentation
│   └── styles.css            # All styling and responsive design
├── logs/                      # cPanel log files (if any)
├── tmp/                       # cPanel temporary files (if any)
└── other cPanel directories   # Additional cPanel system folders
```

### Frontend Architecture
- **Modular Structure**: Clean separation of concerns with dedicated files
- **HTML5**: Semantic markup and modern form elements (`index.html`)
- **CSS3**: External stylesheet with responsive design (`styles.css`)
- **JavaScript (ES6+)**: Modular JavaScript with modern patterns (`js/` directory)
  - `main.js` - Main initialization and event binding
  - `form-handler.js` - Form validation, navigation, and submission
  - `ai-integration.js` - AI questions, urgency, proxy detection
  - `ui-manager.js` - Summary pages, modals, scroll indicators
  - `sample-data.js` - Testing utilities
  - `utils.js` - URL parsing, messages, helpers
- **Responsive Design**: Mobile-first approach with optimized breakpoints

### AI Integration
- **Primary Service**: Azure OpenAI Service (GPT-4) for intelligent question generation
- **Fallback Service**: OpenAI API (GPT-4o) as backup option
- **Server-Side Processing**: PHP proxy with Azure App Service environment variable management
- **Smart Prompting**: MSP-focused system prompts with proxy detection
- **Question Generation**: AI generates up to 2 focused, essential questions for faster issue resolution
- **Error Handling**: Graceful fallbacks when AI is unavailable
- **Urgency Assessment**: Intelligent priority classification system
- **Proxy Detection**: Content analysis for identifying submissions on behalf of others
- **AI Review System**: Optional AI-powered analysis of issue descriptions for completeness and clarity
- **Service Selection**: Automatically chooses Azure OpenAI when available, falls back to OpenAI API

### Data Handling
- **Form Validation**: Client-side validation with HTML5 attributes
- **File Processing**: Image upload with base64 conversion
- **Webhook Integration**: Direct submission to Rewst webhook endpoint
- **Data Capture**: Comprehensive collection of all form inputs and AI interactions
- **Urgency Tracking**: Priority level confirmation and adjustment capabilities
- **Proxy Data Collection**: Gathers actual user information when needed
- **URL Parameter Processing**: Automatic extraction and submission of computer and user data

## 🌐 **Custom Domain Configuration**

### Domain Setup Complete
- **Primary Domain**: `help.cp.tech` 
- **DNS A Record**: `13.89.172.22` (Azure inbound IP)
- **Domain Verification**: TXT record `asuid.help.cp.tech` → `aef5b4364996d26e3a25b8e036db7c52e4ddbb27943181c2c2bb04f94861410b`
- **HTTPS Redirect**: Enabled - all HTTP traffic redirects to HTTPS
- **SSL Certificate**: Azure App Service managed certificate (auto-provisioning)

### DNS Configuration
```
A Record:
Name: help.cp.tech
Type: A
Value: 13.89.172.22
TTL: 3600

TXT Record (for verification):
Name: asuid.help.cp.tech
Type: TXT
Value: aef5b4364996d26e3a25b8e036db7c52e4ddbb27943181c2c2bb04f94861410b
TTL: 3600
```

### SSL Certificate Status
- **Type**: Azure App Service Managed Certificate (Free)
- **Status**: ✅ Active and working
- **Auto-Renewal**: Enabled - certificate will automatically renew before expiration
- **Next Renewal**: January 2026 (30 days before Feb 28, 2026 expiration)
- **HTTPS-Only Mode**: Enabled for security

### Troubleshooting Custom Domain
If you encounter issues with the custom domain:

1. **Verify DNS**: `nslookup help.cp.tech` should return `13.89.172.22`
2. **Check HTTP Redirect**: `curl -I http://help.cp.tech` should return 301 redirect
3. **SSL Certificate**: May take 15-30 minutes to provision after DNS changes
4. **Azure Status**: Check `az webapp config hostname list --webapp-name helpcptech --resource-group helpcptech-rg`

## 🔒 Security Enhancements

### Environment Variable Configuration
- **Server-Level Variables**: API key and webhook URL stored securely in server environment
- **No Configuration Files**: No sensitive files in the project directory
- **No Hardcoded Keys**: API credentials completely removed from source code
- **Standard Practice**: Uses standard environment variable approach
- **Easy Deployment**: Simple environment variable management for different hosting environments

### API Key Protection
- **Environment Variable Storage**: API key stored securely in `.env` file
- **Server-Side Processing**: API key moved to PHP backend (`generate-questions.php`)
- **No Client Exposure**: API credentials no longer visible in browser source
- **Secure Communication**: Direct API calls from server to OpenAI
- **Rate Limiting**: Built-in protection against API abuse
- **Version Control Safe**: API keys will never be accidentally committed to repositories

### Data Privacy
- **Form Data**: Sent to your webhook endpoint only
- **Screenshots**: Converted to base64 and included in submission
- **AI Questions**: Generated server-side, not stored by OpenAI
- **User Confirmation**: Urgency levels require explicit user confirmation

### Security Notices
- **Clear Warnings**: Prominent alerts about sensitive data sharing (icon + message only)
- **Form Validation**: Client-side validation prevents malicious submissions
- **File Type Restrictions**: Image uploads only, with size limitations

### Search Engine Blocking
- **Comprehensive Meta Tags**: Blocks all major search engines (Google, Bing, Yahoo, DuckDuckGo)
- **International Protection**: Blocks Yandex, Baidu, and other global search engines
- **Social Media Crawlers**: Blocks Facebook, Twitter, LinkedIn, WhatsApp, Telegram bots
- **Archive Prevention**: Blocks Internet Archive, Wayback Machine, and archival services
- **Robots.txt**: Server-level blocking of all crawlers and bots
- **Security Headers**: Referrer control and additional privacy protection
- **Zero Indexing**: Form will never appear in search results or social media previews

## 🤖 AI Review Feature

### Smart Ticket Review System
The form now includes an optional AI review feature that allows users to opt-in to intelligent analysis of their issue descriptions before submission.

### How It Works
- **Pre-checked by Default**: "Smart Ticket Review" is enabled by default for optimal user experience
- **Information Modal**: Detailed explanation of what the AI reviews and what it doesn't see
- **Privacy-First**: Only technical issue details are analyzed, never personal information
- **Visual Indicators**: Badge appears next to the Issue field when AI review is enabled
- **Content Extraction**: Only fields marked as AI-reviewable are processed

### What the AI Reviews
- ✓ Issue description text only
- ✓ Technical problem details
- ✓ Error messages and symptoms
- ✓ System behavior descriptions

### What the AI Does NOT See
- ✗ Personal information (name, email, phone)
- ✗ Company details
- ✗ Account numbers or passwords
- ✗ Payment information
- ✗ File attachments

### Benefits
- **Faster Resolution**: AI identifies missing critical information
- **Better Prioritization**: Helps ensure urgent issues are properly flagged
- **Reduced Back-and-Forth**: Fewer clarification emails needed
- **Improved Accuracy**: More complete information leads to better support

### Technical Implementation
- **Client-Side Flag**: JavaScript tracks AI review opt-in state
- **Content Isolation**: Only extracts content from fields with `data-ai-reviewable="true"`
- **Hidden Fields**: AI review state and content are captured in hidden form fields
- **Accessibility**: Full keyboard navigation and ARIA support for the information modal

## 🔗 URL Parameter Support

### Automatic System Information Capture
The form automatically detects and captures system information from URL parameters, making it easy to pre-populate tickets with computer and user details.

### Supported Parameters
- **`computer`**: Computer name or identifier (e.g., `LAPTOP-AILFRC52`)
- **`user`**: Username or user identifier (e.g., `brettweese`)

### Usage Examples
```
https://help.cp.tech/?computer=LAPTOP-AILFRC52&user=brettweese
https://yoursite.com/tickets/?computer=DESKTOP-ABC123&user=johnsmith
```

### Features
- **Automatic Detection**: Parameters are parsed on page load
- **Visual Feedback**: Users see a confirmation message when parameters are detected
- **Summary Display**: Parameters are shown in the ticket summary for verification
- **Webhook Submission**: Computer and user information is included in the final submission
- **Error Handling**: Graceful fallback if parameters are missing or malformed

## 📱 Mobile Experience

### Responsive Design
- **Mobile-First Approach**: Optimized for all screen sizes
- **Touch-Friendly Interface**: Proper button sizes and spacing
- **Optimized Layout**: Reduced padding and margins for mobile devices
- **Header Layout**: Horizontal logo + title layout on most mobile devices
- **Smart Stacking**: Only stacks on very small screens (under 400px)

### Mobile Optimizations
- **Better Spacing**: Reduced excessive margins and padding for more compact mobile layout
- **Improved Touch Targets**: All buttons and inputs meet 44px minimum height for better accessibility
- **Enhanced Forms**: Optimized input sizing with 16px font size and proper padding
- **AI Questions**: Streamlined question cards with reduced spacing for mobile viewing
- **Urgency Assessment**: Mobile-friendly confirmation interfaces with compact layouts
- **Sample Data**: Improved button layout and spacing for mobile devices
- **Responsive Breakpoints**: Optimized for 768px, 400px, and very small screens
- **Header Optimization**: Reduced header height and improved logo sizing for mobile

## 📋 Setup Instructions

### 1. Prerequisites
- OpenAI API key
- Azure account with CLI access
- **PHP with cURL extension enabled** (required for OpenAI API calls)
- Modern web browser
- SSL certificate (included with Azure App Service)

### 2. Configuration

#### Environment Variables Setup
1. **Azure App Service Environment Variables**:
   ```bash
   # Set environment variables in Azure App Service
   az webapp config appsettings set --name helpcptech --resource-group helpcptech-rg --settings \
     AZURE_OPENAI_ENDPOINT="https://helpcptech-openai.openai.azure.com/" \
     AZURE_OPENAI_API_KEY="your-azure-openai-key-here" \
     AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
     OPENAI_API_KEY="your-openai-key-here" \
     WEBHOOK_URL="your-webhook-url-here"
   ```

2. **Automatic configuration via Azure**:
   - Environment variables are automatically available to all PHP requests
   - PHP files use `getenv()` to access the variables
   - Professional, enterprise-grade secret management with Azure Key Vault integration
   - No local configuration files needed

#### Alternative: Server Environment Variables
If you prefer to use server-level environment variables:

1. **For cPanel hosting**:
   - Contact your hosting provider to set environment variables
   - Or use `.htaccess` method (less secure)

2. **For VPS/server hosting**:
   ```bash
   export OPENAI_API_KEY='your-actual-api-key-here'
   export WEBHOOK_URL='your-webhook-url-here'
   ```

3. **For Docker/Container hosting**:
   ```yaml
   environment:
     - OPENAI_API_KEY=your-actual-api-key-here
     - WEBHOOK_URL=your-webhook-url-here
   ```

### 3. Azure Deployment
1. **Create Azure Resources**:
   ```bash
   # Create resource group
   az group create --name helpcptech-rg --location centralus
   
   # Create App Service Plan
   az appservice plan create --name helpcptech-plan --resource-group helpcptech-rg --sku B1 --is-linux
   
   # Create Web App
   az webapp create --name helpcptech --resource-group helpcptech-rg --plan helpcptech-plan --runtime "PHP|8.1"
   
   # Create Azure OpenAI resource
   az cognitiveservices account create \
     --name helpcptech-openai \
     --resource-group helpcptech-rg \
     --location centralus \
     --kind OpenAI \
     --sku S0
   ```

2. **Deploy Code**:
   ```bash
   # Zip your files (excluding secrets)
   zip -r deploy.zip public_html/ -x "*.env" "*.bashrc" "doppler_loader.php" ".user.ini"
   
   # Deploy to Azure
   az webapp deployment source config-zip --resource-group helpcptech-rg --name helpcptech --src deploy.zip
   ```

3. **Test Functionality**:
   - Fill out the form
   - Click "Next" to see summary and AI questions
   - Verify urgency assessment and confirmation
   - Test proxy submission scenarios
   - Verify webhook submission

## 🔧 Customization

### Development Guidelines

**When writing code, always:**
1. **Use `getenv()` to retrieve secrets** - Never hardcode API keys
2. **Add error checking for missing secrets** - Validate environment variables are loaded
3. **Never include/require config files for secrets** - They're auto-loaded by Azure App Service
4. **Assume secrets are already available in environment** - Thanks to Azure App Service integration
5. **Support both Azure OpenAI and OpenAI API** - Azure OpenAI preferred, OpenAI API as fallback

**Example:**
```php
$azureEndpoint = getenv('AZURE_OPENAI_ENDPOINT');
$azureKey = getenv('AZURE_OPENAI_API_KEY');
$openaiKey = getenv('OPENAI_API_KEY');

if (empty($azureEndpoint) && empty($openaiKey)) {
    error_log('ERROR: No AI service configuration found');
    http_response_code(500);
    exit('Configuration error');
}
```

### Styling
- **Colors**: Modify CSS variables for brand consistency
- **Fonts**: Update Google Fonts imports
- **Layout**: Adjust container widths and spacing
- **Header**: Customize logo and title positioning

### AI Behavior
- **Question Count**: Modify `max_tokens` and prompt for different question counts
- **Tone**: Adjust system prompt for different support styles
- **Urgency Thresholds**: Customize priority detection logic
- **Proxy Detection**: Enhance keywords for better proxy identification
- **Timing**: Change auto-generation delay (currently immediate)

### Form Fields
- **Required Fields**: Add/remove `required` attributes
- **Validation**: Customize HTML5 validation patterns
- **Labels**: Update field names and descriptions

## 📱 User Flow

### Step 1: Form Completion
1. User fills out contact information
2. Provides ticket subject and detailed notes
3. Optionally uploads screenshot
4. Clicks "Next" button

### Step 2: Review & AI Analysis
1. Summary page displays all information
2. AI automatically generates relevant questions
3. **Urgency assessment displayed with confirmation options**
4. **Proxy detection if submitting on behalf of someone else**
5. User can optionally answer questions
6. User confirms or adjusts urgency level
7. User clicks "Submit Ticket" or uses quick submit options

### Step 3: Confirmation
1. Success message appears
2. Form data sent to webhook
3. User receives confirmation

## 🚨 Troubleshooting

### AI Questions Not Appearing
- Check browser console for errors
- Verify PHP backend is accessible
- Ensure notes field has sufficient content (>30 characters)
- Check server error logs for PHP issues

### JavaScript Syntax Errors
- If you see "Invalid or unexpected token" errors, check for malformed template literals
- Ensure all template literals (backticks) are properly opened and closed
- Verify JavaScript syntax with `node -c scripts.js` command
- Check for missing semicolons or brackets in complex functions

### Form Submission Issues
- Verify webhook URL is accessible
- Check form validation requirements
- Ensure all required fields are completed
- Test with different browsers/devices

### Urgency Assessment Issues
- Verify AI questions are generating properly
- Check urgency confirmation section visibility
- Ensure urgency adjustment form works correctly

### Mobile Layout Issues
- Clear browser cache
- Verify CSS file paths
- Check for conflicting stylesheets
- Test responsive breakpoints

### Proxy Submission Issues
- Verify AI is detecting proxy keywords
- Check console logs for proxy detection
- Ensure 4th question is generated for contact info
- Test with sample proxy data

## 📊 Performance

### Optimization Features
- **Lazy Loading**: AI questions generated on-demand
- **Efficient DOM**: Minimal DOM manipulation
- **Async Processing**: Non-blocking API calls
- **Responsive Images**: Optimized image handling
- **Server-Side AI**: Reduced client-side processing
- **Mobile Optimized**: Efficient layouts for all screen sizes

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Fallbacks**: Graceful degradation for older browsers

## Recent Updates

### Latest Improvements (August 2025)
- **Collapsible Summary Section**: Added attractive collapsible summary on the second form page that shows just "Your Request: [AI Summary]" by default, with a down arrow to expand and show full confirmation details
- **Smart Summary Collapse**: Summary automatically expands when AI review is disabled (showing full details) and collapses when AI review is enabled (focusing on AI-generated content)
- **Collapsible Sample Data Section**: Made the sample data testing section collapsible and starts collapsed by default for a cleaner interface
- **Explanatory Text Removed**: Removed the "Help us resolve your issue faster..." text since users can figure out the interface without it
- **Urgency Assessment Title Removed**: Removed the "Urgency Assessment" heading since the functionality is self-evident
- **AI Question Limit Reduced**: Maximum AI-generated questions reduced from 3 to 2 for more focused, streamlined user experience
- **Scroll Indicator Removed**: Completely eliminated scroll indicator arrow and related functionality for cleaner interface
- **Spacing Optimizations**: Dramatically reduced excessive margins and padding throughout summary page, eliminating giant gaps between sections
- **Conditional AI Text Display**: The explanatory text "Help us resolve your issue faster..." now only appears when Smart Ticket Review is enabled, providing cleaner interface when AI features are disabled
- **Azure OpenAI Integration Complete**: Successfully deployed GPT-4o model with working AI question generation
- **SSL Certificate Active**: Azure App Service managed certificate working with auto-renewal
- **Custom Domain Fully Operational**: https://help.cp.tech working with HTTPS
- **Custom Domain Setup**: Successfully configured help.cp.tech as primary domain with Azure App Service
- **DNS Configuration**: Properly configured A record pointing to Azure inbound IP (13.89.172.22)
- **HTTPS Security**: Enabled HTTPS-only mode with automatic HTTP to HTTPS redirects
- **SSL Certificate Management**: Azure App Service managed certificates for free SSL/TLS
- **Domain Verification**: Implemented proper TXT record verification for domain ownership
- **Security Enhancement**: Moved OpenAI API key and webhook URL from hardcoded source to secure environment variables
- **JavaScript Fix**: Fixed 'this' context issue in handleNextButton function for reliable button state management
- **DOM Safety**: Added comprehensive null checks in handleSubmitTicket to prevent runtime errors
- **File Upload Improvements**: Enhanced FileReader usage with single instance, error handling, and proper cleanup
- **Review Screen Redesign**: Removed frame-style boxes and triple-layer containers for clean, simple appearance matching main form design
- **AI Questions Styling**: Simplified AI question responses to plain form fields without frame styling
- **Search Engine Blocking**: Comprehensive protection against all search engines, social media crawlers, and archival services
- **UI Streamlining**: Removed redundant "Jump to Submit" button and optimized Quick Resolution section layout
- **Logo Updates**: Integrated new Creative Planning stacked logo with optimized sizing and responsive design
- **Cache-Busting**: Implemented version parameters and cache control for easier development and testing
- **AI Review Opt-in Feature**: Added Smart Ticket Review checkbox with detailed information modal explaining how AI reviews issue descriptions
- **Proxy Submission Confirmation**: Added a confirmation step for proxy submissions, allowing users to dismiss false detections
- **Mobile Experience Improvements**: Enhanced mobile responsiveness with better spacing, touch targets, and layout optimization
- **URL Parameter Capture**: Added ability to capture and display computer name and user from URL parameters
- **Urgency Confirmation Display**: Added persistent display of confirmed urgency level in the summary
- **Form Field Updates**: Changed "Actual User" to "Impacted User" and removed company field from proxy subform

## 🔄 Updates & Maintenance

### Recent Enhancements
- **Performance Optimization**: Implemented asynchronous API calls with reduced timeouts and intelligent fallback system in generate-questions.php (August 21, 2025)
- **Timeout Handling Fix**: Added explicit timeout error handling in generate-questions.php for better API reliability (August 21, 2025)
- **Azure Deployment**: Successfully deployed latest version to Azure App Service (August 21, 2025)
- **cPanel Structure**: Reorganized folder structure to match cPanel hosting conventions
- **Environment Configuration**: Added `.env` file support for secure API key and webhook management
- **Security Enhancement**: Moved OpenAI API key and webhook URL from hardcoded source to secure environment variables
- **JavaScript Modularization**: Refactored monolithic scripts.js into focused, maintainable modules
- **Security**: Moved API key to server-side PHP backend
- **Urgency System**: AI-powered priority detection with user confirmation
- **Proxy Support**: Enhanced detection and handling of tickets submitted for others (using "Impacted User" terminology)
- **Mobile Optimization**: Comprehensive responsive design improvements
- **Testing Tools**: Built-in sample data including proxy submissions
- **Header Layout**: Professional logo + title positioning
- **Loading States**: Better user feedback during AI processing
- **Error Handling**: Improved fallbacks and user guidance
- **Code Refactoring**: Separated inline CSS and JavaScript into external files for better maintainability
- **Bug Fixes**: Fixed malformed template literals causing JavaScript syntax errors
- **User Experience**: Added persistent urgency display after confirmation (simplified design)
- **URL Parameters**: Added support for automatic computer and user information capture
- **Mobile Experience**: Significantly improved mobile UX with better spacing and touch targets

### New Architecture Benefits
- **cPanel Compatibility**: Standard folder structure works seamlessly with cPanel hosting
- **Security**: `.env` file outside web root prevents accidental exposure
- **Environment Management**: Easy configuration for different deployment environments
- **Maintainability**: Clean separation of HTML, CSS, and JavaScript into logical modules
- **Debugging**: Easier to locate and fix issues in focused, smaller files
- **Performance**: Better caching and loading of individual modules
- **Collaboration**: Multiple developers can work on different modules simultaneously
- **Scalability**: Easier to add new features and modify existing functionality
- **Code Organization**: Clear separation of concerns (AI, UI, forms, utilities)
- **Easier Testing**: Individual modules can be tested in isolation

### Regular Tasks
- Monitor OpenAI API usage and costs
- Review AI question quality and relevance
- Update security notices and branding
- Test form functionality across devices
- Verify urgency assessment accuracy
- Test proxy submission scenarios

### Version History
- **v1.0**: Initial release with AI question generation
- **v1.1**: Two-step submission process
- **v1.2**: Summary page and optional AI answers
- **v2.0**: Security enhancements and urgency assessment
- **v2.1**: Proxy submission support and mobile optimization
- **v2.2**: Enhanced mobile experience and header improvements
- **v2.3**: AI proxy detection and comprehensive mobile fixes
- **v2.4**: UI streamlining, spacing optimizations, and AI question limit reduction (2 questions max)
- **v2.5**: Collapsible summary section, smart summary behavior, and collapsible sample data section

## 📞 Support

### Technical Issues
- Check browser console for error messages
- **Verify Azure environment variables are set** - Use `az webapp config appsettings list --name helpcptech --resource-group helpcptech-rg`
- **Check Azure logs** - Use `az webapp log tail --name helpcptech --resource-group helpcptech-rg`
- **Verify cURL extension is enabled** - Azure App Service includes this by default
- **Restart app if needed** - Use `az webapp restart --name helpcptech --resource-group helpcptech-rg`
- Test with minimal form data

### Feature Requests
- AI question customization
- Additional form fields
- Integration with other systems
- Enhanced styling options
- Urgency assessment refinements
- Mobile experience improvements

## 📄 License

This project is proprietary software for Creative Planning. All rights reserved.

---

**Built with ❤️ for better customer support experiences**

*Last updated: August 2025 - Collapsible summary section with smart behavior, collapsible sample data section, Azure OpenAI integration complete with GPT-4o, custom domain help.cp.tech fully operational with HTTPS, SSL certificate active and auto-renewing, all features working perfectly*
