import React, { Fragment } from 'react';
import RC2 from 'react-chartjs2';
import socket from '../webSocketClient';
import { switchModeOnMute, askStateAskaHide } from '../speechSynthesizer';
import '../../css/logo.css';

let imgfilepath = 'http://localhost:6060/';
let triggerImgOrVideo = 'img';

let errStatus = 0;
let final = false;

function formatDateMax() {
  const x = new Date();
  return `${x.getUTCMonth() + 1}/${x.getUTCDate()+1}/${x.getFullYear()} 00:00`;
}
function formatDateMin() {
  const x = new Date();
  let m = x.getUTCMonth() - 1;
  m < 1 ? m = 1 : '';
  return `${m}/${x.getUTCDate()}/${x.getFullYear()} 00:00`;
}

let chartOptions = {
      animation: {
          // Chart object
          duration: 2000,
          // Animation easing to use
          easing: 'easeInOutQuad',
      },
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
            min: formatDateMin()
          }
        }],
        yAxes: [{
          ticks: {
            source:'data'
          }
        }]
  }
};

class InteractWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      renderImgOrVideo: 'none',
      errStatus: 0
    };
  }

  componentWillMount() {
    triggerImgOrVideo = 'img';
    final = false;
    this.lol();
  }
  work = () => {
    console.log('work '+triggerImgOrVideo);
    final = true;
    this.setState({
      renderImgOrVideo: triggerImgOrVideo,
      errStatus: 0
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
    console.log('alo '+final);
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
  }
  typeSwitchMuteMode = (e) => {
    if (e.target.getAttribute('alt') === 'MuteMode') {
      this.props.handlerInteractWindow(false);
      window.myconsole.log(e.target.getAttribute('value'));
      let value = e.target.getAttribute('value');
      value == 'true' ? value = true : value = false ;
      switchModeOnMute(value);
      socket.start();
    }
    //this.props.handlerInteractWindow(false);
  }
  typeAskMute = (e) => {
    switchModeOnMute(e.target.getAttribute('alt'));
    this.props.handlerInteractWindow(false);
  }
  typeLifeCircles = (e) => {
    if (e.target.getAttribute('alt') === 'positive') {
      socket.send('speech_end','AUDIO');
      socket.send(`я ${e.target.getAttribute('value')}`,'aska');
    } else if (e.target.getAttribute('alt') === 'negative') {
      socket.send('speech_end','AUDIO');
      socket.send(`давай не сегодня ${e.target.getAttribute('value')}`, 'aska');
    } else if (e.target.getAttribute('alt') === 'default') {
      socket.send(null, 'shortInterval');
    }
    this.props.handlerInteractWindow(false);
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
          <RC2 width={360} height={300} data={this.props.obj.arr[0].chartData} options={chartOptions} type="line" />
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
