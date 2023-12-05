document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#keyInfoHighlighter").addEventListener("click", function () {
        let editorContent = quill.getText();

        if (!editorContent.trim()) {
            alert("The editor content is empty.");
            return;
        }

        // Open the density selection popup
        openDensitySelectionPopup(editorContent);
    });

    document.getElementById('unhighlightButton').addEventListener('click', function() {
        var length = quill.getLength();
        quill.removeFormat(0, length);
    });
});

function openDensitySelectionPopup(editorContent) {
    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'densitySelectionPopup';
    popup.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: white; border: 1px solid black; z-index: 1000; display: flex; flex-direction: column; align-items: center;';

    // Add instruction text to the popup
    const instructionText = document.createElement('div');
    instructionText.textContent = 'Select Highlight Density Level:';
    instructionText.style.cssText = 'margin-bottom: 20px; font-size: 18px; font-weight: bold;';
    popup.appendChild(instructionText);

    // Define the density options
    const densities = ['Low', 'Medium', 'High'];
    densities.forEach(density => {
        const button = document.createElement('button');
        button.innerText = density;
        button.style.cssText = 'margin-bottom: 10px; padding: 10px 20px;'; // Add button styling here
        button.onclick = function() {
            fetchKeyInfo(editorContent, density);
            document.body.removeChild(popup);
        };
        popup.appendChild(button);
    });

    // Append the popup to the body
    document.body.appendChild(popup);
}


function fetchKeyInfo(editorContent, density) {
    var promptText;
    // Customize your prompt text based on the density selection
    if (density === 'Low') {
        promptText = ("Please only return the key words or phrases that are MOST and absolutely crucial for understanding the overall message "
   + "in the given text exactly as they appeared in the original text. Limit the response to up to 3 key words/phrases."
   + " When extracting key words or phrases from a paragraph, "
   + "they typically fall into the following categories (A, B, C, D): "
   + "\nA. Nouns and Proper Nouns (e.g. main subjects or objects of the paragraph, such as people, places, organizations, or specific things), "
   + "Technical and Domain-Specific Terms (e.g. specific fields or topics), Names and Titles (e.g. names of people, books, "
   + "documents, theories, etc., that are central to the paragraph's message). "
   + "\nB. Key Action Verbs: Key actions or states of being that drive the narrative or argument in the paragraph"
   + "\nC. Dates and Numbers: Important for understanding timelines, quantities, or other numerical data relevant to the paragraph"
   + "\nD. Phrases or Idioms: Sometimes a key idea or concept is best captured in a phrase rather than a single word."
   + "\nPlease return as a dictionary. \n"
   + "Example response format: "
   + "\n{\n"
   + "    \"A\": [\"John Doe\", \"London\", \"Divergence Theorem\"],\n"
   + "    \"B\": [\"execute\", \"analyze\", \"create\"],\n"
   + "    \"C\": [\"15%\", \"year-over-year\", \"2021 Q1\"]\n"
   + "    \"D\": [\"Cutting corners%\", \"Don't judge a book by its cover\", \"The elephant in the room\"]\n"
   + "}. Text: " + editorContent.trim());
    } else if (density === 'Medium') {
        promptText = ("Please return the key words or phrases that contribute to the understanding of the content "
   + "in the given text exactly as they appeared in the original text. Limit the response to up to 10 key words/phrases"
   + " When extracting key words or phrases from a paragraph, "
   + "they typically fall into the following categories (A, B, C, D): "
   + "\nA. Nouns and Proper Nouns (e.g. main subjects or objects of the paragraph, such as people, places, organizations, or specific things), "
   + "Technical and Domain-Specific Terms (e.g. specific fields or topics), Names and Titles (e.g. names of people, books, "
   + "documents, theories, etc., that are central to the paragraph's message). "
   + "\nB. Key Action Verbs: Key actions or states of being that drive the narrative or argument in the paragraph"
   + "\nC. Dates and Numbers: Important for understanding timelines, quantities, or other numerical data relevant to the paragraph"
   + "\nD. Phrases or Idioms: Sometimes a key idea or concept is best captured in a phrase rather than a single word."
   + "\nPlease return as a dictionary. \n"
   + "Example response format: "
   + "\n{\n"
   + "    \"A\": [\"John Doe\", \"London\", \"Divergence Theorem\"],\n"
   + "    \"B\": [\"execute\", \"analyze\", \"create\"],\n"
   + "    \"C\": [\"15%\", \"year-over-year\", \"2021 Q1\"]\n"
   + "    \"D\": [\"Cutting corners%\", \"Don't judge a book by its cover\", \"The elephant in the room\"]\n"
   + "}. Text: " + editorContent.trim());
    } else { // 'High' density
        promptText = ("Please return ALL the key words or phrases that are central to the text's message "
   + "in the given text exactly as they appeared in the original text. No limit for the number of words/phrases returned."
   + " When extracting key words or phrases from a paragraph, "
   + "they typically fall into the following categories (A, B, C, D): "
   + "\nA. Nouns and Proper Nouns (e.g. main subjects or objects of the paragraph, such as people, places, organizations, or specific things), "
   + "Technical and Domain-Specific Terms (e.g. specific fields or topics), Names and Titles (e.g. names of people, books, "
   + "documents, theories, etc., that are central to the paragraph's message). "
   + "\nB. Key Action Verbs: Key actions or states of being that drive the narrative or argument in the paragraph"
   + "\nC. Dates and Numbers: Important for understanding timelines, quantities, or other numerical data relevant to the paragraph"
   + "\nD. Phrases or Idioms: Sometimes a key idea or concept is best captured in a phrase rather than a single word."
   + "\nPlease return as a dictionary. \n"
   + "Example response format: "
   + "\n{\n"
   + "    \"A\": [\"John Doe\", \"London\", \"Divergence Theorem\"],\n"
   + "    \"B\": [\"execute\", \"analyze\", \"create\"],\n"
   + "    \"C\": [\"15%\", \"year-over-year\", \"2021 Q1\"]\n"
   + "    \"D\": [\"Cutting corners%\", \"Don't judge a book by its cover\", \"The elephant in the room\"]\n"
   + "}. Text: " + editorContent.trim());
    }

    // Fetch request with the customized prompt
    fetch("http://52.201.236.49:3000/chatgpt", {
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
        let messageContent;
        try {
            messageContent = JSON.parse(data.choices[0].message.content);
        } catch(e) {
            console.error("Error parsing message content:", e);
            return;
        }

        let categorizedPhrases = {
            A: messageContent.A || [],
            B: messageContent.B || [],
            C: messageContent.C || [],
            D: messageContent.D || [],
        };

        Object.keys(categorizedPhrases).forEach(category => {
            if (Array.isArray(categorizedPhrases[category])) {
                highlightKeyInformation(categorizedPhrases[category], editorContent, category);
            }
        });
    })
    .catch(error => console.error("Error:", error));
}

function highlightKeyInformation(keyPhrases, editorContent, category) {
    let color;
    switch (category) {
        case 'A':
            color = 'pink';
            break;
        case 'B':
            color = 'orange';
            break;
        case 'C':
            color = '#CBC3E3';
            break;
        case 'D':
            color = 'yellow';
            break;
    }

    keyPhrases.forEach(phrase => {
        let startIndex = 0;
        while ((startIndex = editorContent.indexOf(phrase, startIndex)) !== -1) {
            quill.formatText(startIndex, phrase.length, { 'background': color });
            startIndex += phrase.length;
        }
    });
}

