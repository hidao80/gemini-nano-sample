// Thread of conversation
let thread = [];

/**
 * Handles the send button click event.
 * Sends user input to the AI language model and displays the response.
 * Also handles displaying loading spinner and error messages.
 * 
 * @async
 * @function handleSend
 * @returns {Promise<void>}
 */
async function handleSend() {
    // Hide the message area and display the loading spinner
    document.getElementById('messageAreaRow').classList.add('d-none');
    document.getElementById('loadingSpinner').classList.remove('d-none');

    // Get the user input and system prompt
    const promptText = document.getElementById('textBox').value;
    const systemPrompt = document.getElementById('systemPromptText').value;

    // Get the AI language model
    if (ai && ai.languageModel && ai.languageModel.create && promptText) {
        try {
            const outputList = document.getElementById('output');

            // Display user input
            const inputElement = document.createElement('div');
            const promptElement = document.createElement('div');
            const userElement = document.createElement('div');
            inputElement.classList.add('mb-1', 'd-flex', 'flex-row', 'gap-2');
            userElement.innerHTML = '<span class="user">User</span>: ';
            promptElement.innerHTML = marked.parse(promptText);
            inputElement.appendChild(userElement);
            inputElement.appendChild(promptElement);

            // Append the user input to the output list
            outputList.appendChild(inputElement);

            // Scroll to the bottom of the output list
            outputList.lastElementChild.scrollIntoView({ behavior: 'smooth' });

            // Send user input to AI and get AI response
            // console.debug(thread);
            const session = await ai.languageModel.create({ systemPrompt: systemPrompt, initialPrompts: thread });
            const response = await session.prompt(promptText);

            // Update thread with user input and AI response
            thread.push({ role: 'user', content: promptText });
            thread.push({ role: 'assistant', content: response });

            // Display system response
            const outputElement = document.createElement('div');
            const responseElement = document.createElement('div');
            const AgentElement = document.createElement('div');
            outputElement.classList.add('mb-1', 'd-flex', 'flex-row', 'gap-2');
            AgentElement.innerHTML = '<span class="assistant">Assistant</span>: ';
            responseElement.innerHTML = marked.parse(response);
            outputElement.appendChild(AgentElement);
            outputElement.appendChild(responseElement);

            // Append the system response to the output list
            outputList.appendChild(outputElement);

            // Scroll to the bottom of the output list
            outputList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            // Display error message in messageArea
            document.getElementById('messageArea').textContent = error.message;
            document.getElementById('messageAreaRow').classList.remove('d-none');
            console.error(error);
        }

        // Clear the text box
        document.getElementById('textBox').value = '';
    }

    // Hide the loading spinner
    document.getElementById('loadingSpinner').classList.add('d-none', true);
}

// When the send button is clicked, send the prompt to the AI and display the AI's response
document.getElementById('sendButton').addEventListener('click', handleSend);

// When the enter key is pressed, send the prompt to the AI and display the AI's response
document.getElementById('textBox').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSend();
    }
});

// When the save button is clicked, save the system prompt to local storage
document.getElementById('saveButton').addEventListener('click', () => {
    const systemPrompt = document.getElementById('systemPromptText').value;
    localStorage.setItem('systemPrompt', systemPrompt);
});

// When the clear button is clicked, clear the output list
document.addEventListener('DOMContentLoaded', () => {
    const systemPrompt = localStorage.getItem('systemPrompt');
    if (systemPrompt) {
        document.getElementById('systemPromptText').value = systemPrompt;
    }
});
