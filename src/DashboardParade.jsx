import React, { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import './dashboard-parade.css';

const BACKDROP = `${import.meta.env.BASE_URL}dashboard-parade/tiananmen.png`;
const MARCH_SPRITE = `${import.meta.env.BASE_URL}dashboard-parade/monkey-march.png`;
const RANKS = [
  { size: 13.5, bottom: 21, offset: 6 },
  { size: 16, bottom: 10.5, offset: 1 },
  { size: 18, bottom: 1.5, offset: 6 },
];

function ParadeOverlay({ onFinish }) {
  const [assets, setAssets] = useState('loading');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    let cancelled = false;
    Promise.all([BACKDROP, MARCH_SPRITE].map(src => {
      const image = new Image();
      image.src = src;
      return image.decode();
    })).then(() => {
      if (!cancelled) setAssets('ready');
    }).catch(() => {
      if (!cancelled) setAssets('error');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    const dismissOnEscape = event => { if (event.key === 'Escape') onFinish(); };
    const dismissWhenHidden = () => { if (document.hidden) onFinish(); };
    preference.addEventListener('change', update);
    document.addEventListener('keydown', dismissOnEscape);
    document.addEventListener('visibilitychange', dismissWhenHidden);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('keydown', dismissOnEscape);
      document.removeEventListener('visibilitychange', dismissWhenHidden);
    };
  }, [onFinish]);

  useEffect(() => {
    if (assets === 'loading') return;
    const timer = window.setTimeout(onFinish, assets === 'error' ? 4000 : reducedMotion ? 6000 : 18000);
    return () => window.clearTimeout(timer);
  }, [assets, reducedMotion, onFinish]);

  return <>
    <span className="paradeAnnouncement" role="status">{assets === 'loading' ? '猴乐乐方阵正在集合。'
      : assets === 'error' ? '彩蛋暂时未能加载，请稍后再点国旗重试。'
      : '国庆快乐！猴乐乐方阵向您敬礼。再次点击国旗或按 Escape 可收起。'}</span>
    {assets === 'error' && <p className="paradeLoadError">彩蛋还没加载好，稍后再点国旗试试</p>}
    {assets === 'ready' && <div className={`paradeOverlay${reducedMotion ? ' is-static' : ''}`} aria-hidden="true">
      <div className="paradeScene">
        <img className="paradeBackdrop" src={BACKDROP} width="1672" height="941" alt="" />
        <div className="paradeGreeting">国庆快乐</div>
        <div className="paradeFormation">
          {RANKS.map((rank, row) => Array.from({ length: 6 }, (_, column) => <div className="paradeMonkey" key={`${row}-${column}`}
            style={{ width: `${rank.size}%`, bottom: `${rank.bottom}%`, left: `${rank.offset + column * 12.5}%`, zIndex: row + 1 }}>
            <span className="paradeMonkeyShadow" />
            <span className="paradeSprite" style={{ backgroundImage: `url("${MARCH_SPRITE}")` }} />
          </div>))}
        </div>
      </div>
    </div>}
  </>;
}

export default function DashboardParade() {
  const [open, setOpen] = useState(false);
  const starId = useId();
  const finish = useCallback(() => setOpen(false), []);
  return <>
    <button type="button" className="dashboardParadeFlag" onClick={() => setOpen(value => !value)} aria-label="国庆彩蛋：猴乐乐阅兵" title={open ? '再点一下收起 · Esc 也可退出' : '国庆快乐 · 点我看看'} aria-pressed={open}>
      <svg viewBox="0 0 30 20" width="24" height="16" aria-hidden="true">
        <defs><path id={starId} d="M0-1 .2245-.309 .9511-.309 .3633.118 .5878.809 0 .382-.5878.809-.3633.118-.9511-.309-.2245-.309Z" /></defs>
        <rect width="30" height="20" rx="1" fill="#de2910" />
        <g fill="#ffde00">
          <use href={`#${starId}`} transform="translate(5 5) scale(3)" />
          <use href={`#${starId}`} transform="translate(10 2) rotate(59)" />
          <use href={`#${starId}`} transform="translate(12 4) rotate(82)" />
          <use href={`#${starId}`} transform="translate(12 7) rotate(106)" />
          <use href={`#${starId}`} transform="translate(10 9) rotate(129)" />
        </g>
      </svg>
    </button>
    {open && createPortal(<ParadeOverlay onFinish={finish} />, document.body)}
  </>;
}
