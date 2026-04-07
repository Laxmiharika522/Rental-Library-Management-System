from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db
from models.wishlist import Wishlist
from models.book import Book

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('', methods=['GET'])
@jwt_required()
def get_wishlist():
    try:
        user_id = int(get_jwt_identity())
        wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
        return jsonify([item.to_dict() for item in wishlist_items]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@wishlist_bp.route('', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        book_id = data.get('book_id')

        if not book_id:
            return jsonify({'error': 'Book ID is required'}), 400

        # Check if book exists
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': 'Book not found'}), 404

        # Check if already in wishlist
        existing = Wishlist.query.filter_by(user_id=user_id, book_id=book_id).first()
        if existing:
            return jsonify({'message': 'Book already in wishlist'}), 200

        new_item = Wishlist(user_id=user_id, book_id=book_id)
        db.session.add(new_item)
        db.session.commit()

        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@wishlist_bp.route('/<int:book_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(book_id):
    try:
        user_id = int(get_jwt_identity())
        item = Wishlist.query.filter_by(user_id=user_id, book_id=book_id).first()

        if not item:
            return jsonify({'error': 'Item not found in wishlist'}), 404

        db.session.delete(item)
        db.session.commit()

        return jsonify({'message': 'Removed from wishlist'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
