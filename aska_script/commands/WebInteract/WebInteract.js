const { payforInternet } = require('./payforInternet');
const { sayMoney } = require('./checkMoney');
// /////////////////////////////////////////////////////////////////////////////
function WebInteract(ws, option, parameter) {
  parameter = parameter.join(' ');
  //console.log(`parameter = |${parameter}|`);
  switch (option) {
    case '1':
      payforInternet(ws);
      break;
    case '2':
      sayMoney(ws);
      break;
    case '3':
      //deleteListener(ws, parameter);
      break;
    default:
      console.log('error option');
  }
}
module.exports.WebInteract = WebInteract;
