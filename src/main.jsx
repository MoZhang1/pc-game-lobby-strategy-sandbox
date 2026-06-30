import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronRight, Monitor, RotateCcw, Smartphone, X } from 'lucide-react';
import './product.css';

const strategies = {
  A: { name: '我的应用', current: '历史游玩游戏召回', plan: '本阶段保持现状', type: '保持现状', note: '继续承担老用户历史游戏快速召回，不纳入本轮改造。' },
  B: { name: '首屏 Banner', current: '1号位棋牌，2/4/5联运，3号位捕鱼', plan: '1号位棋牌游戏排期轮换', type: '纯配置', note: '建立棋牌游戏素材与档期表，按排期轮换并持续观察进入游戏效果。' },
  C: { name: '本地热门', current: 'IP地区召回；前6位按当地热度排序，后续人工配置', plan: '支持修改算法排序数量和排序规则', type: '需要开发', note: '把“算法排序到第几位”和各排序因子做成可配置能力，方便随时调整。' },
  D: { name: '固定推荐', current: '美女捕鱼 + 两个联运游戏', plan: '本阶段保持现状', type: '保持现状', note: '继续作为固定变现游戏入口。' },
  E: { name: '热门推荐', current: '1号位棋牌，4号位捕鱼，其余为联运广告', plan: '本阶段保持现状', type: '保持现状', note: '保持现有广告位结构，后续结合数据再决定是否进入实验。' },
  F: { name: '精品游戏', current: '扑克、麻将、联运、休闲分类人工配置', plan: '优化各分类下的游戏排序', type: '纯配置', note: '优先调整首屏可见游戏顺序，减少低效曝光。' },
  G: { name: '导航 Tab', current: '分类及排序取游戏库标签和权重', plan: '优化游戏分类 Tab 排序', type: '纯配置', note: '根据核心用户需求调整 Tab 顺序，并同步优化分类内游戏排序。' },
  H: { name: '页游新服', current: '联运游戏新服分发位', plan: '本阶段保持现状', type: '保持现状', note: '继续承担联运新服导流。' },
  I: { name: '次屏 Banner', current: '联运游戏广告位，可关闭', plan: '本阶段保持现状', type: '保持现状', note: '保留当前联运广告承接方式。' },
  J: { name: '游戏导航', current: '游戏库分类导航', plan: '优化游戏分类栏展示', type: '需要产品支持', note: '重新梳理分类栏的信息层级、展示数量和最近上新入口。' },
  SEARCH: { name: '搜索框', current: '按游戏名称搜索', plan: '优化搜索关联词', type: '纯配置', note: '补充别名、玩法词和高频错别字，提高搜索后的游戏进入率。' },
  GUIDE: { name: '新手引导与流失拦截', current: '大厅缺少统一的新用户首玩引导与离开前承接', plan: '优化新手引导和流失拦截', type: '持续优化', note: '围绕首次进入、无点击、准备离开三个时机设计引导，并分别观察新用户分发率和老用户二次分发率。' },
};

const hotspots = [
  { id: 'A', page: 1, x: 2.7, y: 5.4, w: 10.8, h: 55.4 },
  { id: 'B', page: 1, x: 14.1, y: 5.4, w: 68.3, h: 25.7 },
  { id: 'C', page: 1, x: 15.1, y: 31.8, w: 67.8, h: 17.4 },
  { id: 'D', page: 1, x: 3.2, y: 61.0, w: 9.7, h: 26.4 },
  { id: 'E', page: 1, x: 13.8, y: 50.4, w: 68.9, h: 25.8 },
  { id: 'F', page: 1, x: 13.8, y: 76.8, w: 68.9, h: 22.5 },
  { id: 'G', page: 1, x: 83.0, y: 55.0, w: 15.9, h: 26.5 },
  { id: 'H', page: 1, x: 83.0, y: 82.0, w: 16.0, h: 17.7 },
  { id: 'SEARCH', page: 1, x: 29.8, y: 1.0, w: 16.2, h: 3.4 },
  { id: 'GUIDE', page: 1, x: 83.1, y: 7.0, w: 15.6, h: 47.5 },
  { id: 'I', page: 2, x: 13.6, y: 16.3, w: 68.7, h: 26.0 },
  { id: 'J', page: 2, x: 13.6, y: 43.2, w: 70.0, h: 55.1 },
];

