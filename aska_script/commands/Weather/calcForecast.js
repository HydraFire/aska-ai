function getDateFromStr(str) {
  return parseFloat(str.split('-')[2]);
}

function filterArrayBuyDate(arr, date) {
  return arr.filter(v => getDateFromStr(v.dt_txt) == date);
}

function calcForecast(json) {
  console.log(json.list[1].main);
  console.log(filterArrayBuyDate(json.list, 12));
  return 'вау';
}
module.exports.calcForecast = calcForecast;
