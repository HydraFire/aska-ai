const textToTime = function textToTime(text) {
  return Date.parse(new Date());
};
module.exports.textToTime = textToTime;



const searchDate = function searchDate(str) {
  let strEnd = false;
  const arr = str.split(' ');

  const arrmain = [{
    value: ['числа', 'число'],
    func: (i) => {
      const r = new Date();
      let month = r.getMonth() + 1;
      month < 10 ? month = `0${month}` : '';
      let day = parseFloat(arr[i - 1]);
      day < 10 ? day = `0${day}` : '';
      return `${r.getFullYear()}-${month}-${day}T`;
    }
  }];

  arr.forEach((v, i) => {
    arrmain[0].value.forEach((objValue) => {
      if (v === objValue) {
        strEnd = arrmain[0].func(i);
      }
    });
  });
  console.log(`searchDate = ${strEnd}`);
  return strEnd;
};
module.exports.searchDate = searchDate;
// /////////////////////////////////////////////////////////////////////////////
const searchTime = function searchTime(str) {
  let strEnd = false;
  const arr = str.split(' ');
  [strEnd] = arr.filter(v => v.includes(':'));
  console.log(strEnd);
  if (strEnd !== undefined) {
    const a = strEnd.split(':')[0];
    parseFloat(a) < 10 ? strEnd = `0${strEnd}` : '';
    strEnd += ':00.000Z';
    console.log(`searchTime = ${strEnd}`);
  } else {
    strEnd = false;
  }
  return strEnd;
};
module.exports.searchTime = searchTime;
// /////////////////////////////////////////////////////////////////////////////
function normalizeTimeZone(v) {
  let a = new Date();
  a = a.getTimezoneOffset() * 60000;
  return v + a;
}
module.exports.normalizeTimeZone = normalizeTimeZone;
