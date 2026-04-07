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
    fine_amount = db.Column(db.Numeric(10, 2), default=0.00)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        # 💰 Calculate dynamic fine if active and overdue
        today = date.today()
        current_fine = float(self.fine_amount) if self.fine_amount else 0.0
        
        if self.status == 'active' and today > self.due_date:
            late_days = (today - self.due_date).days
            # 📚 Fetch fine rate from the book record
            rate = float(self.book.fine_rate) if self.book else 10.0
            current_fine = float(late_days * rate)

        return {
            "id": self.id,
            "user": self.user.to_dict() if hasattr(self, 'user') and self.user else {"id": self.user_id},
            "book": self.book.to_dict() if hasattr(self, 'book') and self.book else {"id": self.book_id},
            "rental_date": self.rental_date.isoformat(),
            "due_date": self.due_date.isoformat(),
            "return_date": self.return_date.isoformat() if self.return_date else None,
            "status": self.status,
            "total_price": float(self.total_price) if self.total_price else 0.0,
            "fine_amount": current_fine,
            "is_overdue": today > self.due_date and self.status == 'active'
        }
