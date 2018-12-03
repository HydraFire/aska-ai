const fs = require('fs');
const jwt = require('jsonwebtoken');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { checkAssignments, idleInterval } = require('../../mainTimeCircle');
// ///////////////////////////////
// ///////////////////////////////
const fileDescription = './data/commands/Login/description.json';
const fileOption = './data/commands/Login/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
function createToken() {
  return jwt.sign({ id: process.env.PASSWORD }, process.env.JWT_SECRET, { expiresIn: '21d' });
}
// ////////////////////////////////////////////////////////////////////////////
function verifAccess() {
  return JSON.parse(fs.readFileSync(fileDescription));
}
module.exports.verifAccess = verifAccess;
// ////////////////////////////////////////////////////////////////////////////
function verifToken(ws, token) {
  if (token != '*') {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded.id !== process.env.PASSWORD) {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'b1')));
      } else {
        ws.accessed = true;
        idleInterval(ws);
        checkAssignments(ws);
        console.log('connection accessed');
      }
    });
  } else {
    console.log(asyncAsk.whatToSay(AskaSC, 'a0'));
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'a0')));
  }
}
module.exports.verifToken = verifToken;
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
function Login(ws, option) {
  let count = 3;
  const defaultFunction = function defaultFunction() {
    count -= 1;
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'b0')));
    if (count === 0) {
      // Закрыть соединение
      ws.close();
    }
  };
  const positive = function positive() {
    if (option === '1') {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'a2')));
      socket.send(ws, 'token', createToken());
    } else {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'a3')));
    }
    // Получает доступ
    ws.accessed = true;
    // Запуск проверки заданий и лайф циклов
    setTimeout(() => {
      idleInterval(ws);
      checkAssignments(ws);
    }, 3000);
  };
  const negative = function negative() {
    socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'b2')));
  };

  const packaging = function packaging() {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: positive,
        words: [process.env.PASSWORD],
        end: true
      }, {
        func: negative,
        words: AskaSC.q0,
        end: true
      }
    ], defaultFunction);
  };
  console.log(`LOGIN // option =${option}`);
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, 'a1')), packaging);
}
module.exports.Login = Login;
