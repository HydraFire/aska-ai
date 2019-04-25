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
function sayDataError(ws, err) {
  console.log(err);
  ws.lifeCirclesResponse = 'error';
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}
function payError(ws, errText) {
  console.log(errText);
  ws.lifeCirclesResponse = 'error';
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}
function allIsDone(ws) {
  ws.lifeCirclesResponse = 'done';
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}

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
function corect(str) {
  str = `${str}`;
  if (str.length === 4) {
    return `00${str}`;
  } else if (str.length === 5) {
    return `0${str}`;
  } else {
    return `${str}`;
  }
}
// /////////////////////////////////////////////////////////////////////////////
function scenario(ws, money, metDay, metNight) {
  console.log(`${money} ${metDay} ${metNight}`);

  metDay = corect(metDay);
  metNight = corect(metNight);

  let part0, part1, part2
  //
  part0 = `
  nightmare
    .goto('https://ok.kep.com.ua/home/ru')
    .wait(1000)
    .type('#username', '${process.env.ENERGY_LOGIN}')
    .type('#password', '${process.env.ENERGY_PASSWORD}')
    .click('input[type="submit"]')
    .wait(1000)
    .click('a[href="https://ok.kep.com.ua/home/ru/accounts/675566"]')
    .wait(6000)
    .click('a[href="/home/ru/readings/new"]')
    .wait(1000)
    .type('#readings_counter_1', '${metDay}')
    .type('#readings_counter_2', '${metNight}')
    .wait(500)
    .evaluate(() => {
      return document.querySelector('.readings-consumption-result-counter').innerText;
    })
  `;
  function checkAllParameter(obj) {
    let kw = parseFloat(obj.value);
    let tarif = kw < 100 ? 0.9 : 1.68;
    let sym = kw * tarif;

    if (!isNaN(parseFloat(obj.value))) {
      if (money > sym) {
        sendAnswer(ws, 'answer', {
          cardNum: process.env.CARD_NUM,
          cardY: process.env.CARD_Y,
          cardM: process.env.CARD_M,
          cardCvv: process.env.CARD_CVV
        }, allOk)
      } else {
        sayMoneyError(ws, money, sym);
      }
    } else {
      sayDataError(ws, obj.value);
    }
  }

  part1 = `nightmare
    .click('a[data-target=".modal--confirmation"]')
    .wait(2000)
    .click('input[value="Занести показания"]')
    .wait(3000)
    .click('a[href="/home/ru/pays/1/type/1/method?main_service=only"]')
    .wait(3000)
    .click('img[alt="PORTMONE.COM"]')
    .wait(1000)
    .click('input[value="Оплатить"]')
    .wait(6000)
    .type('#single_portmone_pay_card', '${process.env.CARD_NUM}')
    .type('#single_portmone_pay_exp_date', '${process.env.CARD_MY}')
    .type('#single_portmone_pay_cvv2', '${process.env.CARD_CVV}')
    .type('#card-pay__user-email', '${process.env.MAIN_EMAIL}')
    .wait(1000)
    .click('button[data-action="cardPayment"]')
    .wait(10000)
    .evaluate(() => {
      document.querySelector('button[type="submit"]').disabled = false;
    })
      `;

  function allOk(obj) {
    console.log(obj.value);
    if (obj.value[0] === 'Прошла успешно') {
      allIsDone(ws)
    } else {
      payError(ws, obj.value)
    }
  }

  sendAnswer(ws, 'sendCode', assembleTheParts(part0, part1), checkAllParameter);

}
// /////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////

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
