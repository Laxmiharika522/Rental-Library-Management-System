import sys
import os
import json
from pathlib import Path

# Add the parent directory of 'backend' to sys.path so we can import 'app' and 'models'
# The current file is backend/scripts/refresh_books.py
# So .. is backend/ and ../.. is the root
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(os.path.join(root_path, 'backend'))

from app import create_app
from models.database import db
from models.book import Book
from models.rental import Rental
from models.wishlist import Wishlist
from models.review import Review
from sqlalchemy import text

def refresh_books():
    app = create_app()
    with app.app_context():
        print("Refreshing books database...")
        
        try:
            # Disable foreign key checks for MySQL to allow truncation
            db.session.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            
            # Truncate tables to reset IDs
            print("Cleaning up tables (rentals, wishlist, reviews, books)...")
            db.session.execute(text("TRUNCATE TABLE rentals;"))
            db.session.execute(text("TRUNCATE TABLE wishlist;"))
            db.session.execute(text("TRUNCATE TABLE reviews;"))
            db.session.execute(text("TRUNCATE TABLE books;"))
            
            # Re-enable foreign key checks
            db.session.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
            db.session.commit()
            
            # Load books from JSON
            json_path = Path(root_path) / "backend" / "data" / "books.json"
            if not json_path.exists():
                print(f"Error: {json_path} not found.")
                return

            with open(json_path, "r", encoding="utf-8") as f:
                books_data = json.load(f)

            print(f"Seeding {len(books_data)} books...")
            for data in books_data:
                # Remove 'id' if it exists in JSON to let DB auto-increment from 1
                if "id" in data:
                    del data["id"]
                
                # Check for required fields
                if not data.get("title") or not data.get("author"):
                    continue

                new_book = Book(
                    isbn=data.get("isbn"),
                    title=data["title"],
                    author=data["author"],
                    publisher=data.get("publisher"),
                    publication_year=data.get("publication_year"),
                    genre=data.get("genre"),
                    category=data.get("category", "Book"),
                    price_per_day=data.get("price_per_day", 0),
                    fine_rate=data.get("fine_rate", 10.00), # 🚀 Map new field
                    description=data.get("description"),
                    total_copies=int(data.get("total_copies", 1)),
                    available_copies=int(data.get("total_copies", 1)),
                    image_url=data.get("image_url")
                )
                db.session.add(new_book)
            
            db.session.commit()
            print("Books refreshed successfully! All IDs started from 1.")

        except Exception as e:
            db.session.rollback()
            print(f"Error during refresh: {e}")

if __name__ == "__main__":
    refresh_books()
