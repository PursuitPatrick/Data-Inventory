# AI Inventory Tracker Backend

This folder contains backend server options for your AI Inventory Tracker application.

## 🚀 Quick Start

### Option 1: Node.js with Express (Recommended)

**Prerequisites:**
- Node.js (v14 or higher)
- npm or yarn

**Setup:**
```bash
cd backend
npm install
```

**Run:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Test:**
- Open your browser to: http://localhost:3001/test
- You should see: `{"message": "Back Is Running"}`

### Option 2: Python with Flask

**Prerequisites:**
- Python 3.7 or higher
- pip

**Setup:**
```bash
cd backend
pip install -r requirements.txt
```

**Run:**
```bash
python app.py
```

**Test:**
- Open your browser to: http://localhost:5000/test
- You should see: `{"message": "Back Is Running"}`

## 📁 File Structure

```
backend/
├── package.json          # Node.js dependencies
├── server.js            # Express server
├── requirements.txt     # Python dependencies
├── app.py              # Flask application
└── README.md           # This file
```

## 🔗 API Endpoints

Both backends provide the same endpoints:

- `GET /` - API information
- `GET /test` - Test endpoint (returns "Back Is Running")
- `GET /health` - Health check

## 🌐 Ports

- **Node.js/Express**: Port 3001
- **Python/Flask**: Port 5000

## 🔧 Configuration

You can change the ports by setting environment variables:
- Node.js: `PORT=3001`
- Python: `PORT=5000`

## 💡 Why Two Options?

- **Node.js/Express**: Better integration with your existing React frontend, same JavaScript ecosystem
- **Python/Flask**: Great for data processing, AI/ML integration, and if your team prefers Python

## 🚨 Important Notes

- Only run ONE backend at a time to avoid port conflicts
- The frontend (React) runs on port 5173 (Vite default)
- Backend runs on different ports (3001 or 5000)
- CORS is enabled for both backends to allow frontend communication 