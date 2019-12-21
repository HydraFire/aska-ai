const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const mainTimeCircle = require('../../mainTimeCircle');
const asyncAsk = require('../../asyncAsk');
const { sayMorning } = require('../Weather/Weather');
const { Creative } = require('../Creative/Creative');
const { checkURL, checkSmartURL } = require('../../saveAska');
const { checkMoney, checkMyMoney } = require('../WebInteract/checkMoney');
const { dateToText_to_e } = require('../../textToTime');
const { miniGame } = require('../Creative/miniGame');

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
  return `${dateToText_to_e(dateNow.getDate())} ${arrMonth[month]}`;
}
function goodMorning(ws, value) {
  sayMorning(ws).then(result => {
    let missYou = '';
    if (value.timeLeft) {
      missYou = iMissYou(value);
    }
    Creative().forEach(v => { //asyncAsk.whatToSay(AskaSC, 'a0')
      asyncAsk.readEndWait(ws, checkURL(v));
    })
    asyncAsk.readEndWait(ws, checkURL(sayDay()));
    asyncAsk.readEndWait(ws, checkURL(sayDateMonth()));
    asyncAsk.readEndWait(ws, checkURL(missYou));


    //console.log(result);
    result.split(',')
      .filter(v => v != '' && v != ' ' && v != ', ' && v != ' ,' && v != ',')
      .forEach((v, i, arr) => {
      //  if (i === arr.length - 1) {
      //    asyncAsk.readEndWait(ws, checkURL(v), mainTimeCircle.shortInterval)
    //    } else {
          v != 'undefined' ? asyncAsk.readEndWait(ws, checkURL(v)):'';
    //    }
      });
      /*
    Promise.all([checkMoney(), checkMyMoney()]).then(function(values) {
      let money = values[0].split('.')[0];
      let money2 = values[1].split('.')[0];
      let text = `На моём счету ${money} гривен, а на другом ${money2} гривен`;
      asyncAsk.readEndWait(ws, text)
    });
*/
    miniGame(ws)

    let x = value.obj;
    x.timeLastRun = Date.now();
    x.timeLastGoodMorning = Date.now();
    fs.writeFileSync(filepath, JSON.stringify(x), 'utf8');
  }, err => console.log(err));
}
module.exports.goodMorning = goodMorning;
