const fs = require('fs');

function dateFormated(d) {
  const objData = new Date(d);
  return `${objData.getMonth() + 1}/${objData.getDate()}/${objData.getFullYear()} ${objData.getHours()}:${objData.getMinutes()}`;
}

function difference(a, b) {
  return Math.abs((a - b) / 100000000 | 0);
}
function QuestVictory() {
  const arr = JSON.parse(fs.readFileSync('./data/QuestVictoryData.json'));
  const data = arr.map((v, i) => {
    let diffpar = arr[i + 1];
    !diffpar ? diffpar = arr[i] : '';
    return { x: dateFormated(v.info), y: difference(v.info, diffpar.info) };
  });
  return {
    label: 'QuestVictory',
    data,
    borderColor: 'rgb(200, 150, 100)',
    type: 'line'
  };
}

function QuestPlan() {
  const arr = JSON.parse(fs.readFileSync('./data/QuestData.json'));
  const data = arr.map((v, i) => {
    let diffpar = arr[i + 1];
    !diffpar ? diffpar = arr[i] : '';
    return { x: dateFormated(v.startDate), y: difference(v.startDate, diffpar.startDate) };
  });
  return {
    label: 'QuestPlan',
    data,
    borderColor: 'rgb(100, 200, 100)',
    type: 'line'
  };
}
function logBookData() {
  const arr = JSON.parse(fs.readFileSync('./data/LogBook.json'));
  const data = arr.map((v, i) => {
    let diffpar = arr[i + 1];
    !diffpar ? diffpar = arr[i] : '';
    return { x: dateFormated(v.date), y: (difference(v.date, diffpar.date)*2) };
  });
  return {
    label: 'LogBook',
    data,
    backgroundColor: 'rgb(100, 150, 200)',
    type: 'bar'
  };
}

function LifeCirclePart(element) {
  const data = element.incident.map((v, i) => {
    let diffpar = element.incident[i - 1];
    !diffpar ? diffpar = v : '';
    return { x: dateFormated(v), y: difference(diffpar, v) };
  });
  return {
    label: element.words[0],
    data,
    borderColor: 'rgb(10, 10, 10)',
    type: 'line'
  };
}
// /////////////////////////////////////////////////////////////////////////////
function chartLoad() {
  const arr = JSON.parse(fs.readFileSync('./data/LifeCirclesData.json'));
  const logbookdata = JSON.parse(fs.readFileSync('./data/LogBook.json'));
  const datasets = [];
  datasets.push(logBookData());
  datasets.push(QuestVictory());
  datasets.push(QuestPlan());
  arr.forEach(v => datasets.push(LifeCirclePart(v)));
  return { datasets, logbookdata };
}

