const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { getWeather } =require('../Weather/Weather');
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
  socket.send(ws, 'aska', iMissYou(value));
}
module.exports.sayIMissYou = sayIMissYou;

// /////////////////////////////////////////////////////////////////////////

function sayDateTime() {
  let dateNow = new Date();
  let hours = dateNow.getHours();
  let minutes = dateNow.getMinutes();
  hours < 10 ? hours = `0${hours}` : '';
  minutes < 10 ? minutes = `0${minutes}` : '';
  let arrMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля','августа','сентября','октября','ноября','декабря'];
  return `сегодня ${dateNow.getDate()}-е ${arrMonth[dateNow.getMonth()]}, ${hours}:${minutes}`;
}

async function goodMorning(ws, value) {
  let missYou = '';
  if (value.timeLeft) {
    missYou = iMissYou(value);
  }
  socket.send(ws, 'aska', `${asyncAsk.whatToSay(AskaSC, 'a0')}, ${sayDateTime()}, ${missYou}.${await getWeather()}`);
  let x = value.obj;
  x.timeLastRun = Date.now();
  x.timeLastGoodMorning = Date.now();
  fs.writeFileSync(filepath, JSON.stringify(x), 'utf8');
}
module.exports.goodMorning = goodMorning;
