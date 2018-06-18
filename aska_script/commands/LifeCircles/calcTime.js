/* eslint-disable */
function calcLast(arr, i) {
  const first = arr[i].incident[arr[i].incident.length - 1];
  const second = arr[i].incident[arr[i].incident.length - 2];
  let sym = ((first - second) / 100) * 80 | 0;
  console.log(sym);
  return sym;
}
module.exports.calcLast = calcLast;

function calcNow(arr, i) {
  const first = Date.parse(new Date());
  const second = arr[i].incident[arr[i].incident.length - 1];
  const sym = first - second;
  console.log(sym);
  return sym;
}
module.exports.calcNow = calcNow;

function countToText(v) {
  let arr_100_900 = ['сто ','двести ','триста ','четыреста ','пятьсот ','шестьсот ','семьсот ','восемьсот ','девятьсот ']
  let arr_100_900b = ['юбелейный сотый ','двухсотый ','трехсотый ','четырехсотый ','пятисотый ','шестисотый ','семисотый ','восьмисотый ','девятисотый ']
  let arr_20_90 = ['двадцатый ','тридцатый ','сороковой ','пятидесятый ','шестидесятый ','семидесятый ','восьмидесятый ','девяностый ']
  let arr_20_90b = ['двадцать ','тридцать ','сорок ','пятьдесят ','шестьдесят ','семьдесят ','восемьдесят ','девяносто ']
  let arr_11_19 = ['десятый ','одиннадцатый ','двенадцатый ','тринадцатый ','четырнадцатый ','пятнадцатый ','шестнадцатый ','семнадцатый ','восемнадцатый ','девятнадцатый ']
  let arr_1_9 = ['первый ','второй ','третий ','четвертый ','пятый ','шестой ','седьмой ','восьмой ','девятый ']

  v+=''
  let z = v[v.length-1]
  let zz = v[v.length-2]
  let zzz = v[v.length-3]
  v=''

  zzz&&zz==0&&z==0?v +=arr_100_900b[zzz-1]:zzz?v+=arr_100_900[zzz-1]:''
  zz==1?v +=arr_11_19[z]:'';
  zz>1&&z==0?v +=arr_20_90[zz-2]:'';
  zz>1&&z!=0?v +=arr_20_90b[zz-2]:'';
  zz!=1&&z!=0?v +=arr_1_9[z-1]:'';
  !zzz&&!zz&&z==0?v +='не разу':'';
  zzz||zz||z!=0?v +='раз ':''

  return v
}
module.exports.countToText = countToText;

function dateToText(value) {
  const mmm = new Date(value);
  console.log('value '+value+'  mmm '+mmm);
  let minutes = mmm.getMinutes();
  let hours = mmm.getUTCHours();
  let date = mmm.getUTCDate() - 1;

  date += '';
  if (date != 0) {
    let d = date[date.length-1]
    let dd = date[date.length-2]
    if(dd == 1){date +=' дней '}else
      if(d == 0){date +=' дней '}else
        if(d == 1){date +=' день '}else
          if(d > 1&&d < 5){date +=' дня '}else
            if(d >= 5){date +=' дней '}
  }else{date = ''}

  hours+=''
  if(hours != 0){
    let h = hours[hours.length-1]
    let hh = hours[hours.length-2]

    if(hh == 1){hours +=' часов '}else
      if(h == 0){hours +=' часов '}else
        if(h == 1){hours +=' час '}else
          if(h > 1&&h < 5){hours +=' часа '}else
            if(h >= 5){hours +=' часов '}
  }else{hours = ''}

  minutes+=''
  if(minutes != 0){
    let m = minutes[minutes.length-1]
    let mm = minutes[minutes.length-2]

    if(mm == 1){minutes +=' минут '}else
      if(m == 0){minutes +=' минут '}else
        if(m == 1){minutes +=' минута '}else
          if(m > 1&&m < 5){minutes +=' минуты '}else
            if(m >= 5){minutes +=' минут '}
  }else{minutes = ''}

  return date+hours+minutes
}
module.exports.dateToText = dateToText;
