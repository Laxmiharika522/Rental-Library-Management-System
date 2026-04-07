"""
fix_images_and_reset.py
Fixes broken image URLs in books.json and wipes/reseeds the books table with IDs starting at 1.
Also wipes rentals, wishlist, and reviews tables to avoid FK conflicts.
"""
import os, sys, json
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from models.database import db
from models.book import Book
from decimal import Decimal

# ---------------------------------------------------
# 1. Open Library ISBN covers (verified high-res URLs)
# ---------------------------------------------------
IMAGE_FIXES = {
    "Campbell Biology":            "https://covers.openlibrary.org/b/isbn/9780134093413-L.jpg",
    "Calculus: Early Transcendentals": "https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg",
    "Principles of Economics":     "https://covers.openlibrary.org/b/isbn/9781305585126-L.jpg",
    "Organic Chemistry":           "https://covers.openlibrary.org/b/isbn/9780321971371-L.jpg",
    "Physics for Scientists and Engineers": "https://covers.openlibrary.org/b/isbn/9781133947271-L.jpg",
    "Watchmen":                    "https://covers.openlibrary.org/b/isbn/9780930289232-L.jpg",
    "Maus":                        "https://covers.openlibrary.org/b/isbn/9780679748403-L.jpg",
    "The Sandman Vol 1":           "https://covers.openlibrary.org/b/isbn/9781401284770-L.jpg",
    "Persepolis":                  "https://covers.openlibrary.org/b/isbn/9780375714832-L.jpg",
    "Saga Vol 1":                  "https://covers.openlibrary.org/b/isbn/9781607066019-L.jpg",
    "The Winds of Time":           "https://covers.openlibrary.org/b/isbn/9780345467607-L.jpg",
    "Quantum Mind":                "https://covers.openlibrary.org/b/isbn/9780979870804-L.jpg",
}

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "books.json")

# ---------------------------------------------------
# 2. Patch books.json in-place
# ---------------------------------------------------
def patch_json():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        books = json.load(f)

    fixed = 0
    for book in books:
        title = book.get("title", "")
        if "example.com" in book.get("image_url", "") and title in IMAGE_FIXES:
            book["image_url"] = IMAGE_FIXES[title]
            fixed += 1
            print(f"  Fixed image for: {title}")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(books, f, indent=2, ensure_ascii=False)

    print(f"\nPatched {fixed} image URLs in books.json")
    return books

# ---------------------------------------------------
# 3. Wipe related tables and re-seed books
# ---------------------------------------------------
def reset_and_seed(books):
    app = create_app()
    with app.app_context():
        print("\nDropping dependent data (reviews, wishlist, rentals)...")
        try:
            db.session.execute(db.text("SET FOREIGN_KEY_CHECKS = 0"))
            db.session.execute(db.text("TRUNCATE TABLE reviews"))
            db.session.execute(db.text("TRUNCATE TABLE wishlist"))
            db.session.execute(db.text("TRUNCATE TABLE rentals"))
            db.session.execute(db.text("TRUNCATE TABLE books"))
            db.session.execute(db.text("SET FOREIGN_KEY_CHECKS = 1"))
            db.session.commit()
            print("Tables wiped successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"  Warning during wipe: {e}")

        print(f"\nSeeding {len(books)} books (IDs will start from 1)...")
        added = 0
        for book_item in books:
            isbn = book_item.get("isbn")
            if not isbn:
                continue
            try:
                new_book = Book(
                    isbn=isbn,
                    title=book_item.get("title"),
                    author=book_item.get("author"),
                    publisher=book_item.get("publisher"),
                    publication_year=int(book_item.get("publication_year", 0) or 0),
                    genre=book_item.get("genre"),
                    category=book_item.get("category", "Book"),
                    price_per_day=Decimal(str(book_item.get("price_per_day", 0))),
                    description=book_item.get("description"),
                    total_copies=int(book_item.get("total_copies", 1)),
                    available_copies=int(book_item.get("available_copies", 1)),
                    image_url=book_item.get("image_url"),
                )
                db.session.add(new_book)
                added += 1
            except Exception as e:
                print(f"  Skip {book_item.get('title')}: {e}")

        db.session.commit()
        print(f"Seeded {added} books. First few IDs:")
        for b in Book.query.order_by(Book.id).limit(5).all():
            print(f"  ID={b.id}  {b.title}")

if __name__ == "__main__":
    print("=== STEP 1: Patching books.json ===")
    books = patch_json()
    print("\n=== STEP 2: Resetting & re-seeding database ===")
    reset_and_seed(books)
    print("\n✅ Done! Database refreshed with IDs starting from 1.")
