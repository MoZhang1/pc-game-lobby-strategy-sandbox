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

export default function PcOptimizationDashboard() {
  const [active, setActive] = useState('march');
  const batch = batches[active];
  const rows = useMemo(() => batch.rows, [batch]);
  return <main className="minimal-dashboard">
    <header><div><h1>PC 新大厅改造前后对比</h1><p>只使用 SQL 结果表中的两段时间均值；不含分日趋势或补造数据。</p></div><span>数据整理：2026.07.21</span></header>
    <nav aria-label="选择改造节点" className="minimal-tabs">{Object.entries(batches).map(([key, item]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => setActive(key)}>{item.label}<small>{item.period}</small></button>)}</nav>
    <section className="minimal-scope"><b>{batch.label}</b><span>{batch.period}</span><span>{batch.sample}</span><i>指标：新增率、人均对局、次留、3 日留存、7 日留存</i></section>
    <Summary rows={rows} />
    <ConclusionSummary active={active} />
    <section className="minimal-table"><header><h2>游戏级改造前后差值</h2><p>正数表示改造后均值更高；单位：新增率 / 留存为百分点，人均对局为局数。</p></header><div><table><thead><tr><th>游戏</th><th>app_id</th>{fields.map(([label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[1]}><td>{row[0]}</td><td>{row[1]}</td>{fields.map(([, index, suffix]) => <td className={tone(row[index])} key={index}>{format(row[index], suffix)}</td>)}</tr>)}</tbody><tfoot><tr><th colSpan="2">简单平均</th>{fields.map(([, index, suffix]) => <th className={tone(mean(rows, index))} key={index}>{format(mean(rows, index), suffix)}</th>)}</tr></tfoot></table></div></section>
  </main>;
}