function StrategyModal({ id, onClose }) {
  const item = strategies[id];
  useEffect(() => {
    const close = event => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  return <div className="modalMask" onMouseDown={onClose}>
    <article className="strategyModal" role="dialog" aria-modal="true" aria-labelledby="strategy-title" onMouseDown={event => event.stopPropagation()}>
      <header>
        <div>{id.length === 1 && <span className="areaCode">{id}</span>}<small>后续优化策略</small></div>
        <button aria-label="关闭" onClick={onClose}><X /></button>
      </header>
      <h2 id="strategy-title">{item.name}</h2>
      <div className={`typeTag type-${item.type}`}>{item.type}</div>
      <section><label>当前分发逻辑</label><p>{item.current}</p></section>
      <section className="planBlock"><label>本轮优化</label><h3>{item.plan}</h3><p>{item.note}</p></section>
      <footer><span>点击大厅其他位置可继续查看</span><button onClick={onClose}>知道了</button></footer>
    </article>
  </div>;
}

function Screen({ page, onSelect }) {
  return <div className="screen" data-page={page}>
    <img src={`./pc-lobby-screen-${page}.png`} alt={`PC游戏大厅产品界面第${page}屏`} />
    {hotspots.filter(item => item.page === page).map(item => <button
      key={item.id}
      className="hotspot"
      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, height: `${item.h}%` }}
      onClick={() => onSelect(item.id)}
      aria-label={`查看${strategies[item.id].name}优化策略`}
    ><span>{item.id.length === 1 ? item.id : item.id === 'SEARCH' ? '搜索' : '引导'}</span></button>)}
  </div>;
}

const androidPages = {
  recommend: 'android-recommend.png',
  local: 'android-local.png',
  poker: 'android-poker.png',
  mahjong: 'android-mahjong.png',
  new: 'android-new-games.png',
  web: 'android-web-games.png',
};

const androidTabs = [
  { id: 'recommend', label: '推荐', x: 1, w: 7 },
  { id: 'local', label: '同城棋牌', x: 8, w: 13 },
  { id: 'poker', label: '扑克', x: 21, w: 8 },
  { id: 'mahjong', label: '麻将', x: 29, w: 8 },
  { id: 'new', label: '新游专区', x: 37, w: 13 },
  { id: 'web', label: '网游', x: 50, w: 8 },
];

function AndroidGuideModal({ type, onClose, onTry, onSearch }) {
  if (!type) return null;
  return <div className="mobileMask">
    <section className="mobileGuide" role="dialog" aria-modal="true" aria-label="替代游戏推荐">
      <button className="mobileClose" aria-label="关闭引导" onClick={onClose}><X /></button>
      <div className="guideGameIcon">掼</div>
      <small>为你找到一款本地热门</small>
      <h2>没有找到想玩的游戏吗？</h2>
      <p>可以先试试这款本地热门游戏</p>
      <article><b>掼蛋</b><span>同地区新用户启动率最高</span><em>简单易上手 · 匹配快</em></article>
      <button className="tryNow" onClick={onTry}>立即试玩</button>
      <button className="keepSearch" onClick={onSearch}>继续搜索</button>
    </section>
  </div>;
}

