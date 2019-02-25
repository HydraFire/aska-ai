const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const mainTimeCircle = require('../../mainTimeCircle');
const { checkURL } = require('../../saveAska');
const { addListener, deleteListener, saveEditAction, readAction } = require('./addListener');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/WebScraping/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
function goToUrl(ws, parameter) {
  let arr = readAction();
  arr = arr.filter(f => f.name === parameter);
  if (arr.length > 0) {
    let str = arr[0].code;
    let index = str.search('goto');
    let url = str.slice(index + 6, str.lenght);
    index = url.search("'");
    url = url.slice(0, index);
    function packaging() {
      socket.send(ws, 'goToUrl', url);
    }
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'goToUrl')), packaging);
    return;
  }
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'deleteError')));
}

function sayAction(ws, obj) {
  delete obj.startWith;
  function parseValue(v) {
    if (v.askaSay.includes('value')) {
      if (typeof v.value === 'object') {
        let i = -1;
        return v.askaSay.replace('value', () => {
          i += 1;
          return v.value[i];
        });
      } else {
        return v.askaSay.replace('value', v.value);
      }
    }
    return v.askaSay;
  }
  function nextLow() {
    obj.readyToSay = false;
    saveEditAction(obj);
    mainTimeCircle.shortInterval(ws);
  };
  function nextMedium() {
    if (obj.sayTimes === 0) {
      obj.readyToSay = false;
    } else {
      obj.sayTimes -= 1;
    }
    saveEditAction(obj);
    mainTimeCircle.shortInterval(ws);
  };
  function nextHigh() {
    obj.readyToSay = false;
    saveEditAction(obj);
    mainTimeCircle.shortInterval(ws);
  };
  switch (obj.prioritySay) {
      case 'low':
        asyncAsk.readEndWait(ws, parseValue(obj), nextLow);
        break;
      case 'medium':
        asyncAsk.readEndWait(ws, parseValue(obj), nextMedium);
        break;
      case 'high':
        asyncAsk.readEndWait(ws, parseValue(obj), nextHigh);
        break;
      default:
        console.log('obj.prioritySay = undefined');
    }
}
module.exports.sayAction = sayAction;

function WebScraping(ws, option, parameter) {
  parameter = parameter.join(' ');
  console.log(`parameter = |${parameter}|`);
  switch (option) {
    case '1':
      addListener(ws);
      break;
    case '2':
      goToUrl(ws, parameter);
      break;
    case '3':
      deleteListener(ws, parameter);
      break;
    default:
      console.log('error option');
  }
}
module.exports.WebScraping = WebScraping;
