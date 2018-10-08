const fs = require('fs');
const { goodMorning, sayIMissYou } = require('./goodMorning');
const { eveningTalk } = require('./eveningTalk');

const filepath = './data/system.json';

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filepath));
  } catch (err) {
    console.log('// Create new System file');
    return { timeLastRun: 0, timeLastGoodMorning: 0, timeEveningTalk: 0 };
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
  let timeLastEveningTalk = Date.now() - obj.timeEveningTalk;
  let hoursNow = new Date().getHours();
  let buildArr = {};

  if (hoursNow > 4 && hoursNow < 14 && timeLastGoodMorning > (16 * 60 * 60 * 1000)) {
    buildArr.goodMorning = true;
  }
  if (hoursNow > 19 && hoursNow < 24 && timeLastEveningTalk > (16 * 60 * 60 * 1000)) {
    buildArr.eveningTalk = true;
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
  } else if (value.eveningTalk) {
    eveningTalk(ws, value);
  } else if (value.timeLeft) {
    sayIMissYou(ws, value);
  } else {};
  // место для еще какогото системного оповещения
}
module.exports.sayWhatYouNeed = sayWhatYouNeed;
