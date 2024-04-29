import React, { useState, useEffect } from 'react';

const CheckIn = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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
}, []);

  const handleSelectChange = (event) => {
    setSelectedBook(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedBook) {
      setMessage('Please select a book to check in.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/books/${selectedBook}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avail: true, who: "", due: "" }) 
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      const result = await response.json();
      setMessage('Book checked in successfully!');
      window.location.reload();
      console.log(result);
    } catch (error) {
      console.error('Error checking in book:', error);
      setMessage('Failed to check in book.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (
    <div className="container">
      <h1>Check In A Book</h1>
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
            <th>Available</th>
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
              <td>{book.avail.toString()}</td>
              <td>{book.who}</td>
              <td>{book.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="form-section">
        <label htmlFor="book-select">Choose a Book:</label>
        <select id="book-select" value={selectedBook} onChange={handleSelectChange}>
          <option value="">Select a book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select><br/>
        <button className="button-checkout" onClick={handleSubmit}>Check In Book</button>
        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );

};

export default CheckIn;
