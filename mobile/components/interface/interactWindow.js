import React, { Fragment } from 'react';
import socket from '../webSocketClient';
import { switchModeOnMute } from '../speechSynthesizer';
import '../../css/logo.css';

class InteractWindow extends React.Component {
  typeAska = () => {
    socket.send('speech_end','AUDIO');
    this.props.handlerInteractWindow(false);
  }
  typeLoogbook = (e) => {
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
          return <p key={v.name}><button value={v.value} alt={v.type} onClick={this.typeLoogbook}>{v.name}</button></p>
        })}
      </div>
    );
  }
  render() {
    return (
      <div className="interactWindow">
        <div className="interactWindow_center">
          {this.props.obj.text}
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}

export default InteractWindow;
// {this.myRender()}
