# backend/scripts/create_db.py
import pymysql
import sys
import os

# Add backend to path (if needed)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def create_database():
    try:
        # Connect to MySQL (without a specific database)
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='Laxmiharika12124@',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        try:
            with connection.cursor() as cursor:
                # Create the database if it doesn't exist
                cursor.execute("CREATE DATABASE IF NOT EXISTS library_management")
            connection.commit()
            print("✅ Database 'library_management' created or already exists.")
        finally:
            connection.close()
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    create_database()
