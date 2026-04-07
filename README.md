# Rental Library Management System

A comprehensive library management web application designed for renting and managing books.

## Features
- **Browse Books**: Discover books by genre, author, or title.
- **User Authentication**: Secure login and registration for members and admins.
- **Rental System**: Manage book rentals, returns, and late fee calculations.
- **Admin Dashboard**: Manage the book catalog, user accounts, and rental history.
- **Dynamic Recommendations**: Personalized book suggestions based on rental history.

## Screenshots

### Home & Exploration
| Home Page | Catalog Page | Browse by Category |
| :---: | :---: | :---: |
| ![Home Page](Home_page.png) | ![Catalog Page](Catalog.png) | ![Browse by Category](Browse_by_category.png) |

### Book Details & Renting
| Book Renting | Payment | Confirm Payment |
| :---: | :---: | :---: |
| ![Book Renting](Book_Renting.png) | ![Payment](Payment.png) | ![Confirm Payment](Confirm_payment.png) |

### User Profile & My Rentals
| My Rentals | Profile Update | Check-in Rentals |
| :---: | :---: | :---: |
| ![My Rentals](My_Rentals.png) | ![Profile Update](Profile_Update.png) | ![Check-in MyRentals](Check_in_MyRentals.png) |

### Admin Dashboard
| Admin Dashboard | Books Management | User Management |
| :---: | :---: | :---: |
| ![Admin Dashboard](Admin_Dashboard.png) | ![Admin Books Management](Admin_BooksManagement.png) | ![Admin User Management](Admin_UserManagement.png) |

### Trending & More
| Trending Books | Featured Authors | About Page |
| :---: | :---: | :---: |
| ![Trending Books](Trending_books.png) | ![Featured Authors](Featured_Authors.png) | ![About Page](About.png) |


## Technology Stack
- **Frontend**: React.js, Vanilla CSS, Lucide-React icons.
- **Backend**: Python (Flask), SQLite/JSON.
- **Database**: Local JSON storage for book data.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Laxmiharika522/Rental-Library-Management-System.git
   cd Rental-Library-Management-System
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

## Usage
- Access the frontend at `http://localhost:3000`.
- The backend API runs at `http://localhost:5000`.

## License
MIT License
