// Quill editor setup
var quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: "#toolbar",
    },
  });
  
  // Modal elements
  var languageModal = document.getElementById("languageModal");
  var previewModal = document.getElementById("previewModal");
  var translationButton = document.getElementById("myButton");
  var closeModalButton = document.getElementsByClassName("close")[0];
  var closePreviewModalButton = document.getElementsByClassName("close-preview")[0];
  var translationPreview = document.getElementById("translationPreview");
  
  // Open the language modal
  translationButton.onclick = function() {
    languageModal.style.display = "block";
  };
  
  // Close the language modal
  closeModalButton.onclick = function() {
    languageModal.style.display = "none";
  };
  
  // Close the preview modal
  closePreviewModalButton.onclick = function() {
    previewModal.style.display = "none";
  };
  
  // Close modals if clicked outside of them
  window.onclick = function(event) {
    if (event.target == languageModal) {
      languageModal.style.display = "none";
    } else if (event.target == previewModal) {
      previewModal.style.display = "none";
    }
  };
  
  // Translate button inside the language modal
  document.getElementById("translateButton").addEventListener("click", function() {
    // Retrieve the selected language from the dropdown
    var selectedLanguage = document.getElementById("languageSelect").value;
  
    // Retrieve all the content from Quill as plain text
    var editorContent = quill.getText();
  
    // Prepare the prompt with a command
    var promptText = `Translate the following text to ${selectedLanguage}: ${editorContent.trim()}`;
  
    fetch("http://localhost:3000/chatgpt", {
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
      // Assuming the response contains the text from GPT-4
      // You might need to adjust this part depending on the actual response format
      var translatedText = data.choices[0].message.content;
      
      // Display the translation in the preview modal
      translationPreview.textContent = translatedText;
      previewModal.style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
  
    // Close the language modal
    languageModal.style.display = "none";
  });
  
  // Accept translation button inside the preview modal
  document.getElementById("acceptTranslation").addEventListener("click", function() {
    quill.setText(translationPreview.textContent); // Replace the editor content with the translation
    previewModal.style.display = "none"; // Close the preview modal
  });
  
  // Skip translation button inside the preview modal
  document.getElementById("skipTranslation").addEventListener("click", function() {
    previewModal.style.display = "none"; // Just close the preview modal
  });
  