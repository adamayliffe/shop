document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded! Initializing script...'); // Debug: Confirm DOM is ready

    // --- Mobile Menu Toggle (for the main website nav) ---
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('nav');

    if (mobileMenuIcon && nav) {
        mobileMenuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
            console.log('Mobile menu toggled.'); // Debug
        });
    } else {
        console.warn('Mobile menu icon or navigation element not found.'); // Debug
    }

    // --- Chatbot Functionality ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotButton = document.querySelector('.close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    // Direct selection of the quick-questions container for robust access
    const quickQuestionsContainer = document.querySelector('#chatbot-messages .quick-questions');

    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Debug: Check if essential chatbot elements are found
    if (!chatbotButton) console.error('Chatbot button (ID: chatbot-button) not found!');
    if (!chatbotContainer) console.error('Chatbot container (ID: chatbot-container) not found!');
    if (!chatbotMessages) console.error('Chatbot messages container (ID: chatbot-messages) not found!');
    if (!quickQuestionsContainer) console.error('Quick questions container (.quick-questions inside #chatbot-messages) not found!');
    if (!userInput) console.error('User input (ID: user-input) not found!');
    if (!sendButton) console.error('Send button (ID: send-button) not found!');


    // Define question sets
    const initialQuestions = [
        { type: 'women-size', text: 'What size do you go up to for the women\'s store?' },
        { type: 'baby-size', text: 'What sizes do you go up to on the baby store?' },
        { type: 'shipping', text: 'How far do you ship too?' },
        { type: 'talk-to-agent', text: 'I need to talk to an agent.' }
    ];

    const followupQuestions = [
        { type: 'returns-exchange', text: 'What is your return/exchange policy?' },
        { type: 'order-status', text: 'How can I check my order status?' },
        { type: 'product-care', text: 'How do I care for my garments?' },
        { type: 'more-help', text: 'I need more help.' }
    ];

    const agentContactQuestion = [
        { type: 'send-email-agent', text: 'Send Email to Agent' }
    ];

    // Object to store all possible answers
    const answers = {
        'women-size': "For our women's store, we generally carry sizes from XS (UK 6) to XXL (UK 18-20), with a selection of items going up to 3XL (UK 22). Please check individual product pages for specific sizing charts, as fit can vary by brand.",
        'baby-size': "Our baby store offers sizes from Newborn (0-3 months) up to 24 months. Some popular items also extend to toddler sizes (2T, 3T, 4T). We focus on comfortable and durable materials for little ones!",
        'shipping': "We offer worldwide shipping! Standard shipping within the UK typically takes 3-5 business days. International shipping times vary by destination, usually 7-14 business days. Express options are available at checkout. You can find more details on our 'Shipping Information' page.",
        'returns-exchange': "Our return policy allows returns within 30 days of purchase for a full refund or exchange, provided items are unworn, unwashed, and with original tags. Please see our 'Returns Policy' page for full details.",
        'order-status': "To check your order status, please visit our 'Track Order' page and enter your order number and email address. You'll receive real-time updates there.",
        'product-care': "Most of our garments come with specific care instructions on their labels. Generally, we recommend cold water wash on a gentle cycle and air drying to preserve fabric quality and color. Delicate items may require hand washing.",
        'more-help': "Please select a specific query from the options, or if you still need assistance, you can type your question or choose to talk to an agent.",
        'talk-to-agent-intro': "If you wish to speak with an agent, please click the button below to send us an email. We'll get back to you as soon as possible.",
        'generic-typed-message': "Thanks for reaching out! We'll get back to you shortly.",
        'initial-greeting': "Hi there,\nHere are some questions that some of our buyers ask."
    };

    // Function to add a message to the chat display
    function addMessage(message, type) {
        if (!chatbotMessages) {
            console.error('chatbotMessages container is null. Cannot add message.');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        // Handle newlines for messages with multiple paragraphs
        message.split('\n').forEach(line => {
            const paragraph = document.createElement('p');
            paragraph.textContent = line;
            messageDiv.appendChild(paragraph);
        });
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
        console.log(`Message added: "${message.split('\n')[0]}..." (${type})`); // Debug: Log first line of message
    }

    // Function to display quick question buttons
    function displayQuickQuestions(questions) {
        if (!quickQuestionsContainer) {
            console.error('quickQuestionsContainer is null. Cannot display questions.');
            return;
        }
        // Clear previous questions
        quickQuestionsContainer.innerHTML = '';
        console.log('Cleared quick questions container. Displaying new questions:', questions.map(q => q.text)); // Debug

        questions.forEach(q => {
            const button = document.createElement('button');
            button.classList.add('quick-question-btn');
            button.textContent = q.text;
            button.dataset.question = q.type; // Store the question type in a data attribute
            quickQuestionsContainer.appendChild(button);
            console.log(`Added question button: "${q.text}"`); // Debug
        });
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
    }

    // Handler for quick question button clicks
    function handleQuickQuestionClick(event) {
        const button = event.target;
        const questionText = button.textContent;
        const questionType = button.dataset.question;

        addMessage(questionText, 'user-message');
        console.log(`User clicked: "${questionText}" (Type: ${questionType})`); // Debug

        setTimeout(() => {
            if (questionType === 'talk-to-agent') {
                addMessage(answers['talk-to-agent-intro'], 'bot-message');
                displayQuickQuestions(agentContactQuestion); // Show only the "Send Email to Agent" button
            } else if (questionType === 'more-help') {
                addMessage(answers['more-help'], 'bot-message');
                displayQuickQuestions(initialQuestions); // Go back to initial questions
            } else if (questionType === 'send-email-agent') {
                sendEmailToAgent(); // Directly call email function
            }
            else {
                addMessage(answers[questionType], 'bot-message'); // Display the answer
                // After giving an answer, display followup questions
                setTimeout(() => {
                    addMessage("Is there anything else I can help you with?", 'bot-message');
                    displayQuickQuestions(followupQuestions);
                }, 1000); // Small delay before showing next set of questions
            }
        }, 800);
    }

    // Function to handle "Talk to an Agent" via email
    function sendEmailToAgent() {
        const companyEmail = 'support@aylliffeboutique.com'; // IMPORTANT: Replace with your actual company email
        const subject = encodeURIComponent('Customer Support Request from Website Chatbot');
        const body = encodeURIComponent('Dear Aylliffe Boutique Support Team,\n\nI would like to speak with an agent regarding the following:\n\n[Please describe your query here]\n\nMy name is [Your Name] and my email is [Your Email].\n\nThank you.');

        window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
        addMessage("Opening your email client now. Please send us a detailed message!", 'bot-message');
        console.log(`Attempted to send email to agent: mailto:${companyEmail}`); // Debug
        // After opening email, display followup questions or a "thank you"
        setTimeout(() => {
             addMessage("Is there anything else I can help you with?", 'bot-message');
             displayQuickQuestions(followupQuestions);
        }, 1500);
    }


    // --- Event Listeners and Initial Setup ---

    // Toggle chatbot visibility
    if (chatbotButton && chatbotContainer && chatbotMessages && quickQuestionsContainer) { // Ensure all elements are found
        chatbotButton.addEventListener('click', () => {
            console.log('Chatbot button clicked.'); // Debug
            const isChatbotVisible = chatbotContainer.style.display === 'flex';
            chatbotContainer.style.display = isChatbotVisible ? 'none' : 'flex';

            if (!isChatbotVisible) { // If chatbot is now becoming visible
                console.log('Chatbot is now visible. Initializing...'); // Debug
                chatbotMessages.innerHTML = ''; // Clear previous messages (messages only, not the quick questions div)
                
                // Add the initial greeting message
                addMessage(answers['initial-greeting'], 'bot-message');
                
                // Display the initial set of quick questions
                displayQuickQuestions(initialQuestions); // THIS IS THE CRUCIAL CALL
            }
        });
    } else {
        console.error('One or more essential chatbot elements not found, chatbot functionality may be impaired.');
    }

    // Close chatbot button
    if (closeChatbotButton && chatbotContainer) {
        closeChatbotButton.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
            console.log('Chatbot closed.'); // Debug
        });
    }

    // Handle sending user messages from input field
    if (sendButton && userInput && chatbotMessages && quickQuestionsContainer) {
        sendButton.addEventListener('click', () => {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, 'user-message');
                userInput.value = '';
                console.log(`User typed message: "${message}"`); // Debug
                // Simulate a generic bot response for typed messages
                setTimeout(() => {
                    addMessage(answers['generic-typed-message'], 'bot-message');
                    // After a typed message, always offer to talk to an agent or provide more help options
                    setTimeout(() => {
                         addMessage("Is there anything else I can help you with?", 'bot-message');
                         displayQuickQuestions(followupQuestions);
                    }, 1000);
                }, 1000);
            }
        });
    }

    // Allow sending messages with Enter key
    if (userInput && sendButton) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }

    // Delegation for dynamically added quick question buttons
    // Attach one listener to the parent container (quickQuestionsContainer) and check the target
    if (quickQuestionsContainer) { // Ensure container exists before adding listener
        quickQuestionsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('quick-question-btn')) {
                console.log('Quick question button clicked via delegation.'); // Debug
                handleQuickQuestionClick(event);
            }
        });
    }
    // No initial display on DOMContentLoaded, as the chatbot starts hidden.
    // Display will happen when the chatbot button is clicked.
});
