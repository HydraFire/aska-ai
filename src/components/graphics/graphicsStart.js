import iconsole from '../interface/iconsole';
// Create Shader
import shaderStart from './shaderStart';
import canvasGraphics from './canvasStart';

function graphicsStart() {
  function checkOptions() {
    if (localStorage.shaderSelected) {
      try {
        JSON.parse(localStorage.shaderSelected);
      } catch (e) {
        iconsole.logC('JSON.parse ERROR');
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  function refresh() {
    if (!checkOptions()) {
      const obj = {
        shader: false,
        effectName: 'Equalizer',
        option: 3
      };
      localStorage.shaderSelected = JSON.stringify(obj);
      return obj;
    }
    return JSON.parse(localStorage.shaderSelected);
  }


  const options = refresh();
  iconsole.logC(options);
  if (options.shader) {
    shaderStart(options);
  } else {
    canvasGraphics(options);
  }
}

export default graphicsStart;
