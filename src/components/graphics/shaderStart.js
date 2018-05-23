import shader from './shader-core';

import { shaderCloud } from './shaders/shaderCloud';
import { shaderSpace } from './shaders/shaderSpace';
import { shaderFractal00 } from './shaders/shaderFractal00';
import { shaderFractal01 } from './shaders/shaderFractal01';
import { shaderTemple } from './shaders/shaderTemple';


const shaderStart = function shaderStart(options) {
  let string = '';
  let lvl = 3;
  switch (options.effectName) {
    case 'shaderCloud':
      string = shaderCloud;
      break;
    case 'shaderSpace':
      string = shaderSpace;
      lvl = 2;
      break;
    case 'shaderFractal00':
      string = shaderFractal00;
      break;
    case 'shaderFractal01':
      string = shaderFractal01;
      break;
    case 'shaderTemple':
      string = shaderTemple;
      break;
    default:
      string = shaderSpace;
      break;
  }
  // Запуск шейдера
  shader(string, lvl);
};

export default shaderStart;
