import React, { Fragment } from 'react';
import socket from '../webSocketClient';
import { switchModeOnMute } from '../speechSynthesizer';
import '../../css/logo.css';

let imgfilepath = 'http://localhost:6060/';

class InteractWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      triggerImgOrVideo: 'img',
      errStatus: 0,
      final: true
    };
  }
  componentDidMount() {
    if (this.state.final) {
      window.myconsole.log(`${imgfilepath}${this.props.obj.arr[0].value}`, 'chat');
      let img = document.createElement('img');
      img.src = `${imgfilepath}${this.props.obj.arr[0].value}.jpg`;
      img.addEventListener('error',() => {
        if (this.state.triggerImgOrVideo === 'img' && this.state.errStatus < 2) {
          this.changeFormatMedia('video', this.state.errStatus + 1);
        } else if (this.state.triggerImgOrVideo === 'video' && this.state.errStatus < 2) {
          this.changeFormatMedia('img', this.state.errStatus + 1);
        } else {
          this.changeFormatMedia('none', 0);
        }
      })
    }
  }
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
      socket.send(`я ${e.target.getAttribute('value')}`,'aska');
    } else if (e.target.getAttribute('alt') === 'negative') {
      socket.send(`я не хочу ${e.target.getAttribute('value')}`, 'aska');
    } else if (e.target.getAttribute('alt') === 'default') {
      socket.send(null, 'shortInterval');
    }
    this.props.handlerInteractWindow(false);
  }
  changeFormatMedia = (type, num) => {
    this.setState({
       triggerImgOrVideo: type,
       errStatus: num,
       final: false
    });
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
      <div className="interactWindow_bottom">
        {this.props.obj.arr.map((v, i) => {
          return <p key={v.name}><button value={v.value} alt={v.type} lol={this.props.obj.type} onClick={this[`${this.props.obj.type}`]}>{v.name}</button></p>
        })}
      </div>
    );
  }
  renderImageFromGallery = () => {
    if (this.state.triggerImgOrVideo === 'img') {
      return <img className="interactWindow_img" src={`${imgfilepath}${this.props.obj.arr[0].value}.jpg`} />;
    } else if (this.state.triggerImgOrVideo === 'video') {
      return <video loop autoPlay className="interactWindow_img" src={`${imgfilepath}${this.props.obj.arr[0].value}.mp4`} />
    } else {
      return <span>none</span>;
    }
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
// {this.myRender()}
