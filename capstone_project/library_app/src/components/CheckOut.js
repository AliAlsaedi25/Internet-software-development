import React, { useState, useEffect } from 'react';

const CheckOut = ({ avail }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/books/?avail=true');
        const data = await response.json();
        console.log(data);
        setBooks(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchBooks();
  }, [avail]);

  const handleSelectChange = (event) => {
    setSelectedBook(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedBook) {
      setMessage('Please select a book to check out.');
      return;
    }

    if (!name.trim()) {
      setMessage('Please enter your name.');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 180); // adds 90 days for due date
    const formattedDate = (dueDate.getMonth() + 1) + '/' + dueDate.getDate() + '/' + dueDate.getFullYear().toString().substr(-2);
  
    console.log(JSON.stringify({ avail: false, who: name, due: dueDate.toISOString() }));

    try {
      const response = await fetch(`http://localhost:3001/books/${selectedBook}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avail: false, who: name, due: formattedDate })
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      const result = await response.json();
      setMessage('Book checked out successfully!');
      window.location.reload();
      console.log(result);
    } catch (error) {
      console.error('Error checking out book:', error);
      setMessage('Failed to check out book.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Check Out A Book</h1>
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
        <label htmlFor="name">Your Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange}></input><br/>
        <button className="button-checkout" onClick={handleSubmit}>Check Out Book</button>
        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  );
};  

export default CheckOut;