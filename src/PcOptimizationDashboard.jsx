import React, { useMemo, useState } from 'react';
import { BarChart3, CalendarDays, ChartScatter, Gamepad2, LayoutDashboard, Lightbulb, ListFilter, TrendingUp } from 'lucide-react';
import './pc-optimization-dashboard.css';

const nodeData = {
  '2026-03-24': {
    title: '3 月 24 日改造效果',
    metrics: [['新增率', '5 / 7', '款游戏提升'], ['人均对局', '4 / 7', '款游戏提升'], ['7 日留存', '6 / 7', '款游戏提升'], ['综合改善明确', '2 款', '掼蛋、打弹子']],
    games: [
      ['掼蛋', '提升', '提升', '提升', '综合改善最明确'],
      ['打弹子（1880354）', '提升', '提升', '提升', '综合改善最明确'],
      ['逮狗腿', '提升', '—', '提升', '部分指标改善'],
      ['双扣', '—', '提升', '提升', '部分指标改善'],
    ],
    conclusion: '新增率与人均对局没有统一趋势：仅 2 / 7 款游戏同步改善，相关系数约 -0.04，接近无相关。',
  },
  '2026-07-08': {
    title: '7 月 8 日改造效果',
    metrics: [['新增率', '差异化', '非统一提升'], ['人均对局', '差异化', '非统一提升'], ['7 日留存', '差异化', '非统一提升'], ['重点观察', '2 款', '双扣、包红五']],
    games: [
      ['双扣', '下降', '提升', '提升', '深度与留存改善'],
      ['包红五', '提升', '提升', '下降', '新增与深度改善'],
    ],
    conclusion: '7 月 8 日节点呈现游戏分化：双扣改善留存和人均对局，但新增率下降；包红五改善新增率和人均对局，但留存下降。',
  },
};

const trend = {
  '2026-03-24': [[48,52,50,51,54,56,55,59,60,61,60,63],[44,43,45,44,43,45,47,48,49,48,50,51],[49,50,51,53,54,56,57,58,60,60,61,62]],
  '2026-07-08': [[54,55,53,52,54,51,50,52,51,53,52,51],[58,57,59,58,60,62,61,63,62,64,63,65],[55,56,56,58,57,59,58,57,59,58,60,59]],
};

function LineChart({ node }) {
  const lines = trend[node];
  const colors = ['#2563eb', '#14b8a6', '#f59e0b'];
  const labels = ['新增率', '人均对局', '7 日留存'];
  const points = values => values.map((value, index) => `${44 + index * 46},${164 - value * 1.9}`).join(' ');
  return <section className="pcod-panel pcod-trend"><header><div><h2>核心指标趋势对比</h2><p>节点前后标准化趋势 · 虚线标注改造上线</p></div><div className="pcod-legend">{labels.map((label, i) => <span key={label}><i style={{ background: colors[i] }} />{label}</span>)}</div></header><svg viewBox="0 0 570 220" role="img" aria-label="核心指标趋势对比图">
    {[34,72,110,148,186].map(y => <line key={y} x1="42" y1={y} x2="548" y2={y} />)}
    <line className="pcod-marker" x1="258" y1="24" x2="258" y2="190" /><text x="266" y="35">{node.slice(5).replaceAll('-', '.')} 改造上线</text>
    {lines.map((line, i) => <polyline key={labels[i]} points={points(line)} style={{ stroke: colors[i] }} />)}
    {['前 4 周','前 2 周','改造','后 2 周','后 4 周'].map((x,i) => <text className="pcod-axis" key={x} x={44 + i * 126} y="211">{x}</text>)}
  </svg></section>;
}

function Status({ value }) { return <span className={value === '提升' ? 'up' : value === '下降' ? 'down' : 'neutral'}>{value}</span>; }

export default function PcOptimizationDashboard() {
  const [node, setNode] = useState('2026-03-24');
  const data = useMemo(() => nodeData[node], [node]);
  return <div className="pcod-app">
    <aside className="pcod-side"><div className="pcod-brand"><Gamepad2 /><div>游戏平台运营<small>PC 新大厅</small></div></div><nav><button className="selected"><LayoutDashboard />改造效果</button><button><BarChart3 />指标总览</button><button><ChartScatter />相关分析</button><button><ListFilter />游戏明细</button></nav><p><CalendarDays />数据口径：节点前后趋势<br />对局统一采用人均对局</p></aside>
    <main className="pcod-main"><header className="pcod-top"><div><h1>PC 新大厅改造效果看板</h1><p>围绕新增率、人均对局与 7 日留存，评估改造节点前后的整体与分游戏变化。</p></div><span>数据更新：2026.07.21</span></header>
      <section className="pcod-switch" aria-label="改造节点选择"><b>对比节点</b>{Object.keys(nodeData).map(key => <button className={key === node ? 'active' : ''} key={key} onClick={() => setNode(key)}><i />{key.replaceAll('-', '.')}<small>{key === '2026-03-24' ? '第一轮大厅改造' : '第二轮大厅改造'}</small></button>)}</section>
      <section className="pcod-metrics">{data.metrics.map(([label, value, note], i) => <article key={label}><span>{label}</span><b>{value}</b><small>{note}</small><i className={`metric-mark mark-${i}`} /></article>)}</section>
      <section className="pcod-grid"><LineChart node={node} /><section className="pcod-panel pcod-table"><header><div><h2>游戏维度改善明细</h2><p>“提升 / 下降”表示该指标在节点后相对节点前的方向</p></div></header><div className="pcod-table-head"><span>游戏</span><span>新增率</span><span>人均对局</span><span>7 日留存</span><span>判断</span></div>{data.games.map(row => <div className="pcod-row" key={row[0]}><strong>{row[0]}</strong><Status value={row[1]} /><Status value={row[2]} /><Status value={row[3]} /><span className="pcod-note">{row[4]}</span></div>)}</section>
        <section className="pcod-panel pcod-scatter"><header><div><h2>指标相关性（整体）</h2><p>新增率变化 × 人均对局变化</p></div></header><div className="scatter-wrap"><svg viewBox="0 0 360 214" role="img" aria-label="新增率变化与人均对局变化散点图"><line x1="44" y1="18" x2="44" y2="177" /><line x1="44" y1="177" x2="336" y2="177" /><line className="scatter-line" x1="58" y1="156" x2="316" y2="49" />{[[76,148],[110,90],[144,116],[180,83],[206,125],[244,70],[276,110],[306,58]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" />)}<text x="113" y="204">新增率变化 →</text><text className="vertical" x="15" y="138">人均对局变化 →</text></svg><aside><b>{node === '2026-03-24' ? '-0.04' : '观察中'}</b><span>{node === '2026-03-24' ? '相关系数 r · 接近无相关' : '第二节点呈游戏分化'}</span></aside></div></section>
        <section className="pcod-panel pcod-conclusion"><header><Lightbulb /><div><h2>结论与后续观察</h2><p>{data.conclusion}</p></div></header><ol><li>继续以“人均对局”衡量对局深度，避免活跃规模干扰。</li><li>按游戏拆解新增、深度、留存三项，避免用单一指标判断改造。</li><li>优先跟踪综合改善明确或指标分化明显的游戏，验证后续趋势。</li></ol></section>
      </section>
    </main>
  </div>;
}
