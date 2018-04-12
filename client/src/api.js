import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
const socket = openSocket(`http://localhost:${port}`);

export function subscribeToDrawings(cb) {
  socket.on('drawing', timestamp => cb(timestamp));
  socket.emit('subscribeToDrawings', 1000);
}

export function createDrawing(name) {
  socket.emit('createDrawing', { name })
}

export function publishLine({ drwaingID, line }) {
  socket.emit('publishLine', { drwaingID, ...line })
}

export function subscribeToDrawingLines({ drwaingID, cb }) {
  let handler;
  const lineStream = Rx.Observable.fromEventPattern(
    handler => socket.on(`drawingLine:${drwaingID}`, handler),
    handler => socket.off(`drawingLine:${drwaingID}`, handler)
  );
  const bufferedTimeStream = lineStream
    .bufferTime(100)
    .map(lines => ({ lines }));

  const reconnectStream = Rx.Observable.fromEventPattern(
    handler = socket.on('connect', handler),
    handler = socket.off('connect', handler)
  )

  const maxStream = lineStream
    .map(line => new Date(line.timestamp).getTime())
    .scan((a, b) => Math.max(a, b), 0);

  reconnectStream
    .withLaresrFrom(maxStream)
    .subscribe((joined) => {
      const lastReceivedTimestamp = joined[1];
      socket.emit('subscribeToDrawingLines', {
        drwaingID,
        froms: lastReceivedTimestamp,
      })
    })

  bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
  socket.emit('subscribeToDrawingLines', { drwaingID });
}

export function subscribeToConnectionEvent(cb) {
  socket.on('connect', () => cb({
    state: 'connected',
    port,
  }));
  socket.on('disconnect', () => cb({
    state: 'disconnected',
    port,
  }));
  socket.on('connect_error', () => cb({
    state: 'disconnected',
    port,
  }));
}