import sys
import os
import random

# Add current dir to path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), ".")))

from app import create_app
from models.database import db
from models.review import Review
from models.book import Book
from models.user import User
from models.rental import Rental

app = create_app()

reviews_data = [
    {"rating": 5, "text": "Absolutely loved this! A total classic that everyone should read at least once."},
    {"rating": 4, "text": "Great read, very insightful. The pacing was a bit slow in the middle but the ending made up for it."},
    {"rating": 5, "text": "Mind-blowing. I couldn't put it down. Highly recommend to anyone interested in the genre."},
    {"rating": 3, "text": "It was okay. A bit overrated in my opinion, but still worth a read if you have time."},
    {"rating": 5, "text": "A masterpiece of literature. The depth of character is incredible."},
    {"rating": 4, "text": "Really enjoyed the unique perspective. Would definitely read more from this author."},
    {"rating": 2, "text": "Not really my style. I found the narrative a bit confusing and hard to follow."},
    {"rating": 5, "text": "Perfect for a weekend read. Light, engaging, and very well-written."},
]

def seed_reviews():
    with app.app_context():
        print("🌱 Seeding reviews...")
        
        # Get some books and users
        books = Book.query.limit(10).all()
        users = User.query.limit(5).all()
        
        if not books or not users:
            print("❌ No books or users found. Please seed them first.")
            return

        # Clear existing reviews to avoid duplicates in mock data (optional)
        # db.session.execute(db.text("DELETE FROM reviews"))
        
        count = 0
        for book in books:
            # Add 1-3 reviews per book
            num_reviews = random.randint(1, 3)
            selected_users = random.sample(users, min(num_reviews, len(users)))
            
            for user in selected_users:
                # Check if already reviewed
                exists = Review.query.filter_by(user_id=user.id, book_id=book.id).first()
                if not exists:
                    # To satisfy the "must have rented" constraint in the logic, 
                    # we briefly ensure a mock rental exists for this user/book
                    rental_exists = Rental.query.filter_by(user_id=user.id, book_id=book.id).first()
                    if not rental_exists:
                        mock_rental = Rental(
                            user_id=user.id, 
                            book_id=book.id, 
                            rental_date=random.choice(['2024-01-01', '2024-02-01']),
                            due_date='2024-12-31'
                        )
                        db.session.add(mock_rental)

                    rev_content = random.choice(reviews_data)
                    new_rev = Review(
                        user_id=user.id,
                        book_id=book.id,
                        rating=rev_content["rating"],
                        review_text=rev_content["text"]
                    )
                    db.session.add(new_rev)
                    count += 1
        
        db.session.commit()
        print(f"✅ Successfully seeded {count} mock reviews!")

if __name__ == "__main__":
    seed_reviews()
