import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.database import db
from models.wishlist import Wishlist # Import to register the model

def create_tables():
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Database tables created/updated successfully!")

if __name__ == "__main__":
    create_tables()
