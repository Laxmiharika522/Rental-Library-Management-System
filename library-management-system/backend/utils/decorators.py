#backend\utils\decorators.py
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify
from models.user import User

def role_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user or user.role not in roles:
                return jsonify({'error': 'Access denied'}), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator
