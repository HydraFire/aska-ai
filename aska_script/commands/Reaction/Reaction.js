const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// ////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Reaction/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));


function next(ws, options) {
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, `a${options}`)));
}

function Reaction(ws, options) {
  if (options == '1') {
    socket.send(ws, 'aska', `${ws.ClientSay}`);
  } else {
    next(ws, options);
  }
}
module.exports.Reaction = Reaction;
