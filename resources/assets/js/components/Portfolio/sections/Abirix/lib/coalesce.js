import DetectBrowser from '../../../../../services/DetectBrowser';
import { angle, cos, fadeInOut, HALF_PI, lerp, rand, sin } from '../../common/util';

const particleCount = 75;
const particlePropCount = 9;
const particlePropsLength = particleCount * particlePropCount;
const baseTTL = 100;
const rangeTTL = 500;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseSize = 2;
const rangeSize = 10;
const baseHue = 10;
const rangeHue = 100;
const backgroundColor = 'hsla(60, 50%, 3%, 1)';

/* eslint-disable no-unused-vars */
let container;
let canvas;
let ctx;
let center;
let tick;
let particleProps;
/* eslint-enable */

const initParticles = () => {
  tick = 0;
  particleProps = new Float32Array(particlePropsLength);

  for (let i = 0; i < particlePropsLength; i += particlePropCount) {
    initParticle(i);
  }
};

const initParticle = i => {
  let theta;
  let x;
  let y;
  let vx;
  let vy;
  let life;
  let ttl;
  let speed;
  let size;
  let hue;

  const { width, height } = canvas.a;

  x = rand(width);
  y = rand(height);

  theta = angle(x, y, center[0], center[1]);

  vx = cos(theta) * 6;
  vy = sin(theta) * 6;

  life = 0;

  ttl = baseTTL + rand(rangeTTL);
  speed = baseSpeed + rand(rangeSpeed);
  size = baseSize + rand(rangeSize);
  hue = baseHue + rand(rangeHue);

  particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i);
};

const drawParticles = () => {
  for (let i = 0; i < particlePropsLength; i += particlePropCount) {
    updateParticle(i);
  }
};

const updateParticle = i => {
  const i2 = 1 + i;
  const i3 = 2 + i;
  const i4 = 3 + i;
  const i5 = 4 + i;
  const i6 = 5 + i;
  const i7 = 6 + i;
  const i8 = 7 + i;
  const i9 = 8 + i;

  let x;
  let y;
  let theta;
  let vx;
  let vy;
  let life;
  let ttl;
  let speed;
  let x2;
  let y2;
  let size;
  let hue;

  x = particleProps[i];
  y = particleProps[i2];

  theta = angle(x, y, center[0], center[1]) + 0.75 * HALF_PI;

  vx = lerp(particleProps[i3], 2 * cos(theta), 0.05);
  vy = lerp(particleProps[i4], 2 * sin(theta), 0.05);

  life = particleProps[i5];
  ttl = particleProps[i6];
  speed = particleProps[i7];

  x2 = x + vx * speed;
  y2 = y + vy * speed;
  size = particleProps[i8];
  hue = particleProps[i9];

  drawParticle(x, y, theta, life, ttl, size, hue);

  life++;

  particleProps[i] = x2;
  particleProps[i2] = y2;
  particleProps[i3] = vx;
  particleProps[i4] = vy;
  particleProps[i5] = life;

  life > ttl && initParticle(i);
};

const drawParticle = (x, y, theta, life, ttl, size, hue) => {
  const xRel = x - 0.5 * size;
  const yRel = y - 0.5 * size;

  ctx.a.save();

  ctx.a.lineCap = 'round';
  ctx.a.lineWidth = 1;
  ctx.a.strokeStyle = `hsla(${hue}, 100%, 60%, ${fadeInOut(life, ttl)})`;

  ctx.a.beginPath();
  ctx.a.translate(xRel, yRel);
  ctx.a.rotate(theta);
  ctx.a.translate(-xRel, -yRel);
  ctx.a.strokeRect(xRel, yRel, size, size);
  ctx.a.closePath();
  ctx.a.restore();
};

const createCanvas = () => {
  container = document.querySelector('.content--canvas-abirix');
  canvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas'),
  };

  canvas.b.style = `
		position: fixed;
		left: 0;
		width: 100%;
	`;

  container.appendChild(canvas.b);

  ctx = {
    a: canvas.a.getContext('2d'),
    b: canvas.b.getContext('2d'),
  };
  center = [];
};

const resize = () => {
  const { innerWidth, innerHeight } = window;

  if (canvas && canvas.a) {
    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;
  }

  ctx && ctx.a && ctx.a.drawImage(canvas.b, 0, 0);

  if (canvas && canvas.b) {
    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;
  }

  ctx && ctx.b && ctx.b.drawImage(canvas.a, 0, 0);

  if (canvas && canvas.a) {
    const { width, height } = canvas.a;

    center[0] = 0.5 * width;
    center[1] = 0.5 * height;
  }
};

const renderGlow = () => {
  ctx.b.save();

  !DetectBrowser.isFirefox() && (ctx.b.filter = 'blur(8px) brightness(200%)');

  ctx.b.globalCompositeOperation = 'lighter';

  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
  ctx.b.save();

  !DetectBrowser.isFirefox() && (ctx.b.filter = 'blur(4px) brightness(200%)');

  ctx.b.globalCompositeOperation = 'lighter';

  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
};

const render = () => {
  ctx.b.save();

  ctx.b.globalCompositeOperation = 'lighter';

  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
};

const draw = () => {
  if (!ctx) return;

  tick++;

  const { width, height } = canvas.a;

  ctx.a.clearRect(0, 0, width, height);

  ctx.b.fillStyle = backgroundColor;
  ctx.b.fillRect(0, 0, width, height);

  drawParticles();
  renderGlow();
  render();

  window.requestAnimationFrame(draw);
};

window.addEventListener('resize', resize);

export const setup = () => {
  const contentCanvas = document.querySelector('.content--canvas-abirix canvas');

  if (contentCanvas) return;

  createCanvas();
  resize();
  initParticles();
  draw();
};

export const remove = () => {
  const contentCanvas = document.querySelector('.content--canvas-abirix canvas');

  contentCanvas && contentCanvas.remove();

  container = null;
  canvas = null;
  ctx = null;
  center = null;
  tick = null;
  particleProps = null;
};

export default setup;
