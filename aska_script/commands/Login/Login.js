const fs = require('fs');
const jwt = require('jsonwebtoken');
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkAssignments } = require('../../mainTimeCircle');
// ///////////////////////////////
// ///////////////////////////////
const fileDescription = './aska_script/commands/Login/description.json';
const fileOption = './aska_script/commands/Login/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// ////////////////////////////////////////////////////////////////////////////
function createToken() {
  return jwt.sign({ id: process.env.PASSWORD }, process.env.JWT_SECRET, { expiresIn: '2d' });
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
        socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'b1'));
      } else {
        ws.accessed = true;
        checkAssignments(ws);
        console.log('connection accessed');
      }
    });
  } else {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'a0'));
  }
}
module.exports.verifToken = verifToken;
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
function Login(ws, option) {
  let count = 3;
  const defaultFunction = function defaultFunction() {
    count -= 1;
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'b0'));
    if (count === 0) {
      // Закрыть соединение
      ws.close();
    }
  };
  const positive = function positive() {
    if (option === '1') {
      socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'a2'));
      socket.send(ws, 'token', createToken());
    } else {
      socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'a3'));
    }
    // Получает доступ
    ws.accessed = true;
    // Запуск проверки заданий и лайф циклов
    setTimeout(() => {
      checkAssignments(ws);
    }, 3000);
  };
  const negative = function negative() {
    socket.send(ws, 'aska', asyncAsk.whatToSay(AskaSC, 'b2'));
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
  asyncAsk.readEndWait(ws, asyncAsk.whatToSay(AskaSC, 'a1'), packaging);
}
module.exports.Login = Login;
