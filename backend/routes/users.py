#backend\routes\users.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.database import db

users_bp = Blueprint('users', __name__)

# 🔐 Get all users (Admin/Librarian)
@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 🔐 Get single user
@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 🔐 Activate / Deactivate user
@users_bp.route('/<int:user_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        user.is_active = not user.is_active
        db.session.commit()

        return jsonify({
            'message': 'User status updated',
            'is_active': user.is_active
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
