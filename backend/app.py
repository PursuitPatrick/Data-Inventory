from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuration
PORT = int(os.environ.get('PORT', 5000))

@app.route('/test')
def test():
    return jsonify({'message': 'Back Is Running'})

@app.route('/health')
def health():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/')
def root():
    return jsonify({
        'message': 'AI Inventory Tracker Backend API',
        'version': '1.0.0',
        'endpoints': {
            'test': '/test',
            'health': '/health'
        }
    })

if __name__ == '__main__':
    print(f"🚀 Backend server running on http://localhost:{PORT}")
    print(f"📝 Test endpoint: http://localhost:{PORT}/test")
    print(f"💚 Health check: http://localhost:{PORT}/health")
    app.run(host='0.0.0.0', port=PORT, debug=True) 