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
function allIsDone(ws, money) {
  asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
  checkMoney().then((moneyNew) => {
    let lost = money - moneyNew;
    asyncAsk.readEndWait(ws, `${lost}`);
    ws.lifeCirclesResponse = 'done';
  })
}
function sayMoneyError(ws, money, tarif) {
  ws.lifeCirclesResponse = 'error';
  socket.send(ws, 'aska', `${AskaSC.sayMoneyError[0]} ${tarif},${AskaSC.sayMoneyError[1]} ${money}`);
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
function scenario(ws, money, tarif) {

  let part0, part1;
  //
  part0 = `
    nightmare
    .goto('https://www.ipay.ua/ua/bills/oplata-kommunalnyh-uslug-cherez-internet-komfort-taun')
    .wait(4000)
    .type('#billform-acc', '${process.env.MAIN_KV}')
    .select('#billform-address', "вул. Регенераторна 4")
    .type('#billform-fio', '${process.env.MAIN_NAME_FULL}')
    .type('#billform-invoice', ${tarif})
    .wait(1000)
    .click('#first_step_continue')
    .wait(3000)
    .type('#cardform-pan', '${process.env.CARD_NUM}')
    .type('#cardform-expm', '${process.env.CARD_MY}')
    .type('#cardform-cvv', '${process.env.CARD_CVV}')
    .type('#cardform-fio', '${process.env.MAIN_NAME}')
    .wait(1000)
    .click('button[type="submit"]')
    .wait(10000)
    .evaluate(() => {
      return document.querySelector('.paymentRequisites-step4-success').outerText;
    })
  `;

  function allOk(obj) {
    console.log(obj.value);
    if (obj.value == "Платіж успішно здійснений") {
      allIsDone(ws, money);
    } else {
      payError(ws, obj.value)
    }
    sendAnswer(ws, 'answer', { ok: 'ok' }, empty);
  }

  part1 = `
    nightmare
    .wait(1000)
    .evaluate(() => {
      return "ok";
    })
  `;

  function empty() {
    console.log('all is ok');
  }

  sendAnswer(ws, 'sendCode', assembleTheParts(part0, part1), allOk);

}
// /////////////////////////////////////////////////////////////////////////////
function checkNeedMoney(ws, money) {
  let tarif = 629.00;
  if (money > tarif) {
    scenario(ws, money, tarif);
  } else {
    sayMoneyError(ws, money, tarif)
  }
}
// /////////////////////////////////////////////////////////////////////////////
function nextStep(ws, money) {
  checkOnline(ws).then((res) => {
    res.status === 200 ? checkNeedMoney(ws, money) : sayConnectError(ws);
  });
}
function payforHome(ws) {
  checkMoney().then((money) => {
    if (money) {
      nextStep(ws, money)
    } else {
      askMoneyCheckError(ws);
    }
  })
}
module.exports = { payforHome };
