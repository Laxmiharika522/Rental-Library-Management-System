from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from models.database import db
from models.book import Book
from models.rental import Rental
from sqlalchemy import func
from pathlib import Path
import json

books_bp = Blueprint("books", __name__)

# --------------------------------------------------
# GET all books (search + category + pagination)
# --------------------------------------------------
@books_bp.route("", methods=["GET"])  # no trailing slash
def get_books():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        search = request.args.get("search", "", type=str).strip()
        category = request.args.get("category", "", type=str).strip()

        query = Book.query

        if search:
            query = query.filter(
                db.or_(
                    Book.title.ilike(f"%{search}%"),
                    Book.author.ilike(f"%{search}%"),
                    Book.genre.ilike(f"%{search}%")
                )
            )

        if category:
            query = query.filter(Book.category.ilike(f"%{category}%"))

        books = query.order_by(Book.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return jsonify({
            "books": [book.to_dict() for book in books.items],
            "total": books.total,
            "pages": books.pages,
            "current_page": page
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# GET single book by ID
# --------------------------------------------------
@books_bp.route("/<int:book_id>", methods=["GET"])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict()), 200


# --------------------------------------------------
# ADD single book
# --------------------------------------------------
@books_bp.route("", methods=["POST"])
@jwt_required()
def add_book():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        if not data.get("title") or not data.get("author"):
            return jsonify({"error": "Title and author are required"}), 400

        if data.get("isbn") and Book.query.filter_by(isbn=data["isbn"]).first():
            return jsonify({"error": "Book with this ISBN already exists"}), 409

        total_copies = int(data.get("total_copies", 1))

        book = Book(
            isbn=data.get("isbn"),
            title=data["title"],
            author=data["author"],
            publisher=data.get("publisher"),
            publication_year=data.get("publication_year"),
            genre=data.get("genre"),
            category=data.get("category", "Book").strip(),
            price_per_day=data.get("price_per_day", 0),
            description=data.get("description"),
            total_copies=total_copies,
            available_copies=total_copies,
            image_url=data.get("image_url")
        )

        db.session.add(book)
        db.session.commit()

        return jsonify(book.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# BULK UPLOAD FROM JSON (update or insert)
# --------------------------------------------------
@books_bp.route("/upload-json", methods=["POST"])
@jwt_required()
def upload_books_from_json():
    try:
        json_path = Path(__file__).resolve().parent.parent / "data" / "books.json"

        if not json_path.exists():
            return jsonify({"error": "books.json file not found"}), 404

        with open(json_path, "r", encoding="utf-8") as f:
            books_data = json.load(f)

        if not isinstance(books_data, list):
            return jsonify({"error": "JSON must be an array"}), 400

        added = updated = skipped = 0

        for data in books_data:
            if not data.get("title") or not data.get("author"):
                skipped += 1
                continue

            isbn = data.get("isbn")
            book = Book.query.filter_by(isbn=isbn).first() if isbn else None

            if book:
                changed = False

                def update_field(attr, value):
                    nonlocal changed
                    if value is not None and getattr(book, attr) != value:
                        setattr(book, attr, value)
                        changed = True

                update_field("title", data.get("title"))
                update_field("author", data.get("author"))
                update_field("publisher", data.get("publisher"))
                update_field("publication_year", data.get("publication_year"))
                update_field("genre", data.get("genre"))
                update_field("category", data.get("category"))
                update_field("price_per_day", data.get("price_per_day"))
                update_field("description", data.get("description"))
                update_field("total_copies", data.get("total_copies"))
                update_field("available_copies", data.get("available_copies"))
                update_field("image_url", data.get("image_url"))

                if changed:
                    updated += 1

            else:
                total_copies = int(data.get("total_copies", 1))

                new_book = Book(
                    isbn=isbn,
                    title=data["title"],
                    author=data["author"],
                    publisher=data.get("publisher"),
                    publication_year=data.get("publication_year"),
                    genre=data.get("genre"),
                    category=data.get("category", "Book"),
                    price_per_day=data.get("price_per_day", 0),
                    description=data.get("description"),
                    total_copies=total_copies,
                    available_copies=total_copies,
                    image_url=data.get("image_url")
                )

                db.session.add(new_book)
                added += 1

        db.session.commit()

        return jsonify({
            "message": "Bulk upload successful",
            "added": added,
            "updated": updated,
            "skipped": skipped
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# GET categories with book count
# --------------------------------------------------
@books_bp.route("/categories", methods=["GET"])
def get_categories():
    try:
        results = (
            db.session.query(
                Book.category,
                db.func.count(Book.id)
            )
            .group_by(Book.category)
            .all()
        )

        return jsonify([
            {"title": category.strip().title(), "items": count}
            for category, count in results if category
        ]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# GET featured authors (top 5 by rentals)
# --------------------------------------------------
@books_bp.route("/featured-authors", methods=["GET"])
def get_featured_authors():
    try:
        results = (
            db.session.query(
                Book.author.label("author"),
                func.count(Rental.id).label("rental_count")
            )
            .join(Rental, Rental.book_id == Book.id)
            .group_by(Book.author)
            .order_by(func.count(Rental.id).desc())
            .limit(5)
            .all()
        )

        return jsonify([
            {
                "name": author,
                "book_count": rental_count  # frontend expects this key
            }
            for author, rental_count in results
        ]), 200

    except Exception as e:
        print("FEATURED AUTHORS ERROR:", e)
        return jsonify({"error": "Failed to load featured authors"}), 500


# --------------------------------------------------
# GET featured books (top 5 most rented)
# --------------------------------------------------
@books_bp.route("/featured", methods=["GET"])
def get_featured_books():
    try:
        limit = request.args.get("limit", 5, type=int)

        results = (
            db.session.query(
                Book,
                func.count(Rental.id).label("rental_count")
            )
            .join(Rental, Rental.book_id == Book.id)
            .group_by(Book.id)
            .order_by(func.count(Rental.id).desc())
            .limit(limit)
            .all()
        )

        return jsonify({
            "books": [
                {
                    **book.to_dict(),
                    "rental_count": rental_count
                }
                for book, rental_count in results
            ]
        }), 200

    except Exception as e:
        print("FEATURED BOOKS ERROR:", e)
        return jsonify({"error": "Failed to load featured books"}), 500 


# --------------------------------------------------
# GET recommended books (based on popularity for now)
# GET /api/books/recommended
# --------------------------------------------------
@books_bp.route("/recommended", methods=["GET"])
@jwt_required(optional=True)
def get_recommended_books():
    try:
        user_id = get_jwt_identity()
        recommended_books = []
        limit = request.args.get("limit", 10, type=int)
        
        if user_id:
            user_id = int(user_id)
            # Find categories the user has rented
            rented_categories = (
                db.session.query(Book.category)
                .join(Rental, Rental.book_id == Book.id)
                .filter(Rental.user_id == user_id)
                .distinct().all()
            )
            
            if rented_categories:
                cat_list = [c[0] for c in rented_categories]
                # Find books the user has already rented
                rented_ids = [r[0] for r in db.session.query(Rental.book_id).filter(Rental.user_id == user_id).all()]
                
                # Recommend books from those categories that the user hasn't rented yet
                recommended_results = (
                    db.session.query(Book, func.count(Rental.id).label("rental_count"))
                    .outerjoin(Rental, Rental.book_id == Book.id)
                    .filter(Book.category.in_(cat_list))
                    .filter(Book.id.notin_(rented_ids))
                    .group_by(Book.id)
                    .order_by(func.count(Rental.id).desc())
                    .limit(limit).all()
                )
                recommended_books = [{**b.to_dict(), "rental_count": rc} for b, rc in recommended_results]

        # If not enough recommendations, fill with popular books
        if len(recommended_books) < limit:
            remaining = limit - len(recommended_books)
            exclude_ids = [b["id"] for b in recommended_books]
            if user_id:
                exclude_ids.extend([r[0] for r in db.session.query(Rental.book_id).filter(Rental.user_id == user_id).all()])

            popular_results = (
                db.session.query(Book, func.count(Rental.id).label("rental_count"))
                .outerjoin(Rental, Rental.book_id == Book.id)
                .filter(Book.id.notin_(exclude_ids))
                .group_by(Book.id)
                .order_by(func.count(Rental.id).desc())
                .limit(remaining).all()
            )
            recommended_books.extend([{**b.to_dict(), "rental_count": rc} for b, rc in popular_results])
        
        return jsonify({"books": recommended_books[:limit]}), 200

    except Exception as e:
        print("RECOMMENDED BOOKS ERROR:", e)
        return jsonify({"error": str(e)}), 500