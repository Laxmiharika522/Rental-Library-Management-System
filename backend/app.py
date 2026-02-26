from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.database import init_db

from routes.auth import auth_bp
from routes.books import books_bp
from routes.rentals import rentals_bp
from routes.users import users_bp
from routes.admin import admin_bp



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Prevent strict slash issues
    app.url_map.strict_slashes = False

    # CORS configuration
    CORS(
        app,
        supports_credentials=True,
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
        allow_headers=["Content-Type", "Authorization"],
    )

    # Initialize extensions
    JWTManager(app)
    init_db(app)

    # ----------------------------
    # Register Blueprints
    # ----------------------------
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(books_bp, url_prefix="/api/books")
    app.register_blueprint(rentals_bp, url_prefix="/api/rentals")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")


    # ----------------------------
    # Root Route
    # ----------------------------
    @app.route("/")
    def index():
        return {"message": "Library Management API is running 🚀"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)