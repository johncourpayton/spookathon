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
You are a precision mathematical solver. Your ONLY job is to provide a 
step-by-step solution for the given LaTeX problem.

**CRITICAL RULES:**
1.  You MUST follow the output template *exactly*.
2.  **DO NOT explain the LaTeX code itself.** Never discuss what a command 
    like `\underbrace` or `\frac` means. Only solve the mathematical 
    problem it represents.
3.  Do NOT add any conversational text.
4.  ALL mathematical calculations MUST be in display-style LaTeX (`$$...$$`).
5.  ALL reasoning text MUST be plain English.

**OUTPUT TEMPLATE:**
---
## Step-by-Step Solution

**Step 1: [Short Title for Step 1]**
*Reasoning:* [Explain the goal or logic of this step in plain text.]
*Calculation:*
$$[LaTeX for the calculation of Step 1]$$

**Step 2: [Short Title for Step 2]**
*Reasoning:* [Explain the goal or logic of this step in plain text.]
*Calculation:*
$$[LaTeX for the calculation of Step 2]$$

**Step 3: [Short Title for Step 3]**
*Reasoning:* [Explain the goal or logic of this step in plain text.]
*Calculation:*
$$[LaTeX for the calculation of Step 3]$$

[... add more steps as needed ...]

---
## Final Answer
The final solution to the problem {latex_formula} is:
$$\boxed{[Final LaTeX answer]}$$
"""
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt_to_send
    )
    
    print("\n--- Solution ---")
    print(response.text)
    
except Exception as e:
    print(f"\nAn error occurred with the AI API: {e}")