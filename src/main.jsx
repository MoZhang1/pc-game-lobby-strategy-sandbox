import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Monitor, Smartphone, X } from 'lucide-react';
import './product.css';
import InteractiveAndroidSimulator from './AndroidSimulator';
import InteractivePcLobby from './PcLobby';

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

function App() {
  const [platform, setPlatform] = useState('pc');
  const [selected, setSelected] = useState(null);
  return <main className="productApp">
    <nav className="platformNav" aria-label="平台切换">
      <button className={platform === 'pc' ? 'active' : ''} onClick={() => setPlatform('pc')}><Monitor />PC新大厅</button>
      <button className={platform === 'android' ? 'active' : ''} onClick={() => setPlatform('android')}><Smartphone />安卓</button>
    </nav>
    {platform === 'pc' ? <InteractivePcLobby onSelect={setSelected}/> : <InteractiveAndroidSimulator />}
    {selected && <StrategyModal id={selected} onClose={() => setSelected(null)} />}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
