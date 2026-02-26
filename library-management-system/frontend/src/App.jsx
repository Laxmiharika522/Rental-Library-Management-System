import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout & Common
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalog from "./pages/Catalog";
import PaymentPage from "./pages/PaymentPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import AuthorBooks from "./pages/AuthorBooks";
import UserProfilePage from "./pages/UserProfilePage";

// Books Components
import Categories from "./components/books/Categories";
import CategoryBooks from "./components/books/CategoryBooks";
import BookDetails from "./components/books/BookDetails";
import ConfirmRental from "./pages/ConfirmRental";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import UsersPage from "./admin/pages/UsersPage";
import AdminBooks from "./admin/pages/AdminBooks";
import ActiveRentals from "./admin/pages/ActiveRentals";

import "./App.css";

/**
 * --- PROTECTED ADMIN ROUTE ---
 */
const AdminRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- USER ROUTES --- */}
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-rentals" element={<MyRentalsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/authors/:authorName" element={<AuthorBooks />} />

          {/* --- BOOK ROUTES --- */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/books" element={<CategoryBooks />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/rent/:bookId" element={<ConfirmRental />} />

          {/* --- ADMIN ROUTES (PROTECTED) --- */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <AdminBooks />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rentals/active"
            element={
              <AdminRoute>
                <ActiveRentals />
              </AdminRoute>
            }
          />

          {/* --- FALLBACK ROUTE --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
