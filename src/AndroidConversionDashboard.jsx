import React, { useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { DateRangeInput } from '@astryxdesign/core/DateRangeInput';
import { BarChart3, CalendarDays, FileSearch, TrendingDown, TrendingUp } from 'lucide-react';
import './conversion-dashboard.css';
import './astryx-report.css';
import './astryx-report-overrides.css';

const EVENTS = [
  { id: 'TOTAL_START', label: '总启动（用户启动＋本地包相关点击）', shortLabel: '总启动' },
  { id: '60100102', label: '本地热门游戏点击', shortLabel: '本地热门游戏点击' },
  { id: '60100103', label: '推荐列表游戏点击', shortLabel: '推荐列表游戏点击' },
  { id: '60100201', label: '首屏banner点击', shortLabel: '首屏banner点击' },
  { id: '60100301', label: '次屏banner点击', shortLabel: '次屏banner点击' },
  { id: '60100602', label: '活动banner点击', shortLabel: '活动banner点击' },
  { id: '60100402', label: '首屏弹窗广告点击', shortLabel: '首屏弹窗广告点击' },
  { id: '60100703', label: '搜索游戏点击', shortLabel: '搜索游戏点击' },
  { id: '60102605', label: '页签内点击', shortLabel: '页签内点击' },
  { id: '60103909', label: '游戏模块开始玩点击', shortLabel: '游戏模块开始玩' },
  { id: '60103948', label: '家乡专区游戏点击', shortLabel: '家乡专区游戏点击' },
];

// 口径完整的模块数据自 2026-06-20 起可用。每行：日期、纯新增用户、各事件 UV。
const DAILY_ROWS = [
  ['2026-06-20',579,364,79,8,2,2,8,0,66,22,115,77], ['2026-06-21',579,396,78,2,6,3,12,1,69,32,114,82],
  ['2026-06-22',536,361,79,3,3,2,0,0,71,20,103,82], ['2026-06-23',520,354,67,7,4,1,0,0,78,19,97,87],
  ['2026-06-24',547,378,79,9,2,1,0,1,66,27,131,65], ['2026-06-25',518,360,77,6,3,0,0,1,64,19,112,70],
  ['2026-06-26',529,382,74,6,3,3,0,2,75,25,125,93], ['2026-06-27',494,331,69,2,5,0,0,0,57,15,101,67],
  ['2026-06-28',556,395,69,5,4,4,0,0,74,18,117,95], ['2026-06-29',552,392,68,8,4,0,0,1,61,21,99,113],
  ['2026-06-30',537,372,81,3,0,3,0,0,66,28,131,98], ['2026-07-01',529,359,71,5,1,2,0,1,61,16,127,84],
  ['2026-07-02',542,384,67,3,5,1,0,1,68,21,111,99], ['2026-07-03',569,421,97,3,6,0,10,0,89,30,128,106],
  ['2026-07-04',591,417,82,5,1,0,9,1,69,28,118,124], ['2026-07-05',555,396,79,4,3,0,17,1,73,23,118,111],
  ['2026-07-06',520,372,78,5,5,1,0,0,68,19,113,97], ['2026-07-07',577,409,96,8,3,1,0,0,74,18,106,114],
  ['2026-07-08',532,377,83,8,8,0,0,0,68,22,107,86], ['2026-07-09',569,395,78,5,6,1,0,0,70,28,106,112],
  ['2026-07-10',546,381,81,5,3,1,0,2,58,20,124,105], ['2026-07-11',670,440,90,10,5,0,0,0,105,35,126,108],
  ['2026-07-12',597,404,90,6,8,2,0,2,64,23,135,103], ['2026-07-13',595,421,95,5,9,1,0,0,74,30,117,133],
  ['2026-07-14',573,397,101,6,4,0,0,0,74,32,97,108], ['2026-07-15',594,404,90,1,4,0,0,0,55,28,113,101],
  ['2026-07-16',612,434,80,7,5,3,0,0,89,28,128,118], ['2026-07-17',581,409,64,6,7,1,16,0,63,22,126,127],
  ['2026-07-18',651,468,93,4,8,1,13,1,98,32,114,124], ['2026-07-19',683,479,84,9,12,3,14,0,102,33,121,122],
  ['2026-07-20',650,456,79,9,9,1,0,0,78,28,109,122], ['2026-07-21',652,432,72,4,3,3,0,0,79,30,105,110],
];

const daily = DAILY_ROWS.map(([date, users, ...uvs]) => ({
  date, label: `${Number(date.slice(5, 7))}/${Number(date.slice(8))}`, users,
  uv: Object.fromEntries(EVENTS.map((event, index) => [event.id, uvs[index]])),
}));
const eventSeries = Object.fromEntries(EVENTS.map(event => [event.id, { ...event, values: daily.map(item => item.uv[event.id] / item.users * 100) }]));
const formatDate = value => value.replace('2026-', '').replace('-', '/').replace(/^0/, '');
const formatPp = value => `${value >= 0 ? '+' : ''}${value.toFixed(2)}pp`;

const EXPERIMENTS = [
  {
    id: 'local-hot-v1', title: '实验 1 · 本地热门优化', module: '本地热门',
    content: '根据各市实际新增游戏排序，优化本地热门推荐排序。', start: '2026-07-08', end: '2026-07-14', beforeStart: '2026-07-01', beforeEnd: '2026-07-07',
  },
  {
    id: 'local-hot-v2', title: '实验 2 · 新用户游戏位调整', module: '本地热门',
    content: '调整新用户看到的本地热门展示：增加 1 个棋牌游戏位，减少 1 个营收游戏位置。', start: '2026-07-15', end: '2026-07-21', beforeStart: '2026-07-08', beforeEnd: '2026-07-14',
  },
];

function getSummary(start, end) {
  const rows = daily.filter(item => item.date >= start && item.date <= end);
  const users = rows.reduce((sum, item) => sum + item.users, 0);
  const stats = Object.fromEntries(EVENTS.map(event => {
    const uv = rows.reduce((sum, item) => sum + item.uv[event.id], 0);
    return [event.id, { uv, rate: uv / users * 100 }];
  }));
  return { rows, users, stats };
}

function TrendChart({ items, eventIds = [], markerDate, markerLabel }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const visibleSeries = eventIds.map(id => ({ ...eventSeries[id], values: items.map(item => item.uv[id] / item.users * 100) }));
  const colors = ['#2c6dbe','#c77d18','#1b8d63','#8b5fbf','#c04e73','#3d7e8c','#ac6d1d','#6b7280','#0f766e','#b45309','#4f46e5'];
  const values = visibleSeries.flatMap(series => series.values);
  const low = values.length ? Math.min(...values) : 0; const high = values.length ? Math.max(...values) : 100;
  const span = Math.max(high - low, 5); const chartBounds = { min: low - span * .14, max: high + span * .14 };
  const y = value => 190 - ((value - chartBounds.min) / (chartBounds.max - chartBounds.min)) * 142;
  const x = index => 42 + index * (730 / Math.max(items.length - 1, 1));
  const markerIndex = items.findIndex(item => item.date === markerDate);
  const markerX = markerIndex < 0 ? 0 : x(markerIndex);
  const tooltipX = hoveredIndex === null ? 0 : Math.min(x(hoveredIndex) + 12, 570);
  return <div className="astryxTrend" role="img" aria-label="总启动和模块点击按日趋势">
    <div className="trendLegend">{visibleSeries.length ? visibleSeries.map((series, index) => <span key={series.id}><i style={{ borderColor: colors[index % colors.length] }} />{series.shortLabel}</span>) : <span>未选择事件</span>}</div>
    <svg viewBox="0 0 800 230" onMouseLeave={() => setHoveredIndex(null)}>
      {[44,82,120,158,196].map((lineY, index) => <g key={lineY}><line x1="42" x2="772" y1={lineY} y2={lineY} /><text x="4" y={lineY + 4}>{(chartBounds.max - index * (chartBounds.max - chartBounds.min) / 4).toFixed(chartBounds.max < 10 ? 1 : 0)}%</text></g>)}
      {markerIndex >= 0 && <g><line className="optimiseMarker" x1={markerX} x2={markerX} y1="28" y2="198" /><text className="optimiseLabel" x={markerX + 7} y="39">{markerLabel}</text></g>}
      {visibleSeries.map((series, seriesIndex) => <polyline key={series.id} className="eventSeriesLine" style={{ stroke: colors[seriesIndex % colors.length] }} points={series.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')} />)}
      {hoveredIndex !== null && visibleSeries.map((series, seriesIndex) => <circle key={`${series.id}-${hoveredIndex}`} className="trendPoint" cx={x(hoveredIndex)} cy={y(series.values[hoveredIndex])} r="4" style={{ fill: colors[seriesIndex % colors.length] }} />)}
      {hoveredIndex !== null && visibleSeries.length > 0 && <g className="trendTooltip" transform={`translate(${tooltipX}, 28)`}><rect width="220" height={31 + visibleSeries.length * 18} rx="6" /><text x="10" y="19" className="tooltipDate">{items[hoveredIndex].date}</text>{visibleSeries.map((series, index) => <g key={series.id} transform={`translate(10, ${37 + index * 18})`}><circle cx="4" cy="-4" r="3" style={{ fill: colors[index % colors.length] }} /><text x="13" y="0">{series.shortLabel}　{series.values[hoveredIndex].toFixed(1)}%</text></g>)}</g>}
      {!visibleSeries.length && <text className="emptyChartText" x="407" y="125" textAnchor="middle">请选择至少一个事件查看趋势</text>}
      {visibleSeries.length > 0 && items.map((item, index) => <rect className="trendHoverTarget" key={item.date} x={x(index) - 730 / Math.max(items.length - 1, 1) / 2} y="26" width={730 / Math.max(items.length - 1, 1)} height="174" onMouseEnter={() => setHoveredIndex(index)} onClick={() => setHoveredIndex(index)} />)}
      {items.map((item, index) => <text className="axisLabel" x={x(index)} y="222" textAnchor="middle" key={item.date}>{item.label}</text>)}
    </svg>
  </div>;
}

function Metric({ label, value, helper, tone = 'neutral', icon: Icon }) {
  return <Card className="astryxMetric"><div><span>{label}</span><b className={tone}>{value}</b><small>{helper}</small></div>{Icon && <Icon aria-hidden="true" />}</Card>;
}

function AttributionTable({ items, beforeLabel, afterLabel }) {
  return <div className="attributionTable" role="table" aria-label="模块归因与问题定位">
    <div className="attributionHead" role="row"><span>模块事件</span><span>{beforeLabel}</span><span>{afterLabel}</span><span>变化</span><span>复盘判断</span></div>
    {items.map(item => <div className="attributionRow" role="row" key={item.id}><strong role="cell" data-label="模块事件">{item.label}</strong><span role="cell" data-label={beforeLabel}>{item.before.toFixed(2)}%</span><span role="cell" data-label={afterLabel}>{item.after.toFixed(2)}%</span><b role="cell" data-label="变化" className={item.delta >= 0 ? 'positive' : 'negative'}>{formatPp(item.delta)}</b><span role="cell" data-label="复盘判断" className="attributionConclusion">{item.conclusion}</span></div>)}
  </div>;
}

function GlobalEventTable() {
  const all = getSummary('2026-06-20', '2026-07-21');
  return <div className="globalEventTable" role="table" aria-label="模块事件概览">
    <div className="globalEventHead" role="row"><span>事件</span><span>全期占比</span><span>数据说明</span></div>
    {EVENTS.map(event => <div className="globalEventRow" role="row" key={event.id}><strong role="cell" data-label="事件">{event.id === 'TOTAL_START' ? event.label : `${event.id} · ${event.label}`}</strong><span role="cell" data-label="全期占比">{all.stats[event.id].rate.toFixed(2)}%</span><span role="cell" data-label="数据说明">全期 {all.stats[event.id].uv.toLocaleString()} / {all.users.toLocaleString()}</span></div>)}
  </div>;
}

function GlobalDataPage() {
  const [range, setRange] = useState({ start: '2026-06-20', end: '2026-07-21' });
  const [appliedRange, setAppliedRange] = useState(range);
  const [eventIds, setEventIds] = useState(['TOTAL_START', '60100102']);
  const selected = useMemo(() => daily.filter(item => item.date >= appliedRange.start && item.date <= appliedRange.end), [appliedRange]);
  const summary = getSummary(appliedRange.start, appliedRange.end);
  const selectedEvent = eventIds.length === 1 ? eventSeries[eventIds[0]] : null;
  const toggleEvent = id => setEventIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const period = `${formatDate(appliedRange.start)}–${formatDate(appliedRange.end)}`;
  return <>
    <header className="pageIntro"><div><h1>全局数据</h1><p>安卓纯新增用户 · 总启动与模块点击总览</p></div><span>数据更新至 2026/07/21</span></header>
    <Card className="filterCard"><div className="filterCopy"><CalendarDays /><div><b>数据日期</b><span>模块数据有效起始 6/20；总启动＝用户启动＋本地包相关点击</span></div></div><DateRangeInput label="数据日期" isLabelHidden value={range} onChange={value => value && setRange(value)} min="2026-06-20" max="2026-07-21" numberOfMonths={1} /><Button label="应用筛选" variant="primary" onClick={() => setAppliedRange(range)} /></Card>
    <div className="globalMetrics"><Metric label="期间总启动占比" value={`${summary.stats.TOTAL_START.rate.toFixed(2)}%`} helper={`${summary.stats.TOTAL_START.uv.toLocaleString()} / ${summary.users.toLocaleString()} · ${period}`} icon={BarChart3} /><Metric label="趋势已选事件" value={eventIds.length ? `${eventIds.length} 项` : '未选择'} helper={selectedEvent ? selectedEvent.label : '支持多选或全部取消'} tone="positive" icon={TrendingUp} /><Metric label="纯新增用户数" value={summary.users.toLocaleString()} helper={`${selected.length} 天 · 模块数据起始 6/20`} icon={FileSearch} /></div>
    <section className="pageSection"><div className="sectionTitle"><div><h2>事件趋势</h2><p>{period} · 多事件共用占比纵轴</p></div><details className="eventPicker"><summary>筛选事件 <b>{eventIds.length ? `已选 ${eventIds.length} 项` : '未选择'}</b></summary><div>{EVENTS.map(event => <label key={event.id}><input type="checkbox" checked={eventIds.includes(event.id)} onChange={() => toggleEvent(event.id)} />{event.label}</label>)}</div></details></div><Card className="chartCard"><TrendChart items={selected} eventIds={eventIds} /></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>模块事件概览</h2><p>按最新完整口径汇总 · 总启动已包含本地包相关点击</p></div></div><Card className="globalEventCard"><GlobalEventTable /></Card></section>
  </>;
}

function ReviewPage() {
  const [experimentId, setExperimentId] = useState('local-hot-v2');
  const experiment = EXPERIMENTS.find(item => item.id === experimentId);
  const before = getSummary(experiment.beforeStart, experiment.beforeEnd);
  const after = getSummary(experiment.start, experiment.end);
  const totalDelta = after.stats.TOTAL_START.rate - before.stats.TOTAL_START.rate;
  const localDelta = after.stats['60100102'].rate - before.stats['60100102'].rate;
  const playDelta = after.stats['60103909'].rate - before.stats['60103909'].rate;
  const bannerDelta = after.stats['60100602'].rate - before.stats['60100602'].rate;
  const driverItems = EVENTS.filter(event => event.id !== 'TOTAL_START').map(event => {
    const beforeRate = before.stats[event.id].rate; const afterRate = after.stats[event.id].rate; const delta = afterRate - beforeRate;
    let conclusion = delta >= 0 ? '正向变化，继续观察稳定性' : '负向变化，需结合承接链路观察';
    if (event.id === '60100102') conclusion = experimentId === 'local-hot-v2' ? '实验模块点击下降，不能仅用总启动提升证明实验有效' : '实验模块点击提升，但未带动总启动';
    if (event.id === '60103909') conclusion = '连续两轮走低，优先检查游戏承接、排序和启动链路';
    if (event.id === '60100602') conclusion = '活动临时投放，作为环境变量单列，不与实验混合归因';
    return { id: event.id, label: event.shortLabel, before: beforeRate, after: afterRate, delta, conclusion };
  }).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const moduleVerdict = localDelta > 0 ? '正优化' : localDelta < 0 ? '负优化' : '无明显变化';
  const startupVerdict = totalDelta > 0 ? '正优化' : totalDelta < 0 ? '负优化' : '无明显变化';
  const candidate = driverItems.filter(item => item.id !== '60100102' && Math.sign(item.delta) === Math.sign(totalDelta)).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  const bannerOnRows = after.rows.filter(item => item.uv['60100602'] > 0);
  const bannerOffRows = after.rows.filter(item => item.uv['60100602'] === 0);
  const totalStartRate = rows => rows.reduce((sum, item) => sum + item.uv.TOTAL_START, 0) / rows.reduce((sum, item) => sum + item.users, 0) * 100;
  const bannerDayGap = bannerOnRows.length && bannerOffRows.length ? totalStartRate(bannerOnRows) - totalStartRate(bannerOffRows) : null;
  const trendItems = daily.filter(item => item.date >= experiment.beforeStart && item.date <= experiment.end);
  const nextSteps = experimentId === 'local-hot-v2'
    ? [{ title: '继续按当前规则观察一周数据变化。', detail: '活动 Banner 的投放会影响本地热门点击效果，需要先排除该环境变量后再判断实验结果。' }]
    : [{ title: '补充本地热门游戏位的明细数据。', detail: '分别看新增棋牌游戏位、减少营收游戏位的曝光、点击与启动贡献。' }, { title: '持续定位游戏模块开始玩的下降原因。', detail: '优先检查承接游戏、排序和点击后的启动链路。' }];
  return <>
    <header className="pageIntro"><div><h1>实验复盘</h1><p>按实验区间切换查看 · 总启动＝用户启动＋本地包相关点击</p></div><span>固定实验口径</span></header>
    <Card className="experimentSelector"><div><b>选择实验区间</b><span>具体实验模块在下方实验分段中说明</span></div><select value={experimentId} onChange={event => setExperimentId(event.target.value)} aria-label="选择实验区间">{EXPERIMENTS.map(item => <option value={item.id} key={item.id}>{item.title} · {formatDate(item.start)}–{formatDate(item.end)}</option>)}</select></Card>
    <section className="experimentBlock"><div className="sectionTitle"><div><h2>{experiment.title}</h2><p>{formatDate(experiment.start)}–{formatDate(experiment.end)} · 对比 {formatDate(experiment.beforeStart)}–{formatDate(experiment.beforeEnd)}</p></div></div>
      <Card className="experimentBrief"><div><span>实验模块</span><b>{experiment.module}</b></div><div><span>实验内容</span><b>{experiment.content}</b></div></Card>
      <div className="reviewCallout"><b>实验效果结论</b><p>对实验模块：<strong className={localDelta >= 0 ? 'positive' : 'negative'}>{moduleVerdict}</strong>（本地热门点击 {formatPp(localDelta)}）。对总启动：<strong className={totalDelta >= 0 ? 'positive' : 'negative'}>{startupVerdict}</strong>（{before.stats.TOTAL_START.rate.toFixed(2)}% → {after.stats.TOTAL_START.rate.toFixed(2)}%，{formatPp(totalDelta)}）。</p><p>若总启动变化不是由实验模块带动，当前模块粒度下的最大同步候选是<strong>{candidate.label}</strong>（{formatPp(candidate.delta)}）。这只是同步信号，不代表因果；模块点击用户可重叠，现有数据无法把总启动变化精确拆到单一模块。</p></div>
      <div className="reviewMetrics"><Metric label="对实验模块" value={moduleVerdict} helper={`本地热门点击 ${before.stats['60100102'].rate.toFixed(2)}% → ${after.stats['60100102'].rate.toFixed(2)}% · ${formatPp(localDelta)}`} tone={localDelta >= 0 ? 'positive' : 'negative'} icon={localDelta >= 0 ? TrendingUp : TrendingDown} /><Metric label="对总启动" value={startupVerdict} helper={`${before.stats.TOTAL_START.rate.toFixed(2)}% → ${after.stats.TOTAL_START.rate.toFixed(2)}% · ${formatPp(totalDelta)}`} tone={totalDelta >= 0 ? 'positive' : 'negative'} icon={totalDelta >= 0 ? TrendingUp : TrendingDown} /><Metric label="实验期总启动占比" value={`${after.stats.TOTAL_START.rate.toFixed(2)}%`} helper={`${after.stats.TOTAL_START.uv.toLocaleString()} / ${after.users.toLocaleString()} · ${formatDate(experiment.start)}–${formatDate(experiment.end)}`} icon={BarChart3} /><Metric label="最大同步候选" value={candidate.label} helper={`${formatPp(candidate.delta)} · 仅为候选，不作因果结论`} tone={candidate.delta >= 0 ? 'positive' : 'negative'} icon={candidate.delta >= 0 ? TrendingUp : TrendingDown} /></div>
      <section className="pageSection"><div className="sectionTitle"><div><h2>实验前后趋势</h2><p>仅保留实验前后各 7 天 · 虚线为实验上线</p></div></div><Card className="chartCard"><TrendChart items={trendItems} eventIds={['TOTAL_START', '60100102']} markerDate={experiment.start} markerLabel={`${formatDate(experiment.start)} 实验上线`} /></Card></section>
      <section className="pageSection"><div className="sectionTitle"><div><h2>模块归因与问题定位</h2><p>按实验前后变化幅度排序 · 单位：pp</p></div></div><Card className="attributionCard"><AttributionTable items={driverItems} beforeLabel="实验前" afterLabel="实验期" /></Card></section>
      <section className="pageSection bannerSection"><div className="sectionTitle"><div><h2>活动 Banner：单列环境变量</h2><p>临时按需投放，不计入本地热门实验成效</p></div></div><Card className="bannerCardV2"><div><span>实验前活动 Banner 点击</span><b>{before.stats['60100602'].rate.toFixed(2)}%</b><small>{before.stats['60100602'].uv.toLocaleString()} UV</small></div><div><span>实验期活动 Banner 点击</span><b>{after.stats['60100602'].rate.toFixed(2)}%</b><small>{after.stats['60100602'].uv.toLocaleString()} UV</small></div><aside><b>{formatPp(bannerDelta)}</b><span>{bannerDayGap === null ? '实验期无 Banner 点击日，暂无可比拆分' : `Banner 点击日总启动较无点击日高 ${formatPp(bannerDayGap)}；仅为相关性`}</span></aside></Card></section>
      <section className="pageSection"><div className="sectionTitle"><div><h2>下一步</h2></div></div><ol className="reviewActions">{nextSteps.map(item => <li key={item.title}><b>{item.title}</b><span>{item.detail}</span></li>)}</ol></section>
    </section>
  </>;
}

function ConversionDashboard() {
  const [page, setPage] = useState('global');
  return <div className="astryxReport" data-astryx-theme="neutral" data-astryx-media="light"><aside className="reportNav"><div className="reportBrand"><span>游戏大厅分发</span><small>安卓新增用户分析</small></div><nav aria-label="报告导航"><button className={page === 'global' ? 'selected' : ''} onClick={() => setPage('global')}><BarChart3 />全局数据</button><button className={page === 'review' ? 'selected' : ''} onClick={() => setPage('review')}><FileSearch />实验复盘</button></nav><p>数据由人工补充<br />更新后生成本地报告</p></aside><main className="reportMain"><div className="reportContent">{page === 'global' ? <GlobalDataPage /> : <ReviewPage />}</div></main></div>;
}

export default ConversionDashboard;
