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
      let year = r.getFullYear();
      let month = r.getMonth() + 1;
      const date = r.getDate();
      let sayDate = parseFloat(arr[i - 1]);
      if (sayDate <= date) {
        month += 1;
      }
      if (month > 12) {
        month -= 12;
        year += 1;
      }
      month < 10 ? month = `0${month}` : '';
      sayDate < 10 ? sayDate = `0${sayDate}` : '';
      return `${year}-${month}-${sayDate}T`;
    }
  },
  {
    value: ['сегодня', 'через'],
    func: () => {
      const r = new Date();
      let month = r.getMonth() + 1;
      month < 10 ? month = `0${month}` : '';
      let day = r.getDate();
      day < 10 ? day = `0${day}` : '';
      return `${r.getFullYear()}-${month}-${day}T`;
    }
  },
  {
    value: ['завтра'],
    func: () => {
      const r = new Date(Date.now() + (24 * 60 * 60 * 1000));
      let month = r.getMonth() + 1;
      month < 10 ? month = `0${month}` : '';
      let day = r.getDate();
      day < 10 ? day = `0${day}` : '';
      return `${r.getFullYear()}-${month}-${day}T`;
    }
  },
  {
    value: ['послезавтра'],
    func: () => {
      const r = new Date(Date.now() + (48 * 60 * 60 * 1000));
      let month = r.getMonth() + 1;
      month < 10 ? month = `0${month}` : '';
      let day = r.getDate();
      day < 10 ? day = `0${day}` : '';
      return `${r.getFullYear()}-${month}-${day}T`;
    }
  },
  {
    value: ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'],
    func: (i, daySay) => {
      let dif = 0;
      const day = new Date().getDay();
      let month;
      let date;

      if (day < daySay) {
        dif = daySay - day;
      } else {
        dif = (7 - day) + daySay;
      }
      const r = new Date(Date.now() + (dif * 24 * 60 * 60 * 1000));
      month = r.getMonth() + 1;
      month < 10 ? month = `0${month}` : '';
      date = r.getDate();
      date < 10 ? date = `0${date}` : '';
      return `${r.getFullYear()}-${month}-${date}T`;
    }
  },
  {
    value: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля','августа','сентября','октября','ноября','декабря'],
    func: (i, monthSay) => {
      const r = new Date();

      let year = r.getFullYear();
      let month = monthSay + 1;
      let date = parseFloat(arr[i - 1]);

      let monthNow = r.getMonth() + 1;
      let dateNow = 2;

      console.log(' '+month+' '+monthNow+' '+(month < monthNow));
      console.log(' '+date+' '+dateNow+' '+(date < dateNow));

      if (month < monthNow) {
        year = year + 1;
      }
      if (month == monthNow && date < dateNow) {
        year = year + 1;
      }



      month < 10 ? month = `0${month}` : '';
      date < 10 ? date = `0${date}` : '';
      console.log(`${year}-${month}-${date}T`);
      return `${year}-${month}-${date}T`;
    }
  }];
  // ///////////////////////////////////////////////////////////////////////////
  arr.forEach((v, i) => {
    arrmain.forEach((w) => {
      w.value.forEach((objValue, iv) => {
        // console.log(`${v} == ${objValue}`);
        if (v === objValue) {
          strEnd = w.func(i, iv);
        }
      });
    });
  });
  console.log(`translateDate = ${strEnd}`);
  return strEnd;
};
module.exports.searchDate = searchDate;
// /////////////////////////////////////////////////////////////////////////////
function searchDouble(str) {
  let z = 0;
  str.includes('Z') ? z += 1 : '';
  const f = str.search('Z');
  str = str.substring(f + 1, str.length);
  str.includes('Z') ? z += 1 : '';
  z == 2 ? z = true : z = false;
  return z;
}
// //////////////////////////////////////////////////////////////////////////////
const searchTime = function searchTime(str) {
  let simple = true;
  let strEnd = false;
  const arr = str.split(' ');
  // ///////////////////////
  const newmain = [{
    value: ['час', 'часа'],
    func: (ii) => {
      let dif = parseFloat(arr[ii - 1]);
      isNaN(dif) ? dif = 1 : '';
      const r = new Date(Date.now() + (dif * 60 * 60 * 1000));
      let hour = r.getHours();
      let minute = r.getMinutes();
      hour < 10 ? hour = `0${hour}` : '';
      minute < 10 ? minute = `0${minute}` : '';
      return `${hour}:${minute}:00.000Z`;
    }
  },
  {
    value: ['полчаса'],
    func: () => {
      const r = new Date(Date.now() + (30 * 60 * 1000));
      let hour = r.getHours();
      let minute = r.getMinutes();
      hour < 10 ? hour = `0${hour}` : '';
      minute < 10 ? minute = `0${minute}` : '';
      return `${hour}:${minute}:00.000Z`;
    }
  },
  {
    value: ['минут'],
    func: (ii) => {
      const dif = parseFloat(arr[ii - 1]);
      const r = new Date(Date.now() + (dif * 60 * 1000));
      let hour = r.getHours();
      let minute = r.getMinutes();
      hour < 10 ? hour = `0${hour}` : '';
      minute < 10 ? minute = `0${minute}` : '';
      return `${hour}:${minute}:00.000Z`;
    }
  }];
  // //////////////////////////
  const arrmain = [{
    value: ['через'],
    func: () => {
      let answer = '';
      arr.forEach((v, i) => {
        newmain.forEach((w) => {
          w.value.forEach((objValue) => {
            // console.log(`${v} == ${objValue}`);
            if (v === objValue) {
              answer += w.func(i);
            }
          });
        });
      });
      if (searchDouble(answer)) {
        let hours1 = parseFloat(answer.split(':')[0]);
        let minutes1 = parseFloat(answer.split(':')[1]);
        let hours2 = parseFloat(answer.split(':')[2].split('Z')[1]);
        let minutes2 = parseFloat(answer.split(':')[3]);

        hours2 > new Date().getHours() ? hours1 += 1 : '';
        hours1 < 10 ? hours1 = `0${hours1}` : '';
        minutes2 < 10 ? minutes2 = `0${minutes2}` : '';
        answer = `${hours1}:${minutes2}:00.000Z`;
      }
      if (answer == '') {
        answer = false;
      }
      return answer;
    }
  },
  {
    value: ['дня', 'вечера'],
    func: () => {
      const [time] = arr.filter(v => v.includes(':'));
      let hours = parseFloat(time.split(':')[0]) + 12;
      hours < 10 ? hours = `0${hours}` : '';
      return `${hours}:${time.split(':')[1]}:00.000Z`;
    }
  }
  ];

  arr.forEach((v, i) => {
    arrmain.forEach((w) => {
      w.value.forEach((objValue, iv) => {
        // console.log(`${v} == ${objValue}`);
        if (v === objValue) {
          simple = false;
          strEnd = w.func(i, iv);
        }
      });
    });
  });

  if (simple) {
    [strEnd] = arr.filter(v => v.includes(':'));
    if (strEnd !== undefined) {
      const a = strEnd.split(':')[0];
      parseFloat(a) < 10 ? strEnd = `0${strEnd}` : '';
      strEnd += ':00.000Z';
    } else {
      strEnd = false;
    }
  }
  console.log(`translateTime = ${strEnd}`);
  return strEnd;
};
module.exports.searchTime = searchTime;
// /////////////////////////////////////////////////////////////////////////////
function normalizeTimeZone( v ) {
  let a = new Date();
  a = a.getTimezoneOffset() * 60000;
  return v + a;
}
module.exports.normalizeTimeZone = normalizeTimeZone;
// /////////////////////////////////////////////////////////////////////////////
function dateToText_to_e( n ) {
  return [
    'первое',
    'второе',
    'третье',
    'четвертое',
    'пятое',
    'шестое',
    'седьмое',
    'восьмое',
    'девятое',
    'десятое',
    'одиннадцатое',
    'двенадцатое',
    'тринадцатое',
    'четырнадцатое',
    'пятнадцатое',
    'шестнадцатое',
    'семнадцатое',
    'восемнадцатое',
    'девятнадцатое',
    'двадцатое',
    'двадцать первое',
    'двадцать второе',
    'двадцать третье',
    'двадцать четвертое',
    'двадцать пятое',
    'двадцать шестое',
    'двадцать седьмое',
    'двадцать восьмое',
    'двадцать девятое',
    'тридцатое',
    'тридцать первое'][n];
}
module.exports.dateToText = dateToText;
