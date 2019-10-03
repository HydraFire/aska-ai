import React, { Fragment } from 'react';

import '../../css/interactWindow.css';

class InteractWindow extends React.Component {
  constructor() {
    super();
  }
  work = () => {}


  typeAskMute = (e) => {
    switchModeOnMute(e.target.getAttribute('alt'));
    this.props.handlerInteractWindow(false);
  }
  render() {
    return (
      <div className="interactWindow">
        <div className="interactWindow_bottom">
          {this.props.arr.map((v, i) => {
            return <p key={v}><button value={v} alt={v} onClick={this.props.metod}>{v}</button></p>
          })}
        </div>
      </div>
    );
  }
}

export default InteractWindow;
