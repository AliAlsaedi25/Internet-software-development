import React, { useState, useEffect } from 'react';

function FClock(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h2>The current time is {date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function ClickButton(props) {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${clickCount} times`;
  });

  const handleButtonClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click Me!</button>
      <p>Click Count: {clickCount}</p>
    </div>
  );
}

function App() {
  return (
    <div className="App" style={containerStyle}>
      <div style={headerStyle}>
        <h1>Header Stuff</h1>
      </div>
      <div style={mainContentStyle}>
        <div style={leftColumnStyle} className="left-column">
          <h2>Left Column Stuff</h2>
          <ClickButton />
        </div>
        <div style={rightColumnStyle} className="right-column">
          <h2>Right Column Stuff</h2>
          <FClock />
        </div>
      </div>
      <div style={footerStyle}>
        <h1>Footer Stuff</h1>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const headerStyle = {
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
  padding: '20px',
};

const mainContentStyle = {
  display: 'flex',
};

const leftColumnStyle = {
  flex: 1,
  backgroundColor: '#f0f0f0',
  padding: '20px',
};

const rightColumnStyle = {
  flex: 1,
  backgroundColor: '#f0f0f0',
  padding: '20px',
};

const footerStyle = {
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
  padding: '20px',
};

export default App;
