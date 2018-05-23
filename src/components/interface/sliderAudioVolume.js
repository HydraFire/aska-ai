import React from 'react';
/* eslint-disable */
import '../../css/sliderAudioVolume.css';

function start() {
	const audio = document.querySelector('#audio');
	const speed = document.querySelector('.speed');
	const bar = speed.querySelector('.speed-bar');
	const navCoords = speed.getBoundingClientRect();

	let isClicked = false;
	if (localStorage.audioVolume) {
		bar.style.height = `${100-(localStorage.audioVolume*100)}%`;
		bar.textContent = localStorage.audioVolume;
	} else {
		localStorage.audioVolume = 0.5;
		bar.style.height = `${100-(localStorage.audioVolume*100)}%`;
		bar.textContent = localStorage.audioVolume;
	}

	audio.volume = localStorage.audioVolume;

	function handleMove(e){
	  if(isClicked){
			let y = e.pageY - navCoords.top + 1;
			let shkala = navCoords.bottom - navCoords.top;
			let procent = y / shkala * 100 | 0;
      bar.style.height = procent + '%';
			procent = (100 - procent)/100;
      bar.textContent = procent;
			audio.volume = procent;
      localStorage.audioVolume = procent;
	  }
	}
	function handleClickDown(e){
	  e.preventDefault();
	  isClicked = true;
	}
	function handleClickUp(e){
	  e.preventDefault();
	  isClicked = false;
	}

	speed.addEventListener('mousemove', handleMove);
	speed.addEventListener('mousedown', handleClickDown);
	speed.addEventListener('mouseup', handleClickUp);
	speed.addEventListener('mouseleave', handleClickUp);
};

class sliderAudioVolume extends React.Component {
	componentDidMount() {
    start();
  }
	render() {
    return (
			<div className="wrapper">
	      <div className="speed">
	        <div className="speed-bar">0.2</div>
	      </div>
	    </div>
		)
	}
}
export default sliderAudioVolume;
