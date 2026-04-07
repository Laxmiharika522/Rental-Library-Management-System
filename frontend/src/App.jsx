import React, { lazy, Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Always-loaded layout (tiny, needed on every page)
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// ─── Lazy-loaded Pages (loaded only when navigated to) ───────────────────────
const Home          = lazy(() => import("./pages/Home"));
const About         = lazy(() => import("./pages/About"));
const Login         = lazy(() => import("./pages/Login"));
const Register      = lazy(() => import("./pages/Register"));
const Catalog       = lazy(() => import("./pages/Catalog"));
const PaymentPage   = lazy(() => import("./pages/PaymentPage"));
const MyRentalsPage = lazy(() => import("./pages/MyRentalsPage"));
const AuthorBooks   = lazy(() => import("./pages/AuthorBooks"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const ConfirmRental = lazy(() => import("./pages/ConfirmRental"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const History = lazy(() => import("./pages/History"));

// Books
const Categories  = lazy(() => import("./components/books/Categories"));
const CategoryBooks = lazy(() => import("./components/books/CategoryBooks"));
const BookDetails = lazy(() => import("./components/books/BookDetails"));

// Admin
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const UsersPage      = lazy(() => import("./admin/pages/UsersPage"));
const AdminBooks     = lazy(() => import("./admin/pages/AdminBooks"));
const ActiveRentals  = lazy(() => import("./admin/pages/ActiveRentals"));

// ─── Page loading fallback ───────────────────────────────────────────────────
const PageLoader = () => (
  <div className="page-loader">
    <div className="page-loader-inner">
      <div className="loader-ring" />
      <span>Loading...</span>
    </div>
  </div>
);

// ─── Protected Admin Route ───────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
};

// ─── App ─────────────────────────────────────────────────────────────────────
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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* PUBLIC */}
            <Route path="/"        element={<Home />} />
            <Route path="/home"    element={<Home />} />
            <Route path="/about"   element={<About />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* USER */}
            <Route path="/catalog"          element={<Catalog />} />
            <Route path="/payment"          element={<PaymentPage />} />
            <Route path="/my-rentals"       element={<MyRentalsPage />} />
            <Route path="/profile"          element={<UserProfilePage />} />
            <Route path="/wishlist"         element={<Wishlist />} />
            <Route path="/history"          element={<History />} />
            <Route path="/authors/:authorName" element={<AuthorBooks />} />

            {/* BOOKS */}
            <Route path="/categories"   element={<Categories />} />
            <Route path="/books"        element={<CategoryBooks />} />
            <Route path="/books/:id"    element={<BookDetails />} />
            <Route path="/rent/:bookId" element={<ConfirmRental />} />

            {/* ADMIN (PROTECTED) */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users"     element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="/admin/books"     element={<AdminRoute><AdminBooks /></AdminRoute>} />
            <Route path="/admin/rentals/active" element={<AdminRoute><ActiveRentals /></AdminRoute>} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
