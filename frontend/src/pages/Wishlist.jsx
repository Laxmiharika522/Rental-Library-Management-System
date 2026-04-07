// frontend/src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";
import BookCard from "../components/books/BookCard";
import "../styles/Catalog.css"; 

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const res = await getWishlist();
            setWishlist(res.data || []);
        } catch (err) {
            console.error("Failed to load wishlist", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {
        try {
            await removeFromWishlist(bookId);
            setWishlist(wishlist.filter(item => item.book_id !== bookId));
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
        }
    };

    if (loading) return (
        <div className="page-loader">
            <div className="loader-ring" />
            <span>Fetching your wishlist...</span>
        </div>
    );

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>♥ My Wishlist</h1>
                <p>Keep track of the stories that move you.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                    <div className="empty-icon">🤍</div>
                    <p>Your wishlist is currently empty.</p>
                    <button className="btn-explore" onClick={() => navigate('/catalog')}>Explore Stories</button>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-card-wrapper">
                            {/* Pass hideRent to remove the internal Rent button */}
                            <BookCard book={item.book} hideRent={true} />
                            
                            <div className="wishlist-card-actions">
                                <button 
                                    className="btn-wishlist-view"
                                    onClick={() => navigate(`/books/${item.book_id}`)}
                                >
                                    📖 View Details
                                </button>
                                <button 
                                    className="btn-wishlist-remove"
                                    onClick={() => handleRemove(item.book_id)}
                                >
                                    🗑️ Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;

// --- Premium CSS for Wishlist ---
const style = document.createElement('style');
style.textContent = `
    .wishlist-container {
        padding: 3rem 5%;
        min-height: calc(100vh - 80px);
        background: var(--cream);
        display: flex;
        flex-direction: column;
        align-items: center; /* CENTER ALIGN */
        text-align: center;
    }

    .wishlist-header {
        margin-bottom: 3.5rem;
        max-width: 700px;
    }

    .wishlist-header h1 {
        font-family: var(--font-display);
        font-size: 2.8rem;
        color: var(--purple);
        margin-bottom: 0.5rem;
    }

    .wishlist-header p {
        color: var(--text-soft);
        font-size: 1.1rem;
        font-weight: 500;
    }

    .wishlist-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 3rem;
        width: 100%;
        max-width: 1200px;
        justify-content: center; /* CENTER ALIGN GRID */
    }

    .wishlist-card-wrapper {
        background: white;
        border-radius: var(--r-xl);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        border: 1px solid rgba(106, 30, 85, 0.05);
    }

    .wishlist-card-wrapper:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl);
        border-color: var(--gold);
    }

    .wishlist-card-actions {
        padding: 1.2rem;
        background: #FDFBFE;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        border-top: 1px solid #F0EEF5;
    }

    .wishlist-card-actions button {
        width: 100%;
        padding: 12px;
        border-radius: var(--r-md);
        font-weight: 700;
        font-size: 0.85rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-wishlist-view {
        background: rgba(106, 30, 85, 0.08);
        color: var(--purple);
    }
    .btn-wishlist-view:hover {
        background: var(--purple);
        color: white;
    }

    .btn-wishlist-remove {
        background: transparent;
        color: var(--text-soft);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.75rem;
    }
    .btn-wishlist-remove:hover {
        color: var(--crimson);
        text-decoration: underline;
    }

    .empty-wishlist {
        padding: 5rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .empty-icon {
        font-size: 4rem;
        color: #F8D7DA;
        animation: pulse 2s infinite;
    }

    .btn-explore {
        background: var(--purple);
        color: white;
        padding: 1rem 2.5rem;
        border-radius: var(--r-full);
        border: none;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-explore:hover {
        transform: scale(1.05);
        background: var(--gold);
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
