import os
from google import genai 
from dotenv import load_dotenv
from pathlib import Path
from pix2text import Pix2Text

# Set the path to the image you want to solve
IMAGE_FILE_PATH = 'test1.png' 

# --- 2. Load API Key ---
script_dir = Path(__file__).parent 
dotenv_path = script_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

# --- 3. Process Image with Pix2Text ---
print(f"Processing image: {IMAGE_FILE_PATH}...")
try:
    p2t = Pix2Text.from_config()
    # Recognize the formula and store it in a variable
    latex_formula = p2t.recognize_formula(IMAGE_FILE_PATH) 
    
    if not latex_formula:
        print("Error: Could not find a formula in the image.")
        exit() # Stop the script if no formula is found
        
    print(f"LaTex Version of Formula: {latex_formula}")

except Exception as e:
    print(f"An error occurred during image processing (pix2text): {e}")
    exit() # Stop the script if pix2text fails

# --- 4. Send to Gemini API ---
try:
    print("\nLoading solution...")
    client = genai.Client() 
    
    # Create a new prompt that INCLUDES the formula variable
    prompt_to_send = f"""
    Please provide a clear, step-by-step solution
    for the following math problem.

    Problem (in LaTeX):
    {latex_formula}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt_to_send
    )
    
    print("\n--- Solution ---")
    print(response.text)
    
except Exception as e:
    print(f"\nAn error occurred with the AI API: {e}")