import React, { Component } from 'react';
import { subscribeToDrawings } from './api.js';

class DrawingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawings: []
    };

    subscribeToDrawings((drawing) => {
      this.setState(prevState => ({
        drawings: prevState.drawings.concat([drawing])
      }))
    })
  }

  render() {
    const drawings = this.state.drawings.map(drawing => (
      <li
        className="DrawingList-item"
        key={drawing.id}
        onClick={event => this.props.selectDrawing(drawing)}
      >
        {drawing.name}
      </li>
    ))
    return (
      <ul
        className="DrawingList"
      >
        {drawings}
      </ul>
    )
  }
}

export default DrawingList;