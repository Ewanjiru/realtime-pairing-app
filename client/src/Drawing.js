import React, { Component } from 'react';
import Canvas from 'simple-react-canvas';
import { publishLine, subscribeToDrawingLines } from './api.js';

class Drawing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
    };
    this.handleDraw = this.handleDraw.bind(this);
  }

  componentDidMount() {
    subscribeToDrawingLines(this.props.drawing.id, (linesEvent) => {
      this.setState(prevState => {
        return {
          lines: [...prevState.lines, ...linesEvent.lines]
        };
      });
    });
  }

  handleDraw(line) {
    publishLine({
      drwaingID: this.props.drawing.id,
      line,
    })
  }

  render() {
    return (this.props.drawing) ? (
      <div
        className="Drawing"
      >
        <div className="Drawing-title">
          {this.props.drawing.name}
          ({this.state.lines.length})
        </div>
        <Canvas drawingEnabled={true}
          onDraw={this.handleDraw}
          lines={this.state.lines}
        />
      </div>
    )
      : null;
  }
}

export default Drawing;