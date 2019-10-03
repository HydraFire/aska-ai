import iconsole from '../interface/iconsole';
//
import Equalizer from './animation/Equalizer';
import { Kaleidoscope } from './animation/Kaleidoscope';
import Anime from './animation/Anime';
import shader from './shader-core';
import { shaderCloud } from './shaders/shaderCloud';
import { shaderSpace } from './shaders/shaderSpace';
import { shaderFractal00 } from './shaders/shaderFractal00';
import { shaderFractal01 } from './shaders/shaderFractal01';
import { shaderTemple } from './shaders/shaderTemple';


export default function graphicsStart( value ) {
  let lvl = 3;
  switch (value) {
    case 'shaderCloud':
      shader(shaderCloud, lvl)
      break;
    case 'shaderSpace':
      lvl = 2;
      shader(shaderSpace, lvl)
      break;
    case 'shaderFractal00':
      shader(shaderFractal00, lvl)
      break;
    case 'shaderFractal01':
      shader(shaderFractal01, lvl)
      break;
    case 'shaderTemple':
      shader(shaderTemple, lvl)
      break;
    case 'Equalizer':
      Equalizer();
      break;
    case 'Kaleidoscope':
      Kaleidoscope();
      break;
    case 'Anime':
      Anime();
      break;
    default:
      Equalizer();
      break;
  }
}
