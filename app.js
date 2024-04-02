// App.js

import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0
    };
  }

  handleButtonClick = () => {
    this.setState(prevState => ({
      clickCount: prevState.clickCount + 1
    }));
  };

  render() {
    return (
      <div className="App">
        <header>
          <h1>Header Stuff</h1>
        </header>
        <div className="main-content">
          <div className="left-column">
            <h2>Left Column Stuff</h2>
          </div>
          <div className="right-column">
            <h2>Right Column Stuff</h2>
            <button onClick={this.handleButtonClick}>Click Me!</button>
            <p>Click Count: {this.state.clickCount}</p>
          </div>
        </div>
        <footer>
          <h1>Footer Stuff</h1>
        </footer>
      </div>
    );
  }
}

export default App;