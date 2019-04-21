const fs = require('fs');
// /////////////////////////////////////////////////////////////////////////////
const socket = require('../../webSocketOnMessage');
const asyncAsk = require('../../asyncAsk');
const { checkURL } = require('../../saveAska');
const { checkMoney } = require('./checkMoney');
const { checkOnline, sendAnswer, assembleTheParts, sayConnectError } = require('./instrument');
// /////////////////////////////////////////////////////////////////////////////
const fileOption = './data/commands/WebInteract/option.json';
const AskaSC = JSON.parse(fs.readFileSync(fileOption));
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
function askMoneyCheckError(ws) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          nextStep(ws, 999);
        },
        words: AskaSC.wordsYes,
        end: true
      },
      {
        func: () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'internetPayCancel')));
        },
        words: AskaSC.wordsNo,
        end: true
      }
    ], () => {
      socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'internetPayGoOn')));
    });
  });
}
// /////////////////////////////////////////////////////////////////////////////
function scenario(ws, money, metDay, metNight) {
  console.log(`${money} ${metDay} ${metNight}`);
  /*
  let part0, part1, part2
  //
  part0 = `
  nightmare
    .goto('https://triolan.name/LP.aspx')
    .wait(1000)
    .click('#rb1')
    .wait(1000)
    .type('#login2_tbAgreement', '${process.env.INTERNET_ID}')
    .type('#login2_tbPassword', '${process.env.INTERNET_PASSWORD}')
    .click('#login2_btnLoginByAgr')
    .wait(2000)
    .evaluate(() => {
      return [
        document.querySelector('.personal_data').children[1].children[0].children[1].outerText,
        document.querySelector('#cph_main_ddl_activations').options[0].outerText
      ];
    })
  `;
  sendAnswer(ws, 'sendCode', assembleTheParts(part0, part1, part2), checkAllParameter);
  */
}
// /////////////////////////////////////////////////////////////////////////////
function askMeterReadingsNight(ws, money, metDay) {
  let metNight = '';
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          scenario(ws, money, metDay, metNight);
        },
        words: ['end'],
        end: true
      },
      {
        func: () => {
          if (metNight != '') {
            socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayDone')));
            ws.ClientSay = 'end';
          } else {
            socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNoHaveNum')));
          }
        },
        words: AskaSC.wordsMYes,
        end: false
      },
      {
        func: () => {
          metNight = '';
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNotRight')));
        },
        words: AskaSC.wordsMNo,
        end: false
      }
    ], (str) => {
      if (!isNaN(parseFloat(str))) {
        socket.send(ws, 'aska', `${str}. ${asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNotNan')}`);
        metNight = str;
      } else {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNan')));
      }
    });
  });
}

function askMeterReadingsDay(ws, money) {
  let metersDay = '';
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
    asyncAsk.selectFunctionFromWords(ws, [
      {
        func: () => {
          askMeterReadingsNight(ws, money, metersDay);
        },
        words: ['end'],
        end: true
      },
      {
        func: () => {
          if (metersDay != '') {
            socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayDone')));
            ws.ClientSay = 'end';
          } else {
            socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNoHaveNum')));
          }
        },
        words: AskaSC.wordsMYes,
        end: false
      },
      {
        func: () => {
          metersDay = '';
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNotRight')));
        },
        words: AskaSC.wordsMNo,
        end: false
      }
    ], (str) => {
      if (!isNaN(parseFloat(str))) {
        socket.send(ws, 'aska', `${str}. ${asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNotNan')}`);
        metersDay = str;
      } else {
        socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'askMeterReadingsDayNan')));
      }
    });
  });
}
// /////////////////////////////////////////////////////////////////////////////
function nextStep(ws, money) {
  checkOnline(ws).then((res) => {
    res.status === 200 ? askMeterReadingsDay(ws, money) : sayConnectError(ws);
  });
}
function payforEnergy(ws) {
  checkMoney().then((money) => {
    if (money) {
      nextStep(ws, money)
    } else {
      askMoneyCheckError(ws);
    }
  })
}
module.exports = { payforEnergy };
