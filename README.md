# Spookathon - AI Math Problem Solver

An intelligent math problem solver that uses AI to recognize mathematical formulas from images and provide step-by-step solutions.

## Features

- 📸 **Image Recognition**: Upload images of math problems
- 🤖 **AI-Powered OCR**: Extract LaTeX formulas using Pix2Text
- 🧠 **Smart Solving**: Get detailed step-by-step solutions using Google's Gemini AI
- 🌐 **Web Interface**: Modern Next.js frontend with React
- 🔧 **RESTful API**: Flask backend with CORS support

## Project Structure

```
spookathon-1/
├── backend/                 # Python Flask API
│   ├── app.py              # Main Flask application
│   ├── ai-api.py           # AI integration
│   ├── math_solver.py      # Math solving logic
│   └── pix.py              # Image processing utilities
├── frontend/               # Next.js React application
│   └── my-app/            # Next.js app
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** (recommended: Python 3.11)
- **Node.js 18+** and npm/pnpm
- **Git** for version control

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd spookathon-1
```

### 2. Backend Setup (Python/Flask)

#### Install Python Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

#### Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add your Google AI API key to the `.env` file:

```env
GOOGLE_API_KEY=your_google_ai_api_key_here
```

**To get a Google AI API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and paste it in your `.env` file

### 3. Frontend Setup (Next.js/React)

```bash
cd frontend/my-app

# Install dependencies
npm install
# OR if you prefer pnpm:
# pnpm install
```

### 4. Running the Application

#### Start the Backend Server

```bash
# From the project root directory
cd backend
python app.py
```

The Flask server will start on `http://127.0.0.1:5000`

#### Start the Frontend Development Server

Open a new terminal window:

```bash
# From the project root directory
cd frontend/my-app
npm run dev
# OR
# pnpm dev
```

The Next.js development server will start on `http://localhost:3000`

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Upload an image** containing a math problem
3. **Click solve** to get the AI-generated step-by-step solution
4. **View the results** with the recognized LaTeX formula and detailed solution

## API Endpoints

### POST `/solve`
Upload an image and get a mathematical solution.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "solution": "Step-by-step solution text...",
  "latex": "\\frac{x^2 + 1}{x - 1}"
}
```

## Development

### Backend Development

```bash
cd backend
python app.py
```

The server runs in debug mode with auto-reload enabled.

### Frontend Development

```bash
cd frontend/my-app
npm run dev
```

Hot reload is enabled for development.

### Testing

```bash
# Test the backend API
cd backend
python -m pytest

# Test the frontend
cd frontend/my-app
npm test
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   - Ensure you're in the correct directory
   - Check that all dependencies are installed: `pip install -r requirements.txt`

2. **Google AI API errors:**
   - Verify your API key is correct in the `.env` file
   - Check that you have sufficient API quota

3. **Image processing errors:**
   - Ensure the uploaded image is clear and contains readable text
   - Supported formats: PNG, JPG, JPEG

4. **CORS errors:**
   - Make sure the Flask server is running on port 5000
   - Check that Flask-CORS is properly installed

### Port Conflicts

- **Backend (Flask)**: Default port 5000
- **Frontend (Next.js)**: Default port 3000

If these ports are in use, you can change them:
- Flask: Modify `app.run(port=5001)` in `backend/app.py`
- Next.js: Use `npm run dev -- -p 3001`

## Dependencies

### Backend (Python)
- Flask 3.0.0 - Web framework
- Flask-CORS 4.0.0 - Cross-origin requests
- google-generativeai 0.8.3 - Google AI integration
- pix2text 0.3.0 - Image-to-text conversion
- Pillow 10.1.0 - Image processing
- PyTorch 2.1.2 - Machine learning framework

### Frontend (Node.js)
- Next.js 16.0.0 - React framework
- React 19.2.0 - UI library
- TypeScript 5.x - Type safety
- Tailwind CSS 4.x - Styling

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem
