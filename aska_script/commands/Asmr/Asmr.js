const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/Asmr/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
let chosen = '';
// /////////////////////////////////////////////////////////////////////////////
function start(ws, sayWords) {
  let list = fs.readdirSync('./public/asmr');
  let i = 0;
  let trackList;
  list.forEach((v) => {
    if (v.search(sayWords) != -1) {
      chosen = v;
      trackList = fs.readdirSync(`./public/asmr/${v}`);
      trackList = trackList.map(value => `${chosen}/${value}`);
      socket.send(ws, 'volume', 0.2);
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'a1')));
      // fully shuffleArray
      trackList = trackList.map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0]).map(a => a[1]);
      socket.send(ws, 'asmr', { command: 'start', trackList });
      i += 1;
    }
  });
  i == 0 ? socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'a2'))) : '';
}

function askStart(ws) {
  const positive = function positive() {
    start(ws, ws.ClientSay);
  };
  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: [''],
        whatever: true,
        end: true
      }
    ]);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'a0')), packaging);
}
// /////////////////////////////////////////////////////////////////////////////
function next(ws) {
  socket.send(ws, 'asmr', { command: 'next' });
}
function stop(ws) {
  function packaging() {
    socket.send(ws, 'volume', 1);
  }
  socket.send(ws, 'asmr', { command: 'stop' });
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'a3')), packaging);
}
// /////////////////////////////////////////////////////////////////////////////
function Asmr(ws, option, parameters) {
  let sayWords = parameters.join(' ');
  switch (option) {
    case '1':
      askStart(ws);
      break;
    case '2':
      start(ws, sayWords);
      break;
    case '3':
      next(ws);
      break;
    case '4':
      stop(ws);
      break;
    default:
      console.log('error option');
  }
}
module.exports.Asmr = Asmr;
