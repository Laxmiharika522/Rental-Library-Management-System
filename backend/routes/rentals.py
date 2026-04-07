from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db
from models.rental import Rental
from models.book import Book
from datetime import date, timedelta

rentals_bp = Blueprint('rentals', __name__)

FINE_PER_DAY = 10.0  # Daily fine for overdue books


# ==================================================
# Rent a Book
# POST /api/rentals
# ==================================================
@rentals_bp.route('', methods=['POST'])
@jwt_required()
def rent_book():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        book_id = data.get('book_id')
        duration = int(data.get('duration', 14)) # Default 14 days

        if not book_id:
            return jsonify({'error': 'Book ID is required'}), 400

        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': 'Book not found'}), 404

        if book.available_copies <= 0:
            return jsonify({'error': 'Book not available'}), 400

        # Prevent duplicate active rentals
        existing_rental = Rental.query.filter_by(
            user_id=user_id,
            book_id=book_id,
            status='active'
        ).first()

        if existing_rental:
            return jsonify({'error': 'You already rented this book'}), 400

        # 💰 Calculate total price
        total_price = duration * float(book.price_per_day)

        rental = Rental(
            user_id=user_id,
            book_id=book_id,
            rental_date=date.today(),
            due_date=date.today() + timedelta(days=duration),
            status='active',
            total_price=total_price
        )

        book.available_copies -= 1

        db.session.add(rental)
        db.session.commit()

        return jsonify(rental.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================================================
# Get My Active Rentals
# GET /api/rentals/user
# ==================================================
@rentals_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_rentals():
    try:
        user_id = int(get_jwt_identity())
        # Simply fetch active rentals without auto-returning
        rentals = Rental.query.filter_by(user_id=user_id, status='active').all()
        return jsonify([rental.to_dict() for rental in rentals]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================================================
# Return a Book (Manual Return)
# POST /api/rentals/<id>/return
# ==================================================
@rentals_bp.route('/<int:rental_id>/return', methods=['POST'])
@jwt_required()
def return_book_manually(rental_id):
    try:
        user_id = int(get_jwt_identity())
        rental = Rental.query.filter_by(id=rental_id, user_id=user_id).first()

        if not rental:
            return jsonify({'error': 'Rental not found'}), 404

        if rental.status == 'returned':
            return jsonify({'error': 'Book already returned'}), 400

        today = date.today()
        rental.status = 'returned'
        rental.return_date = today

        # 💰 Fine Calculation using book's specific rate
        book = Book.query.get(rental.book_id)
        if today > rental.due_date:
            late_days = (today - rental.due_date).days
            rate = float(book.fine_rate) if book else FINE_PER_DAY
            rental.fine_amount = late_days * rate

        # 🔄 Update book availability
        book = Book.query.get(rental.book_id)
        if book:
            book.available_copies += 1

        db.session.commit()
        return jsonify(rental.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================================================
# Get All Transactions (Record of All Activities)
# GET /api/rentals/history
# ==================================================
@rentals_bp.route('/history', methods=['GET'])
@jwt_required()
def get_user_rental_history():
    try:
        user_id = int(get_jwt_identity())
        # Fetch ALL rentals for this user as a record
        history = Rental.query.filter_by(user_id=user_id).order_by(Rental.rental_date.desc()).all()
        return jsonify([rental.to_dict() for rental in history]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
