const fs = require('fs');
const main = require('../../NN/fuckOffNN');
const socket = require('../../webSocketOnMessage');
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const askForCircle = require('./askForCircle');
const textAnalitic = require('./textAnalitic');
const { calcLast } = require('./calcTime');
// //////////////////////////////////////
const fileOption = './data/commands/LifeCircles/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// //////////////////////////////////////
const filepath = './data/LifeCirclesData.json';
const example = [{
  words: ['test'],
  timeOut: 15,
  startIncident: 210,
  incident: [1515135169000, 1525135169000],
  remind: 1515135169000
}];
// /////////////////////////////////////////////////////////////////////////////
function readFile(p) {
  try {
    return JSON.parse(fs.readFileSync(p));
  } catch (err) {
    console.log(err);
    return example;
  }
}
// /////////////////////////////////////////////////////////////////////////////
function saveFile(p, arr) {
  fs.writeFileSync(p, JSON.stringify(arr), 'utf8');
  mainTimeCircle.reloadFileLifeCircle();
}
// /////////////////////////////////////////////////////////////////////////////
function saveIncidentFirstTime(arr, value, startCount) {
  arr.push({
    words: [value],
    timeOut: 0,
    startIncident: startCount,
    incident: [Date.parse(new Date())],
    remind: 9999999999999
  });
  saveFile(filepath, arr);
}
module.exports.saveIncidentFirstTime = saveIncidentFirstTime;
// /////////////////////////////////////////////////////////////////////////////
function remindCalc(ws, arr, i) {
  if (arr[i].DayOfMonth) {
    let r = new Date();
    let month = r.getMonth();
    r.getDate() >= arr[i].DayOfMonth ? month += 1 : '';
    arr[i].remind = Date.parse(new Date(r.getFullYear(), month, arr[i].DayOfMonth, 20, 0, 0, 0));
    return arr;
  }
  if (arr[i].timeInterval && arr[i].timeInterval[0]) {
    let zzz = arr[i].incident[arr[i].incident.length - 1];
    zzz += arr[i].timeInterval[0] * 3600000;
    const m = arr[i].timeInterval.shift();
    arr[i].timeInterval.splice(arr[i].timeInterval.length, 1, m);
    socket.send(ws, 'console', `arr[i].timeInterval = ${arr[i].timeInterval}`);
    arr[i].remind = zzz;
    return arr;
  }
  let zzz = calcLast(arr, i);
  zzz += arr[i].incident[arr[i].incident.length - 1];
  arr[i].remind = zzz;
  socket.send(ws, 'console', `arr[i].remind = ${arr[i].remind}`);
  return arr;
}

// /////////////////////////////////////////////////////////////////////////////
function itsHappened(ws, arrOld, iOld) {
  let arr = readFile(filepath);
  let i = arr.findIndex(v => v.words[0] == arrOld[iOld].words[0]);
  arr[i].incident.push(Date.parse(new Date()));
  arr = remindCalc(ws, arr, i);
  saveFile(filepath, arr);
}

function waitIntervalEndFunc(ws, arr, i, value) {

  const int = setInterval(() => {
    if (ws.lifeCirclesResponse === 'done') {
      ws.audio = 'speech_start';
      if (arr[i].startFunction) {
        askForCircle.ok(ws, arr, i, value);
      }
      itsHappened(ws, arr, i, value);
      ws.lifeCirclesResponse = 'none';
      clearInterval(int);
    } else if (ws.lifeCirclesResponse === 'error') {
      ws.lifeCirclesResponse = 'none';
      clearInterval(int);
    }
    ws.closeAllInterval ? clearInterval(int) : '';
  }, 1000);

  if (arr[i].startFunction) {
    main.start(ws, arr[i].startFunction);
  } else {
    askForCircle.ok(ws, arr, i, value);
    askForCircle.clientTimeout(ws, arr, i);
  }
}
// /////////////////////////////////////////////////////////////////////////////
function selectScriptBranch(ws, arr, i, value) {
  if (arr[i].timeOut || arr[i].startFunction) {
    waitIntervalEndFunc(ws, arr, i, value);
  } else {
    askForCircle.ok(ws, arr, i, value);
    itsHappened(ws, arr, i);
  }
}

