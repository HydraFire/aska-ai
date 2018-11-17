import React, { Fragment } from 'react';
import socket from '../webSocketClient';
import { switchModeOnMute } from '../speechSynthesizer';
import '../../css/logo.css';

class InteractWindow extends React.Component {
  constructor() {
    super();
    this.state = {
      triggerImgOrVideo: false
    };
  }
  testData = () => {
    let video = document.createElement('img');
    video.src = URL.createObjectURL(this.props.binaryData);
    video.addEventListener('error',() => {
      console.log('ALLOY');
      this.videoPick(true);
    })
  }
  videoPick = (boolean) => {
    if (!boolean) {
      if (this.state.triggerImgOrVideo != false) {
        this.setState({
           triggerImgOrVideo: false
        });
      }
    } else {
      if (this.state.triggerImgOrVideo != true) {
        this.setState({
           triggerImgOrVideo: true
        });
      }
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
  typeAskMute = (e) => {
    switchModeOnMute(e.target.getAttribute('alt'));
    this.props.handlerInteractWindow(false);
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
  if (this.props.binaryData) {
    this.testData();
      if (this.state.triggerImgOrVideo) {
        return <video loop autoPlay className="interactWindow_img" src={URL.createObjectURL(this.props.binaryData)} />
      } else {
        return <img className="interactWindow_img" src={URL.createObjectURL(this.props.binaryData)} />;
      }
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
