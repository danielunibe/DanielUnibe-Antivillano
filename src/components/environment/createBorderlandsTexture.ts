import * as THREE from 'three';

export const createBorderlandsTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 768);
    const yellow = '#F2D019';
    const red = '#b81d13';
    const black = '#000000';

    ctx.fillStyle = red;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 768, Math.random() * 60, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = black;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(256, 384, 160, 0.2 * Math.PI, 1.25 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = yellow;
    ctx.beginPath();
    ctx.moveTo(256, 240);
    ctx.lineTo(360, 480);
    ctx.lineTo(152, 480);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = black;
    ctx.lineWidth = 4;
    for (let i = 0; i < 30; i += 1) {
      const x = Math.random() * 512;
      const y = Math.random() * 768;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y + 10);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = black;
    ctx.font = '900 70px "Teko"';
    ctx.save();
    ctx.translate(256, 160);
    ctx.rotate(-0.1);
    ctx.fillText('DO NOT ENTER', 0, 0);
    ctx.restore();

    ctx.fillStyle = yellow;
    ctx.font = '900 90px "Teko"';
    ctx.fillText('PANDORA', 256, 680);

    ctx.strokeStyle = red;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(100, 650);
    ctx.lineTo(412, 650);
    ctx.stroke();

    ctx.font = '900 50px "Teko"';
    ctx.fillStyle = red;
    ctx.fillText('IIII-II', 100, 100);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
