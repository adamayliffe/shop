document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle (for the main website nav) ---
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('nav');

    if (mobileMenuIcon && nav) {
        mobileMenuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // --- Chatbot Functionality ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotButton = document.querySelector('.close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickQuestionsContainer = chatbotMessages.querySelector('.quick-questions'); // Reference to the div holding quick questions

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
        { type: 'more-help', text: 'I need more help.' } // Option to go back to initial or just say talk to agent
    ];

    const agentContactQuestion = [
        { type: 'send-email-agent', text: 'Send Email to Agent' } // Changed type to differentiate from general 'talk-to-agent'
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
    }

    // Function to display quick question buttons
    function displayQuickQuestions(questions) {
        // Clear previous questions
        quickQuestionsContainer.innerHTML = '';
        questions.forEach(q => {
            const button = document.createElement('button');
            button.classList.add('quick-question-btn');
            button.textContent = q.text;
            button.dataset.question = q.type; // Store the question type in a data attribute
            quickQuestionsContainer.appendChild(button);
        });
        // We no longer need attachQuickQuestionListeners here because of event delegation on parent
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
    }

    // Handler for quick question button clicks
    function handleQuickQuestionClick(event) {
        const button = event.target;
        const questionText = button.textContent;
        const questionType = button.dataset.question;

        addMessage(questionText, 'user-message');

        // Provide immediate feedback to the user that their query is being processed
        setTimeout(() => {
            if (questionType === 'talk-to-agent') {
                addMessage(answers['talk-to-agent-intro'], 'bot-message');
                displayQuickQuestions(agentContactQuestion); // Show only the "Contact via Email" button
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
        const companyEmail = 'support@aylliffeboutique.com'; // Replace with your actual company email
        const subject = encodeURIComponent('Customer Support Request from Website Chatbot');
        const body = encodeURIComponent('Dear Aylliffe Boutique Support Team,\n\nI would like to speak with an agent regarding the following:\n\n[Please describe your query here]\n\nMy name is [Your Name] and my email is [Your Email].\n\nThank you.');

        window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
        addMessage("Opening your email client now. Please send us a detailed message!", 'bot-message');
        // After opening email, display followup questions or a "thank you"
        setTimeout(() => {
             addMessage("Is there anything else I can help you with?", 'bot-message');
             displayQuickQuestions(followupQuestions);
        }, 1500);
    }


    // --- Event Listeners and Initial Setup ---

    // Toggle chatbot visibility
    if (chatbotButton) {
        chatbotButton.addEventListener('click', () => {
            chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
            if (chatbotContainer.style.display === 'flex') {
                // When opening, ensure initial greeting and questions are displayed
                chatbotMessages.innerHTML = ''; // Clear previous messages
                addMessage(answers['initial-greeting'], 'bot-message');
                displayQuickQuestions(initialQuestions); // <--- THIS IS THE CRUCIAL LINE ADDED/CORRECTED
            }
        });
    }

    // Close chatbot button
    if (closeChatbotButton) {
        closeChatbotButton.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });
    }

    // Handle sending user messages from input field
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, 'user-message');
                userInput.value = '';
                // Simulate a generic bot response for typed messages
                setTimeout(() => {
                    addMessage(answers['generic-typed-message'], 'bot-message');
                    // After a typed message, always offer to talk to an agent or provide more help options
                    setTimeout(() => {
                         addMessage("Is there anything else I can help you with?", 'bot-message');
                         displayQuickQuestions(followupQuestions); // Offer followup or agent contact
                    }, 1000);
                }, 1000);
            }
        });
    }

    // Allow sending messages with Enter key
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }

    // Delegation for dynamically added quick question buttons
    // We attach one listener to the parent container and check the target
    quickQuestionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('quick-question-btn')) {
            // All quick question buttons, including the "Send Email to Agent" button,
            // are now handled by the single handleQuickQuestionClick function.
            // The `if (questionType === 'send-email-agent')` inside that function
            // will correctly call `sendEmailToAgent()`.
            handleQuickQuestionClick(event);
        }
    });

    // The chatbot is initially hidden, so we don't need to display questions on DOMContentLoaded.
    // They will be displayed when the chatbot button is clicked.
});
