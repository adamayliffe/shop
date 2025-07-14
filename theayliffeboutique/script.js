document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded! Script execution started.');

    // --- Mobile Menu Toggle ---
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('nav');

    if (mobileMenuIcon && nav) {
        mobileMenuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
            console.log('Mobile menu toggled.');
        });
    } else {
        console.warn('Mobile menu elements not found. Mobile menu functionality will not work.');
    }

    // --- Chatbot Elements ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotButton = document.querySelector('.close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInputContainer = document.querySelector('.chatbot-input');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Robust check for essential chatbot elements
    const essentialChatbotElements = [
        { element: chatbotButton, id: 'chatbot-button' },
        { element: chatbotContainer, id: 'chatbot-container' },
        { element: closeChatbotButton, selector: '.close-chatbot' },
        { element: chatbotMessages, id: 'chatbot-messages' },
        { element: userInputContainer, selector: '.chatbot-input' },
        { element: userInput, id: 'user-input' },
        { element: sendButton, id: 'send-button' }
    ];

    let allChatbotElementsFound = true;
    essentialChatbotElements.forEach(item => {
        if (!item.element) {
            console.error(`Chatbot Initialization Error: Element with ${item.id ? 'ID' : 'selector'} '${item.id || item.selector}' not found!`);
            allChatbotElementsFound = false;
        }
    });

    if (!allChatbotElementsFound) {
        console.error('Chatbot cannot be fully initialized due to missing elements. Please check your HTML IDs/classes.');
        return; // Stop script execution if essential elements are missing
    }
    console.log('All essential chatbot elements found.');


    // --- Question & Answer Data ---
    const initialQuestions = [
        { type: 'women-size', text: 'What size do you go up to for the women\'s store?' },
        { type: 'baby-size', text: 'What sizes do you go up to on the baby store?' },
        { type: 'shipping', text: 'How far do you ship too?' },
        { type: 'speak-to-agent', text: 'Do you want to speak to an agent?' }
    ];

    const followupQuestions = [
        { type: 'returns-exchange', text: 'What is your return/exchange policy?' },
        { type: 'order-status', text: 'How can I check my order status?' },
        { type: 'product-care', text: 'How do I care for my garments?' },
        // CHANGED TEXT HERE:
        { type: 'speak-to-agent', text: 'Can I still speak to an agent?' }
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

    function addMessage(message, type) {
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

    function displayQuickQuestions(questions) {
        const newQuickQuestionsDiv = document.createElement('div');
        newQuickQuestionsDiv.classList.add('quick-questions');

        console.log('Creating new quick questions container. Displaying new questions:', questions.map(q => q.text));

        questions.forEach(q => {
            const button = document.createElement('button');
            button.classList.add('quick-question-btn');
            button.textContent = q.text;
            button.dataset.question = q.type;
            newQuickQuestionsDiv.appendChild(button);
            console.log(`Added question button: "${q.text}"`);
        });

        chatbotMessages.appendChild(newQuickQuestionsDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function displayContactForm() {
        const newContactFormContainer = document.createElement('div');
        newContactFormContainer.classList.add('contact-form-container');
        newContactFormContainer.id = 'dynamic-contact-form-container';

        const botIntroMessage = document.createElement('p');
        botIntroMessage.classList.add('bot-message');
        botIntroMessage.textContent = answers['agent-form-intro'];
        newContactFormContainer.appendChild(botIntroMessage);

        // MODIFIED: Changed form action to Formsubmit.co
        // IMPORTANT: REPLACE 'your-email@example.com' WITH YOUR ACTUAL EMAIL
        const formHTML = `
            <form id="dynamic-agent-contact-form" action="https://formsubmit.co/adam.ayliffe2018@gmail.com" method="POST">
                <input type="hidden" name="_subject" value="New Aylliffe Boutique Chatbot Inquiry!">
                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="_next" value="https://adamayliffe.github.io/shop/theayliffeboutique">

                <div class="form-group">

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

        chatbotMessages.appendChild(newContactFormContainer);
        userInputContainer.classList.add('hidden'); // Hide the bottom text input when form is active
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        console.log('Displayed contact form dynamically.');

        // For Formsubmit.co, the form will submit directly via its action attribute.
        // No custom JS handleFormSubmit event listener is typically needed on the form itself,
        // unless you want to do client-side validation or AJAX submission before Formsubmit.co.
        // For this setup, we rely on Formsubmit.co's direct POST behavior.
    }

    // --- Event Handlers ---

    chatbotMessages.addEventListener('click', (event) => {
        if (event.target.classList.contains('quick-question-btn')) {
            const button = event.target;
            const questionText = button.textContent;
            const questionType = button.dataset.question;

            addMessage(questionText, 'user-message');
            console.log(`User clicked: "${questionText}" (Type: ${questionType})`);

            let parentQuickQuestionsDiv = button.closest('.quick-questions');
            if (parentQuickQuestionsDiv) {
                // Disable all buttons in the current quick-questions group after one is clicked
                Array.from(parentQuickQuestionsDiv.querySelectorAll('button')).forEach(btn => btn.disabled = true);
            }

            setTimeout(() => {
                if (questionType === 'speak-to-agent') {
                    displayContactForm();
                } else {
                    addMessage(answers[questionType], 'bot-message');
                    setTimeout(() => {
                        addMessage("Is there anything else I can help with?", 'bot-message');
                        displayQuickQuestions(followupQuestions);
                    }, 1000);
                }
            }, 800);
        }
    });

    // The previous handleFormSubmit function for mailto is removed.
    // Formsubmit.co handles the POST directly.

    // --- Initial Setup & Chatbot Toggle ---

    chatbotButton.addEventListener('click', () => {
        console.log('Chatbot button clicked.');
        const isChatbotVisible = chatbotContainer.style.display === 'flex';
        chatbotContainer.style.display = isChatbotVisible ? 'none' : 'flex';

        if (!isChatbotVisible) { // If chatbot is now becoming visible
            console.log('Chatbot is now visible. Initializing...');
            chatbotMessages.innerHTML = ''; // Clear all previous chat history
            addMessage(answers['initial-greeting'], 'bot-message');
            displayQuickQuestions(initialQuestions);
            userInputContainer.classList.remove('hidden'); // Ensure input is visible on open
        }
    });

    closeChatbotButton.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
        console.log('Chatbot closed.');
    });

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
                     addMessage("Is there anything else I can help with?", 'bot-message');
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
});
