const fs = require('fs');
const socket = require('./webSocketOnMessage');
const asyncAsk = require('./asyncAsk');
const { checkURL, checkSmartURL } = require('./saveAska');

const filepath = './data/system.json';
const fileOption = './data/commands/System/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    console.log('// Create new System file');
    return { timeLastRun: 0, timeLastGoodMorning: 0 };
  }
}

function afterReadWriteFile() {
  let obj = readFile();
  let lastObj = Object.assign({}, obj);
  obj.timeLastRun = Date.now();
  fs.writeFileSync(filepath, JSON.stringify(obj), 'utf8');
  return lastObj;
}
function checkDate() {
  let obj = afterReadWriteFile();
  let timeLeft = Date.now() - obj.timeLastRun;
  let timeLastGoodMorning = Date.now() - obj.timeLastGoodMorning;
  let hoursNow = new Date().getHours();
  let buildArr = {};

  if (hoursNow > 4 && hoursNow < 14 && timeLastGoodMorning > (16 * 60 * 60 * 1000)) {
    buildArr.goodMorning = true;
  }
  if (timeLeft > (24 * 60 * 60 * 1000)) {
    buildArr.timeLeft = timeLeft;
  }
  if (Object.keys(buildArr).length > 0) {
    buildArr.startWith = 'System';
    buildArr.obj = obj;
  }
  return [ buildArr ];
}
module.exports.checkDate = checkDate;

function sayWhatYouNeed(ws, value) {
  if (value.goodMorning) {
    goodMorning(ws, value);
  } else if (buildArr.timeLeft) {
    sayIMissYou(ws, value);
  } else {};
  // место для еще какогото системного оповещения
}
module.exports.sayWhatYouNeed = sayWhatYouNeed;

function iMissYou(value) {
  let lvl = 'a1';
  if (value.timeLeft > (31 * 24 * 60 * 60 * 1000)) {
    lvl = 'a4';
  } else if (value.timeLeft > (7 * 24 * 60 * 60 * 1000)) {
    lvl = 'a3';
  } else if (value.timeLeft > (3 * 24 * 60 * 60 * 1000)) {
    lvl = 'a2';
  }
  return asyncAsk.whatToSay(AskaSC, lvl);
}
function sayIMissYou(ws, value) {
  socket.send(ws, 'aska', iMissYou(value));
}
function sayDateTime() {
  let dateNow = new Date();
  return `сегодня 5-тое октября, ${dateNow.getHours()}:${dateNow.getMinutes()}`;
}

function goodMorning(ws, value) {
  let missYou = '';
  if (value.timeLeft) {
    missYou = iMissYou(value);
  }
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'a0')}, ${sayDateTime()}, ${missYou}`);
  let x = value.obj;
  x.timeLastGoodMorning = Date.now();
  fs.writeFileSync(filepath, JSON.stringify(x), 'utf8');
}
