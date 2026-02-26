#backend\routes\__init__.py
from .auth import auth_bp
from .books import books_bp
from .rentals import rentals_bp
from .users import users_bp
from .admin import admin_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(books_bp, url_prefix="/books")
    app.register_blueprint(rentals_bp, url_prefix="/rentals")
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(admin_bp, url_prefix="/admin")  
