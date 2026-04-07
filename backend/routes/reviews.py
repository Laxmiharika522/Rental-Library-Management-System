from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db
from models.review import Review
from models.rental import Rental
from models.book import Book
from datetime import datetime

reviews_bp = Blueprint("reviews", __name__)

# ==================================================
# Submit a Review
# POST /api/reviews
# ==================================================
@reviews_bp.route("", methods=["POST"])
@jwt_required()
def submit_review():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        book_id = data.get("book_id")
        rating = data.get("rating")
        review_text = data.get("review_text", "")

        if not book_id or not rating:
            return jsonify({"error": "Book ID and Rating are required"}), 400

        # 🛡️ 1. CHECK IF RENTED: Only users who rented the book can review
        rental = Rental.query.filter_by(user_id=user_id, book_id=book_id).first()
        if not rental:
            return jsonify({"error": "You must rent this book before leaving a review."}), 403

        # 🛡️ 2. CHECK IF ALREADY REVIEWED: One review per user per book
        existing_review = Review.query.filter_by(user_id=user_id, book_id=book_id).first()
        if existing_review:
            return jsonify({"error": "You have already reviewed this book."}), 400

        # 🛡️ 3. CREATE REVIEW
        new_review = Review(
            user_id=user_id,
            book_id=book_id,
            rating=rating,
            review_text=review_text
        )

        db.session.add(new_review)
        db.session.commit()

        return jsonify(new_review.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==================================================
# Get Reviews for a Book
# GET /api/books/<id>/reviews
# ==================================================
@reviews_bp.route("/book/<int:book_id>", methods=["GET"])
def get_book_reviews(book_id):
    try:
        reviews = Review.query.filter_by(book_id=book_id).all()
        
        # Calculate Average Rating
        if not reviews:
            return jsonify({"average_rating": 0, "total_reviews": 0, "reviews": []}), 200

        total_rating = sum(r.rating for r in reviews)
        avg_rating = round(total_rating / len(reviews), 1)

        return jsonify({
            "average_rating": avg_rating,
            "total_reviews": len(reviews),
            "reviews": [r.to_dict() for r in reviews]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================================================
# Check if User can Review (Internal/Frontend Helper)
# GET /api/reviews/check/<id>
# ==================================================
@reviews_bp.route("/check/<int:book_id>", methods=["GET"])
@jwt_required()
def check_review_status(book_id):
    try:
        user_id = int(get_jwt_identity())
        
        rental = Rental.query.filter_by(user_id=user_id, book_id=book_id).first()
        existing_review = Review.query.filter_by(user_id=user_id, book_id=book_id).first()
        
        return jsonify({
            "can_review": rental is not None,
            "already_reviewed": existing_review is not None,
            "review": existing_review.to_dict() if existing_review else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
