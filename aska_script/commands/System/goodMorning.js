const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { sayMorning } = require('../Weather/Weather');
const { checkURL, checkSmartURL } = require('../../saveAska');

const filepath = './data/system.json';
const fileOption = './data/commands/System/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////
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
module.exports.iMissYou = iMissYou;

function sayIMissYou(ws, value) {
  let text = iMissYou(value);
  asyncAsk.readEndWait(ws, text, () => {
    mainTimeCircle.shortInterval(ws);
  });
}
module.exports.sayIMissYou = sayIMissYou;

// /////////////////////////////////////////////////////////////////////////

function sayDay() {
  let dateNow = new Date();
  let day = dateNow.getDay();
  //let hours = dateNow.getHours();
  //let minutes = dateNow.getMinutes();
  //hours < 10 ? hours = `0${hours}` : '';
  //minutes < 10 ? minutes = `0${minutes}` : '';
  let arrDay = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  return `сегодня ${arrDay[day]}`;
}
function sayDateMonth() {
  let dateNow = new Date();
  let month = dateNow.getMonth();
  let arrMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля','августа','сентября','октября','ноября','декабря'];
  return `${dateNow.getDate()}-е ${arrMonth[month]}`;
}
function goodMorning(ws, value) {
  sayMorning(ws).then(result => {
    let missYou = '';
    if (value.timeLeft) {
      missYou = iMissYou(value);
    }
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'a0')));
    asyncAsk.readEndWait(ws, checkURL(sayDay()));
    asyncAsk.readEndWait(ws, checkURL(sayDateMonth()));
    asyncAsk.readEndWait(ws, checkURL(missYou));
    //console.log(result);
    result.split(',')
      .filter(v => v != '' && v != ' ' && v != ', ' && v != ' ,' && v != ',')
      .forEach((v, i, arr) => {
        if (i === arr.length - 1) {
          asyncAsk.readEndWait(ws, checkURL(v), mainTimeCircle.shortInterval)
        } else {
          asyncAsk.readEndWait(ws, checkURL(v));
        }
      });

    let x = value.obj;
    x.timeLastRun = Date.now();
    x.timeLastGoodMorning = Date.now();
    fs.writeFileSync(filepath, JSON.stringify(x), 'utf8');
  }, err => console.log(err));
}
module.exports.goodMorning = goodMorning;
