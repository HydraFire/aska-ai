const { payforInternet } = require('./payforInternet');
const { payforEnergy } = require('./payforEnergy');
const { payforHome } = require('./payforHome');
const { sayMoney } = require('./checkMoney');
const { orderVisitation } = require('./orderVisitation');
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
      payforEnergy(ws);
      break;
    case '4':
      payforHome(ws);
      break;
    case '5':
      orderVisitation(ws);
      break;
    default:
      console.log('error option');
  }
}
module.exports.WebInteract = WebInteract;