function whenDidItHappen(ws, arr, i, value) {
  askForCircle.when(ws, arr, i, value);
  saveFile(filepath, arr);
}
function doNotRemind(ws, arr, i) {
  arr[i].remind = 9999999999000;
  saveFile(filepath, arr);
  askForCircle.setNotRemind(ws, arr[i].words[0]);
}
function doNotRemindOneDay(ws, arr, i) {
  arr[i].remind = arr[i].remind + (24*60*60*1000);
  saveFile(filepath, arr);
  askForCircle.setNotRemindOneDay(ws, arr[i].words[0]);
}
function setTime(ws, arr, i, sayWords) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'setTimeCancel')));
        },
        words: AskaSC.wordsNo,
        end: true
      },
      {
        func: () => {
          socket.send(ws, 'aska', askForCircle.setTimer(parseFloat(ws.ClientSay)));
          arr[i].timeOut = parseFloat(ws.ClientSay);
          saveFile(filepath, arr);
        },
        words: [''],
        isNumber: true,
        end: true
      },
      {
        func: () => {
          console.log('ok');
        },
        words: ['end'],
        end: true
      }
    ], () => {
      if (main.checkIntelligentObject(ws.ClientSay)) {
        socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'setOKFunc')} ${ws.ClientSay}`);
        arr[i].startFunction = ws.ClientSay;
        saveFile(filepath, arr);
        ws.ClientSay = 'end';
      } else {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'setTimeDef')));
      }
    });
  });
  /*
  sayWords = askForCircle.special(ws, arr, i, 'ignor');
  if (isNaN(parseFloat(sayWords))) {
    askForCircle.noTimeInt(ws);
  } else {
    arr[i].timeOut = parseFloat(sayWords);
    saveFile(filepath, arr);
    askForCircle.setTimer(ws, parseFloat(sayWords));
  }
  */
}
function checkTimeInterval(ws, arr, i, sayWords) {
  sayWords = sayWords.split(' ');
  sayWords = sayWords.map(v => v.replace(/[, ]+/g, " ").trim());
  sayWords = sayWords.map((v) => {
    if (v.includes(':')) { v = v.split(':')[0]; }
    return parseFloat(v);
  });
  if (sayWords.every(v => !isNaN(v))) {
    socket.send(ws, 'console', `sayWords = ${sayWords}`);
    arr[i].timeInterval = sayWords;
    saveFile(filepath, arr);
    askForCircle.setTimeIntervalSay(ws, sayWords.join(' '));
  } else {
    socket.send(ws, 'console', `sayWords = ${sayWords}`);
    askForCircle.noTimeIntervalSay(ws, sayWords.join(' '));
  }
}
function setTimeInterval(ws, arr, i, sayWords) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'setTimeCancel')));
        },
        words: AskaSC.wordsNo,
        end: true
      },
      {
        func: () => {
          console.log('ok');
        },
        words: ['end'],
        end: true
      }
    ], () => {
      if (ws.ClientSay.includes('числа')) {
        socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'setOKDate')} ${parseFloat(ws.ClientSay)} числа`);
        if (parseFloat(ws.ClientSay) < 31) {
          arr[i].DayOfMonth = parseFloat(ws.ClientSay);
          saveFile(filepath, arr);
        }
        ws.ClientSay = 'end';
      } else {
        checkTimeInterval(ws, arr, i, ws.ClientSay);
        ws.ClientSay = 'end';
      }
    });
  });
}
// ////////////////////////////////////////////////////////////////////////////
function eventCountToZero(ws, arr, i, value) {
  arr[i].startIncident = (- (arr[i].incident.length - 1)) + value;
  saveFile(filepath, arr);
}
module.exports.eventCountToZero = eventCountToZero;
function eventDelete(ws, arr, i, sayWords) {
  arr.splice(i, 1);
  askForCircle.sayEventDelete(ws, sayWords);
  saveFile(filepath, arr);
}
// /////////////////////////////////////////////////////////////////////////////
// ПРОВЕРКА НАЛИЧИЯ СУЩЕСТВОВАНИЯ ПАРАМЕТРОВ В БАЗЕ
// /////////////////////////////////////////////////////////////////////////////
function newIncident(ws, arr, value) {
  askForCircle.askForNew(ws, arr, value);
}
module.exports.newIncident = newIncident;
// /////////////////////////////////////////////////////////////////////////////
function allWordsTest(ws, arr, value, option) {
  console.log(`value = ${value};`);
  const allWordsArray = [];
  arr.forEach((v, i) => {
    v.words.forEach((word) => {
      if (textAnalitic.go(value, word) > 40) {
        allWordsArray.push({ name: word, index: i });
      }
    });
  });
  if (allWordsArray.length !== 0) {
    askForCircle.go(ws, arr, value, allWordsArray, option);
  } else {
    newIncident(ws, arr, value);
  }
}
// /////////////////////////////////////////////////////////////////////////////
function switchOption(ws, arr, i, sayWords, option) {
  switch (option) {
    case '1':
      selectScriptBranch(ws, arr, i, sayWords);
      break;
    case '2':
      whenDidItHappen(ws, arr, i, sayWords);
      break;
    case '3':
      doNotRemind(ws, arr, i, sayWords);
      break;
    case '4':
      setTime(ws, arr, i, sayWords);
      break;
    case '5':
      setTimeInterval(ws, arr, i, sayWords);
      break;
    case '6':
      askForCircle.countToZero(ws, arr, i, sayWords);
      break;
    case '7':
      eventDelete(ws, arr, i, sayWords);
      break;
    case '8':
      doNotRemindOneDay(ws, arr, i, sayWords);
      break;
    default:
      console.log('error option');
  }
}
module.exports.switchOption = switchOption;
// /////////////////////////////////////////////////////////////////////////////
function paramTest(arr, words) {
  return arr.findIndex(v => v.words.some(w => w === words));
}
module.exports.paramTest = paramTest;
// /////////////////////////////////////////////////////////////////////////////
function LifeCircles(ws, option, parameters) {
  const sayWords = parameters.join(' ');
  const arr = readFile(filepath);
  const i = paramTest(arr, sayWords);
  if (i !== -1) {
    switchOption(ws, arr, i, sayWords, option);
  } else {
    allWordsTest(ws, arr, sayWords, option);
  }
}
module.exports.LifeCircles = LifeCircles;
