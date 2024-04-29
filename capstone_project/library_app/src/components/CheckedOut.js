import React, { useState, useEffect } from 'react';

const CheckedOut = ({ avail }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchBooks = async () => {
        try {
          const response = await fetch('http://localhost:3001/books/?avail=false');
          const data = await response.json();
          console.log(data);
          setBooks(data);
        } catch (error) {
          console.error('Error fetching devices:', error);
        }
      };

    fetchBooks();
  }, [avail]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
    <h1>Checked Out Books</h1>
    <button className="button-home" onClick={() => window.location.href = '/'}>
        Home
      </button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Who</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.who}</td>
              <td>{book.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckedOut;
