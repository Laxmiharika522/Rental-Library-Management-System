import React, { useEffect, useState } from "react";
import { getUserRentalHistory, returnBook } from "../services/rentalService";
import "../styles/History.css";

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await getUserRentalHistory();
            setHistory(data || []);
        } catch (err) {
            console.error("Failed to load rental history", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (rentalId) => {
        try {
            await returnBook(rentalId);
            loadHistory(); // Refresh
        } catch (err) {
            alert("Failed to return book. Please try again.");
        }
    };

    // 📊 Calculate Stats
    const stats = {
        total: history.length,
        active: history.filter(r => r.status === 'active').length,
        returned: history.filter(r => r.status === 'returned').length,
        overdue: history.filter(r => r.is_overdue).length,
        totalFines: history.reduce((sum, r) => sum + (r.fine_amount || 0), 0)
    };

    // 🔍 Filter & Search Logic
    const filteredHistory = history.filter(rental => {
        const matchesSearch = 
            rental.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rental.book?.author.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            statusFilter === "all" || 
            (statusFilter === "active" && rental.status === "active") ||
            (statusFilter === "returned" && rental.status === "returned") ||
            (statusFilter === "overdue" && rental.is_overdue);

        return matchesSearch && matchesStatus;
    });

    const getStatusDisplay = (rental) => {
        if (rental.status === 'returned') {
            return { label: "✅ Returned", class: "returned", canReturn: false };
        }
        if (rental.is_overdue) {
            return { label: "⚠️ Overdue", class: "overdue", canReturn: true };
        }
        return { label: "⏳ Active", class: "borrowed", canReturn: true };
    };

    if (loading) return (
        <div className="page-loader">
            <div className="loader-ring" />
            <span>Fetching your records...</span>
        </div>
    );

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>📖 My Transaction Record</h1>
                <p>Track your reading journey and manage your active library rentals.</p>
            </div>

            {/* 📈 Stats Bar */}
            <div className="stats-bar">
                <div className="stat-card">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total Logs</span>
                </div>
                <div className="stat-card accent-orange">
                    <span className="stat-value">{stats.active}</span>
                    <span className="stat-label">Currently Reading</span>
                </div>
                <div className="stat-card accent-green">
                    <span className="stat-value">{stats.returned}</span>
                    <span className="stat-label">Books Returned</span>
                </div>
                <div className="stat-card accent-red">
                    <span className="stat-value">₹{stats.totalFines}</span>
                    <span className="stat-label">Fine Balance</span>
                </div>
            </div>

            {/* 🔍 Filter Controls */}
            <div className="filter-controls">
                <div className="search-wrapper">
                    <div className="search-icon-box">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <input 
                        className="search-input-pill"
                        type="text" 
                        placeholder="Search for books, authors, or genres..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    {["all", "active", "returned", "overdue"].map(status => (
                        <button 
                            key={status}
                            className={`filter-btn ${statusFilter === status ? "active" : ""}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="empty-history">
                    <p>{searchTerm ? "No matches found for your search." : "No transaction history found."}</p>
                </div>
            ) : (
                <div className="history-grid">
                    {filteredHistory.map((rental) => {
                        const display = getStatusDisplay(rental);
                        const dueDate = new Date(rental.due_date);
                        const isLate = rental.is_overdue || (rental.status === 'returned' && new Date(rental.return_date) > dueDate);
                        
                        return (
                            <div key={rental.id} className="history-card">
                                <img 
                                    className="history-cover" 
                                    src={rental.book?.image_url || "/book-placeholder.png"} 
                                    alt={rental.book?.title} 
                                />

                                <div className="history-book-info">
                                    <h3>{rental.book?.title}</h3>
                                    <p>by {rental.book?.author}</p>
                                    <div className="status-container">
                                        <span className={`status-tag ${display.class}`}>
                                            {display.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="rental-dates">
                                    <div className="date-row">
                                        <span className="date-label">Borrowed:</span>
                                        <span>{new Date(rental.rental_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    <div className="date-row">
                                        <span className="date-label">Due Date:</span>
                                        <span className={rental.is_overdue ? "text-red" : ""}>
                                            {new Date(rental.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    {rental.return_date && (
                                        <div className="date-row highlight-green">
                                            <span className="date-label">Returned:</span>
                                            <span>{new Date(rental.return_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    )}

                                    {rental.fine_amount > 0 && (
                                        <div className={`fine-info ${rental.status === 'returned' ? 'paid' : 'pending'}`}>
                                            <span>{rental.status === 'returned' ? 'Penalty Paid' : 'Current Fine'}</span>
                                            <span>₹{rental.fine_amount}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="action-area">
                                    {display.canReturn ? (
                                        <button 
                                            className={`btn-history-action ${rental.is_overdue ? 'btn-return-late' : 'btn-return'}`}
                                            onClick={() => handleReturn(rental.id)}
                                        >
                                            Return Now
                                        </button>
                                    ) : (
                                        <div className="return-success-badge">
                                            <span>Library Confirmed</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
