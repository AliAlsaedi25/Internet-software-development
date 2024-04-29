import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home.js';
import Available from './components/Available.js';
import CheckedOut from './components/CheckedOut.js';
import CheckOut from './components/CheckOut.js';
import CheckIn from './components/CheckIn.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/available" element={<Available/>}/>
        <Route path="/checkedout" element={<CheckedOut/>}/>
        <Route path="/checkout" element={<CheckOut/>}/>
        <Route path="/checkin" element={<CheckIn/>}/>
      </Routes>
    </Router>
  );
}

export default App;
