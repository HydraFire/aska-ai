import React, { Fragment } from 'react';
import socket from '../webSocketClient';
import '../../css/logo.css';

class InteractWindow extends React.Component {
  typeAska = () => {
    socket.send('speech_end','AUDIO');
    this.props.handlerInteractWindow(false);
  }
  typeLoogbook = (e) => {
    socket.send(e.target.getAttribute('alt'),'expClick');
    socket.send('speech_end','AUDIO');
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
          return <p key={v.name}><button alt={i} onClick={this.typeLoogbook}>{v.name} {`${v.value}%`}</button></p>
        })}
        <p key="ok"><button onClick={this.typeAska}>ok</button></p>
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
