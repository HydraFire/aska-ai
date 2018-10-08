const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL, checkSmartURL } = require('../../saveAska');
const { iMissYou } = require('./goodMorning');

const fileSyspath = './data/system.json';
const filepath = './data/eveningTalk.json';
const fileOption = './data/commands/System/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));

let newTextArr = [];

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    console.log('// Create new eveningTalk file');
    return [];
  }
}

function saveResult(value) {
  const arr = readFile();
  arr.push({
    time: Date.now(),
    text: newTextArr
  });
  fs.writeFileSync(filepath, JSON.stringify(arr), 'utf8');

  let x = value.obj;
  x.timeLastRun = Date.now();
  x.timeEveningTalk = Date.now();
  fs.writeFileSync(fileSyspath, JSON.stringify(x), 'utf8');
}
// ////////////////////////////////////////////////////////////////////////////
const askPart3 = function askPart3(ws, obj) {

  const defaultFunction = function defaultFunction(string) {
    console.log(string);
  };

  const positive = function positive() {
    newTextArr.push(ws.ClientSay);
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p5')));
    saveResult(obj);
  };

  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p3')));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: ["whatever"],
        whatever: true,
        end: true
      },
      {
        func: negative,
        words: AskaSC.p2,
        end: true
      }
    ], defaultFunction);
  };
  if (obj.timeLeft) {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'z1')), packaging);
  } else {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'z0')), packaging);
  }
};
// ////////////////////////////////////////////////////////////////////////////
const askPart2 = function askPart2(ws, obj) {

  const defaultFunction = function defaultFunction(string) {
    console.log(string);
  };

  const positive = function positive() {
    newTextArr.push(ws.ClientSay);
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p4')));
    asyncAsk.onlyWait(ws, askPart3, obj);
  };

  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p3')));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: ["whatever"],
        whatever: true,
        end: true
      },
      {
        func: negative,
        words: AskaSC.p2,
        end: true
      }
    ], defaultFunction);
  };
  if (obj.timeLeft) {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'k1')), packaging);
  } else {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'k0')), packaging);
  }
};
// ////////////////////////////////////////////////////////////////////////////
const askPart1 = function askPart1(ws, obj) {

  const defaultFunction = function defaultFunction(string) {
    console.log(string);
  };

  const positive = function positive() {
    newTextArr.push(ws.ClientSay);
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p4')));
    asyncAsk.onlyWait(ws, askPart2, obj);
  };

  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p3')));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: ["whatever"],
        whatever: true,
        end: true
      },
      {
        func: negative,
        words: AskaSC.p2,
        end: true
      }
    ], defaultFunction);
  };
  if (obj.timeLeft) {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'h1')), packaging);
  } else {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'h0')), packaging);
  }
};
// /////////////////////////////////////////////////////////////////////////
const askPart0 = function askPart0(ws, obj, text) {

  const defaultFunction = function defaultFunction(string) {
    console.log(string);
  };

  const positive = function positive() {
    newTextArr.push(ws.ClientSay);
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p4')));
    asyncAsk.onlyWait(ws, askPart1, obj);
  };

  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p3')));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: ["whatever"],
        whatever: true,
        end: true
      },
      {
        func: negative,
        words: AskaSC.p2,
        end: true
      }
    ], defaultFunction);
  };
  if (obj.timeLeft) {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'p1')), packaging);
  } else {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'p0')), packaging);
  }
};

function addMissYou(ws, value, text) {
  asyncAsk.readEndWait(ws, text, askPart0, value);
}

function eveningTalk(ws, value) {
  newTextArr = [];
  if (value.timeLeft) {
    addMissYou(ws, value, iMissYou(value));
  } else {
    askPart0(ws, value);
  }
}
module.exports.eveningTalk = eveningTalk;
