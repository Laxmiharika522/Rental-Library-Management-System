from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash
from models.user import User
from models.book import Book
from models.rental import Rental
from utils.decorators import role_required
from models.database import db

admin_bp = Blueprint("admin", __name__)

# ===============================
# ADMIN DASHBOARD STATS
# ===============================
@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_dashboard():
    total_users = User.query.count()
    total_books = Book.query.count()
    active_rentals = Rental.query.filter_by(status="active").count()

    available_books = db.session.query(
        db.func.sum(Book.available_copies)
    ).scalar() or 0

    return jsonify({
        "total_users": total_users,
        "total_books": total_books,
        "active_rentals": active_rentals,
        "available_books": available_books
    }), 200


# ===============================
# BOOKS MANAGEMENT
# ===============================

# 1. Get all books (Admin view – unpaginated)
@admin_bp.route("/books", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_get_all_books():
    try:
        books = Book.query.order_by(Book.created_at.desc()).all()
        return jsonify([book.to_dict() for book in books]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 2. Add book manually
@admin_bp.route("/books", methods=["POST"])
@jwt_required()
@role_required("admin")
def admin_add_book():
    data = request.get_json() or {}

    if not data.get("title") or not data.get("author"):
        return jsonify({"error": "Title and author are required"}), 400

    if data.get("isbn") and Book.query.filter_by(isbn=data["isbn"]).first():
        return jsonify({"error": "ISBN already exists"}), 400

    total_copies = int(data.get("total_copies", 1))

    new_book = Book(
        title=data["title"],
        author=data["author"],
        isbn=data.get("isbn"),
        category=data.get("category", "General"),
        price_per_day=data.get("price_per_day", 0),
        total_copies=total_copies,
        available_copies=total_copies,
        image_url=data.get("image_url", "")
    )

    db.session.add(new_book)
    db.session.commit()

    return jsonify(new_book.to_dict()), 201


# 3. Update book details
@admin_bp.route("/books/<int:book_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json() or {}

    try:
        book.title = data.get("title", book.title)
        book.author = data.get("author", book.author)
        book.category = data.get("category", book.category)

        if "price_per_day" in data:
            book.price_per_day = data["price_per_day"]

        if "total_copies" in data:
            new_total = int(data["total_copies"])
            diff = new_total - book.total_copies
            book.total_copies = new_total
            book.available_copies += diff

        db.session.commit()
        return jsonify({
            "message": "Book updated successfully",
            "book": book.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# 4. Delete book
@admin_bp.route("/books/<int:book_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    active_rental = Rental.query.filter_by(
        book_id=book_id,
        status="active"
    ).first()

    if active_rental:
        return jsonify({"error": "Cannot delete book with active rentals"}), 400

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200


# ===============================
# USERS MANAGEMENT
# ===============================

# 1. Get all users
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


# 2. Add user manually
@admin_bp.route("/users", methods=["POST"])
@jwt_required()
@role_required("admin")
def add_user():
    data = request.get_json() or {}

    if User.query.filter(
        (User.username == data["username"]) |
        (User.email == data["email"])
    ).first():
        return jsonify({"error": "Username or email already exists"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        full_name=data.get("full_name", ""),
        role=data.get("role", "user")
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": new_user.to_dict()
    }), 201


# 3. Delete user
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    Rental.query.filter_by(user_id=user_id).delete()
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User and rental history deleted"}), 200


# 4. Update user role
@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_user_role(user_id):
    user = User.query.get(user_id)
    data = request.get_json() or {}

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.role = data.get("role", user.role)
    db.session.commit()

    return jsonify({"message": f"User role updated to {user.role}"}), 200


# ===============================
# RENTALS MANAGEMENT
# ===============================

# 1. Get active rentals
@admin_bp.route("/rentals/active", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_active_rentals():
    try:
        active_rentals = (
            db.session.query(Rental, User, Book)
            .join(User, Rental.user_id == User.id)
            .join(Book, Rental.book_id == Book.id)
            .filter(Rental.status == "active")
            .all()
        )

        results = []
        for rental, user, book in active_rentals:
            results.append({
                "id": rental.id,
                "user_name": user.full_name or user.username,
                "book_title": book.title,
                "rental_date": rental.rental_date.isoformat(),
                "due_date": rental.due_date.isoformat(),
                "total_price": float(rental.total_price),
                "status": rental.status
            })

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 2. Manually mark rental as returned
@admin_bp.route("/rentals/<int:rental_id>/return", methods=["PUT"])
@jwt_required()
@role_required("admin")
def mark_rental_returned(rental_id):
    rental = Rental.query.get_or_404(rental_id)

    if rental.status == "returned":
        return jsonify({"message": "Rental already returned"}), 400

    try:
        rental.status = "returned"
        rental.return_date = rental.due_date

        book = Book.query.get(rental.book_id)
        if book:
            book.available_copies += 1

        db.session.commit()
        return jsonify({"message": "Book returned successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
