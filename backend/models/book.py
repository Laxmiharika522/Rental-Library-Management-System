from models.database import db
from datetime import datetime

class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(20), unique=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    publisher = db.Column(db.String(100))
    publication_year = db.Column(db.Integer)
    genre = db.Column(db.String(50))
    category = db.Column(db.String(50), nullable=False)

    price_per_day = db.Column(db.Numeric(10, 2), default=0.00)

    description = db.Column(db.Text)
    total_copies = db.Column(db.Integer, default=1)
    available_copies = db.Column(db.Integer, default=1)
    image_url = db.Column(db.String(255))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    rentals = db.relationship("Rental", backref="book", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "isbn": self.isbn,
            "title": self.title,
            "author": self.author,
            "publisher": self.publisher,
            "publication_year": self.publication_year,
            "genre": self.genre,
            "category": self.category,
            "price_per_day": float(self.price_per_day),
            "description": self.description,
            "total_copies": self.total_copies,
            "available_copies": self.available_copies,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat()
        }
