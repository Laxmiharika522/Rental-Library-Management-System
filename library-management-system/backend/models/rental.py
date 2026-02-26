from models.database import db
from datetime import date, datetime

class Rental(db.Model):
    __tablename__ = "rentals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)

    rental_date = db.Column(db.Date, default=date.today)
    due_date = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date)

    status = db.Column(db.Enum("active", "returned"), default="active")

    total_price = db.Column(db.Numeric(10, 2), default=0.00)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user.to_dict(),
            "book": self.book.to_dict(),
            "rental_date": self.rental_date.isoformat(),
            "due_date": self.due_date.isoformat(),
            "return_date": self.return_date.isoformat() if self.return_date else None,
            "status": self.status,
            "total_price": float(self.total_price)
        }
