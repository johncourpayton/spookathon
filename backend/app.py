import os
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS  # For handling requests from the frontend
from dotenv import load_dotenv
from google import genai 
from pix2text import Pix2Text
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Enable CORS
CORS(app)

# Load the .env file
script_dir = Path(__file__).parent 
dotenv_path = script_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Save the image to process it
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize our AI models ONCE when the server starts
try:
    print("Loading Google AI Client...")
    ai_client = genai.Client()
    print("Google AI Client loaded.")
    
    print("Loading Pix2Text models...")
    p2t_client = Pix2Text.from_config()
    print("Pix2Text models loaded.")
    
except Exception as e:
    print(f"FATAL ERROR: Could not initialize AI models: {e}")
    # If models can't load, the server can't do its job.
    exit()

# --- 2. Define the API Endpoint ---

# This creates a new URL at http://127.0.0.1:5000/solve
# It only accepts POST requests (which is how files are sent)
@app.route('/solve', methods=['POST'])
def solve_problem():
    print("\nReceived a new request...")
    
    # --- 3. Get the Uploaded Image ---
    
    # Check if the 'image' file is in the request
    if 'image' not in request.files:
        print("Error: No 'image' key in request.files")
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    # Check if the user selected a file
    if file.filename == '':
        print("Error: No file selected")
        return jsonify({"error": "No file selected"}), 400

    image_path = None
    try:
        # --- 4. Process the Image ---
        
        # Save the file temporarily
        filename = secure_filename(file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(image_path)
        print(f"Image saved temporarily to: {image_path}")

        # Run Pix2Text
        print("Running Pix2Text...")
        latex_formula = p2t_client.recognize_formula(image_path)
        
        if not latex_formula:
            print("Error: Pix2Text could not find a formula.")
            return jsonify({"error": "Could not find a formula in the image"}), 400
            
        print(f"Recognized LaTeX: {latex_formula}")

        # --- 5. Call the AI API ---
        
        print("Sending to Google AI...")
        prompt_to_send = f"""
        Please provide a clear, step-by-step solution
        for the following math problem.

        Problem (in LaTeX):
        {latex_formula}
        """
        
        response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt_to_send
        )
        
        solution_text = response.text
        print("AI Solution generated.")

        # --- 6. Send the Solution Back ---
        
        # Return a JSON object with the solution and the recognized formula
        return jsonify({
            "solution": solution_text,
            "latex": latex_formula
        })

    except Exception as e:
        # Catch-all for any other errors
        print(f"An error occurred: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500
        
    finally:
        # --- 7. Clean Up ---
        
        # Delete the temporary image file after we're done
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
            print(f"Cleaned up temporary file: {image_path}")

# --- 8. Run the Server ---

# This line makes the script run continuously as a server
if __name__ == '__main__':
    # Runs the server on http://127.0.0.1:5000
    # debug=True means it will auto-reload when you save changes
    app.run(debug=True, port=5000)
