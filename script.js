document.addEventListener('DOMContentLoaded', () => {
    const webhookUrl = 'https://hhjjjkkjjjjjju.app.n8n.cloud/webhook/Creaton';
    
    const createButton = document.getElementById('createButton');
    const promptInput = document.getElementById('gamePrompt');
    const statusMessage = document.getElementById('statusMessage');
    const resultsSection = document.getElementById('resultsSection');
    const gameOutput = document.getElementById('gameOutput');
    const apiResponse = document.getElementById('apiResponse');
    const buttonText = document.querySelector('#createButton .button-text');
    const loader = document.querySelector('#createButton .loader');

    // Function to update the UI state
    function setUIState(isLoading, message, responseData = null) {
        // Button state
        createButton.disabled = isLoading;
        buttonText.classList.toggle('hidden', isLoading);
        loader.classList.toggle('hidden', !isLoading);

        // Results section visibility
        resultsSection.classList.remove('hidden');
        
        // Status message update
        statusMessage.textContent = message;

        // Output box visibility and content
        if (responseData) {
            gameOutput.classList.remove('hidden');
            apiResponse.textContent = JSON.stringify(responseData, null, 2);
            statusMessage.style.borderLeftColor = 'green';
            statusMessage.style.backgroundColor = '#e6ffed'; // Success color
        } else {
            gameOutput.classList.add('hidden');
            statusMessage.style.borderLeftColor = isLoading ? 'var(--primary-color)' : 'var(--accent-color)';
            statusMessage.style.backgroundColor = isLoading ? '#e0f7ff' : '#fff3e0'; // Loading/Waiting color
        }
    }

    // Event listener for the main button
    createButton.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();

        if (prompt === '') {
            setUIState(false, 'Please enter a game creation prompt to continue.', null);
            return;
        }

        // 1. Set UI to Loading State (The 'Bolt' starts spinning)
        setUIState(true, '⚡️ Generating game... Please wait (this may take a moment).', null);

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: Your n8n webhook might require an API Key/Auth header,
                    // but for a simple public webhook, this is often enough.
                },
                body: JSON.stringify({ prompt: prompt, source: 'CREATON-UI' }),
            });

            const data = await response.json();

            // 2. Handle successful response (The 'Lovable' result appears)
            if (response.ok) {
                setUIState(false, '✅ Success! Your game has been generated!', data);
            } else {
                // Handle non-200 status codes
                setUIState(false, `❌ Error: Agent responded with status ${response.status}. Message: ${data.message || 'Unknown error.'}`, null);
            }

        } catch (error) {
            // 3. Handle network/fetch errors
            console.error('Fetch Error:', error);
            setUIState(false, '⚠️ Network Error. Could not connect to the AI agent. Check your console for details.', null);
        }
    });

    // Initial state setup
    setUIState(false, 'Enter your game prompt and click "Create Game"!', null);
});
