// frontend/src/components/books/BookList.js
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';
import BookCard from './BookCard';

const BookList = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['books', page, search],
    async () => {
      const response = await api.get('/books', {
        params: { page, search, per_page: 12 }
      });
      return response.data;
    },
    { keepPreviousData: true }
  );

  if (isLoading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error loading books</div>;

  return (
    <div className="book-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* here imported book card and mapped through the data to show the book details in the book card */}
      <div className="books-grid">
        {data?.books?.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
          className="btn-secondary"
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {data?.pages}
        </span>
        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page === data?.pages}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