module.exports.chartLoad = chartLoad;
// /////////////////////////////////////////////////////////////////////////////
/*
const this_real_time = function(){
  var objData = new Date();
  var year = objData.getFullYear()
  var month = objData.getMonth();
  var date = objData.getDate();
  var hours = objData.getHours();
  var minutes = objData.getMinutes();
  return [year,month+1,date,hours,minutes]
}
if(!localStorage.line_color_0){
  localStorage.line_color_0 = 'rgb(75, 192, 192)'
  localStorage.line_color_1 = 'rgb(192, 75, 192)'
  localStorage.line_color_2 = 'rgb(192, 192, 75)'
  localStorage.line_color_3 = 'rgb(75, 75, 192)'
  localStorage.line_color_4 = 'rgb(75, 192, 75)'
  localStorage.line_color_5 = 'rgb(192, 75, 75)'
}


const calc_time_difference = function(arr_time_x,arr_real_time){


  const int_day_in_month = function(iu){
  let arr_month = [0,0,31,59,90,120,151,181,212,243,273,304,334,365]
  var ii = 0
  arr_month.map((v,index)=>{if(index == iu){ ii = v}})
  return ii
  }
  const int_day_in_year = function(v){
  switch(v) {
  case 2016:  v = 0; break;
  case 2017:  v = 365; break;
  case 2018:  v = 365+365; break;
  case 2019:  v = 365+365+365; break;
  case 2020:  v = 365+365+365+365; break;
  }
  return v
  }
  let v1 = int_day_in_month(arr_time_x[1])
  let v0 = int_day_in_year(arr_time_x[0])
  let the_magic_begin = (v0*24*60)+(v1*24*60)+(arr_time_x[2]*24*60)+(arr_time_x[3]*60)+arr_time_x[4];
  v1 = int_day_in_month(arr_real_time[1])
  v0 = int_day_in_year(arr_real_time[0])
  var symaDate = (v0*24*60)+(v1*24*60)+(arr_real_time[2]*24*60)+(arr_real_time[3]*60)+arr_real_time[4]
  symaDate = symaDate - the_magic_begin;
  return symaDate
}



//////////////////////////////////////////////////////////////////////
const preparing_data = function(arr){
  let arr_corect = []
  arr.forEach((v)=>arr_corect.push(v[1]+'/'+v[2]+'/'+v[0]+' '+v[3]+':'+v[4]))
  console.log(arr_corect)

  let arr_x = []
  for(i=0;i<arr.length-1;i++){
    arr_x.push(calc_time_difference(arr[i],arr[i+1]))
  }
  // arr_x.push(calc_time_difference(arr[arr_json.length-1],this_real_time()));
  console.log(arr_x);


  let arr_with_objects = []
  arr_corect.forEach((v,i)=>{
    let obj_test = {
    x: v,
    y: arr_x[i-1]
    }
    arr_with_objects.push(obj_test)
  })
  console.log(arr_with_objects)
  return arr_with_objects
}



let time_to_string = ''
let lasttime = this_real_time()
time_to_string = lasttime[1]+'/'+lasttime[2]+'/'+lasttime[0]+' '+lasttime[3]+':'+lasttime[4]



var timeFormat = 'MM/DD/YYYY HH:mm';
function newDate(days) {
  return moment().add(days, 'd').toDate();
}
function newDateString(days) {
  return moment().add(days, 'd').format(timeFormat);
}
function newTimestamp(days) {
  return moment().add(days, 'd').unix();
}
console.log(newDateString(15))
var color = Chart.helpers.color;
var config = {
type: 'line',
data: {
datasets: [{
label: "болит_голова",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: 'rgb(192, 75, 75)',
fill: false,
data: preparing_data(arr_0)
},{
label: "был_у_врача",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_0,
fill: false,
data: preparing_data(arr_1)
},{
label: "видел_андрея",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_1,
fill: false,
data: preparing_data(arr_2)
},{
label: "видел_илью",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_2,
fill: false,
data: preparing_data(arr_3)
},{
label: "видел_саню",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_3,
fill: false,
data: preparing_data(arr_4)
},{
label: "выпил_сок",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_4,
fill: false,
data: preparing_data(arr_5)
},{
label: "выполнил_медитацию",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_5,
fill: false,
data: preparing_data(arr_6)
},{
label: "выходил_бегать",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_6,
fill: false,
data: preparing_data(arr_7)
},{
label: "делаю_уборку",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_7,
fill: false,
data: preparing_data(arr_8)
},{
label: "еду_к_родителям",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_8,
fill: false,
data: preparing_data(arr_9)
},{
label: "купил_пиво",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_9,
fill: false,
data: preparing_data(arr_10)
},{
label: "полил_цветы",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_10,
fill: false,
data: preparing_data(arr_11)
},{
label: "прочитал_статью",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_12)
},{
label: "сделал_зарядку",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_13)
},{
label: "сегодня_постричься",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_14)
},{
label: "сел_писать",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_15)
},{
label: "скурил_банку",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_16)
},{
label: "тренировка_мозга",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_17)
},{
label: "увидел_твою_красоту",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_18)
},{
label: "чистил_зубы",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_19)
},{
label: "дневник",
backgroundColor: 'rgb(3, 3, 3)',
borderColor: localStorage.line_color_11,
fill: false,
data: preparing_data(arr_20)
}]
},
options: {
title:{
text: "Chart.js Time Scale"
},
scales: {
xAxes: [{
type: "time",
time: {
format: timeFormat,
max:time_to_string,
tooltipFormat: 'll HH:mm'
},
scaleLabel: {
display: true,
labelString: 'Date'
}
}, ],
yAxes: [{
scaleLabel: {
display: true,
labelString: 'value',
}
}]
},
}
};

var ctx2 = document.getElementById("myChart").getContext("2d");
ctx2.width = 1920
ctx2.height = 1080
window.myLine = new Chart(ctx2, config);

// window.myLine.update();

document.getElementById("myChart").onclick = function(evt){
    var activePoints = window.myLine.getElementsAtEvent(evt);
	  if(activePoints.length > 0){
      var clickedElementindex = activePoints[0]["_index"];
	    var label = window.myLine.getDatasetAtEvent(evt);
		  console.log(clickedElementindex)
      console.log(label[clickedElementindex])
      console.log('20')
      if(label[clickedElementindex]._datasetIndex == 20){
        socket.send('дневник страница '+label[clickedElementindex]._index)
      }
   }
}
*/
