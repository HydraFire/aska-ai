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
function sayDataError(ws, err) {
  console.log(err);
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}
function sayDateFinalError(ws, dateFinal) {
  socket.send(ws, 'aska', `${AskaSC.sayDateFinalError[0]} ${dateFinal}`);
}
function sayMoneyError(ws, money, tarif) {
  socket.send(ws, 'aska', `${AskaSC.sayMoneyError[0]} ${tarif},${AskaSC.sayMoneyError[1]} ${money}`);
}
function sayPaySiteError(ws) {
  socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)));
}
function payError(ws, errText) {
  socket.send(ws, 'aska', checkURL(`${asyncAsk.whatToSay(AskaSC, arguments.callee.name)}, ${errText}`));
}
function allIsDone(ws) {
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
function scenario(ws, money) {
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

  function checkAllParameter(obj) {
    let dateFinal = obj.value[0].split('.').map(v => parseFloat(v));
    let tarif = parseFloat(obj.value[1].split(',')[1]);

    if (dateFinal.every(v => !isNaN(v)) && !isNaN(tarif)) {
      if (Date.parse(new Date(dateFinal[2], dateFinal[1] - 1, dateFinal[0], 0, 0, 0, 0)) < Date.now()) {
        if (money > tarif) {
          sendAnswer(ws, 'answer', {
            cardNum: process.env.CARD_NUM,
            cardY: process.env.CARD_Y,
            cardM: process.env.CARD_M,
            cardCvv: process.env.CARD_CVV,
            tarif: `${tarif}`
          }, allOk)
        } else {
          sayMoneyError(ws, money, tarif);
        }
      } else {
        sayDateFinalError(ws, dateFinal);
      }
    } else {
      sayDataError(ws, obj.value);
    }
  }

  part1 = `nightmare
      .click('a[href="PaymentProcedure.aspx"]')
      .click('a[href="Visa.aspx"]')
      .wait(500)
      .type('#cph_main_AmountBox', answer.data.tarif)
      .click('#cph_main_btn_confirm')
      .wait(500)
      .click('#cph_main_btn_pay')
      .wait(2000)
      .type('input[placeholder="XXXX   XXXX   XXXX   XXXX"]', answer.data.cardNum)
      .select('select[data-ng-model="SenderCardModel.ExpireMonth"]', answer.data.cardM)
      .select('select[data-ng-model="SenderCardModel.ExpireYear"]', answer.data.cardY)
      .type('input[data-ng-model="SenderCardModel.Cvv"]', answer.data.cardCvv)
      .click('button[data-ng-disabled="activeRequests"]')
      .wait('button[data-ng-click="SendPayment()"]')
      .click('button[data-ng-click="SendPayment()"]')
      .wait(29000)
      .evaluate(() => {
        if (document.querySelector('#i18n_25')) {
          return true;
        } else {
          return false;
        }
      })
      .then((v) => {
        if (v) {
          return nightmare
            .wait(100).evaluate(() => {
              return [
                document.querySelector('#i18n_25').outerText,
                document.querySelector('.block__input__name').outerText
              ];
            });
        } else {
          return nightmare
            .wait(29000).evaluate(() => {
              return [
                document.querySelector('#i18n_25').outerText,
                document.querySelector('.block__input__name').outerText
              ];
            })
        }
      })
      `;

  function allOk(obj) {
    console.log(obj.value);
    if (obj.value[0] === 'Приват24 пароль') {
      passwordAsk();
    } else if (obj.value[1] === 'Пароль из SMS') {
      passwordSMSAsk();
    } else {
      sayPaySiteError(ws);
    }
  }
  function passwordAsk() {
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
      asyncAsk.selectFunctionFromWords(ws, [
        {
          func: () => {
              socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordAskTrueSay')));
              sendAnswer(ws, 'answer', process.env.CARD24_PASSWORD, askDone);
          },
          words: AskaSC.passwordAskTrue,
          end: true
        },
        {
          func: () => {
              socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordAskFalseSay')));
          },
          words: AskaSC.passwordAskFalse,
          end: true
        }
      ], () => {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordAskDef')));
        });
    });
  }

  function passwordSMSAsk() {
    let password = '';
    asyncAsk.readEndWait(ws, checkURL(asyncAsk.whatToSay(AskaSC, arguments.callee.name)), () => {
      asyncAsk.selectFunctionFromWords(ws, [
        {
          func: () => {
              socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordAskFalseSay')));
          },
          words: AskaSC.passwordAskFalse,
          end: true
        },
        {
          func: () => {
              console.log(password);
              sendAnswer(ws, 'answer', password, askDone);
              socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordSMSAskTrueSay')));
          },
          words: ['clientsay'],
          end: true
        },
        {
          func: () => {
              socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordSMSAskReSay')));
              password = '';
          },
          words: AskaSC.passwordSMSAskRe,
          end: false
        }
      ], () => {

        if (!isNaN(parseFloat(ws.ClientSay))) {
          password += ws.ClientSay
          socket.send(ws, 'aska', `${ws.ClientSay}`);
          if (password.length === 8) {
            ws.ClientSay = 'clientsay';
          } else if (password.length > 8) {
            ws.ClientSay = 'recole';
          }
        } else {
          socket.send(ws, 'aska', checkURL(asyncAsk.whatToSay(AskaSC, 'passwordSMSAskFalseSay')));
        }
      });
    });
  }

  part2 = `nightmare.wait(100)
    .then(() => {
      if (isNaN(parseFloat(answer.data))) {
        return nightmare.type('input[type="password"]', answer.data)
          .click('a[onclick="check()"]')
          .wait(5000)
          .evaluate(() => {
                if (document.querySelector('#warning_msg')) {
                  return document.querySelector('#warning_msg').outerText;
                } else {
                  return 'xxx';
                }
          });
      } else {
        return nightmare.type('#otp', answer.data)
        .click('a[onclick="check()"]')
        .wait(15000)
        .evaluate(() => {
              if (document.querySelector('#warning_msg')) {
                return document.querySelector('#warning_msg').outerText;
              } else {
                return document.querySelector('h3[class="payment-success-title"]').outerText;
              }
        });
      }
    })
    `;

  function askDone(obj) {
    console.log(obj.value)
    if (obj.value == 'Успешный платеж') {
      allIsDone(ws);
    } else {
      payError(ws, obj.value);
    }
  }
  sendAnswer(ws, 'sendCode', assembleTheParts(part0, part1, part2), checkAllParameter);
}
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
function nextStep(ws, money) {
  checkOnline(ws).then((res) => {
    res.status === 200 ? scenario(ws, money) : sayConnectError(ws);
  });
}
function payforInternet(ws) {
  checkMoney().then((money) => {
    if (money) {
      nextStep(ws, money)
    } else {
      askMoneyCheckError(ws);
    }
  })
}
module.exports = { payforInternet };
