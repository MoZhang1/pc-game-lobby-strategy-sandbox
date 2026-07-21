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

function Analysis({ batch }) {
  const rows = batch.rows;
  const [newRate, rounds, r1, r3, r7] = fields.map(([, index]) => mean(rows, index));
  const march = rows.length === 7;
  const title = march ? '第一轮改造：留存整体改善，新增与深度幅度较小' : '第二轮改造：对局加深，但中长期留存转弱';
  const detail = march
    ? `7 日留存平均 ${format(r7, 'pp')}，6 款上升、1 款持平；新增率平均 ${format(newRate, 'pp')}，人均对局平均 ${format(rounds)}。数据表现更像“留存改善”，不能据此证明新增率与人均对局存在稳定关系。`
    : `当前仅 2 款游戏：人均对局平均 ${format(rounds)}，次留平均 ${format(r1, 'pp')}；但 3 日留存平均 ${format(r3, 'pp')}、7 日留存平均 ${format(r7, 'pp')}。因此不能把“对局变多”直接认定为改造成功。`;
  return <section className="minimal-analysis"><h2>这组均值怎么解读</h2><h3>{title}</h3><p>{detail}</p><ul><li>仅比较同一节点的改造前后均值；两个节点的窗口长度、游戏样本不同，不能横向比绝对大小。</li><li>没有分日数据，页面不展示趋势线、日均曲线或时间序列推断。</li><li>对局使用人均对局；所有数值均为原 SQL 结果表中的游戏级差值再取简单平均。</li></ul></section>;
}

function QuestionAnalysis({ active }) {
  const march = active === 'march';
  const answers = march ? [
    ['1', '哪些游戏调整后表现优异', '掼蛋是唯一的全链路正向样本', '日均新增 +2.80、新增率 +1.85pp、次留 +2.43pp、3留 +0.16pp、7留 +1.67pp、人均对局 +0.31，六项均为正。打弹子仅可定义为“7留与深度改善”：7留 +2.89pp、人均对局 +0.70，但3留 -3.91pp、日均新增下降。'],
    ['2', '哪些数据层面调整后有明显影响', '留存改善最稳定，新增绝对量没有改善', '7日留存 6款上升、1款持平；但新大厅日均新增 1223.68 → 1058.45（-13.50%），7款中仅掼蛋日均新增上升。新增率 5/7 上升反映的是份额变化，不能直接等同于新增成功。'],
    ['3', '新增率和人均对局是否有统一趋势', '没有统一趋势', '7款游戏的相关系数 r = -0.05，接近 0；只有掼蛋、打弹子两款同时上升，其余5款为一升一降。总对局受活跃规模影响，因此仅用人均对局判断深度。'],
  ] : [
    ['1', '哪些游戏调整后表现优异', '当前没有“全链路优异”样本', '双扣的留存与深度改善：次留 +2.97pp、3留 +0.92pp、7留 +0.57pp、人均对局 +0.58；但新增率 -0.12pp。包红五新增率 +0.19pp、人均对局 +1.05，但3留 -4.68pp、7留 -4.83pp，不能判为成功。'],
    ['2', '哪些数据层面调整后有明显影响', '早期与中长期留存方向相反', '两款游戏平均人均对局 +0.81、次留 +1.01pp，但3留 -1.88pp、7留 -2.13pp。当前结果只包含两款游戏、前后各10天，不能推导为整体改造效果。'],
    ['3', '新增率和人均对局是否有统一趋势', '样本不足，不能判断趋势', '两款游戏一款新增率下降但人均对局上升（双扣），一款两者均上升（包红五）。n=2 时即使数值相关也没有统计解释力，后续需补齐更多游戏再判断。'],
  ];
  return <section className="question-analysis" aria-label="三个核心问题分析">{answers.map(([number, question, conclusion, detail]) => <article key={number}><span>{number}</span><div><h2>{question}</h2><h3>{conclusion}</h3><p>{detail}</p></div></article>)}</section>;
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
    <QuestionAnalysis active={active} />
    <section className="minimal-table"><header><h2>游戏级改造前后差值</h2><p>正数表示改造后均值更高；单位：新增率 / 留存为百分点，人均对局为局数。</p></header><div><table><thead><tr><th>游戏</th><th>app_id</th>{fields.map(([label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[1]}><td>{row[0]}</td><td>{row[1]}</td>{fields.map(([, index, suffix]) => <td className={tone(row[index])} key={index}>{format(row[index], suffix)}</td>)}</tr>)}</tbody><tfoot><tr><th colSpan="2">简单平均</th>{fields.map(([, index, suffix]) => <th className={tone(mean(rows, index))} key={index}>{format(mean(rows, index), suffix)}</th>)}</tr></tfoot></table></div></section>
    <Analysis batch={batch} />
  </main>;
}
