import React, { useMemo, useState } from 'react';
import './pc-optimization-dashboard.css';

// 仅录入《PC新大厅_9款游戏_两批实验聚合报告.xlsx》中的真实节点前后差值；没有分日明细。
const batches = {
  march: {
    label: '2026.03.24 节点', period: '改造前后各 1 个月', sample: '7 款游戏',
    rows: [
      ['逮狗腿', 1880234, .10, -.26, 1.75, .10, 1.34], ['呼和浩特麻将', 1880337, -.02, 2.67, 6.53, .37, 0],
      ['赤峰对调', 1880230, -.12, .08, -2.68, 3.99, 1.53], ['比鸡', 1880450, .16, -1.61, -1.39, .72, .28],
      ['掼蛋', 1880081, 1.85, .31, 2.43, .16, 1.67], ['打大A', 1880221, .05, -.07, -3.06, -1.22, .19], ['打弹子', 1880354, .05, .70, .25, -3.91, 2.89],
    ],
  },
  july: {
    label: '2026.07.08 节点', period: '改造前后各 10 天', sample: '当前结果表仅含 2 款游戏',
    rows: [['双扣', 1880019, -.12, .58, 2.97, .92, .57], ['包红五', 1880024, .19, 1.05, -.96, -4.68, -4.83]],
  },
};
const fields = [['新增率', 2, 'pp'], ['人均对局', 3, ''], ['次留', 4, 'pp'], ['3 日留存', 5, 'pp'], ['7 日留存', 6, 'pp']];
const mean = (rows, index) => rows.reduce((sum, row) => sum + row[index], 0) / rows.length;
const format = (value, suffix = '') => `${value > 0 ? '+' : ''}${value.toFixed(2)}${suffix}`;
const tone = value => value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero';

const gameSheets = {
  march: [
    ['逮狗腿', 1880234, '前一个月', '后一个月', '前439人｜后453人', [1223.68, 1058.45], [15.68, 14.61], [.0128, .0138], [.2916, .3091], [.1822, .1832], [.1367, .1501], [1025.14, 2130.29], [14202.5, 28959.68], [13.85, 13.59]],
    ['呼和浩特麻将', 1880337, '前一个月', '后一个月', '前43人｜后37人', [1223.68, 1058.45], [1.54, 1.19], [.0013, .0011], [.0698, .1351], [.0233, .027], [0, 0], [3.54, 8.16], [63.29, 167.84], [17.9, 20.57]],
    ['赤峰对调', 1880230, '前一个月', '后一个月', '前198人｜后151人', [1223.68, 1058.45], [7.07, 4.87], [.0058, .0046], [.3182, .2914], [.1919, .2318], [.1768, .1921], [428.14, 867.52], [4087.82, 8354.97], [9.55, 9.63]],
    ['比鸡', 1880450, '前一个月', '后一个月', '前399人｜后432人', [1223.68, 1058.45], [14.25, 13.94], [.0116, .0132], [.213, .1991], [.1178, .125], [.0852, .088], [594.71, 1252.68], [20326.25, 40801.1], [34.18, 32.57]],
    ['掼蛋', 1880081, '前一个月', '后一个月', '前3474人｜后3933人', [1223.68, 1058.45], [124.07, 126.87], [.1014, .1199], [.1623, .1866], [.0912, .0928], [.0743, .091], [3040.57, 6390.71], [50348.29, 107784.29], [16.56, 16.87]],
    ['打大A', 1880221, '前一个月', '后一个月', '前286人｜后289人', [1223.68, 1058.45], [10.21, 9.32], [.0083, .0088], [.2832, .2526], [.1748, .1626], [.1503, .1522], [490.68, 1028.94], [8552.54, 17861.68], [17.43, 17.36]],
    ['打弹子', 1880354, '前一个月', '后一个月', '前266人｜后272人', [1223.68, 1058.45], [9.5, 8.77], [.0078, .0083], [.3872, .3897], [.2744, .2353], [.1917, .2206], [764.43, 1625], [17633.75, 38634.06], [23.07, 23.77]],
  ],
  july: [
    ['双扣', 1880019, '前10天', '后10天', '次留/3留：前97人｜后89人；7留：前97人｜后54人', [1019.5, 1069.4], [9.7, 8.9], [.0095, .0083], [.3299, .3596], [.2268, .236], [.2165, .2222], [2564.5, 2636.3], [24376.4, 26589.8], [9.51, 10.09]],
    ['包红五', 1880024, '前10天', '后10天', '次留/3留：前240人｜后272人；7留：前240人｜后170人', [1019.5, 1069.4], [24, 27.2], [.0235, .0254], [.2375, .2279], [.1792, .1324], [.1542, .1059], [3987.2, 4021.7], [51023.2, 55709.8], [12.8, 13.85]],
  ],
};

