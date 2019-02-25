const fs = require('fs');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// ////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/WebScraping/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
let createObj = {};
// ////////////////////////////////////////////////////////////////////////////
function reloadObj() {
  createObj = {
    name: '',
    code: '',
    priorityCheck: '',
    prioritySay: '',
    timeLastCheck: 0,
    retry: '',
    value: '',
    sayTimes: 0,
    askaSay: '',
    readyToSay: false
  };
}
function readAction() {
  try {
    return JSON.parse(fs.readFileSync('./data/actions.json'));
  } catch (err) {
    return [];
  }
}
module.exports.readAction = readAction;
function writeAction() {
  let arr = readAction();
  arr.push(createObj);
  fs.writeFileSync('./data/actions.json', JSON.stringify(arr), 'utf8');
}
function saveEditAction(obj) {
  fs.writeFileSync('./data/actions.json', JSON.stringify(readAction().map(v => {
    if (v.name === obj.name) {
      return obj;
    }
    return v;
  }).filter(f => {
    if (f.name !== obj.name) {
      return true;
    } else {
      if (f.retry === false && f.sayTimes === 0 && f.readyToSay === false) {
        return false;
      } else {
        return true;
      }
    }
  })), 'utf8');
}
module.exports.saveEditAction = saveEditAction;
function deleteListener(ws, parameter) {
  let arr = readAction();
  let index = arr.findIndex(v => v.name === parameter);
  if (index != -1) {
    arr.splice(index, 1);
    fs.writeFileSync('./data/actions.json', JSON.stringify(arr), 'utf8');
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'delete')));
    return;
  }
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'deleteError')));
}
module.exports.deleteListener = deleteListener;
// ///////////////////////////////////////////////////////////////////////////
function askAskaSay(ws) {
    let newText = '';

    function defaultFunction(string) {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'u3')));
      newText += `${string}, `;
    };

    function first() {
      if (newText.length > 0) {
        createObj.askaSay = newText;
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'u1')));
        writeAction();
        reloadObj();
      } else {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'u2')));
      }
    };

    function packaging() {
      asyncAsk.selectFunctionFromWords(ws, [
        {
          func: first,
          words: AskaSC.u4,
          end: true
        }
      ], defaultFunction);
    };
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'u0')), packaging);
}

function askPrioritySay(ws) {
  function defaultFunction() {
     socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'ps1')));
  };

  function low() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'ps2')));
    createObj.prioritySay = 'low';
    asyncAsk.onlyWait(ws, askAskaSay);
  };
  function medium() {
    createObj.prioritySay = 'medium';
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'ps3')));
    asyncAsk.onlyWait(ws, askAskaSay);
  };
  function high() {
    createObj.prioritySay = 'high';
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'ps4')));
    asyncAsk.onlyWait(ws, askAskaSay);
  };

  function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: low,
        words: AskaSC.ps5,
        end: true
      }, {
        func: medium,
        words: AskaSC.ps6,
        end: true
      },{
        func: high,
        words: AskaSC.ps7,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'ps0')), packaging);
}

function askPriorityCheck(ws) {
  function defaultFunction() {
     socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'pc1')));
  };

  function low() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'pc2')));
    createObj.priorityCheck = 'low';
    asyncAsk.onlyWait(ws, askPrioritySay);
  };
  function medium() {
    createObj.priorityCheck = 'medium';
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'pc3')));
    asyncAsk.onlyWait(ws, askPrioritySay);
  };
  function high() {
    createObj.priorityCheck = 'high';
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'pc4')));
    asyncAsk.onlyWait(ws, askPrioritySay);
  };

  function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: low,
        words: AskaSC.pc5,
        end: true
      }, {
        func: medium,
        words: AskaSC.pc6,
        end: true
      },{
        func: high,
        words: AskaSC.pc7,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'pc0')), packaging);
}

function askRetry(ws) {
  function defaultFunction() {
     socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'r1')));
  };

  function positive() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'r2')));
    createObj.retry = true;
    asyncAsk.onlyWait(ws, askPriorityCheck);
  };
  function negative() {
    createObj.retry = false;
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'r2')));
    asyncAsk.onlyWait(ws, askPriorityCheck);
  };

  function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: AskaSC.r4,
        end: true
      }, {
        func: negative,
        words: AskaSC.r5,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'r0')), packaging);
}

function askCode(ws) {
  function defaultFunction() {
     socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p1')));
  };

  function codeCheck() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p2')));
    createObj.code = ws.ClientSay;
    asyncAsk.onlyWait(ws, askRetry);
  };
  function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p3')));
  };

  function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: codeCheck,
        words: AskaSC.p4,
        include: true,
        end: true
      }, {
        func: negative,
        words: AskaSC.p5,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'p0')), packaging);
}

function addListener(ws) {
  reloadObj();
  function defaultFunction() {
     console.log('defaultFunction');
  };

  function codeCheck() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'a1')));
    createObj.name = ws.ClientSay;
    asyncAsk.onlyWait(ws, askCode);
  };
  function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'p3')));
  };

  function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: negative,
        words: AskaSC.p5,
        end: true
      }, {
        func: codeCheck,
        words: [''],
        whatever: true,
        end: true
      }
    ], defaultFunction);
  };
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'a0')), packaging);
};

module.exports.addListener = addListener;
