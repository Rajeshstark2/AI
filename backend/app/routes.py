from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from openai import OpenAI
import os

main = Blueprint('main', __name__)

# Initialize MongoDB client
client = MongoClient(os.getenv('MONGODB_URI'))
db = client.ai_assistant

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@main.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        user_id = data.get('user_id')

        # Get user context from MongoDB
        user_context = db.users.find_one({'user_id': user_id})
        
        # Prepare conversation context
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant."}
        ]
        
        if user_context:
            messages.append({
                "role": "system",
                "content": f"User's name is {user_context.get('name', 'User')}. "
                          f"Preferred wake word is {user_context.get('wake_word', 'Assistant')}."
            })
        
        messages.append({"role": "user", "content": user_message})

        # Get response from OpenAI
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        return jsonify({
            'response': response.choices[0].message.content,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@main.route('/api/user', methods=['POST'])
def create_user():
    try:
        data = request.json
        user_data = {
            'user_id': data.get('user_id'),
            'name': data.get('name'),
            'wake_word': data.get('wake_word', 'Assistant'),
            'preferences': data.get('preferences', {})
        }
        
        db.users.update_one(
            {'user_id': user_data['user_id']},
            {'$set': user_data},
            upsert=True
        )
        
        return jsonify({
            'message': 'User created/updated successfully',
            'status': 'success'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@main.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = db.users.find_one({'user_id': user_id})
        if user:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            return jsonify({
                'user': user,
                'status': 'success'
            })
        return jsonify({
            'error': 'User not found',
            'status': 'error'
        }), 404

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500 