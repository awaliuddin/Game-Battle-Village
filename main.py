from flask import Flask, render_template
import logging
from app import app

logging.basicConfig(level=logging.DEBUG)

# For Vercel deployment
app = app

# This is required for Vercel
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
else:
    # For serverless environment
    app.debug = False