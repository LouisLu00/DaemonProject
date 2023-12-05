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
    // Retrieve all the content from Quill as plain text
    var editorContent = quill.getText();

    // Prepare the prompt with a command to change the tone
    var promptText = `Rewrite the following text in a ${tone.toLowerCase()} tone: ${editorContent.trim()}`;

    fetch("http://52.201.236.49:3000/chatgpt", { // Replace with your API endpoint
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

        // Display the tone-changed text in the preview modal
        document.getElementById('textTonePreviewContent').textContent = toneChangedText;
        document.getElementById('textTonePreviewModal').style.display = 'block';
    })
    .catch((error) => console.error("Error:", error));

    // Close the tone selection popup
    closeToneSelectionPopup();
}

// Function to close the tone selection popup
function closeToneSelectionPopup() {
    const popup = document.getElementById('toneSelectionPopup');
    if (popup) {
        document.body.removeChild(popup);
    }
}

// Close the preview modal when the "Accept" button is clicked
document.getElementById('textToneAcceptChange').addEventListener('click', function() {
    var previewText = document.getElementById('textTonePreviewContent').textContent;
    quill.setText(previewText);
    closeTextTonePreviewModal();
});

// Close the preview modal when the "Cancel" button is clicked
document.getElementById('textToneCancelChange').addEventListener('click', function() {
    closeTextTonePreviewModal();
});

// Function to close the text tone preview modal
function closeTextTonePreviewModal() {
    document.getElementById('textTonePreviewModal').style.display = 'none';
}

// Event listener for closing the modal when the 'x' button is clicked
document.querySelector('.text-tone-close').addEventListener('click', closeTextTonePreviewModal);
