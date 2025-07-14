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
    // Note: quickQuestionsContainer and contactFormContainer are NOT statically retrieved here
    // because they will be created dynamically.
    const userInputContainer = document.querySelector('.chatbot-input');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Debug: Check if essential chatbot elements are found
    if (!chatbotButton) console.error('Chatbot button (ID: chatbot-button) not found!');
    if (!chatbotContainer) console.error('Chatbot container (ID: chatbot-container) not found!');
    if (!chatbotMessages) console.error('Chatbot messages container (ID: chatbot-messages) not found!');
    if (!userInputContainer) console.error('User input container (.chatbot-input) not found!');
    if (!userInput) console.error('User input (ID: user-input) not found!');
    if (!sendButton) console.error('Send button (ID: send-button) not found!');


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

    // Function to display quick question buttons (now dynamic containers)
    function displayQuickQuestions(questions) {
        if (!chatbotMessages) {
            console.error('chatbotMessages container is null. Cannot display quick questions.');
            return;
        }
        // Create a new container for this set of quick questions
        const newQuickQuestionsDiv = document.createElement('div');
        newQuickQuestionsDiv.classList.add('quick-questions'); // Add base class for styling

        console.log('Creating new quick questions container. Displaying new questions:', questions.map(q => q.text));

        questions.forEach(q => {
            const button = document.createElement('button');
            button.classList.add('quick-question-btn');
            button.textContent = q.text;
            button.dataset.question = q.type;
            newQuickQuestionsDiv.appendChild(button);
            console.log(`Added question button: "${q.text}"`);
        });

        chatbotMessages.appendChild(newQuickQuestionsDiv); // Append to the main messages area
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
    }

    // Function to display the contact form (now dynamic container)
    function displayContactForm() {
        if (!chatbotMessages) {
            console.error('chatbotMessages container is null. Cannot display contact form.');
            return;
        }

        // Create a new container for the form
        const newContactFormContainer = document.createElement('div');
        newContactFormContainer.classList.add('contact-form-container'); // Add base class for styling
        newContactFormContainer.id = 'dynamic-contact-form-container'; // Give it a unique ID for easy retrieval

        // Add the introductory bot message
        const botIntroMessage = document.createElement('p');
        botIntroMessage.classList.add('bot-message'); // Class for styling
        botIntroMessage.textContent = answers['agent-form-intro'];
        newContactFormContainer.appendChild(botIntroMessage);

        // Construct the form HTML
        const formHTML = `
            <form id="dynamic-agent-contact-form">
                <div class="form-group">
                    <label for="dynamic-contact-name">Name</label>
                    <input type="text" id="dynamic-contact-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="dynamic-contact-email">Email</label>
                    <input type="email" id="dynamic-contact-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="dynamic-contact-phone">Phone</label>
                    <input type="tel" id="dynamic-contact-phone" name="phone">
                </div>
                <div class="form-group">
                    <label for="dynamic-contact-message">Message</label>
                    <textarea id="dynamic-contact-message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit" id="dynamic-submit-contact-form">Submit</button>
            </form>
        `;
        newContactFormContainer.insertAdjacentHTML('beforeend', formHTML);

        chatbotMessages.appendChild(newContactFormContainer); // Append to main messages area
        userInputContainer.classList.add('hidden'); // Hide the bottom text input when form is active
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
        console.log('Displayed contact form dynamically.');

        // Attach event listener to the dynamically created form
        const currentAgentContactForm = document.getElementById('dynamic-agent-contact-form');
        if (currentAgentContactForm) {
            currentAgentContactForm.addEventListener('submit', handleFormSubmit);
            console.log('Attached submit listener to dynamic form.');
        } else {
            console.error('Dynamic form element not found to attach listener.');
        }
    }

    // --- Event Handlers ---

    // Handle quick question button clicks (delegated from chatbotMessages)
    // This listener needs to be on chatbotMessages as new quick-questions divs are added
    if (chatbotMessages) {
        chatbotMessages.addEventListener('click', (event) => {
            if (event.target.classList.contains('quick-question-btn')) {
                const button = event.target;
                const questionText = button.textContent;
                const questionType = button.dataset.question;

                addMessage(questionText, 'user-message');
                console.log(`User clicked: "${questionText}" (Type: ${questionType})`);

                // Disable all buttons in the current quick-questions group after one is clicked
                let parentQuickQuestionsDiv = button.closest('.quick-questions');
                if (parentQuickQuestionsDiv) {
                    Array.from(parentQuickQuestionsDiv.querySelectorAll('button')).forEach(btn => btn.disabled = true);
                }

                setTimeout(() => {
                    if (questionType === 'speak-to-agent') {
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
        });
    }


    // Handle form submission (mailto)
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        // Get values from the dynamically created form inputs
        const name = document.getElementById('dynamic-contact-name').value.trim();
        const email = document.getElementById('dynamic-contact-email').value.trim();
        const phone = document.getElementById('dynamic-contact-phone').value.trim();
        const message = document.getElementById('dynamic-contact-message').value.trim();

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

        // Hide and remove the current dynamic form after submission
        const currentDynamicFormContainer = document.getElementById('dynamic-contact-form-container');
        if(currentDynamicFormContainer) {
            currentDynamicFormContainer.remove(); // Remove the form from display
        }

        // Show the user input field again
        userInputContainer.classList.remove('hidden');

        // Offer initial questions again
        setTimeout(() => {
            addMessage("Is there anything else I can help you with?", 'bot-message');
            displayQuickQuestions(initialQuestions);
        }, 2000);
    }


    // --- Initial Setup & Chatbot Toggle ---

    // Toggle chatbot visibility
    if (chatbotButton && chatbotContainer && chatbotMessages && userInputContainer) {
        chatbotButton.addEventListener('click', () => {
            console.log('Chatbot button clicked.');
            const isChatbotVisible = chatbotContainer.style.display === 'flex';
            chatbotContainer.style.display = isChatbotVisible ? 'none' : 'flex';

            if (!isChatbotVisible) { // If chatbot is now becoming visible
                console.log('Chatbot is now visible. Initializing...');
                chatbotMessages.innerHTML = ''; // Clear all previous chat history

                addMessage(answers['initial-greeting'], 'bot-message');
                displayQuickQuestions(initialQuestions); // Show initial quick questions
                userInputContainer.classList.remove('hidden'); // Ensure input is visible on open
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

    // Handle sending user messages from input field (only if no form is active)
    if (sendButton && userInput) {
        sendButton.addEventListener('click', () => {
            const message = userInput.value.trim();
            // Check if there is an active form displayed by looking for its dynamic ID
            const activeForm = document.getElementById('dynamic-contact-form-container');
            if (message && !activeForm) { // Only process if message exists AND no form is active
                addMessage(message, 'user-message');
                userInput.value = '';
                console.log(`User typed message: "${message}"`);
                setTimeout(() => {
                    addMessage(answers['generic-typed-message'], 'bot-message');
                    setTimeout(() => {
                         addMessage("Is there anything else I can help you with?", 'bot-message');
                         displayQuickQuestions(followupQuestions);
                    }, 1000);
                }, 1000);
            }
            // If activeForm exists, the userInputContainer should be hidden,
            // so this else if block should ideally not be hit in normal operation.
        });

        userInput.addEventListener('keypress', (e) => {
            const activeForm = document.getElementById('dynamic-contact-form-container');
            if (e.key === 'Enter' && !activeForm) { // Only submit if no form is active
                sendButton.click();
            }
        });
    }
});
