document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded! Initializing script...');

    // --- Mobile Menu Toggle ---
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('nav');

    if (mobileMenuIcon && nav) {
        mobileMenuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
            console.log('Mobile menu toggled.');
        });
    }

    // --- Chatbot Elements ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotButton = document.querySelector('.close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // New element references for the form
    const quickQuestionsContainer = document.querySelector('.quick-questions');
    const contactFormContainer = document.getElementById('contact-form-container');
    const agentContactForm = document.getElementById('agent-contact-form');
    const userInputContainer = document.querySelector('.chatbot-input'); // The div holding user input and send button

    const contactNameInput = document.getElementById('contact-name');
    const contactEmailInput = document.getElementById('contact-email');
    const contactPhoneInput = document.getElementById('contact-phone');
    const contactMessageInput = document.getElementById('contact-message');

    // Debug: Check if essential chatbot elements are found
    if (!chatbotButton) console.error('Chatbot button (ID: chatbot-button) not found!');
    if (!chatbotContainer) console.error('Chatbot container (ID: chatbot-container) not found!');
    if (!chatbotMessages) console.error('Chatbot messages container (ID: chatbot-messages) not found!');
    if (!quickQuestionsContainer) console.error('Quick questions container (.quick-questions) not found!');
    if (!contactFormContainer) console.error('Contact form container (ID: contact-form-container) not found!');
    if (!agentContactForm) console.error('Agent contact form (ID: agent-contact-form) not found!');
    if (!userInputContainer) console.error('User input container (.chatbot-input) not found!');


    // --- Question & Answer Data ---
    const initialQuestions = [
        { type: 'women-size', text: 'What size do you go up to for the women\'s store?' },
        { type: 'baby-size', text: 'What sizes do you go up to on the baby store?' },
        { type: 'shipping', text: 'How far do you ship too?' },
        { type: 'speak-to-agent', text: 'Do you want to speak to an agent?' } // Renamed for clarity
    ];

    const followupQuestions = [
        { type: 'returns-exchange', text: 'What is your return/exchange policy?' },
        { type: 'order-status', text: 'How can I check my order status?' },
        { type: 'product-care', text: 'How do I care for my garments?' },
        { type: 'speak-to-agent', text: 'Still need to speak to an agent?' } // Offer again
    ];

    // Object to store all possible answers
    const answers = {
        'women-size': "For our women's store, we generally carry sizes from XS (UK 6) to XXL (UK 18-20), with a selection of items going up to 3XL (UK 22). Please check individual product pages for specific sizing charts, as fit can vary by brand.",
        'baby-size': "Our baby store offers sizes from Newborn (0-3 months) up to 24 months. Some popular items also extend to toddler sizes (2T, 3T, 4T). We focus on comfortable and durable materials for little ones!",
        'shipping': "We offer worldwide shipping! Standard shipping within the UK typically takes 3-5 business days. International shipping times vary by destination, usually 7-14 business days. Express options are available at checkout. You can find more details on our 'Shipping Information' page.",
        'returns-exchange': "Our return policy allows returns within 30 days of purchase for a full refund or exchange, provided items are unworn, unwashed, and with original tags. Please see our 'Returns Policy' page for full details.",
        'order-status': "To check your order status, please visit our 'Track Order' page and enter your order number and email address. You'll receive real-time updates there.",
        'product-care': "Most of our garments come with specific care instructions on their labels. Generally, we recommend cold water wash on a gentle cycle and air drying to preserve fabric quality and color. Delicate items may require hand washing.",
        'generic-typed-message': "Thanks for reaching out! We'll get back to you shortly.",
        'initial-greeting': "Hi there,\nHere are some questions that some of our buyers ask.",
        'agent-form-intro': "Please fill out the form below, and we'll get back to you as soon as possible."
    };

    // --- Helper Functions ---

    // Function to add a message to the chat display
    function addMessage(message, type) {
        if (!chatbotMessages) {
            console.error('chatbotMessages container is null. Cannot add message.');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        message.split('\n').forEach(line => {
            const paragraph = document.createElement('p');
            paragraph.textContent = line;
            messageDiv.appendChild(paragraph);
        });
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        console.log(`Message added: "${message.split('\n')[0]}..." (${type})`);
    }

    // Function to display quick question buttons
    function displayQuickQuestions(questions) {
        if (!quickQuestionsContainer) {
            console.error('quickQuestionsContainer is null. Cannot display questions.');
            return;
        }
        quickQuestionsContainer.innerHTML = ''; // Clear existing buttons
        quickQuestionsContainer.classList.remove('hidden'); // Show the quick questions div
        contactFormContainer.classList.add('hidden'); // Hide the contact form
        userInputContainer.classList.remove('hidden'); // Show the bottom text input

        console.log('Cleared quick questions container. Displaying new questions:', questions.map(q => q.text));

        questions.forEach(q => {
            const button = document.createElement('button');
            button.classList.add('quick-question-btn');
            button.textContent = q.text;
            button.dataset.question = q.type;
            quickQuestionsContainer.appendChild(button);
            console.log(`Added question button: "${q.text}"`);
        });
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to display the contact form
    function displayContactForm() {
        if (!contactFormContainer) {
            console.error('contactFormContainer is null. Cannot display form.');
            return;
        }
        quickQuestionsContainer.classList.add('hidden'); // Hide quick questions
        contactFormContainer.classList.remove('hidden'); // Show the contact form
        userInputContainer.classList.add('hidden'); // Hide the bottom text input when form is active

        // Clear existing messages except the initial greeting/form intro
        // We'll let the "The Aylliffe Boutique welcomes you..." message be part of the HTML
        // For dynamic content, you might want to clear and re-add.
        // For simplicity with pre-baked form text:
        // chatbotMessages.innerHTML = ''; // This would clear the bot's initial greeting too

        // Add an introductory message just before the form if not already part of HTML
        // addMessage(answers['agent-form-intro'], 'bot-message'); // This is now part of the HTML bot-message
        
        // Ensure form is cleared
        agentContactForm.reset();
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        console.log('Displayed contact form.');
    }

    // --- Event Handlers ---

    // Handle quick question button clicks
    function handleQuickQuestionClick(event) {
        const button = event.target;
        const questionText = button.textContent;
        const questionType = button.dataset.question;

        addMessage(questionText, 'user-message');
        console.log(`User clicked: "${questionText}" (Type: ${questionType})`);

        setTimeout(() => {
            if (questionType === 'speak-to-agent') {
                addMessage(answers['agent-form-intro'], 'bot-message');
                displayContactForm(); // Show the contact form
            } else {
                addMessage(answers[questionType], 'bot-message'); // Display the answer
                setTimeout(() => {
                    addMessage("Is there anything else I can help you with?", 'bot-message');
                    displayQuickQuestions(followupQuestions); // Display followup questions
                }, 1000);
            }
        }, 800);
    }

    // Handle form submission (mailto)
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const name = contactNameInput.value.trim();
        const email = contactEmailInput.value.trim();
        const phone = contactPhoneInput.value.trim();
        const message = contactMessageInput.value.trim();

        if (!name || !email || !message) {
            alert('Please fill in Name, Email, and Message fields.');
            return;
        }

        const companyEmail = 'info@theayliffeboutique.com'; // Your company email
        const subject = encodeURIComponent(`Customer Inquiry from Aylliffe Boutique Chatbot: ${name}`);
        let body = `Name: ${name}\nEmail: ${email}\n`;
        if (phone) {
            body += `Phone: ${phone}\n`;
        }
        body += `\nMessage:\n${message}`;
        body = encodeURIComponent(body);

        window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;

        addMessage("Thank you for your inquiry! Your email client should open shortly with a pre-filled message. Please click 'Send' in your email client to send it.", 'bot-message');
        console.log('Attempted to send email via mailto link.');

        // Optionally, clear the form and display quick questions again after submission
        setTimeout(() => {
            agentContactForm.reset(); // Clear form fields
            addMessage("Is there anything else I can help you with?", 'bot-message');
            displayQuickQuestions(initialQuestions); // Or followupQuestions, depending on desired flow
        }, 2000);
    }


    // --- Initial Setup & Event Listeners ---

    // Toggle chatbot visibility
    if (chatbotButton && chatbotContainer && chatbotMessages && quickQuestionsContainer && contactFormContainer && userInputContainer) {
        chatbotButton.addEventListener('click', () => {
            console.log('Chatbot button clicked.');
            const isChatbotVisible = chatbotContainer.style.display === 'flex';
            chatbotContainer.style.display = isChatbotVisible ? 'none' : 'flex';

            if (!isChatbotVisible) { // If chatbot is now becoming visible
                console.log('Chatbot is now visible. Initializing...');
                // Clear all dynamic messages before showing initial state
                // This targets messages added by JS, leaving the static form HTML untouched for now.
                const existingDynamicMessages = chatbotMessages.querySelectorAll('.message:not(.initial-form-message)');
                existingDynamicMessages.forEach(msg => msg.remove());

                addMessage(answers['initial-greeting'], 'bot-message');
                displayQuickQuestions(initialQuestions); // Show initial quick questions
            }
        });
    } else {
        console.error('One or more essential chatbot elements not found, chatbot functionality may be impaired.');
    }

    // Close chatbot button
    if (closeChatbotButton && chatbotContainer) {
        closeChatbotButton.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
            console.log('Chatbot closed.');
        });
    }

    // Handle sending user messages from input field
    // Only allow typing if the form is NOT visible
    if (userInputContainer && agentContactForm) {
        userInputContainer.querySelector('button').addEventListener('click', () => {
            const message = userInputContainer.querySelector('input').value.trim();
            if (message && !contactFormContainer.classList.contains('hidden')) { // Ensure form is not visible
                 addMessage(message, 'user-message');
                 userInputContainer.querySelector('input').value = '';
                 console.log(`User typed message: "${message}"`);
                 setTimeout(() => {
                     addMessage(answers['generic-typed-message'], 'bot-message');
                     setTimeout(() => {
                          addMessage("Is there anything else I can help you with?", 'bot-message');
                          displayQuickQuestions(followupQuestions); // Offer followup or agent contact
                     }, 1000);
                 }, 1000);
            } else if (contactFormContainer.classList.contains('hidden') && message) {
                // This means the user typed in the input field while the form was meant to be hidden.
                // This scenario should be prevented by hiding the input container.
                // However, as a fallback:
                 addMessage(message, 'user-message');
                 userInputContainer.querySelector('input').value = '';
                 addMessage("I'm currently in 'contact form' mode. Please fill the form or close the bot if you prefer.", 'bot-message');
            }
        });

        userInputContainer.querySelector('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !contactFormContainer.classList.contains('hidden')) {
                userInputContainer.querySelector('button').click();
            }
        });
    }


    // Delegation for dynamically added quick question buttons
    if (quickQuestionsContainer) {
        quickQuestionsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('quick-question-btn')) {
                console.log('Quick question button clicked via delegation.');
                handleQuickQuestionClick(event);
            }
        });
    }

    // Form submission listener
    if (agentContactForm) {
        agentContactForm.addEventListener('submit', handleFormSubmit);
    }
});
