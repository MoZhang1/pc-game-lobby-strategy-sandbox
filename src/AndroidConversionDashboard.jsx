import React, { useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { DateRangeInput } from '@astryxdesign/core/DateRangeInput';
import { BarChart3, CalendarDays, FileSearch, TrendingDown, TrendingUp } from 'lucide-react';
import './conversion-dashboard.css';
import './astryx-report.css';
import './astryx-report-overrides.css';

const daily = [
  { date: '2026-06-15', label: '6/15', users: 517, launch: 61.3, local: 7.7, launchUv: 317, localUv: 40 }, { date: '2026-06-16', label: '6/16', users: 473, launch: 72.1, local: 8.2, launchUv: 341, localUv: 39 },
  { date: '2026-06-17', label: '6/17', users: 498, launch: 68.7, local: 10.6, launchUv: 342, localUv: 53 }, { date: '2026-06-18', label: '6/18', users: 545, launch: 69.9, local: 13.8, launchUv: 381, localUv: 75 },
  { date: '2026-06-19', label: '6/19', users: 646, launch: 70.3, local: 12.7, launchUv: 454, localUv: 82 }, { date: '2026-06-20', label: '6/20', users: 579, launch: 70.1, local: 15.5, launchUv: 406, localUv: 90 },
  { date: '2026-06-21', label: '6/21', users: 579, launch: 68.2, local: 13.5, launchUv: 395, localUv: 78 }, { date: '2026-06-22', label: '6/22', users: 536, launch: 66.6, local: 14.7, launchUv: 357, localUv: 79 },
  { date: '2026-06-23', label: '6/23', users: 520, launch: 67.5, local: 12.9, launchUv: 351, localUv: 67 }, { date: '2026-06-24', label: '6/24', users: 547, launch: 68.7, local: 14.4, launchUv: 376, localUv: 79 },
  { date: '2026-06-25', label: '6/25', users: 518, launch: 68.7, local: 14.9, launchUv: 356, localUv: 77 }, { date: '2026-06-26', label: '6/26', users: 529, launch: 70.9, local: 14.0, launchUv: 375, localUv: 74 },
  { date: '2026-06-27', label: '6/27', users: 494, launch: 67.0, local: 14.0, launchUv: 331, localUv: 69 }, { date: '2026-06-28', label: '6/28', users: 556, launch: 70.9, local: 12.4, launchUv: 394, localUv: 69 },
  { date: '2026-06-29', label: '6/29', users: 552, launch: 70.3, local: 12.3, launchUv: 388, localUv: 68 }, { date: '2026-06-30', label: '6/30', users: 537, launch: 68.5, local: 15.1, launchUv: 368, localUv: 81 },
  { date: '2026-07-01', label: '7/1', users: 529, launch: 66.9, local: 13.4, launchUv: 354, localUv: 71 }, { date: '2026-07-02', label: '7/2', users: 542, launch: 69.6, local: 12.4, launchUv: 377, localUv: 67 },
  { date: '2026-07-03', label: '7/3', users: 569, launch: 73.3, local: 17.0, launchUv: 417, localUv: 97 }, { date: '2026-07-04', label: '7/4', users: 591, launch: 70.2, local: 13.9, launchUv: 415, localUv: 82 },
  { date: '2026-07-05', label: '7/5', users: 555, launch: 70.6, local: 14.2, launchUv: 392, localUv: 79 }, { date: '2026-07-06', label: '7/6', users: 520, launch: 70.6, local: 15.0, launchUv: 367, localUv: 78 },
  { date: '2026-07-07', label: '7/7', users: 577, launch: 70.0, local: 16.6, launchUv: 404, localUv: 96 }, { date: '2026-07-08', label: '7/8', users: 532, launch: 70.1, local: 15.6, launchUv: 373, localUv: 83 },
  { date: '2026-07-09', label: '7/9', users: 569, launch: 68.7, local: 13.7, launchUv: 391, localUv: 78 }, { date: '2026-07-10', label: '7/10', users: 546, launch: 68.7, local: 14.8, launchUv: 375, localUv: 81 },
  { date: '2026-07-11', label: '7/11', users: 670, launch: 64.5, local: 13.4, launchUv: 432, localUv: 90 }, { date: '2026-07-12', label: '7/12', users: 597, launch: 66.7, local: 15.1, launchUv: 398, localUv: 90 },
  { date: '2026-07-13', label: '7/13', users: 595, launch: 69.7, local: 16.0, launchUv: 415, localUv: 95 }, { date: '2026-07-14', label: '7/14', users: 573, launch: 67.5, local: 17.6, launchUv: 387, localUv: 101 },
];

const modules = [
  { event: '60101404 · 用户启动游戏', rate: '68.89%', note: '全期 11,429 / 16,591' }, { event: '60100102 · 本地热门游戏点击', rate: '13.91%', note: '全期 2,308 / 16,591' },
  { event: '60100103 · 推荐列表游戏点击', rate: '0.94%', note: '全期 156 / 16,591' }, { event: '60100201 · 首屏banner点击', rate: '0.77%', note: '全期 127 / 16,591' },
  { event: '60100301 · 次屏banner点击', rate: '0.23%', note: '全期 38 / 16,591' }, { event: '60100602 · 活动banner点击', rate: '0.42%', note: '全期 70 / 16,591' },
  { event: '60100402 · 首屏弹窗广告点击', rate: '0.11%', note: '全期 19 / 16,591' }, { event: '60100703 · 搜索游戏点击', rate: '12.90%', note: '全期 2,141 / 16,591' },
  { event: '60102605 · 页签内点击', rate: '4.39%', note: '全期 728 / 16,591' }, { event: '60103909 · 游戏模块开始玩点击', rate: '20.93%', note: '全期 3,473 / 16,591' },
  { event: '60103948 · 家乡专区游戏点击', rate: '17.02%', note: '全期 2,824 / 16,591' },
];

const eventSeries = {
  60101404: { label: '用户启动游戏', values: [61.3,72.1,68.7,69.9,70.3,70.1,68.2,66.6,67.5,68.7,68.7,70.9,67,70.9,70.3,68.5,66.9,69.6,73.3,70.2,70.6,70.6,70,70.1,68.7,68.7,64.5,66.7,69.7,67.5] },
  60100102: { label: '本地热门游戏点击', values: [7.7,8.2,10.6,13.8,12.7,15.5,13.5,14.7,12.9,14.4,14.9,14,14,12.4,12.3,15.1,13.4,12.4,17,13.9,14.2,15,16.6,15.6,13.7,14.8,13.4,15.1,16,17.6] },
  60100103: { label: '推荐列表游戏点击', values: [0.2,0.6,0.6,1.1,0.9,1.4,0.3,0.6,1.3,1.6,1.2,1.1,0.4,0.9,1.4,0.6,0.9,0.6,0.5,0.8,0.7,1,1.4,1.5,0.9,0.9,1.5,1,0.8,1] },
  60100201: { label: '首屏banner点击', values: [0.4,0.8,0.8,1.1,1.1,0.5,1,0.6,0.8,0.4,0.6,0.6,1,0.7,0.7,0,0.2,0.9,1.1,0.2,0.5,1,0.5,1.5,1.1,0.5,0.7,1.3,1.5,0.7] },
  60100301: { label: '次屏banner点击', values: [0,1.1,0,0.6,0.2,0.3,0.5,0.4,0.2,0.2,0,0.6,0,0.7,0,0.6,0.4,0.2,0,0,0,0.2,0.2,0,0.2,0.2,0,0.3,0.2,0] },
  60100602: { label: '活动banner点击', values: [0,0,0,0,2,1.6,2.1,0,0,0,0,0,0,0,0,0,0,0,1.8,1.5,3.1,0,0,0,0,0,0,0,0,0] },
  60100402: { label: '首屏弹窗广告点击', values: [0.2,0,0.2,0,0.5,0,0.2,0,0,0.2,0.2,0.4,0,0,0.2,0,0.2,0.2,0,0.2,0.2,0,0,0,0,0.4,0,0.3,0,0] },
  60100703: { label: '搜索游戏点击', values: [12.6,14.4,13.9,16,12.2,13.3,11.9,13.2,15,12.1,12.4,14.2,11.5,13.3,11.1,12.3,11.5,12.5,15.6,11.7,13.2,13.1,12.8,12.8,12.3,10.6,15.7,10.7,12.4,12.9] },
  60102605: { label: '页签内点击', values: [5.4,5.1,4.6,5.5,3.6,5.4,5.5,3.7,3.7,4.9,3.7,4.7,3,3.2,3.8,5.2,3,3.9,5.3,4.7,4.1,3.7,3.1,4.1,4.9,3.7,5.2,3.9,5,5.6] },
  60103909: { label: '游戏模块开始玩点击', values: [19,22,21.3,22.8,23.4,21.9,19.7,19.2,18.7,23.9,21.6,23.6,20.4,21,17.9,24.4,24,20.5,22.5,20,21.3,21.7,18.4,20.1,18.6,22.7,18.8,22.6,19.7,16.9] },
  60103948: { label: '家乡专区游戏点击', values: [14.3,15.6,15.1,14.5,13.9,15.5,14.2,15.3,16.7,11.9,13.5,17.6,13.6,17.1,20.5,18.2,15.9,18.3,18.6,21,20,18.7,19.8,16.2,19.7,19.2,16.1,17.3,22.4,18.8] },
};

const attribution = [
  { event: '游戏模块开始玩', before: '21.14%', after: '19.89%', delta: '-1.25pp', conclusion: '最大负向模块，优先检查承接游戏与排序' },
  { event: '本地热门游戏点击', before: '14.68%', after: '15.14%', delta: '+0.46pp', conclusion: '优化方向成立，点击提升未带动整体启动' },
  { event: '页签内点击', before: '—', after: '—', delta: '+0.66pp', conclusion: '正向变化，继续观察稳定性' },
  { event: '家乡专区游戏点击', before: '—', after: '—', delta: '-0.43pp', conclusion: '次要负向模块' },
  { event: '搜索游戏点击', before: '—', after: '—', delta: '-0.36pp', conclusion: '次要负向模块' },
];

function TrendChart({ items, eventIds = [], annotate = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const visibleSeries = eventIds.map(id => ({ id, ...eventSeries[id], values: items.map(item => eventSeries[id].values[daily.findIndex(day => day.date === item.date)]) }));
  const colors = ['#2c6dbe','#c77d18','#1b8d63','#8b5fbf','#c04e73','#3d7e8c','#ac6d1d','#6b7280','#0f766e','#b45309','#4f46e5'];
  const bounds = (valuesToScale, minimumSpan) => {
    const low = Math.min(...valuesToScale); const high = Math.max(...valuesToScale); const span = Math.max(high - low, minimumSpan); const pad = span * .14;
    return { min: low - pad, max: high + pad };
  };
  const chartBounds = visibleSeries.length ? bounds(visibleSeries.flatMap(series => series.values), 5) : { min: 0, max: 100 };
  const y = value => 190 - ((value - chartBounds.min) / (chartBounds.max - chartBounds.min)) * 142;
  const x = index => 42 + index * (730 / Math.max(items.length - 1, 1));
  const launchIndex = items.findIndex(item => item.date === '2026-07-08');
  const markerX = 42 + launchIndex * (730 / Math.max(items.length - 1, 1));
  const tooltipX = hoveredIndex === null ? 0 : Math.min(x(hoveredIndex) + 12, 570);
  const tooltipHeight = 31 + visibleSeries.length * 18;
  return <div className="astryxTrend" role="img" aria-label="启动游戏占比和本地热门点击占比按日趋势">
    <div className="trendLegend">{visibleSeries.length ? visibleSeries.map((series, index) => <span key={series.id}><i style={{ borderColor: colors[index % colors.length] }} />{series.label}</span>) : <span>未选择事件</span>}</div>
    <svg viewBox="0 0 800 230" onMouseLeave={() => setHoveredIndex(null)}>
      {[44, 82, 120, 158, 196].map((lineY, index) => <g key={lineY}><line x1="42" x2="772" y1={lineY} y2={lineY} /><text x="4" y={lineY + 4}>{(chartBounds.max - index * (chartBounds.max - chartBounds.min) / 4).toFixed(visibleSeries.length && chartBounds.max < 10 ? 1 : 0)}%</text></g>)}
      {annotate && launchIndex >= 0 && <g><line className="optimiseMarker" x1={markerX} x2={markerX} y1="28" y2="198" /><text className="optimiseLabel" x={markerX + 7} y="39">7/8 优化上线</text></g>}
      {visibleSeries.map((series, seriesIndex) => <polyline key={series.id} className="eventSeriesLine" style={{ stroke: colors[seriesIndex % colors.length] }} points={series.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')} />)}
      {hoveredIndex !== null && visibleSeries.map((series, seriesIndex) => <circle key={`${series.id}-${hoveredIndex}`} className="trendPoint" cx={x(hoveredIndex)} cy={y(series.values[hoveredIndex])} r="4" style={{ fill: colors[seriesIndex % colors.length] }} />)}
      {hoveredIndex !== null && visibleSeries.length > 0 && <g className="trendTooltip" transform={`translate(${tooltipX}, 28)`}><rect width="220" height={tooltipHeight} rx="6" /><text x="10" y="19" className="tooltipDate">{items[hoveredIndex].date}</text>{visibleSeries.map((series, index) => <g key={series.id} transform={`translate(10, ${37 + index * 18})`}><circle cx="4" cy="-4" r="3" style={{ fill: colors[index % colors.length] }} /><text x="13" y="0">{series.label}　{series.values[hoveredIndex].toFixed(1)}%</text></g>)}</g>}
      {!visibleSeries.length && <text className="emptyChartText" x="407" y="125" textAnchor="middle">请选择至少一个事件查看趋势</text>}
      {visibleSeries.length > 0 && items.map((item, index) => <rect className="trendHoverTarget" key={`hover-${item.date}`} x={x(index) - 730 / Math.max(items.length - 1, 1) / 2} y="26" width={730 / Math.max(items.length - 1, 1)} height="174" onMouseEnter={() => setHoveredIndex(index)} onClick={() => setHoveredIndex(index)} />)}
      {items.map((item, index) => <text className="axisLabel" x={x(index)} y="222" textAnchor="middle" key={item.date}>{item.label}</text>)}
    </svg>
  </div>;
}

function Metric({ label, value, helper, tone = 'neutral', icon: Icon }) {
  return <Card className="astryxMetric"><div><span>{label}</span><b className={tone}>{value}</b><small>{helper}</small></div>{Icon && <Icon aria-hidden="true" />}</Card>;
}

function AttributionTable() {
  return <div className="attributionTable" role="table" aria-label="模块归因与问题定位">
    <div className="attributionHead" role="row"><span>模块事件</span><span>优化前</span><span>优化后</span><span>变化</span><span>复盘判断</span></div>
    {attribution.map(item => <div className="attributionRow" role="row" key={item.event}>
      <strong role="cell" data-label="模块事件">{item.event}</strong>
      <span role="cell" data-label="优化前">{item.before}</span>
      <span role="cell" data-label="优化后">{item.after}</span>
      <b role="cell" data-label="变化" className={item.delta.startsWith('+') ? 'positive' : 'negative'}>{item.delta}</b>
      <span role="cell" data-label="复盘判断" className="attributionConclusion">{item.conclusion}</span>
    </div>)}
  </div>;
}

function GlobalEventTable() {
  return <div className="globalEventTable" role="table" aria-label="模块事件概览">
    <div className="globalEventHead" role="row"><span>事件</span><span>全期占比</span><span>数据说明</span></div>
    {modules.map(item => <div className="globalEventRow" role="row" key={item.event}><strong role="cell" data-label="事件">{item.event}</strong><span role="cell" data-label="全期占比">{item.rate}</span><span role="cell" data-label="数据说明">{item.note}</span></div>)}
  </div>;
}

function GlobalDataPage() {
  const [range, setRange] = useState({ start: '2026-06-15', end: '2026-07-14' });
  const [appliedRange, setAppliedRange] = useState(range);
  const [eventIds, setEventIds] = useState(['60101404', '60100102']);
  const selected = useMemo(() => daily.filter(item => item.date >= appliedRange.start && item.date <= appliedRange.end), [appliedRange]);
  const totalUsers = selected.reduce((sum, item) => sum + item.users, 0);
  const launchUsers = selected.reduce((sum, item) => sum + item.launchUv, 0);
  const selectedEvent = eventIds.length === 1 ? eventSeries[eventIds[0]] : null;
  const toggleEvent = id => setEventIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const meanLaunch = launchUsers / (totalUsers || 1) * 100;
  const period = `${appliedRange.start.replaceAll('-', '/')}–${appliedRange.end.replaceAll('-', '/')}`;

  return <>
    <header className="pageIntro"><div><h1>全局数据</h1><p>安卓纯新增用户 · 启动游戏与模块点击总览</p></div><span>数据更新至 2026/07/15</span></header>
    <Card className="filterCard"><div className="filterCopy"><CalendarDays /><div><b>数据日期</b><span>选择区间后更新趋势与期间汇总指标</span></div></div><DateRangeInput label="数据日期" isLabelHidden value={range} onChange={value => value && setRange(value)} min="2026-06-15" max="2026-07-14" numberOfMonths={1} /><Button label="应用筛选" variant="primary" onClick={() => setAppliedRange(range)} /></Card>
    <div className="globalMetrics"><Metric label="期间启动游戏占比" value={`${meanLaunch.toFixed(2)}%`} helper={`${launchUsers.toLocaleString()} / ${totalUsers.toLocaleString()} · ${period}`} icon={BarChart3} /><Metric label="趋势已选事件" value={eventIds.length ? `${eventIds.length} 项` : '未选择'} helper={selectedEvent ? selectedEvent.label : '支持多选或全部取消'} tone="positive" icon={TrendingUp} /><Metric label="纯新增用户数" value={totalUsers.toLocaleString()} helper={`${selected.length} 天 · 源表起始 6/15`} icon={FileSearch} /></div>
    <section className="pageSection"><div className="sectionTitle"><div><h2>事件趋势</h2><p>{period} · 多事件共用占比纵轴</p></div><details className="eventPicker"><summary>筛选事件 <b>{eventIds.length ? `已选 ${eventIds.length} 项` : '未选择'}</b></summary><div>{Object.entries(eventSeries).map(([id, series]) => <label key={id}><input type="checkbox" checked={eventIds.includes(id)} onChange={() => toggleEvent(id)} />{series.label}</label>)}</div></details></div><Card className="chartCard"><TrendChart items={selected} eventIds={eventIds} /></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>模块事件概览</h2><p>源表已接入的全部事件 · 按全期真实 UV 汇总</p></div></div><Card className="globalEventCard"><GlobalEventTable /></Card></section>
  </>;
}

function ReviewPage() {
  return <>
    <header className="pageIntro"><div><h1>7 月 8 日本地热门优化复盘</h1><p>对比 7/1–7/7 与 7/8–7/14 · 纯新用户启动游戏占比</p></div><span>固定复盘口径</span></header>
    <div className="reviewCallout"><b>问题定位结论</b><p>本地热门点击提升 <strong>0.46pp</strong>，优化方向有效；整体 KPI 下降 <em>2.32pp</em>，当前模块粒度下，最大同步负向信号来自 <strong>“游戏模块开始玩”下降 1.25pp</strong>。</p></div>
    <div className="reviewMetrics"><Metric label="优化前启动游戏占比" value="70.20%" helper="2,726 / 3,883 · 7/1–7/7" icon={BarChart3} /><Metric label="优化后启动游戏占比" value="67.88%" helper="2,771 / 4,082 · 7/8–7/14" tone="negative" icon={TrendingDown} /><Metric label="本地热门点击变化" value="+0.46pp" helper="14.68% → 15.14%" tone="positive" icon={TrendingUp} /><Metric label="游戏模块开始玩变化" value="-1.25pp" helper="21.14% → 19.89%" tone="negative" icon={TrendingDown} /></div>
    <section className="pageSection"><div className="sectionTitle"><div><h2>优化前后趋势</h2><p>虚线为 7 月 8 日本地热门优化上线</p></div></div><Card className="chartCard"><TrendChart items={daily} eventIds={['60101404', '60100102']} annotate /></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>模块归因与问题定位</h2><p>按优化前后变化幅度排序 · 单位：pp</p></div></div><Card className="attributionCard"><AttributionTable /></Card></section>
    <section className="pageSection bannerSection"><div className="sectionTitle"><div><h2>活动 Banner：单列环境变量</h2><p>临时按需投放，不计入本地热门优化成效</p></div></div><Card className="bannerCardV2"><div><span>有活动 Banner 点击日期</span><b>70.45%</b><small>6 天</small></div><div><span>无活动 Banner 点击日期</span><b>68.47%</b><small>24 天</small></div><aside><b>+1.98pp</b><span>历史正向相关，现有数据不能证明因果</span></aside></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>下一步</h2></div></div><ol className="reviewActions"><li><b>下周优化本地热门的新用户游戏位。</b><span>减少 1 个营收游戏位，增加 1 个棋牌游戏位。</span></li><li><b>定位下降明显模块的原因。</b><span>优先拆解“游戏模块开始玩”下降 1.25pp：承接游戏、排序与点击后的启动链路。</span></li><li><b>活动 Banner 单列记录。</b><span>不与本地热门改版混合归因。</span></li></ol></section>
  </>;
}

function ConversionDashboard() {
  const [page, setPage] = useState('global');
  return <div className="astryxReport" data-astryx-theme="neutral" data-astryx-media="light">
    <aside className="reportNav"><div className="reportBrand"><span>游戏大厅分发</span><small>安卓新增用户分析</small></div><nav aria-label="报告导航"><button className={page === 'global' ? 'selected' : ''} onClick={() => setPage('global')}><BarChart3 />全局数据</button><button className={page === 'review' ? 'selected' : ''} onClick={() => setPage('review')}><FileSearch />本地热门优化复盘</button></nav><p>数据由人工补充<br />更新后生成本地报告</p></aside>
    <main className="reportMain"><div className="reportContent">{page === 'global' ? <GlobalDataPage /> : <ReviewPage />}</div></main>
  </div>;
}

export default ConversionDashboard;
