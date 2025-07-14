document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle (for the main website nav) ---
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('nav');

    if (mobileMenuIcon && nav) {
        mobileMenuIcon.addEventListener('click', () => {
            nav.classList.toggle('active'); // Toggles the 'active' class on the <nav> element
        });
    }

    // --- Chatbot Functionality ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotButton = document.querySelector('.close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickQuestionBtns = document.querySelectorAll('.quick-question-btn'); // Select all quick question buttons

    // Toggle chatbot visibility
    if (chatbotButton) {
        chatbotButton.addEventListener('click', () => {
            // If display is 'flex', set to 'none'; otherwise, set to 'flex'
            chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
            if (chatbotContainer.style.display === 'flex') {
                // Scroll to the bottom of messages when chatbot opens
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        });
    }

    // Close chatbot button
    if (closeChatbotButton) {
        closeChatbotButton.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });
    }

    // Function to add a message to the chat display
    function addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type); // Add 'message' and type ('user-message' or 'bot-message') classes
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        messageDiv.appendChild(paragraph);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to the latest message
    }

    // Handle sending user messages from input field
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const message = userInput.value.trim(); // Get and trim user input
            if (message) { // Only send if message is not empty
                addMessage(message, 'user-message'); // Add user message to chat
                userInput.value = ''; // Clear input field

                // Simulate a generic bot response for typed messages
                setTimeout(() => {
                    addMessage("Thanks for reaching out! We'll get back to you shortly.", 'bot-message');
                }, 1000); // 1-second delay for bot response
            }
        });
    }

    // Allow sending messages with Enter key
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendButton.click(); // Simulate a click on the send button
            }
        });
    }

    // --- Handle Quick Questions from buttons ---
    if (quickQuestionBtns.length > 0) {
        quickQuestionBtns.forEach(button => {
            button.addEventListener('click', () => {
                const questionText = button.textContent; // Get the text of the clicked button
                const questionType = button.dataset.question; // Get the 'data-question' attribute value

                // Add the clicked question as a user message
                addMessage(questionText, 'user-message');

                // Determine the bot's answer based on the 'data-question' value
                let botAnswer = '';
                switch (questionType) {
                    case 'women-size':
                        botAnswer = "For our women's store, we generally carry sizes from XS (UK 6) to XXL (UK 18-20), with a selection of items going up to 3XL (UK 22). Please check individual product pages for specific sizing charts, as fit can vary by brand.";
                        break;
                    case 'baby-size':
                        botAnswer = "Our baby store offers sizes from Newborn (0-3 months) up to 24 months. Some popular items also extend to toddler sizes (2T, 3T, 4T). We focus on comfortable and durable materials for little ones!";
                        break;
                    case 'shipping':
                        botAnswer = "We offer worldwide shipping! Standard shipping within the UK typically takes 3-5 business days. International shipping times vary by destination, usually 7-14 business days. Express options are available at checkout. You can find more details on our 'Shipping Information' page.";
                        break;
                    default:
                        // Fallback if a quick question type is not recognized
                        botAnswer = "I'm sorry, I don't have a pre-defined answer for that specific quick question. Can you please rephrase or type your query above?";
                }

                // Add the bot's answer after a short delay
                setTimeout(() => {
                    addMessage(botAnswer, 'bot-message');
                }, 800); // Shorter delay for quick answers
            });
        });
    }
});
