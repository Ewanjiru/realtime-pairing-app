import React, { Component } from 'react';
import { subscribeToConnectionEvent } from './api.js'

class Connection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionStatte: 'connecting'
    }

    subscribeToConnectionEvent(({
      state: connectionStatte,
      port,
    }) => {
      this.setState({
        connectionStatte,
        port,
      })
    })
  }

  render() {
    let content = null;
    if (this.state.connectionStatte === 'disconnected') {
      content = (
        <div className="connection-error">
          We've lost connection to our server...
        </div>
      )
    }
    if (this.state.connectionStatte === 'connecting') {
      content = (
        <div>
          Connecting...
        </div>
      )
    }
    return (
      <div className="Connection">
        <div className="Connection-port">
          Socket Port:{this.state.port}
        </div>
        {content}
      </div>
    )
  }
}

export default Connection;
