import React, { useEffect, useRef, useState } from 'react';
import './dashboard-celebration.css';

const COLORS = ['#fb7185', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb923c'];
const EMOJI = ['🎉', '✨', '🎊'];

export default function DashboardCelebration() {
  const canvasRef = useRef(null);
  const cleanupRef = useRef(() => {});
  const [mode, setMode] = useState('idle');

  useEffect(() => () => cleanupRef.current(), []);

  function celebrate() {
    if (mode !== 'idle') return;
    cleanupRef.current();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (motion.matches || !ctx) {
      setMode('quiet');
      const timer = window.setTimeout(() => setMode('idle'), 1800);
      cleanupRef.current = () => window.clearTimeout(timer);
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const speedScale = Math.min(1.2, Math.sqrt(height / 720));
    const particles = Array.from({ length: width < 600 ? 100 : 180 }, (_, i) => {
      const left = i % 2 === 0;
      return {
        x: left ? 12 : width - 12,
        y: height * 0.88,
        vx: (left ? 1 : -1) * (3 + Math.random() * 9) * Math.min(1, width / 900),
        vy: -(12 + Math.random() * 10) * speedScale,
        size: 6 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.22,
        color: COLORS[i % COLORS.length],
        emoji: i % 17 === 0 ? EMOJI[i % EMOJI.length] : null,
        delay: Math.random() * 180,
      };
    });
    setMode('playing');
    let frame = 0;
    let previous = performance.now();
    const started = previous;

    const stop = () => {
      window.cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener('resize', finish);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', finish);
    };
    const finish = () => {
      stop();
      setMode('idle');
    };
    const onVisibility = () => {
      if (document.hidden) finish();
    };
    cleanupRef.current = stop;
    window.addEventListener('resize', finish);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', finish);

    function draw(now) {
      const elapsed = now - started;
      if (elapsed >= 3800) {
        finish();
        return;
      }
      const step = Math.min((now - previous) / (1000 / 60), 2);
      previous = now;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (elapsed < p.delay) continue;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.vx *= Math.pow(0.994, step);
        p.vy += 0.2 * step;
        p.angle += p.spin * step;
        ctx.save();
        ctx.globalAlpha = Math.min(1, (3800 - elapsed) / 700);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        if (p.emoji) {
          ctx.font = '22px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.scale(1, Math.cos(elapsed / 130 + p.angle));
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
      frame = window.requestAnimationFrame(draw);
    }
    frame = window.requestAnimationFrame(draw);
  }

  return <div className="dashboardCelebration">
    <button type="button" className="dashboardCelebrationButton" aria-label="放礼炮" disabled={mode !== 'idle'} onClick={celebrate}>
      <span aria-hidden="true">🎉</span>{mode === 'idle' ? '放礼炮' : '庆祝中…'}
    </button>
    <span role="status" className={mode === 'quiet' ? 'dashboardCelebrationMessage' : 'dashboardCelebrationSrOnly'}>{mode === 'idle' ? '' : '庆祝一下！🎉'}</span>
    <canvas ref={canvasRef} className="dashboardConfettiCanvas" hidden={mode !== 'playing'} aria-hidden="true" />
  </div>;
}
