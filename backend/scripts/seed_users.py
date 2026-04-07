# backend/scripts/seed_users.py
import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.database import db
from models.user import User

def seed_users():
    app = create_app()
    with app.app_context():
        print("🌱 Seeding users...")
        
        # 1. System Admin
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin', 
                email='admin@library.com', 
                full_name='System Admin', 
                role='admin',
                phone='1234567890',
                address='123 Library Lane, Booktown'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            print("  Created admin user.")
        
        # 2. Test Librarian
        if not User.query.filter_by(username='librarian').first():
            lib = User(
                username='librarian', 
                email='librarian@library.com', 
                full_name='Librarian One', 
                role='librarian',
                phone='0987654321',
                address='456 Reader Road, Booktown'
            )
            lib.set_password('librarian123')
            db.session.add(lib)
            print("  Created librarian user.")

        # 3. Regular Test User
        if not User.query.filter_by(username='user1').first():
            user = User(
                username='user1', 
                email='user1@example.com', 
                full_name='John Doe', 
                role='user',
                phone='5551234567',
                address='789 Regular St, Booktown'
            )
            user.set_password('password123')
            db.session.add(user)
            print("  Created test user 'user1'.")
            
        try:
            db.session.commit()
            print("✅ Users seeded successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding users: {e}")

if __name__ == "__main__":
    seed_users()
