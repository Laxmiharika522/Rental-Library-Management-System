from models.database import db
from datetime import datetime

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    
    rating = db.Column(db.Integer, nullable=False) # 1-5 stars
    review_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref=db.backref("reviews", lazy=True))
    book = db.relationship("Book", backref=db.backref("reviews", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username,
            "book_id": self.book_id,
            "rating": self.rating,
            "review_text": self.review_text,
            "created_at": self.created_at.isoformat()
        }
