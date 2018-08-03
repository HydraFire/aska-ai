const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { questSimple } = require('./QuestSimple');
const { searchDate, searchTime } = require('../../textToTime');
const { saveResult } = require('./QuestInstrument');
// ///////////////////////////////
// ///////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function note(ws, day, time, options) {
  //
  let newText = '';
  //
  const defaultFunction = function defaultFunction(string) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x5')));
    newText += `${string}, `;
  };

  const first = function attentionCheck() {
    if (newText !== '') {
      saveResult(day, time, newText, options);
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
    } else {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x4')));
    }
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.x6,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, `x${options}`)), packaging);
}

// ////////////////////////////////////////////////////////////////////////////
function questHard(ws, options, parameters) {
  //  const a = parameters.join(' ');
  ws.NNListen = false;
  let skazanoe = '';
  let x = false;
  let xString = false;
  let y = false;
  let yString = false;
  let z = false;

  const int = setInterval(() => {
    if (skazanoe !== ws.ClientSay) {
      skazanoe = ws.ClientSay;
      let question = true;
      //  if (skazanoe !== ws.ClientSay) {
      if (!x) {
        xString = searchDate(ws.ClientSay);
        if (xString) {
          x = true;
        } else {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'x0')));
          question = false;
        }
      }
      if (!y) {
        yString = searchTime(ws.ClientSay);
        if (yString) {
          y = true;
        } else if (question) {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f1')));
          question = false;
        }
      }
      if (!z) {
        console.log(`parameters ${parameters}***`);
        if (parameters != '') {
          z = true;
        } else if (question) {
          note(ws, xString, yString, options);
          clearInterval(int);
        }
      }
      if (x && y && z) {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
        parameters = parameters.join(' ');
        saveResult(xString, yString, parameters, options);
        clearInterval(int);
        ws.NNListen = true;
      }
    }
  //  }
  }, 1000);
}
// /////////////////////////////////////////////////////////////////////////////
function Quest(ws, options, parameters) {
  if (options === '3') {
    questSimple(ws, parameters);
  } else {
    questHard(ws, options, parameters);
  }
}
module.exports.Quest = Quest;
