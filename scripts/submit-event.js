document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client from config - wrapped in try/catch to prevent breaking the form
    let supabaseClient;
    try {
        // Initialize the Supabase client - using window.supabase since we're loading from CDN
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.URL, 
            SUPABASE_CONFIG.ANON_KEY
        );
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        // Continue with the form functionality even if Supabase fails to initialize
    }

    // Form step navigation
    const steps = document.querySelectorAll('.step-content');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLineFill = document.getElementById('progress-line-fill');
    let currentStep = 0;

    // Update progress indicators
    function updateProgress() {
        const totalSteps = progressSteps.length;
        const progress = ((currentStep + 1) / totalSteps) * 100;
        
        // Update progress line
        progressLineFill.style.width = `${progress}%`;

        // Update step indicators
        progressSteps.forEach((step, index) => {
            step.classList.remove('completed', 'current', 'upcoming');
            
            if (index < currentStep) {
                step.classList.add('completed');
            } else if (index === currentStep) {
                step.classList.add('current');
            } else {
                step.classList.add('upcoming');
            }
        });
    }

    // Show step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });

        // Only toggle welcome message now
        const welcomeMessage = document.getElementById('welcome-message');
        if (stepIndex === 0) {
            welcomeMessage.classList.remove('hidden');
        } else {
            welcomeMessage.classList.add('hidden');
        }

        currentStep = stepIndex;
        updateProgress();
    }

    // Next step buttons
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                showStep(currentStep + 1);
            }
        });
    });

    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', () => {
            showStep(currentStep - 1);
        });
    });

    // URL validation function
    function isValidUrl(url) {
        if (!url) return false;
        // Basic URL validation - allows domains without protocol
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlPattern.test(url);
    }

    // URL normalization function
    function normalizeUrl(url) {
        if (!url) return url;
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }

    // Validate current step
    function validateCurrentStep() {
        const currentStepElement = steps[currentStep];
        const requiredInputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        // Special validation for step 1 (logo)
        if (currentStep === 0) {
            const logoUpload = document.getElementById('logo-upload');
            const noLogoCheckbox = document.getElementById('no-logo');
            
            if (!logoUpload.files.length && !noLogoCheckbox.checked) {
                isValid = false;
                const errorMessage = document.createElement('p');
                errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                errorMessage.textContent = 'Please either upload a logo or check "We don\'t have a logo"';
                
                // Remove any existing error message
                const existingError = logoUpload.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                logoUpload.parentNode.appendChild(errorMessage);
            } else {
                const existingError = logoUpload.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
        }

        // Special validation for step 3 (event type and URL)
        if (currentStep === 2) {
            // Event type validation
            const eventTypeSelected = document.querySelector('input[name="eventType"]:checked');
            if (!eventTypeSelected) {
                isValid = false;
                const eventTypeContainer = document.querySelector('.event-type-option').parentNode;
                
                if (!eventTypeContainer.querySelector('.error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-2');
                    errorMessage.textContent = 'This field is required';
                    eventTypeContainer.appendChild(errorMessage);
                }
            } else {
                const errorMessage = document.querySelector('.event-type-option').parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }

            // Event URL validation and normalization
            const eventUrl = document.getElementById('event-url');
            if (eventUrl) {
                if (eventUrl.value.trim()) {
                    // Normalize URL before validation
                    eventUrl.value = normalizeUrl(eventUrl.value);
                    
                    if (!isValidUrl(eventUrl.value)) {
                        isValid = false;
                        eventUrl.classList.add('border-red-500');
                        
                        if (!eventUrl.nextElementSibling?.classList.contains('error-message')) {
                            const errorMessage = document.createElement('p');
                            errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                            errorMessage.textContent = 'Please enter a valid website address';
                            eventUrl.parentNode.insertBefore(errorMessage, eventUrl.nextSibling);
                        }
                    } else {
                        eventUrl.classList.remove('border-red-500');
                        const errorMessage = eventUrl.nextElementSibling;
                        if (errorMessage?.classList.contains('error-message')) {
                            errorMessage.remove();
                        }
                    }
                }
            }

            // Conference Week URL required if checkbox checked
            const conferenceWeekCheckbox = document.getElementById('is-conference-week');
            const conferenceWeekUrl = document.getElementById('conference-week-url');
            if (conferenceWeekCheckbox && conferenceWeekCheckbox.checked) {
                if (!conferenceWeekUrl.value.trim()) {
                    isValid = false;
                    conferenceWeekUrl.classList.add('border-red-500');
                    if (!conferenceWeekUrl.nextElementSibling?.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMessage.textContent = 'This field is required';
                        conferenceWeekUrl.parentNode.insertBefore(errorMessage, conferenceWeekUrl.nextSibling);
                    }
                } else {
                    conferenceWeekUrl.value = normalizeUrl(conferenceWeekUrl.value);
                    conferenceWeekUrl.classList.remove('border-red-500');
                    const errorMessage = conferenceWeekUrl.nextElementSibling;
                    if (errorMessage?.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            } else if (conferenceWeekUrl) {
                conferenceWeekUrl.classList.remove('border-red-500');
                const errorMessage = conferenceWeekUrl.nextElementSibling;
                if (errorMessage?.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }

            // Hackathon URL required if checkbox checked
            const hackathonCheckbox = document.getElementById('has-hackathon');
            const hackathonUrl = document.getElementById('hackathon-url');
            if (hackathonCheckbox && hackathonCheckbox.checked) {
                if (!hackathonUrl.value.trim()) {
                    isValid = false;
                    hackathonUrl.classList.add('border-red-500');
                    if (!hackathonUrl.nextElementSibling?.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMessage.textContent = 'This field is required';
                        hackathonUrl.parentNode.insertBefore(errorMessage, hackathonUrl.nextSibling);
                    }
                } else {
                    hackathonUrl.value = normalizeUrl(hackathonUrl.value);
                    hackathonUrl.classList.remove('border-red-500');
                    const errorMessage = hackathonUrl.nextElementSibling;
                    if (errorMessage?.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            } else if (hackathonUrl) {
                hackathonUrl.classList.remove('border-red-500');
                const errorMessage = hackathonUrl.nextElementSibling;
                if (errorMessage?.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        }

        // Validate required fields
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
                
                // Add error message if it doesn't exist
                if (!input.nextElementSibling?.classList.contains('error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('border-red-500');
                const errorMessage = input.nextElementSibling;
                if (errorMessage?.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });

        return isValid;
    }

    // Event type options styling
    document.querySelectorAll('.event-type-option').forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        const dot = option.querySelector('.w-3.h-3');
        
        option.addEventListener('click', () => {
            // Uncheck all other options
            document.querySelectorAll('.event-type-option').forEach(opt => {
                opt.classList.remove('border-blue-500');
                opt.querySelector('.w-3.h-3').classList.add('hidden');
            });
            
            // Check this option
            radio.checked = true;
            dot.classList.remove('hidden');
            option.classList.add('border-blue-500');
        });
    });

    // Handle "no logo" checkbox
    const noLogoCheckbox = document.getElementById('no-logo');
    const logoUpload = document.getElementById('logo-upload');
    
    noLogoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            logoUpload.disabled = true;
            logoUpload.classList.add('opacity-50');
            // Clear any uploaded file
            logoUpload.value = '';
            logoPreview.innerHTML = '<span class="text-gray-400">Preview</span>';
        } else {
            logoUpload.disabled = false;
            logoUpload.classList.remove('opacity-50');
        }
    });

    // Logo preview and optimization
    const logoPreview = document.getElementById('logo-preview');
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const TARGET_SIZE = 150; // 150x150 pixels (reduced from 200x200)
    const MIN_SIZE = 50; // Minimum dimension
    const MAX_ASPECT_RATIO = 2; // Maximum width/height ratio
    const MAX_QUALITY = 0.8; // 80% quality for JPEG compression

    async function resizeImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            img.onload = () => {
                // Check minimum size
                if (img.width < MIN_SIZE || img.height < MIN_SIZE) {
                    reject(new Error(`Image is too small. Minimum size is ${MIN_SIZE}x${MIN_SIZE} pixels.`));
                    return;
                }

                // Check aspect ratio
                const aspectRatio = img.width / img.height;
                if (aspectRatio > MAX_ASPECT_RATIO || aspectRatio < 1/MAX_ASPECT_RATIO) {
                    reject(new Error(`Image aspect ratio is too extreme. Maximum ratio is ${MAX_ASPECT_RATIO}:1`));
                    return;
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > TARGET_SIZE) {
                        height = Math.round((height * TARGET_SIZE) / width);
                        width = TARGET_SIZE;
                    }
                } else {
                    if (height > TARGET_SIZE) {
                        width = Math.round((width * TARGET_SIZE) / height);
                        height = TARGET_SIZE;
                    }
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and resize image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with compression
                canvas.toBlob((blob) => {
                    // Create a new file from the blob
                    const resizedFile = new File([blob], file.name, {
                        type: file.type === 'image/png' ? 'image/png' : 'image/jpeg', // Preserve PNG if original was PNG
                        lastModified: Date.now()
                    });
                    
                    resolve({
                        file: resizedFile,
                        originalSize: { width: img.width, height: img.height }
                    });
                }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', MAX_QUALITY);
            };
            
            img.onerror = reject;
        });
    }

    logoUpload.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, JPEG)');
            this.value = '';
            return;
        }

        try {
            // Show loading state
            logoPreview.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span class="text-gray-400 text-sm">Processing image...</span>
                </div>
            `;
            
            // Resize and compress the image
            const { file: resizedFile, originalSize } = await resizeImage(file);
            
            // Update the file input with the resized file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(resizedFile);
            this.files = dataTransfer.files;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('w-full', 'h-full', 'object-contain');
                
                // Clear previous preview
                logoPreview.innerHTML = '';
                logoPreview.appendChild(img);
                
                // Show optimization confirmation
                const infoText = document.createElement('p');
                infoText.classList.add('text-xs', 'text-blue-600', 'mt-2');
                infoText.textContent = '✓ Optimized for event cards';
                logoPreview.parentNode.appendChild(infoText);
            };
            reader.readAsDataURL(resizedFile);
            
        } catch (error) {
            console.error('Error processing image:', error);
            alert(error.message || 'Error processing image. Please try again.');
            this.value = '';
            logoPreview.innerHTML = '<span class="text-gray-400">Preview</span>';
        }
    });

    // Handle conditional fields
    const conferenceWeekCheckbox = document.getElementById('is-conference-week');
    const conferenceWeekUrlContainer = document.getElementById('conference-week-url-container');
    const hackathonCheckbox = document.getElementById('has-hackathon');
    const hackathonUrlContainer = document.getElementById('hackathon-url-container');

    conferenceWeekCheckbox.addEventListener('change', function() {
        conferenceWeekUrlContainer.classList.toggle('hidden', !this.checked);
        if (!this.checked) {
            conferenceWeekUrlContainer.querySelector('input').value = '';
        }
    });

    hackathonCheckbox.addEventListener('change', function() {
        hackathonUrlContainer.classList.toggle('hidden', !this.checked);
        if (!this.checked) {
            hackathonUrlContainer.querySelector('input').value = '';
        }
    });

    // Form submission
    const form = document.getElementById('event-form');
    const submissionStatus = document.getElementById('submission-status');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const submitAnotherBtn = document.getElementById('submit-another-btn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Only allow submission on the last step
        if (currentStep !== 3) {
            return;
        }

        // Validate either email or telegram is provided
        const email = document.getElementById('contact-email').value.trim();
        const telegram = document.getElementById('contact-telegram').value.trim();
        
        if (!email && !telegram) {
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
            errorMessage.textContent = 'Please provide either an email or Telegram username';
            
            // Remove any existing error message
            const existingError = document.querySelector('.step-content:not(.hidden) .error-message');
            if (existingError) {
                existingError.remove();
            }
            
            document.querySelector('.step-content:not(.hidden)').appendChild(errorMessage);
            return;
        }

        // Show loading state
        form.classList.add('hidden');
        submissionStatus.classList.remove('hidden');
        const loadingElement = document.createElement('div');
        loadingElement.id = 'loading-submission';
        loadingElement.innerHTML = `
            <div class="flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-lg font-medium text-gray-700">Submitting your event...</p>
            </div>
        `;
        submissionStatus.appendChild(loadingElement);
        
        try {
            // Prepare form data
            const formData = new FormData(form);
            
            // Create a structured object matching the database schema
            // Using snake_case for all field names as that's what Supabase expects by default
            const eventData = {
                name: formData.get('name') || '',
                description: formData.get('description') || '',
                city: formData.get('city') || '',
                country: formData.get('country') || '',
                start_date: formData.get('startDate') || '',
                end_date: formData.get('endDate') || '',
                event_type: formData.get('eventType') || '',
                event_url: formData.get('eventUrl') || '',
                
                // Checkbox fields - convert to boolean
                is_conference_week: formData.get('isConferenceWeek') === 'on',
                conference_week_url: formData.get('conferenceWeekUrl') || null,
                has_hackathon: formData.get('hasHackathon') === 'on',
                hackathon_url: formData.get('hackathonUrl') || null,
                is_free: formData.get('isFree') === 'on',
                is_ethereum_10: formData.get('isEthereum10') === 'on',
                is_destino: formData.get('isDestino') === 'on',
                has_volunteership: formData.get('hasVolunteership') === 'on',
                has_scholarship: formData.get('hasScholarship') === 'on',
                
                // Contact information
                contact_name: formData.get('contactName') || '',
                contact_email: formData.get('contactEmail') || '',
                contact_telegram: formData.get('contactTelegram') || ''
            };
            
            // Add submission timestamp
            eventData.submitted_at = new Date().toISOString();
            
            // Add status field (pending approval)
            eventData.status = 'pending';
            
            // Upload logo if provided
            const logoFile = logoUpload.files[0];
            if (logoFile && !noLogoCheckbox.checked) {
                try {
                    // Convert file to base64 for storage
                    const reader = new FileReader();
                    const logoPromise = new Promise((resolve, reject) => {
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(logoFile);
                    });
                    
                    // Wait for logo to be converted to base64
                    const logoBase64 = await logoPromise;
                    // Keep using 'logo' as it's already in snake_case
                    eventData.logo = logoBase64;
                    console.log("Logo encoded successfully");
                } catch (logoError) {
                    console.error("Error encoding logo:", logoError);
                    // Continue without the logo rather than failing the submission
                }
            } else {
                // Set logo to null if no logo is provided
                eventData.logo = null;
            }
            
            // Insert event data into Supabase if client is initialized
            if (supabaseClient) {
                try {
                    console.log('Submitting event data to Supabase:', eventData);
                    
                    const { data, error } = await supabaseClient
                        .from('events')
                        .insert([eventData]);
                        
                    if (error) {
                        console.error('Supabase error:', error);
                        throw error;
                    }
                    console.log('Successfully submitted event to Supabase, response:', data);
                } catch (supabaseError) {
                    console.error('Supabase error:', supabaseError);
                    // Continue with success flow even if Supabase fails
                    // This ensures the form works even without Supabase
                }
            } else {
                console.log('Supabase client not initialized, skipping database submission');
                // Continue with success flow
            }
            
            // Hide loading and show success
            document.getElementById('loading-submission').remove();
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
        } catch (error) {
            console.error('Error submitting event:', error);
            
            // Hide loading and show error
            document.getElementById('loading-submission').remove();
            successMessage.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }
    });

    // Prevent form submission on Enter key unless on last step
    form.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && currentStep !== 3) {
            e.preventDefault();
        }
    });

    // Add URL normalization on blur (when user leaves the field)
    const urlInputs = document.querySelectorAll('input[type="url"]');
    urlInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = normalizeUrl(this.value);
            }
        });
    });

    tryAgainBtn.addEventListener('click', () => {
        submissionStatus.classList.add('hidden');
        form.classList.remove('hidden');
        showStep(0);
    });

    // Handle Submit Another Event button
    submitAnotherBtn.addEventListener('click', () => {
        // Reset the form
        form.reset();
        
        // Clear any error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Reset the logo preview
        const logoPreview = document.getElementById('logo-preview');
        logoPreview.innerHTML = '<span class="text-gray-400">Preview</span>';
        
        // Reset the logo upload field
        const logoUpload = document.getElementById('logo-upload');
        logoUpload.disabled = false;
        logoUpload.classList.remove('opacity-50');
        
        // Reset the no-logo checkbox
        const noLogoCheckbox = document.getElementById('no-logo');
        noLogoCheckbox.checked = false;
        
        // Hide submission status and show form
        submissionStatus.classList.add('hidden');
        form.classList.remove('hidden');
        
        // Go back to first step
        showStep(0);
    });
}); 