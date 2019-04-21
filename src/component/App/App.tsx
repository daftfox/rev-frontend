import * as React from 'react';
import './App.scss';
import Header from "../Header/Header";
import Boards from "../Boards/Boards";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header/>
        <Boards/>
      </div>
    );
  }
}

export default App;
