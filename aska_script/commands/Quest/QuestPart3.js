const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { saveExcuse, saveTimeStart, copyToVictoryFile } = require('./QuestInstrument');
const { searchDate, searchTime } = require('../../textToTime');
// ///////////////////////////////////////////
// //////////////////////////////////////////
const fileOption = './data/commands/Quest/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
const askPart5 = function askPart5(ws, obj) {
  const packaging = function packaging() {
    ws.NNListen = false;
    let skazanoe = ws.ClientSay;
    let x = false;
    let xString = false;
    let y = false;
    let yString = false;

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
        if (x && y) {
          let text = checkURL(asyncAsk.whatToSay(AskaSC, 'f3'));
          asyncAsk.readEndWait(ws, text, () => {
            mainTimeCircle.shortInterval(ws);
          });
          clearInterval(int);
          saveTimeStart(obj, xString, yString);
          ws.NNListen = true;
          mainTimeCircle.shortInterval(ws);
        }
      }
    //  }
    }, 1000);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'h0')), packaging);
};

// /////////////////////////////////////////////////////////////////////////////

const askPart2 = function askPart2(ws, obj) {
  //
  let newText = '';
  //
  const defaultFunction = function defaultFunction(string) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'r1')));
    newText += `${string}, `;
  };

  const first = function attentionCheck() {
    if (newText !== '') {
      saveExcuse(obj, newText);
      asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'r2')), askPart5, obj);
      //asyncAsk.onlyWait(ws, askPart5, obj);
    } else {
      asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'r3')), askPart5, obj);
      //asyncAsk.onlyWait(ws, askPart5, obj);
    }
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.r4,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'r0')), packaging);
};

// /////////////////////////////////////////////////////////////////////////////

const QuestPart3 = function QuestPart3(ws, obj) {
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'z1')} ${obj.quest}?`);
  };

  const attentionCheck = function attentionCheck() {
    copyToVictoryFile(obj);
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'z2')), mainTimeCircle.shortInterval);
  };
  const negative = function negative() {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'z3')), askPart2, obj);
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: attentionCheck,
        words: AskaSC.z4,
        end: true
      }, {
        func: negative,
        words: AskaSC.z5,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'z0')));
  asyncAsk.readEndWait(ws, obj.quest, packaging);
};
module.exports.QuestPart3 = QuestPart3;
