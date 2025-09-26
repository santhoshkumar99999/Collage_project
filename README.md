# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Using Generative AI Features

This application uses the Google AI Gemini model for its chatbot functionality. To enable the chatbot, you need to provide a Google AI API key.

1.  **Get an API Key**: Create an API key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2.  **Set the Environment Variable**: Open the `.env` file in the root of this project.
3.  **Add your key**: Replace `YOUR_API_KEY_HERE` with the key you generated.

```.env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

The application will now be able to authenticate with the Google AI services and the chatbot will function correctly.
