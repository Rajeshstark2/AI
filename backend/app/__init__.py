from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
    app.config['MONGODB_URI'] = os.getenv('MONGODB_URI')
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')

    # Register blueprints
    from .routes import main
    app.register_blueprint(main)

    return app 