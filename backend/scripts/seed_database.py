import os
import json
import sys

# Add the backend directory to sys.path to allow imports from models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.database import db
from models.book import Book
from decimal import Decimal

def seed_database():
    app = create_app()
    with app.app_context():
        # Path to books.json
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'books.json')
        
        if not os.path.exists(data_path):
            print(f"Error: {data_path} not found.")
            return

        with open(data_path, 'r', encoding='utf-8') as f:
            books_data = json.load(f)

        print(f"Found {len(books_data)} books in books.json. Starting seed...")

        added_count = 0
        updated_count = 0
        
        for book_item in books_data:
            isbn = book_item.get('isbn')
            if not isbn:
                print(f"Skipping book without ISBN: {book_item.get('title')}")
                continue

            # Check if book already exists
            existing_book = Book.query.filter_by(isbn=isbn).first()
            
            if existing_book:
                # Update existing book
                existing_book.title = book_item.get('title')
                existing_book.author = book_item.get('author')
                existing_book.publisher = book_item.get('publisher')
                existing_book.publication_year = int(book_item.get('publication_year', 0))
                existing_book.genre = book_item.get('genre')
                existing_book.category = book_item.get('category')
                existing_book.price_per_day = Decimal(str(book_item.get('price_per_day', 0.0)))
                existing_book.description = book_item.get('description')
                existing_book.total_copies = int(book_item.get('total_copies', 1))
                existing_book.available_copies = int(book_item.get('available_copies', 1))
                existing_book.image_url = book_item.get('image_url')
                updated_count += 1
            else:
                # Create new book
                new_book = Book(
                    isbn=isbn,
                    title=book_item.get('title'),
                    author=book_item.get('author'),
                    publisher=book_item.get('publisher'),
                    publication_year=int(book_item.get('publication_year', 0)),
                    genre=book_item.get('genre'),
                    category=book_item.get('category'),
                    price_per_day=Decimal(str(book_item.get('price_per_day', 0.0))),
                    description=book_item.get('description'),
                    total_copies=int(book_item.get('total_copies', 1)),
                    available_copies=int(book_item.get('available_copies', 1)),
                    image_url=book_item.get('image_url')
                )
                db.session.add(new_book)
                added_count += 1

        try:
            db.session.commit()
            print(f"Seed complete!")
            print(f"Total books processed: {len(books_data)}")
            print(f"New books added: {added_count}")
            print(f"Existing books updated: {updated_count}")
            
            # Print unique categories count
            categories = set(b.category for b in Book.query.all())
            print(f"Unique categories in database: {len(categories)}")
            for cat in sorted(list(categories)):
                print(f" - {cat}")
                
        except Exception as e:
            db.session.rollback()
            print(f"Error during commit: {str(e)}")

if __name__ == "__main__":
    seed_database()
