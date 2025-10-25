import os
from google import genai 
from dotenv import load_dotenv
from pathlib import Path

script_dir = Path(__file__).parent 
dotenv_path = script_dir / '.env'

# Load the .env file
load_dotenv(dotenv_path=dotenv_path)

# Initialize the client. 
try:
    client = genai.Client() 
    
    response = client.models.generate_content(
        model="gemini-2.5-flash", # Correct model name
        contents="Give me step by step solution to this problem: ( x+3 )^{2}=4"
    )
    
    print(response.text)
    
except Exception as e:
    print(f"An error occurred: {e}")
