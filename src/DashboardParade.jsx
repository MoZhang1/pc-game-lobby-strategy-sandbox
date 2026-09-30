import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Flag, Pause, Play, RotateCcw, X } from 'lucide-react';
import './dashboard-parade.css';

const BACKDROP = `${import.meta.env.BASE_URL}dashboard-parade/tiananmen.png`;
const MARCH_SPRITE = `${import.meta.env.BASE_URL}dashboard-parade/monkey-march.png`;
const RANKS = [
  { size: 13.5, bottom: 21, offset: 6 },
  { size: 16, bottom: 10.5, offset: 1 },
  { size: 18, bottom: 1.5, offset: 6 },
];

function ParadeDialog({ onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [assets, setAssets] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motionRequested, setMotionRequested] = useState(false);
  const motionAllowed = !reducedMotion || motionRequested;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setAssets('loading');
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
  }, [attempt]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      setMotionRequested(false);
    };
    const pauseWhenHidden = () => {
      if (document.hidden) setPaused(true);
    };
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);

  function replay() {
    setMotionRequested(true);
    setPaused(false);
    setComplete(false);
    setRun(value => value + 1);
  }

  const status = assets === 'loading' ? '方阵正在集合…'
    : assets === 'error' ? '场景未能加载'
    : !motionAllowed ? '猴乐乐方阵，向您敬礼！'
    : complete ? '检阅完毕，国庆快乐！'
    : paused ? '方阵已暂停'
    : '猴乐乐方阵，齐步走！';

  return <dialog ref={dialogRef} className="paradeDialog" aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="paradeHeader">
      <div><h2 id={titleId}>国庆快乐！</h2><p>猴乐乐方阵 · 天安门广场</p></div>
      <button type="button" className="paradeClose" aria-label="关闭阅兵" onClick={onClose} autoFocus><X aria-hidden="true" size={20} /></button>
    </header>
    <div className={`paradeStage ${paused ? 'is-paused' : ''} ${!motionAllowed ? 'is-static' : ''}`}>
      {assets === 'ready' ? <>
        <img className="paradeBackdrop" src={BACKDROP} width="1672" height="941" alt="晴空下的天安门城楼，红墙金瓦，前方是宽阔的石砖广场" />
        <div key={run} className="paradeFormation" role="img" aria-label="18 位猴乐乐排成三排方阵，敬礼向右行进"
          onAnimationEnd={event => { if (event.animationName === 'monkeyParadePass') setComplete(true); }}>
          {RANKS.map((rank, row) => Array.from({ length: 6 }, (_, column) => <div className="paradeMonkey" key={`${row}-${column}`} aria-hidden="true"
            style={{ width: `${rank.size}%`, bottom: `${rank.bottom}%`, left: `${rank.offset + column * 12.5}%`, zIndex: row + 1 }}>
            <span className="paradeMonkeyShadow" />
            <span className="paradeSprite" style={{ backgroundImage: `url("${MARCH_SPRITE}")` }} />
          </div>))}
        </div>
      </> : <div className="paradeAssetMessage">
        <Flag size={32} aria-hidden="true" /><p>{status}</p>
        {assets === 'error' && <button type="button" onClick={() => setAttempt(value => value + 1)}>重新加载</button>}
      </div>}
    </div>
    <footer className="paradeFooter">
      <div className="paradeCaption"><strong role="status">{status}</strong><span>{motionAllowed ? '18 位猴乐乐 · 三排方阵' : '已遵循系统的减少动态效果设置'}</span></div>
      <div className="paradeControls">
        {!motionAllowed ? <button type="button" onClick={replay} disabled={assets !== 'ready'}><Play size={16} aria-hidden="true" />播放动画</button>
          : <><button type="button" onClick={() => setPaused(value => !value)} disabled={assets !== 'ready' || complete}>
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{paused ? '继续' : '暂停'}
          </button><button type="button" onClick={replay} disabled={assets !== 'ready'}><RotateCcw size={16} aria-hidden="true" />{complete ? '再次检阅' : '重播'}</button></>}
      </div>
    </footer>
  </dialog>;
}

export default function DashboardParade() {
  const [open, setOpen] = useState(false);
  const starId = useId();
  return <>
    <button type="button" className="dashboardParadeFlag" onClick={() => setOpen(true)} aria-label="国庆彩蛋：猴乐乐阅兵" title="国庆快乐 · 点我看看" aria-haspopup="dialog">
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
    {open && createPortal(<ParadeDialog onClose={() => setOpen(false)} />, document.body)}
  </>;
}
