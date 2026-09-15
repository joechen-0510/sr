'use strict';
const wishButton = document.getElementById('wish-button');
const wishStatus = document.getElementById('wish-status');
const letterButton = document.getElementById('letter-button');
const letter = document.getElementById('letter');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let width = 0, height = 0, particles = [], frame = 0, previous = 0;
let timers = [];
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize, { passive: true });
resize();
function burst(x, y) {
  if (!ctx || reducedMotion.matches) return;
  const colors = ['#ecc68a', '#ffecc6', '#b8dcf0', '#d2bdff', '#fff8e9'];
  for (let i = 0; i < 62; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4.4;
    particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[Math.floor(Math.random() * colors.length)], size: 1 + Math.random() * 1.7 });
  }
  if (!frame) { previous = performance.now(); frame = requestAnimationFrame(animate); }
}
function animate(now) {
  const dt = Math.min((now - previous) / 16.67, 2); previous = now;
  ctx.clearRect(0, 0, width, height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .025 * dt;
    p.vx *= Math.pow(.987, dt); p.life -= .008 * dt;
    ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (particles.length) frame = requestAnimationFrame(animate);
  else { frame = 0; ctx.clearRect(0, 0, width, height); }
}
function resetCelebration() {
  timers.forEach(clearTimeout); timers = [];
  cancelAnimationFrame(frame); frame = 0; particles = [];
  if (ctx) ctx.clearRect(0, 0, width, height);
  wishButton.disabled = false;
  document.body.classList.remove('celebrating');
}
wishButton.addEventListener('click', () => {
  resetCelebration();
  wishButton.disabled = true;
  wishStatus.textContent = '闭上眼睛，在心里许一个愿望……';
  wishButton.innerHTML = '<span aria-hidden="true">✧</span> 愿望正在飞向星空';
  timers.push(setTimeout(() => {
    document.body.classList.add('celebrating');
    wishStatus.textContent = '董子豪，生日快乐！愿你的每一份期待，都慢慢开花。';
    for (let i = 0; i < 9; i++) timers.push(setTimeout(() => burst(width * (.15 + Math.random() * .7), height * (.15 + Math.random() * .5)), i * 420));
    timers.push(setTimeout(() => {
      wishButton.disabled = false;
      wishButton.innerHTML = '<span aria-hidden="true">✧</span> 再为你放一次烟花 <span aria-hidden="true">↗</span>';
      document.body.classList.remove('celebrating');
    }, 4600));
  }, reducedMotion.matches ? 700 : 1800));
});
letterButton.addEventListener('click', () => {
  letter.hidden = false;
  letterButton.setAttribute('aria-expanded', 'true');
  letterButton.innerHTML = '重读这封星光来信 <span aria-hidden="true">↓</span>';
  letter.focus({ preventScroll: true });
  letter.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    resetCelebration();
    wishButton.innerHTML = '<span aria-hidden="true">✧</span> 许个愿，点亮星空 <span aria-hidden="true">↗</span>';
    wishStatus.textContent = '不必说出口，星星会替你记得。';
  }
});
