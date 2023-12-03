require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Create an async function to load fetch
async function loadDependencies() {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    // You can now use fetch here
}

loadDependencies().then(() => {

    app.post('/chatgpt', async (req, res) => {


        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-4", // Specify the model if required
                    messages: [{ "role": "user", "content": req.body.prompt }]
                })
            });
                
            const apiResponse = await response.json(); // Parse the JSON response
            console.log("API Response:", apiResponse); // Log the parsed response

            res.json(apiResponse); // Send response back to frontend
            
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).send(error.message);
        }
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
});
