import React, { Fragment } from 'react';
import fileType from 'file-type';
import socket from '../webSocketClient';
import { switchModeOnMute } from '../speechSynthesizer';
import '../../css/logo.css';

class InteractWindow extends React.Component {
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
  console.log('renderImageFromGallery');
  if (this.props.obj.filedata) {
      const bytes = new Uint8Array(this.props.obj.filedata.data.data);
      const blob = new Blob([bytes.buffer]);
      if (this.props.obj.filedata.type === 'video') {
        return <video loop autoPlay className="interactWindow_img" src={URL.createObjectURL(blob)} />
      } else {
        return <img className="interactWindow_img" src={URL.createObjectURL(blob)} />;
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
