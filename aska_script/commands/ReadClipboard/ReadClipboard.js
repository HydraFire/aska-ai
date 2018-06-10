const socket = require('../../webSocketOnMessage');

function ReadClipboard(ws, options) {
  console.log(`options ${options}`);
  if (options === '1') {
    socket.send(ws, 'clientFunction', 'read');
  } else {
    socket.send(ws, 'clientFunction', 'translate');
  }
}
module.exports.ReadClipboard = ReadClipboard;
