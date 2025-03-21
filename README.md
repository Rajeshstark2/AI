# AI Assistant Mobile App

A smart virtual assistant mobile application that provides personalized responses, works offline, and integrates with AI APIs.

## Features

- Personalization with user details storage
- Wake word activation (customizable name)
- Offline mode with local responses
- Smart internet access with permission handling
- Natural conversations using ChatGPT/DeepSeek API
- Real-time information retrieval
- Voice input & output
- Background operation support

## Tech Stack

- Frontend: React Native
- Backend: Flask
- Database: MongoDB
- AI Model: ChatGPT API / DeepSeek API
- Storage: AsyncStorage
- Voice Processing: react-native-voice
- Mobile Data Control: React Native Permissions

## Project Structure

```
ai-assistant/
├── mobile/           # React Native mobile app
│   ├── src/         # Source code
│   ├── assets/      # Static assets
│   └── App.js       # Main app component
└── backend/         # Flask backend
    ├── app/         # Application code
    ├── config/      # Configuration files
    └── requirements.txt
```

## Setup Instructions

### Mobile App Setup
1. Navigate to the mobile directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Start the Flask server: `python run.py`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_uri
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. #   A I  
 #   A I  
 