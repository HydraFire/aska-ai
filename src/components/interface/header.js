import React from 'react';
import pushNotification from '../pushNotification';
import '../../css/header.css';
// Подымаем эвент листенеры на книпки
function buttonStart() {
  const shaderButton = document.querySelectorAll('.shaderButton');
  shaderButton.forEach(v => v.addEventListener('click', (e) => {
    localStorage.shaderSelected = JSON.stringify({
      shader: true,
      effectName: e.target.textContent,
      option: 3
    });
  }));
  const canvasButton = document.querySelectorAll('.canvasButton');
  canvasButton.forEach(v => v.addEventListener('click', (e) => {
    localStorage.shaderSelected = JSON.stringify({
      shader: false,
      effectName: e.target.textContent,
      option: 3
    });
  }));
}
/*
function subscribeButton() {
  if (!localStorage.subscribeNotification) {
    localStorage.subscribeNotification = 'false';
  }
  if (localStorage.subscribeNotification === 'false') {
    return (<button id="subscribe" className="subscribeButton">subscribe</button>);
  }
  // return (<button id="unsubscribe" className="subscribeButton">unsubscribe</button>);
  return false;
}
*/
// /////////////////////////////////////////////////////////////////
class Header extends React.Component {
  componentDidMount() {
    buttonStart();
    pushNotification.subscribeBS();
  }
  render() {
    return (
      <div className="header">
        <strong className="logo">NERV.PRO</strong>
        <button className="shaderButton">shaderCloud</button>
        <button className="shaderButton">shaderSpace</button>
        <button className="shaderButton">shaderFractal00</button>
        <button className="shaderButton">shaderFractal01</button>
        <button className="shaderButton">shaderTemple</button>
        <button className="canvasButton">Equalizer</button>
        <button className="canvasButton">Kaleidoscope</button>
        <button className="canvasButton">Anime</button>
      </div>
    );
  }
}

export default Header;
