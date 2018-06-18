import { getMessageArr } from '../components/interface/displayCanvasMessage';

function printText(ctx) {
  // ctx.globalCompositeOperation = 'soft-light';
  ctx.globalCompositeOperation = 'exclusion';
  ctx.font = '60px serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('ASKA', 360 / 2, 80);

  ctx.font = '15px sans-serif';
  getMessageArr().forEach((v, i) => {
    if (i < 38) {
      let x = 0;
      if (v.left) {
        ctx.textAlign = 'right';
        x = 350;
      } else {
        ctx.textAlign = 'left';
        x = 10;
      }
      ctx.fillText(v.text, x, 690 - (i * 15));
    }
  });
}
export default printText;
