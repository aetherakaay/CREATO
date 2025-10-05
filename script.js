// Get references to the HTML elements
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const loader = document.getElementById('loader');
const resultContainer = document.getElementById('result-container');
const resultOutput = document.getElementById('result-output');

// Your n8n Webhook URL
const N8N_WEBHOOK_URL = "https://hhjjjkkjjjjjju.app.n8n.cloud/webhook/Creaton";

// Add an event listener to the button
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();

    // Simple validation to ensure the prompt is not empty
    if (!prompt) {
        alert("Please enter a game idea prompt!");
        return;
    }

    // --- Show loading state and disable the button ---
    generateBtn.disabled = true;
    loader.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
        // --- Send the data to the n8n webhook ---
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The body must be a JSON string
            body: JSON.stringify({ prompt: prompt }),
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get the JSON data from the response
        const data = await response.json();

        // --- Display the result ---
        // JSON.stringify with formatting makes the output readable
        resultOutput.textContent = JSON.stringify(data, null, 2);
        resultContainer.style.display = 'block';

    } catch (error) {
        // --- Handle any errors ---
        console.error("Error calling the AI agent:", error);
        resultOutput.textContent = `An error occurred. Please check the console for details.\n\nError: ${error.message}`;
        resultContainer.style.display = 'block';
    } finally {
        // --- Hide loading state and re-enable the button ---
        loader.style.display = 'none';
        generateBtn.disabled = false;
    }
});
            