function AndroidSimulator() {
  const [page, setPage] = useState('recommend');
  const [tabClicks, setTabClicks] = useState(0);
  const [searches, setSearches] = useState(0);
  const [query, setQuery] = useState('');
  const [weakGuide, setWeakGuide] = useState(false);
  const [guide, setGuide] = useState(null);
  const [resultCard, setResultCard] = useState(false);
  const [started, setStarted] = useState(false);
  const [weakShown, setWeakShown] = useState(false);
  const [strongShown, setStrongShown] = useState(false);
  const [homeDepth, setHomeDepth] = useState(0);
  const [secondaryGuide, setSecondaryGuide] = useState(false);
  const [secondaryShown, setSecondaryShown] = useState(false);

  const selectTab = id => {
    setSecondaryGuide(false);
    if (started) return setPage(id);
    const next = tabClicks + 1;
    setPage(id);
    setTabClicks(next);
    if (next >= 3 && !weakShown) {
      setWeakShown(true);
      setWeakGuide(true);
    }
  };
  const browseHome = event => {
    if (page !== 'recommend' || started || secondaryShown || event.deltaY <= 0) return;
    const next = Math.min(100, homeDepth + 34);
    setHomeDepth(next);
    if (next >= 85) {
      setSecondaryShown(true);
      setSecondaryGuide(true);
    }
  };
  const openSearch = () => { setPage('search'); setWeakGuide(false); };
  const search = () => {
    if (started) return;
    const next = searches + 1;
    setSearches(next);
    if (next < 3) setResultCard(true);
    if (next >= 3 && !strongShown) {
      setStrongShown(true);
      setResultCard(false);
      setGuide('searchFallback');
    }
  };
  const launch = () => {
    setStarted(true);
    setGuide(null);
    setWeakGuide(false);
    setSecondaryGuide(false);
    setResultCard(false);
  };
  const reset = () => {
    setPage('recommend'); setTabClicks(0); setSearches(0); setQuery('');
    setWeakGuide(false); setGuide(null); setResultCard(false); setStarted(false);
    setWeakShown(false); setStrongShown(false);
    setHomeDepth(0); setSecondaryGuide(false); setSecondaryShown(false);
  };

  return <div className="androidPage">
    <div className="androidIntro"><div><b>安卓行为引导模拟</b><span>按真实用户路径操作，满足条件后自动触发对应引导</span></div><button onClick={reset}><RotateCcw />重置行为</button></div>
    <div className="androidWorkspace">
      <div className="phoneShell">
        <div className="phoneScreen" onWheel={browseHome}>
          <img src={`./${page === 'search' ? 'android-search.png' : androidPages[page]}`} alt="安卓竖版同城游界面" />
          {page !== 'search' && <>
            <button className="mobileSearchHotspot" aria-label="进入搜索页" onClick={openSearch} />
            <div className="mobileTabHotspots">{androidTabs.map(tab => <button key={tab.id} aria-label={`点击${tab.label}页签`} style={{left:`${tab.x}%`,width:`${tab.w}%`}} onClick={() => selectTab(tab.id)} />)}</div>
            <button className="gameLaunchHotspot" aria-label="启动当前推荐游戏" onClick={launch} />
          </>}
          {page === 'search' && <>
            <button className="searchBack" aria-label="返回安卓首页" onClick={() => setPage('recommend')} />
            <input className="searchInput" aria-label="搜索游戏" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === 'Enter' && search()} autoFocus placeholder="掼蛋" />
            <button className="searchSubmit" aria-label="提交搜索" onClick={search} />
            {resultCard && <div className="resultRecommend"><small>没找到？你可能会喜欢</small><div><span className="miniGuideIcon">掼</span><b>本地热门 · 掼蛋</b><button onClick={launch}>试玩</button></div></div>}
          </>}
          {weakGuide && <button className="searchBubble" onClick={openSearch}>找不到合适的游戏吗？<b>可以来搜索试试</b><i /></button>}
          {secondaryGuide && <button className="secondaryTabBubble" onClick={() => {setPage('poker');setSecondaryGuide(false)}}>更多游戏可以点击这里探索<i /></button>}
          {page === 'recommend' && !secondaryShown && <div className="homeDepth"><span style={{height:`${homeDepth}%`}}/><small>{homeDepth < 85 ? '向下滑动浏览首页' : '已浏览到底'}</small></div>}
          {started && <div className="startedToast">已启动「掼蛋」，本会话停止触发引导</div>}
          <AndroidGuideModal type={guide} onClose={() => setGuide(null)} onTry={launch} onSearch={() => {setGuide(null);setPage('search')}} />
        </div>
      </div>
      <aside className="behaviorPanel">
        <header><span>实时行为状态</span><i className={started ? 'done' : ''}>{started ? '已启动游戏' : '尚未启动游戏'}</i></header>
        <div className="behaviorCount"><span>首页页签点击</span><strong>{tabClicks}<small> / 3</small></strong></div>
        <div className="behaviorCount"><span>无点击搜索</span><strong>{searches}<small> / 3</small></strong></div>
        <div className="behaviorCount"><span>首页浏览深度</span><strong>{homeDepth}<small>%</small></strong></div>
        <section className={secondaryShown ? 'triggered' : ''}><b>场景 0 · 二级页签引导</b><p>在推荐首页向下滑动，浏览深度达到 85%，期间未启动游戏。</p><em>{secondaryShown ? '已触发' : '等待触发'}</em></section>
        <section className={weakShown ? 'triggered' : ''}><b>场景 1 · 搜索弱引导</b><p>连续点击任意首页页签 3 次，期间不启动游戏。</p><em>{weakShown ? '已触发' : '等待触发'}</em></section>
        <section className={strongShown ? 'triggered' : ''}><b>场景 2 · 替代游戏强引导</b><p>进入搜索页，连续提交搜索 3 次，不点击推荐游戏。</p><em>{strongShown ? '已触发' : '等待触发'}</em></section>
        <section className={resultCard ? 'triggered' : ''}><b>场景 3 · 结果页推荐卡</b><p>提交搜索但未点击游戏时，在结果页强化推荐。</p><em>{resultCard ? '展示中' : '等待触发'}</em></section>
        <footer>频控已模拟：弱/强引导各最多一次；启动游戏后停止触发。</footer>
      </aside>
    </div>
  </div>;
}

function App() {
  const [platform, setPlatform] = useState('pc');
  const [selected, setSelected] = useState(null);
  return <main className="productApp">
    <nav className="platformNav" aria-label="平台切换">
      <button className={platform === 'pc' ? 'active' : ''} onClick={() => setPlatform('pc')}><Monitor />PC新大厅</button>
      <button className={platform === 'android' ? 'active' : ''} onClick={() => setPlatform('android')}><Smartphone />安卓</button>
    </nav>
    {platform === 'pc' ? <div className="pcPage">
      <div className="pageIntro"><div><b>PC新大厅</b><span>点击大厅中的分发位置，查看对应的后续优化策略</span></div><span>可交互位置 <strong>A–J</strong><ChevronRight /></span></div>
      <div className="lobbyCanvas"><Screen page={1} onSelect={setSelected} /><Screen page={2} onSelect={setSelected} /></div>
    </div> : <AndroidSimulator />}
    {selected && <StrategyModal id={selected} onClose={() => setSelected(null)} />}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