const sheetMetrics = [
  ['新大厅日均新增', 5, 'number'], ['游戏日均新增', 6, 'number'], ['新增率', 7, 'rate'], ['次日留存', 8, 'rate'], ['3 日留存', 9, 'rate'], ['7 日留存', 10, 'rate'], ['日均真人活跃', 11, 'number'], ['日均真人参局次数', 12, 'number'], ['人均对局', 13, 'number'],
];
const valueFormat = (value, kind) => kind === 'rate' ? `${(value * 100).toFixed(2)}%` : value.toFixed(2);
const deltaFormat = (before, after, kind) => kind === 'rate' ? format((after - before) * 100, 'pp') : format(after - before);

function Summary({ rows }) {
  return <section className="minimal-summary">{fields.map(([label, index, suffix]) => <article key={label}><span>平均变化 · {label}</span><b className={tone(mean(rows, index))}>{format(mean(rows, index), suffix)}</b><small>{rows.filter(row => row[index] > 0).length} / {rows.length} 款游戏上升</small></article>)}</section>;
}

function ConclusionSummary({ active }) {
  const march = active === 'march';
  const conclusions = march ? [
    ['重点表现', '掼蛋表现最完整', '日均新增 +2.80 · 新增率 +1.85pp · 次留 +2.43pp · 7 留 +1.67pp · 人均对局 +0.31'],
    ['影响最明显', '7 日留存改善最稳定', '6 款上升、1 款持平；新大厅日均新增 -13.50%，仅掼蛋日均新增上升'],
    ['指标关系', '新增率与人均对局未呈统一趋势', 'r = -0.05；2 款同升，5 款方向相反'],
  ] : [
    ['重点表现', '没有全链路优异样本', '双扣的留存与深度改善；包红五的新增率与人均对局改善，但 3 留、7 留下降'],
    ['影响最明显', '早期与中长期留存方向相反', '次留平均 +1.01pp · 人均对局 +0.81 · 3 留 -1.88pp · 7 留 -2.13pp'],
    ['指标关系', '当前不形成可用趋势结论', '仅 2 款游戏：双扣新增率下降、对局上升；包红五两项均上升'],
  ];
  return <section className="conclusion-summary" aria-label="数据结论"><h2>数据结论</h2><div>{conclusions.map(([label, conclusion, evidence]) => <article key={label}><span>{label}</span><h3>{conclusion}</h3><p>{evidence}</p></article>)}</div></section>;
}

function GameSheet({ game }) {
  const [name, appId, beforeLabel, afterLabel, sample, ...values] = game;
  return <section className="game-sheet"><header><div><h2>{name}</h2><p>app_id：{appId}</p></div><span>新增样本：{sample}</span></header><div><table><thead><tr><th>数据维度</th><th>{beforeLabel}</th><th>{afterLabel}</th><th>变化</th></tr></thead><tbody>{sheetMetrics.map(([label, valueIndex, kind]) => { const [before, after] = values[valueIndex - 5]; return <tr key={label}><td>{label}</td><td>{valueFormat(before, kind)}</td><td>{valueFormat(after, kind)}</td><td className={tone(after - before)}>{deltaFormat(before, after, kind)}</td></tr>; })}</tbody></table></div></section>;
}

export default function PcOptimizationDashboard() {
  const [active, setActive] = useState('march');
  const [section, setSection] = useState('home');
  const batch = batches[active];
  const rows = useMemo(() => batch.rows, [batch]);
  const games = gameSheets[active];
  const selectedGame = section === 'home' ? null : games.find(game => game[0] === section);
  return <main className="minimal-dashboard">
    <header><div><h1>PC 新大厅改造前后对比</h1><p>只使用 SQL 结果表中的两段时间均值；不含分日趋势或补造数据。</p></div><span>数据整理：2026.07.21</span></header>
    <nav aria-label="选择改造节点" className="minimal-tabs">{Object.entries(batches).map(([key, item]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => { setActive(key); setSection('home'); }}>{item.label}<small>{item.period}</small></button>)}</nav>
    <section className="minimal-scope"><b>{batch.label}</b><span>{batch.period}</span><span>{batch.sample}</span><i>指标：新增率、人均对局、次留、3 日留存、7 日留存</i></section>
    <nav aria-label="选择页面内容" className="sheet-tabs"><button className={section === 'home' ? 'active' : ''} onClick={() => setSection('home')}>主页</button>{games.map(game => <button key={game[1]} className={section === game[0] ? 'active' : ''} onClick={() => setSection(game[0])}>{game[0]}</button>)}</nav>
    {section === 'home' ? <><Summary rows={rows} /><ConclusionSummary active={active} /></> : <GameSheet game={selectedGame} />}
  </main>;
}
