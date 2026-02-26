from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db
from models.rental import Rental
from models.book import Book
from datetime import date, timedelta

rentals_bp = Blueprint('rentals', __name__)

RENTAL_DAYS = 14  # fixed rental period


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

        # 💰 Calculate total price (no fine system)
        total_price = RENTAL_DAYS * float(book.price_per_day)

        rental = Rental(
            user_id=user_id,
            book_id=book_id,
            rental_date=date.today(),
            due_date=date.today() + timedelta(days=RENTAL_DAYS),
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
# Get User Rentals (AUTO RETURN POLICY)
# GET /api/rentals/user
# ==================================================
@rentals_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_rentals():
    try:
        user_id = int(get_jwt_identity())
        today = date.today()

        rentals = Rental.query.filter_by(user_id=user_id).all()

        for rental in rentals:
            # 🔄 Automatic return when due date is reached or passed
            if rental.status == 'active' and today >= rental.due_date:
                rental.status = 'returned'
                rental.return_date = rental.due_date

                book = Book.query.get(rental.book_id)
                if book:
                    book.available_copies += 1

        db.session.commit()

        return jsonify([rental.to_dict() for rental in rentals]), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
