import React, { Fragment } from 'react';
import RC2 from 'react-chartjs2';
import socket from '../webSocketClient';
import { init } from './animation';
import { switchModeOnMute, askStateAskaHide } from '../speechSynthesizer';
import '../../css/logo.css';

let imgfilepath = 'http://localhost:6060/';
let triggerImgOrVideo = 'img';

let errStatus = 0;
let final = false;

function getMinOfArray(numArray) {
  numArray = numArray.map(v => v.y);
  return Math.min.apply(null, numArray);
}
function calcTicksMin(arr) {
  let minNumber = getMinOfArray(arr);
  minNumber = minNumber - ((minNumber/100) * 5);
  minNumber = (Math.round(minNumber * 10))/10;
  return minNumber;
}

function getMaxOfArray(numArray) {
  numArray = numArray.map(v => v.y);
  return Math.max.apply(null, numArray);
}
function calcTicksMax(arr) {
  let maxNumber = getMaxOfArray(arr);
  maxNumber = maxNumber + ((maxNumber/100) * 20);
  maxNumber = (Math.round(maxNumber * 10))/10;
  return maxNumber;
}
// ////////////////////////////////////////////////////////////////////////////
function formatDateMax() {
  const x = new Date();
  return `${x.getUTCMonth() + 1}/${x.getUTCDate()}/${x.getUTCFullYear()} ${x.getUTCHours()}:${x.getUTCMinutes()}`;
}
function formatDateMin(arr) {
  const x = new Date();
  let m = x.getUTCMonth();
  m < 1 ? m = 1 : '';
  return `${m}/${x.getUTCDate()}/${x.getUTCFullYear()} 00:00`;
}
function createChartOptions(data) {
  /*
  animation: {
      // Chart object
      duration: 2000,
      // Animation easing to use
      easing: 'easeInOutQuad',
  }
  */
  return {
        animation: false,
        legend: {
            display: false,
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              parser: 'MM/DD/YYYY HH:mm',
              max: formatDateMax(),
              min: formatDateMin(data.datasets[0].data)
            }
          }],
          yAxes: [{
            ticks:{
              min: calcTicksMin(data.datasets[0].data),
              max: calcTicksMax(data.datasets[0].data)
            }
          }]
    }
  };
}

class InteractWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      renderImgOrVideo: 'none'
    };
  }
  componentWillMount() {
    triggerImgOrVideo = 'img';
    final = false;
    this.lol();
  }
  work = () => {
    final = true;
    this.setState({
      renderImgOrVideo: triggerImgOrVideo
    });
  }
  test = () => {
      if (triggerImgOrVideo === 'img') {
        triggerImgOrVideo = 'video';
      } else if (triggerImgOrVideo === 'video') {
        final = true;
      }
      this.lol();
  }
  lol = () => {
    if (!final) {
      if (triggerImgOrVideo === 'img') {
        let img = document.createElement('img');
        img.src = `${imgfilepath}${this.props.obj.arr[0].value}.jpg`;
        img.onload = this.work;
        img.addEventListener('error', this.test, { once: true });
      } else if(triggerImgOrVideo === 'video') {
        let video = document.createElement('video');
        video.src = `${imgfilepath}${this.props.obj.arr[0].value}.mp4`;
        video.onloadeddata = this.work;
        video.addEventListener('error', this.test, { once: true });
      }
    }
  }

  /*
  componentWillUnmount() {
    img.removeEventListener('error', this.test );
  }
 */
  typeAska = () => {
    socket.send('speech_end','AUDIO');
    this.props.handlerInteractWindow(false);
    window.navigator.vibrate(100)
  }
  typeSwitchMuteMode = (e) => {
    if (e.target.getAttribute('alt') === 'MuteMode') {
      this.props.handlerInteractWindow(false);
      window.navigator.vibrate(100)
      //window.myconsole.log(e.target.getAttribute('value'));
      let value = e.target.getAttribute('value');
      value == 'true' ? value = true : value = false ;
      switchModeOnMute(value);
      init();
      socket.start();
    }
    //this.props.handlerInteractWindow(false);
  }
  typeAskMute = (e) => {
    switchModeOnMute(e.target.getAttribute('alt'));
    this.props.handlerInteractWindow(false);
    window.navigator.vibrate(100)
  }
  typeLifeCircles = (e) => {
    if (e.target.getAttribute('alt') === 'positive') {
      socket.send('speech_end','AUDIO');
      socket.send(`я ${e.target.getAttribute('value')}`,'aska');
    } else if (e.target.getAttribute('alt') === 'negative') {
      socket.send('speech_end','AUDIO');
      socket.send(`давай не сегодня ${e.target.getAttribute('value')}`, 'aska');
    } else if (e.target.getAttribute('alt') === 'default') {
      socket.send('speech_end','AUDIO');
      socket.send(null, 'shortInterval');
    }
    this.props.handlerInteractWindow(false);
    window.navigator.vibrate(100)
  }

  typeSimpleQuest = (e) => {
    if (e.target.getAttribute('alt') === 'positive') {
      socket.send('speech_end','AUDIO');
      socket.send(`ясно понятно ${e.target.getAttribute('value')}`,'aska');
    } else if (e.target.getAttribute('alt') === 'negative') {
      socket.send('speech_end','AUDIO');
      socket.send(`перенеси ${e.target.getAttribute('value')}`, 'aska');
    } else if (e.target.getAttribute('alt') === 'default') {
      socket.send('speech_end','AUDIO');
      socket.send(null, 'shortInterval');
    }
    this.props.handlerInteractWindow(false);
    window.navigator.vibrate(100)
  }
  /*
  changeFormatMedia = (type, num) => {
    console.log('changeFormatMedia');

  }
  */
  renderChart = () => {
    //console.log(this.props.obj.arr[0].chartData);
    if (this.props.obj.arr[0].chartData && this.state.renderImgOrVideo === 'none') {
      return (
        <div className="interactWindow_chart">
          <RC2 width={360} height={300} data={this.props.obj.arr[0].chartData} options={createChartOptions(this.props.obj.arr[0].chartData)} type="line" />
        </div>
      );
    }
  }
  renderButtons = () => {
    if (this.props.obj.type == 'aska') {
      return (
        <div className="interactWindow_bottom">
          <button onClick={this.typeAska}>ok</button>
        </div>
      );
    }
    return (
      <Fragment>
        {this.renderChart()}
        <div className="interactWindow_bottom">
          {this.props.obj.arr.map((v, i) => {
            return <p key={v.name}><button value={v.value} alt={v.type} lol={this.props.obj.type} onClick={this[`${this.props.obj.type}`]}>{v.name}</button></p>
          })}
        </div>
      </Fragment>
    );
  }
  renderImageFromGallery = () => {
    if (this.state.renderImgOrVideo === 'img') {
      return <img className="interactWindow_img" src={`${imgfilepath}${this.props.obj.arr[0].value}.jpg`} />;
    } else if (this.state.renderImgOrVideo === 'video') {
      if (askStateAskaHide()) {
        return <video muted autoPlay className="interactWindow_img" src={`${imgfilepath}${this.props.obj.arr[0].value}.mp4`} />
      }
      return <video autoPlay className="interactWindow_img" src={`${imgfilepath}${this.props.obj.arr[0].value}.mp4`} />
    }
    return <span></span>;
  }


  render() {
    return (
      <div className="interactWindow">
        <div className="interactWindow_center">
          {this.props.obj.text}
        </div>
        <div className="interactWindow_img">
          {this.renderImageFromGallery()}
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}

export default InteractWindow;
