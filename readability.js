//readabilty checker 
let currentHighlightIndex = -1;
let lowReadabilitySentences = [];

document.querySelector("#readabilityChecker").addEventListener("click", function () {
    let editorContent = quill.getText();

    if (!editorContent.trim()) {
        alert("Editor is empty");
        return;
    }

    // let promptText = "Identify the sentences with low readability in the following text and list them, each on a new line. If there's no such sentences, simply output 0. Text: " + editorContent.trim();
    let promptText = ("Readability is a measure of how easy a piece of text is to read. "
    + "Readable sentences can have some of the following 5 characteristics: "
    + "\n1. Shorter and more concise"
    + "\n2. Use active voice"
    + "\n3. Correct grammar and spelling"
    + "\n4. Use shorter words in place of longer words when they’re synonymous"
    + "\n5. Use more active verbs than adverbs"
    + "\n Your task: Rate each sentence in the following text in terms of readability and assign a readability score (1, 2, or 3) "
    + "(1 not readable, 2 somewhat readable, 3 readable). "
    + "Identify the sentences with readability score 1 in the following text, list them each on a new line, and suggest an improved "
    + "version with better readability after each sentence. Format: Original: <original-sentence> "
    + "Suggestion: <improved version>. If no sentences have a score of 1, simply output 0. Text: " + editorContent.trim());


    fetch("http://localhost:3000/chatgpt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptText }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let suggestionPairs = data.choices[0].message.content.trim().split('\n');

        if (suggestionPairs.length === 1) {
            alert("No sentences of low readability were found.");
        } else {
            lowReadabilitySentences = [];
            suggestedImprovements = [];
            console.log(suggestionPairs)
            for (let i = 0; i < suggestionPairs.length; i += 3) {
                let originalSentence = suggestionPairs[i].substring("Original: ".length).trim();
                let suggestedSentence = suggestionPairs[i + 1].substring("Suggestion: ".length).trim();
                lowReadabilitySentences.push(originalSentence);
                suggestedImprovements.push(suggestedSentence);
            }
            currentHighlightIndex = 0;
            highlightNextSentence();
        }
    
        
    })  
    .catch(error => console.error("Error:", error));
});

function highlightNextSentence() {
    removeEditBox();

    if (currentHighlightIndex >= 0 && currentHighlightIndex < lowReadabilitySentences.length) {
        let sentence = lowReadabilitySentences[currentHighlightIndex].trim();
        let editorContent = quill.getText();
        let startIndex = editorContent.indexOf(sentence);
        if (startIndex !== -1) {
            quill.formatText(startIndex, sentence.length, { 'background': '#add8e6' });
            displayTextBox(startIndex, sentence.length);
        }
    }
}


function displayTextBox(startIndex, length) {
    // Remove any existing textboxes
    removeEditBox();

    // Set the default text for the textbox to the suggested improvement
    let textBox = document.createElement('textarea');
    textBox.className = 'edit-box';
    textBox.value = suggestedImprovements[currentHighlightIndex];  // Set the suggested improvement as the default text
    textBox.setAttribute('rows', '4'); // Set the number of rows to make the textbox taller
    textBox.setAttribute('cols', '50'); // Set the number of columns to make the textbox wider

    // Create the 'Accept' button
    let acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept';
    acceptButton.onclick = function() {
        acceptEdit(startIndex, length, textBox.value);
    };

    // Create the 'Cancel' button
    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = function() {
        cancelEdit();
    };

    // Container for the textbox and buttons
    let container = document.createElement('div');
    container.className = 'temp-container'; // Assign a class for easy removal
    container.style.position = 'absolute';

    // Append the textbox and buttons to the container
    container.appendChild(textBox);
    container.appendChild(acceptButton);
    container.appendChild(cancelButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Position the container below the highlighted text
    positionTextBox(container, startIndex, length);

    
}

function positionTextBox(container, startIndex, length) {
    let quillEditor = document.querySelector('#editor');
    let editorBounds = quillEditor.getBoundingClientRect();
    let textBounds = quill.getBounds(startIndex, length);

    // Position the container below the highlighted text without blocking it
    container.style.left = `${editorBounds.left + textBounds.left}px`;
    container.style.top = `${window.scrollY + editorBounds.top + textBounds.bottom + quillEditor.offsetTop}px`;
}


function positionTextBox(container, startIndex, length) {
    let editorBounds = document.querySelector('#editor').getBoundingClientRect();
    let textBounds = quill.getBounds(startIndex, length);

    container.style.position = 'absolute';
    container.style.left = `${editorBounds.left + textBounds.left}px`;
    container.style.top = `${window.scrollY + editorBounds.top + textBounds.bottom}px`; // Positioned below the highlighted text
}

function acceptEdit(startIndex, length, newText) {
    quill.deleteText(startIndex, length);
    quill.insertText(startIndex, newText);
    removeEditBox();
    moveToNextSentence();
}

function cancelEdit() {
    removeEditBox();
    moveToNextSentence();
}

function moveToNextSentence() {
    removeHighlight(currentHighlightIndex);
    currentHighlightIndex++;
    if (currentHighlightIndex < lowReadabilitySentences.length) {
        highlightNextSentence();
    }
}


function removeEditBox() {
    let existingContainers = document.querySelectorAll('.temp-container'); // Select all containers
    existingContainers.forEach(container => container.remove()); // Remove all containers
}

function removeHighlight(index) {
    if (index >= 0 && index < lowReadabilitySentences.length) {
        let sentence = lowReadabilitySentences[index].trim();
        let startIndex = quill.getText().indexOf(sentence);
        if (startIndex !== -1) {
            quill.removeFormat(startIndex, sentence.length);
        }
    }
}