// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the button for tone selection
    const toneSelectionButton = document.getElementById('toneSelectionButton');
    if (toneSelectionButton) {
        toneSelectionButton.addEventListener('click', function() {
            openToneSelectionPopup();
        });
    }
});

// Function to open the tone selection popup
function openToneSelectionPopup() {
    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'toneSelectionPopup';
    popup.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: white; border: 1px solid black; z-index: 1000;';

    // Define the tone options
    const tones = ['Formal', 'Casual', 'Academic']; // Add more tones as needed
    tones.forEach(tone => {
        const button = document.createElement('button');
        button.innerText = tone;
        button.addEventListener('click', function() {
            selectTone(tone);
        });
        popup.appendChild(button);
    });

    // Add a close button to the popup
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(popup);
    });
    popup.appendChild(closeButton);

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Function to handle the selection of a tone
function selectTone(tone) {
    console.log('Tone selected:', tone);

    // Retrieve all the content from Quill as plain text
    var editorContent = quill.getText();

    // Prepare the prompt with a command to change the tone
    var promptText = `Rewrite the following text in a ${tone.toLowerCase()} tone: ${editorContent.trim()}`;

    fetch("http://localhost:3000/chatgpt", { // Replace with your API endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptText }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        // Assuming the response contains the modified text
        var toneChangedText = data.choices[0].message.content;

        // Replace the editor content with the tone-changed text
        quill.setText(toneChangedText);

        // Optionally, you can display a confirmation or preview modal here
        // previewModal.textContent = toneChangedText;
        // previewModal.style.display = 'block';
    })
    .catch((error) => console.error("Error:", error));

    // Close the tone selection popup
    const popup = document.getElementById('toneSelectionPopup');
    if (popup) {
        document.body.removeChild(popup);
    }
}


// Additional functions and logic for your application...
