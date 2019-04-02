const fs = require('fs');
const fetch = require('node-fetch');
// /////////////////////////////////////////////////////////////////////////////
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/WebInteract/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////
function sayConnectError(ws, err) {
  console.log(err);
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}
function sayIsBusy(ws) {
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}
// ////////////////////////////////////////////////////////////////////////////
function assembleTheParts(...array) {
  function recursionAddPromiseSugar(arr) {
    let str = '';
    if (arr.length > 0) {
      str = arr.splice(0, 1);
      if (arr.length === 0) {
        str += `.then((value) => {
          response.status(200).send({value});
        })
        ${(() => {
          if (!process.env.NIGHTMARE_DEV) {
            return `.then(() => {
              busy = false;
              return nightmare.end();
            })`
          }
        })()}
      },(reject) => {
        console.log(reject);
        busy = false;
        return nightmare.end();
      })xx`
      } else {
        str += `
          .then((value) => {
            response.status(200).send({value});
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              let temp = answer;
              let i = 0;
              let int = setInterval(() => {
                i += 1;
                console.log(i);
                if (temp != answer) {
                  clearInterval(int);
                  resolve(answer.secondRes);
                }
                if (i > 500) {
                  clearInterval(int);
                  reject();
                }
              }, 1000);
            })
          })
          .then((response) => {
            return `;
      }
      str += recursionAddPromiseSugar(arr)
      if(str[str.length-1] === 'x'){
        str = str.substring(0, str.length - 1);
      } else {
        str += `
      },(reject) => {
          busy = false;
          console.log(reject);
          return nightmare.end();
        });`;
      }
    }
    return str;
  }
  return { code: recursionAddPromiseSugar(array), devMode: process.env.NIGHTMARE_DEV};
}
// ////////////////////////////////////////////////////////////////////////////
function sendAnswer(ws, endPoint, str, ask) {
  fetch(`http://${process.env.NIGHTMARE_IP}/api/${endPoint}`, {
        method: 'post',
        body:    JSON.stringify({ answer: str }),
        headers: { 'Content-Type': 'application/json' }
  })
  .then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    sayIsBusy(ws);
   })
  .then(obj => obj !== undefined ? ask(obj) : '')
  .catch(err => {
    sayConnectError(ws, err) ;
  });
}
function checkOnline(ws) {
  return fetch(`http://${process.env.NIGHTMARE_IP}/api/checkOnline`)
  .catch((err) => {
    sayConnectError(ws, err);
  });
}
module.exports = { checkOnline, sendAnswer, assembleTheParts, sayConnectError };
