const fs = require('fs');
const socket = require('../../webSocketOnMessage');
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
  // Закрываем все ожидания чтобы создать новое
  // ws.closeAllInterval = true;


  /*
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'h1'));
  };

  const first = function attentionCheck() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'h2'));
    saveTimeStart(obj, ws.ClientSay);
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.h3,
        end: true
      }
    ], defaultFunction);
  };
  */
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
        }
      }
    //  }
    }, 1000);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'h0')), packaging);
};

// /////////////////////////////////////////////////////////////////////////////
/*
const askPart4 = function askPart4(ws, obj) {
  //
  let newText = '';
  //
  const defaultFunction = function defaultFunction(string) {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'e1'));
    newText += `${string}, `;
  };

  const first = function attentionCheck() {
    if (newText !== '') {
      saveVictory(obj, newText);
      socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'e2'));
    } else {
      socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'e3'));
    }
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: first,
        words: AskaSC.e4,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, asyncAsk.whatToSay(AskaSC, 'e0'), packaging);
};
*/
// /////////////////////////////////////////////////////////////////////////////
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
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'r2')));
      asyncAsk.onlyWait(ws, askPart5, obj);
    } else {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'r3')));
      asyncAsk.onlyWait(ws, askPart5, obj);
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
  // Закрываем все ожидания чтобы создать новое
  // ws.closeAllInterval = true;
  const defaultFunction = function defaultFunction() {
    socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'z1')} ${obj.quest}?`);
  };

  const attentionCheck = function attentionCheck() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'z2')));
    copyToVictoryFile(obj);
    // asyncAsk.onlyWait(ws, askPart4, obj);
  };
  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'z3')));
    asyncAsk.onlyWait(ws, askPart2, obj);
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
  asyncAsk.readEndWait(ws, `${asyncAsk.whatToSay(AskaSC, 'z0')} ${obj.quest}?`, packaging);
};
module.exports.QuestPart3 = QuestPart3;
