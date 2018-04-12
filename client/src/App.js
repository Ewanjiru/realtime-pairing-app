import React, { Component } from 'react';
import './App.css';
import { subscribeToTimer } from './api.js';
import DrawingForm from './DrawingForm.js';
import DrawingList from './DrawingList.js';
import Drawing from './Drawing.js';
import Connection from './Connection.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.selectDrawing = this.selectDrawing.bind(this);
  }

  selectDrawing(drawing) {
    this.setState({
      selectedDrawing: drawing
    });
  }

  render() {
    let ctrl = (
      <div>
        <DrawingForm />
        <DrawingList
          selectDrawing={this.selectDrawing} />
      </div>
    )
    if (this.state.selectedDrawing) {
      ctrl = (
        <Drawing
          drawing={this.state.selectedDrawing}
          key={this.state.selectedDrawing.id}
        />
      )
    }
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Our awesome drawing app</h2>
        </div>
        <Connection />
        {ctrl}
      </div>
    )
  }
}

export default App;