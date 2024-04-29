import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './home.css';


function Home() {
  return (
    <div className="centered-container">
    <h1>Library Tracker App</h1>
    <Link to="/available" className="link-button">Available</Link>
    <Link to="/checkedout" className="link-button">Not Available</Link>
    <Link to="/checkout" className="link-button">Check-out</Link>
    <Link to="/checkin" className="link-button">Check-in</Link>
    </div>
  );
}

export default Home;
