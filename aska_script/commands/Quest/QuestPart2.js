const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { saveTimeEnd, saveExcuse, saveTimeStart } = require('./QuestInstrument');
const { searchDate, searchTime } = require('../../textToTime');
const mainTimeCircle = require('../../mainTimeCircle');
// ///////////////////////////////////////
// //////////////////////////////////////
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
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'f3')));
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

const askPart4 = function askPart4(ws, obj) {
  //
  let newText = '';
  //
  const defaultFunction = function defaultFunction(string) {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'u3')));
    newText += `${string}, `;
  };

  const first = function first() {
    if (newText !== '') {
      saveExcuse(obj, newText);
      asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'u1')), askPart5, obj);
    } else {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'u2')));
    }
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.u4,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'u0')), packaging);
};

// /////////////////////////////////////////////////////////////////////////////
/*
const askPart3 = function askPart3(ws, obj) {
  // Закрываем все ожидания чтобы создать новое
  // ws.closeAllInterval = true;
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'j1'));
  };

  const first = function attentionCheck() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'j2'));
    saveTimeEnd(obj, ws.ClientSay);
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.j3,
        include: true,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, asyncAsk.whatToSay(AskaSC, 'j0'), packaging);
};
*/
// /////////////////////////////////////////////////////////////////////////////

const askPart2 = function askPart2(ws, obj) {
  // Закрываем все ожидания чтобы создать новое
  // ws.closeAllInterval = true;
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p1')));
  };

  const attentionCheck = function attentionCheck() {
    saveTimeEnd(obj, ws.ClientSay);
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'p2')), mainTimeCircle.shortInterval);
    //asyncAsk.onlyWait(ws, mainTimeCircle.shortInterval);
  };
  const negative = function negative() {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'p3')), askPart4, obj);
    //asyncAsk.onlyWait(ws, askPart4, obj);
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: attentionCheck,
        words: AskaSC.p4,
        end: true
      }, {
        func: negative,
        words: AskaSC.p5,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'p0')), packaging);
};

// /////////////////////////////////////////////////////////////////////////////

const QuestPart2 = function QuestPart2(ws, obj) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'y0')));
  if (obj.excuse) {
    asyncAsk.readEndWait(ws, obj.quest);
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'y1')));
    asyncAsk.readEndWait(ws, obj.excuse, askPart2, obj);
  } else {
    asyncAsk.readEndWait(ws, obj.quest, askPart2, obj);
  }
};
module.exports.QuestPart2 = QuestPart2;
