const socket = require('../../webSocketOnMessage');

function Reaction(ws) {
  socket.send(ws, 'aska', `${ws.ClientSay}`);
}
module.exports.Reaction = Reaction;
