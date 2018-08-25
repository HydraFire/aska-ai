const fs = require('fs');
const textAnalitic = require('./textAnalitic');
const socket = require('../../webSocketOnMessage');
const askForCircle = require('./askForCircle');
const { calcLast } = require('./calcTime');
// //////////////////////////////////////
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
    // fs.writeFileSync(p, JSON.stringify(example), 'utf8');
    return example;
  }
}
// /////////////////////////////////////////////////////////////////////////////
function saveFile(p, arr) {
  fs.writeFileSync(p, JSON.stringify(arr), 'utf8');
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
  if (arr[i].timeInterval) {
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

// /////////////////////////////////////////////////////////////////////////////
function itsHappened(ws, arr, i, value) {
  askForCircle.ok(ws, arr, i, value);
  arr[i].incident.push(Date.parse(new Date()));
  arr = remindCalc(ws, arr, i);
  askForCircle.clientTimeout(ws, arr, i);
  saveFile(filepath, arr);
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
function setTime(ws, arr, i, sayWords) {
  sayWords = askForCircle.special(ws, arr, i, 'ignor');
  if (isNaN(parseFloat(sayWords))) {
    askForCircle.noTimeInt(ws);
  } else {
    arr[i].timeOut = parseFloat(sayWords);
    saveFile(filepath, arr);
    askForCircle.setTimer(ws, parseFloat(sayWords));
  }
}

function setTimeInterval(ws, arr, i, sayWords) {
  sayWords = askForCircle.special(ws, arr, i, 'ignor');
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
      itsHappened(ws, arr, i, sayWords);
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
    default:
      console.log('error option');
  }
}
module.exports.switchOption = switchOption;
// /////////////////////////////////////////////////////////////////////////////
function paramTest(arr, words) {
  return arr.findIndex(v => v.words.some(w => w === words));
}
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
