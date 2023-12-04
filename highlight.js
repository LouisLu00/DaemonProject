document.querySelector("#keyInfoHighlighter").addEventListener("click", function () {
    console.log("Button clicked"); // Log when button is clicked

    let editorContent = quill.getText();
    console.log("Editor content:", editorContent); // Log the editor content

    if (!editorContent.trim()) {
        console.log("Editor is empty");
        return;
    }

    var promptText = "Please return the key words or phrases in the following text " +
    "categorized as names, action verbs, and statistics, exactly as they appeared. " +
    "Please return as a dictionary: \n" +
    "{\n" +
    "    \"names\": [\"John Doe\", \"London\", \"Acme Corp\"],\n" +
    "    \"actionVerbs\": [\"run\", \"analyze\", \"create\"],\n" +
    "    \"statistics\": [\"15%\", \"year-over-year\", \"2021 Q1\"]\n" +
    "}" + editorContent.trim();

    console.log("Sending prompt:", promptText); // Log the prompt text being sent

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
        console.log("Received response"); // Log when response is received
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
            names: messageContent.names || [],
            actionVerbs: messageContent.actionVerbs || [],
            statistics: messageContent.statistics || [],
        };
    
        Object.keys(categorizedPhrases).forEach(category => {
            if (Array.isArray(categorizedPhrases[category])) {
                highlightKeyInformation(categorizedPhrases[category], editorContent, category);
            }
        });
    })
    .catch(error => console.error("Error:", error));
});


function highlightKeyInformation(keyPhrases, editorContent, category) {
    let color;
    switch (category) {
        case 'names':
            color = 'pink';
            break;
        case 'actionVerbs':
            color = 'orange';
            break;
        case 'statistics':
            color = 'purple';
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