const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { getWeather } = require('../Weather/Weather');
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

function sayDateTime() {
  let dateNow = new Date();
  let month = dateNow.getMonth();
  let day = dateNow.getDay();
  let hours = dateNow.getHours();
  let minutes = dateNow.getMinutes();
  hours < 10 ? hours = `0${hours}` : '';
  minutes < 10 ? minutes = `0${minutes}` : '';
  let arrDay = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  let arrMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля','августа','сентября','октября','ноября','декабря'];
  return `сегодня ${arrDay[day]}, ${dateNow.getDate()}-е ${arrMonth[month]}, ${hours}:${minutes}, `;
}
function sayWind(windValue) {
  windValue = windValue | 0;
  const arr = ['','','очень слабый ветер','слабый ветер', 'ветер немного чувствуется','немного есть ветер', 'сильный ветер', 'сильный сильный ветер','очень сильный ветер'];
  return arr[windValue];
}
function goodMorning(ws, value) {
  getWeather(ws).then((json) => {
    let sayWeather = `на улице ${json.weather[0].description}, температура ${Math.round(json.main.temp)} градусов, ${sayWind(json.wind.speed)}`;
    let missYou = '';
    if (value.timeLeft) {
      missYou = iMissYou(value);
    }
    let text = `${asyncAsk.whatToSay(AskaSC, 'a0')}, ${sayDateTime()}, ${missYou}.${sayWeather}`;
    asyncAsk.readEndWait(ws, text, () => {
      mainTimeCircle.shortInterval(ws);
    });
    let x = value.obj;
    x.timeLastRun = Date.now();
    x.timeLastGoodMorning = Date.now();
    fs.writeFileSync(filepath, JSON.stringify(x), 'utf8');
  }).catch(err => console.log(err));
}
module.exports.goodMorning = goodMorning;
