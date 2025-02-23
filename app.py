import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)

# Configure Supabase database
SUPABASE_DB_URL = os.environ.get("SUPABASE_DB_URL")
if not SUPABASE_DB_URL:
    raise ValueError("SUPABASE_DB_URL environment variable is not set")

# Configure database
app.config["SQLALCHEMY_DATABASE_URI"] = SUPABASE_DB_URL
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key")

# Initialize database
db.init_app(app)

with app.app_context():
    import models
    db.create_all()

from views import *

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
