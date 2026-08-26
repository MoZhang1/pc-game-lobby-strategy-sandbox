import React, { useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { DateRangeInput } from '@astryxdesign/core/DateRangeInput';
import { BarChart3, CalendarDays, FileSearch, TrendingDown, TrendingUp } from 'lucide-react';
import './conversion-dashboard.css';
import './astryx-report.css';
import './astryx-report-overrides.css';
import { LOCAL_PACKAGE_GEO_DATA, LOCAL_PACKAGE_GEO_PERIODS } from './localPackageGeoData';

const BASE_EVENTS = [
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

const PACKAGE_EVENTS = [
  { id: '1018904', label: '本地包-地区推荐游戏点击', shortLabel: '本地包地区推荐' },
  { id: '1018905', label: '本地包-地区配置游戏点击', shortLabel: '本地包地区配置' },
  { id: '1018902', label: '本地包-Banner点击', shortLabel: '本地包Banner' },
  { id: '1018913', label: '本地包-广告位推荐点击', shortLabel: '本地包广告位推荐' },
];
const EVENTS = [...BASE_EVENTS.slice(0, 2), ...PACKAGE_EVENTS, ...BASE_EVENTS.slice(2)];

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
  ['2026-07-22',702,493,95,11,11,7,0,1,106,30,134,132], ['2026-07-23',582,397,84,9,5,2,0,1,76,23,109,108],
  ['2026-07-24',626,439,78,11,8,2,0,1,96,31,97,115], ['2026-07-25',535,380,62,11,6,3,0,0,75,29,103,90],
  ['2026-07-26',668,479,74,13,7,2,0,1,89,28,117,127], ['2026-07-27',585,397,80,4,5,6,0,0,93,29,119,107],
  ['2026-07-28',527,374,83,3,3,0,0,0,76,39,80,98],
  ['2026-07-29',538,382,83,3,5,1,0,1,73,27,102,114], ['2026-07-30',568,410,64,8,12,2,0,0,79,23,118,89],
  ['2026-07-31',551,407,61,2,8,0,9,0,75,24,126,114], ['2026-08-01',565,423,67,6,7,2,14,0,89,26,103,122],
  ['2026-08-02',586,396,79,5,8,1,6,0,86,37,132,109], ['2026-08-03',593,412,77,5,5,2,0,0,80,23,123,109],
  ['2026-08-04',566,404,85,2,11,2,0,0,97,23,98,97],
  ['2026-08-05',555,389,57,7,7,1,0,0,79,23,117,97], ['2026-08-06',586,438,85,9,9,2,0,0,92,32,135,112], ['2026-08-07',534,381,40,3,4,0,0,2,96,23,104,76],
  ['2026-08-08',506,358,6,3,2,1,0,1,81,26,79,64], ['2026-08-09',616,429,22,1,3,0,0,1,91,25,160,99], ['2026-08-10',528,383,51,2,1,2,0,0,86,23,110,113],
  ['2026-08-11',550,391,73,7,8,2,0,3,73,26,111,105], ['2026-08-12',545,376,82,4,6,2,0,4,79,25,101,104], ['2026-08-13',553,408,66,5,8,0,0,1,96,27,126,112],
  ['2026-08-14',534,373,21,0,1,1,0,1,63,16,113,71], ['2026-08-15',535,383,13,0,2,0,0,0,69,30,114,66], ['2026-08-16',539,394,19,0,2,1,0,0,85,26,101,67], ['2026-08-17',533,385,11,0,1,1,0,0,67,32,99,59], ['2026-08-18',542,399,24,2,2,1,0,0,65,22,110,78],
  ['2026-08-19',512,373,13,1,3,2,0,1,63,18,115,68], ['2026-08-20',533,373,14,0,3,0,0,1,73,22,106,72], ['2026-08-21',543,377,19,1,3,0,0,2,82,25,117,67], ['2026-08-22',540,385,15,2,1,1,0,2,81,26,101,61], ['2026-08-23',584,424,22,2,1,0,0,1,80,32,119,71], ['2026-08-24',559,390,14,4,2,0,0,6,79,26,120,58], ['2026-08-25',485,331,16,0,2,0,0,0,63,14,97,50],
];

// 7/15 起本地包点击从本地热门中拆分为独立事件；此前无此埋点，按 0 展示。
const PACKAGE_ROWS = [
  ['2026-07-15',4,3,0,0], ['2026-07-16',9,8,1,4], ['2026-07-17',7,12,1,2], ['2026-07-18',2,7,0,3], ['2026-07-19',3,6,2,4], ['2026-07-20',5,7,1,4], ['2026-07-21',8,7,2,6],
  ['2026-07-22',4,4,2,3], ['2026-07-23',4,7,0,1], ['2026-07-24',2,4,0,5], ['2026-07-25',1,7,1,4], ['2026-07-26',5,9,0,8], ['2026-07-27',3,5,1,2], ['2026-07-28',4,3,0,4],
  ['2026-07-29',2,5,0,2], ['2026-07-30',10,7,1,2], ['2026-07-31',3,10,3,3], ['2026-08-01',4,7,1,1], ['2026-08-02',3,6,0,4], ['2026-08-03',2,6,0,1], ['2026-08-04',3,6,1,3],
  ['2026-08-05',0,5,0,1], ['2026-08-06',6,6,1,2], ['2026-08-07',7,7,7,37], ['2026-08-08',12,4,15,42], ['2026-08-09',13,11,18,66], ['2026-08-10',4,4,6,9], ['2026-08-11',7,9,1,3],
  ['2026-08-12',6,8,0,4], ['2026-08-13',10,11,0,2], ['2026-08-14',46,71,5,26], ['2026-08-15',50,90,12,35], ['2026-08-16',41,82,5,22], ['2026-08-17',45,91,12,31], ['2026-08-18',49,84,11,25],
  ['2026-08-19',39,82,19,24], ['2026-08-20',39,67,7,23], ['2026-08-21',42,73,9,21], ['2026-08-22',49,88,6,29], ['2026-08-23',35,103,9,22], ['2026-08-24',55,87,7,34], ['2026-08-25',36,72,3,18],
];
const packageByDate = Object.fromEntries(PACKAGE_ROWS.map(([date, ...uvs]) => [date, Object.fromEntries(PACKAGE_EVENTS.map((event, index) => [event.id, uvs[index]]))]));

const daily = DAILY_ROWS.map(([date, users, ...uvs]) => ({
  date, label: `${Number(date.slice(5, 7))}/${Number(date.slice(8))}`, users,
  uv: { ...Object.fromEntries(BASE_EVENTS.map((event, index) => [event.id, uvs[index]])), ...Object.fromEntries(PACKAGE_EVENTS.map(event => [event.id, packageByDate[date]?.[event.id] || 0])) },
}));
const eventSeries = Object.fromEntries(EVENTS.map(event => [event.id, { ...event, values: daily.map(item => item.uv[event.id] / item.users * 100) }]));
const formatDate = value => value.replace('2026-', '').replace('-', '/').replace(/^0/, '');
const formatPp = value => `${value >= 0 ? '+' : ''}${value.toFixed(2)}pp`;

const EXPERIMENTS = [
  {
    id: 'local-hot-v1', title: '实验 1 · 本地热门优化', module: '本地热门',
    metricId: '60100102', content: '根据各市实际新增游戏排序，优化本地热门推荐排序。', start: '2026-07-08', end: '2026-07-14', beforeStart: '2026-07-01', beforeEnd: '2026-07-07',
  },
  {
    id: 'local-hot-v2', title: '实验 2 · 新用户游戏位调整', module: '本地热门',
    metricId: '60100102', content: '调整新用户看到的本地热门展示：增加 1 个棋牌游戏位，减少 1 个营收游戏位置。', start: '2026-07-15', end: '2026-07-21', beforeStart: '2026-07-08', beforeEnd: '2026-07-14',
  },
  {
    id: 'first-banner-material', title: '实验 3 · 首屏 Banner 素材更新', module: '首屏 Banner',
    metricId: '60100201', content: '7 月 15 日更换首屏 Banner 素材，以素材更新前后各 14 天观察点击与总启动变化。', start: '2026-07-15', end: '2026-07-28', beforeStart: '2026-07-01', beforeEnd: '2026-07-14',
  },
  {
    id: 'local-hot-observation', title: '观察期 · 本地热门保持当前规则', module: '本地热门',
    metricId: '60100102', content: '本周未调整本地热门规则；由于上周活动 Banner 投放影响，以 7/08–7/14 的无活动 Banner 周为基线，观察当前规则下的数据变化。', start: '2026-07-22', end: '2026-07-28', beforeStart: '2026-07-08', beforeEnd: '2026-07-14',
  },
  {
    id: 'local-hot-waiting-package', title: '最新观察周 · 等待本地包版本更新', module: '本地热门',
    metricId: '60100102', content: '本周未调整本地热门；等待产品本地包版本更新，预计 8 月 10 日上线后再观察更明显的数据变化。', start: '2026-07-29', end: '2026-08-04', beforeStart: '2026-07-22', beforeEnd: '2026-07-28',
  },
  {
    id: 'local-package-prepublish-incident', title: '异常观察 · 本地包预发影响线上', module: '本地热门 / 本地包',
    metricId: '60100102', content: '8/8–8/10 疑似测试阶段本地包版本影响线上，本地热门点击被转移至本地包；8/11 数据恢复正常。', start: '2026-08-05', end: '2026-08-11', beforeStart: '2026-07-29', beforeEnd: '2026-08-04',
  },
  {
    id: 'local-package-official-launch', title: '正式上线 · 新用户本地包', module: '新用户本地包',
    metricId: '1018905', content: '8 月 14 日本地包正式上线。此后安卓首日新用户展示本地包，活跃用户继续展示旧本地热门。', start: '2026-08-14', end: '2026-08-18', beforeStart: '2026-08-11', beforeEnd: '2026-08-13',
  },
  {
    id: 'local-package-weekly-observation', title: '观察期 · 本地包上线后首个完整周', module: '本地热门 / 本地包',
    metricId: '1018905', content: '本地包已上线，未新增规则调整；观察 8/18–8/25 的总启动及本地热门、本地包入口变化。', start: '2026-08-18', end: '2026-08-25', beforeStart: '2026-08-11', beforeEnd: '2026-08-17',
  },
  {
    id: 'local-package-config-cities', title: '进行中 · 本地包运营配置', module: '本地包运营配置',
    metricId: '1018905', content: '8 月 26 日起对山东、广东、安徽的本地包运营配置表进行配置。', start: '2026-08-26', end: '2026-09-01', beforeStart: '2026-08-19', beforeEnd: '2026-08-25', isOngoing: true,
  },
];

// 两份“活跃用户进入目标游戏”来源表按月汇总：当月目标游戏 UV / 当月用户池 UV。
const TARGET_GAME_MONTHS = [
  { label: '1月', pc: { users: 2026379, game: 21.656, union: 0.352, total: 21.921 }, android: { users: 6099110, game: 39.076, union: 0.154, total: 39.182 } },
  { label: '2月', pc: { users: 1717630, game: 21.697, union: 0.442, total: 22.027 }, android: { users: 5452237, game: 39.763, union: 0.173, total: 39.883 } },
  { label: '3月', pc: { users: 2299598, game: 21.734, union: 0.687, total: 22.245 }, android: { users: 6243566, game: 39.044, union: 0.150, total: 39.146 } },
  { label: '4月', pc: { users: 2311613, game: 21.668, union: 0.662, total: 22.160 }, android: { users: 5967970, game: 39.575, union: 0.132, total: 39.665 } },
  { label: '5月', pc: { users: 2425229, game: 21.465, union: 0.838, total: 22.097 }, android: { users: 5900496, game: 40.169, union: 0.174, total: 40.290 } },
  { label: '6月', pc: { users: 2485239, game: 22.939, union: 0.382, total: 23.225 }, android: { users: 5628923, game: 40.796, union: 0.231, total: 40.965 } },
  { label: '7月', pc: { users: 2649286, game: 25.302, union: 0.421, total: 25.616 }, android: { users: 5721197, game: 41.108, union: 0.179, total: 41.237 } },
  { label: '8月（1–25日）', pc: { users: 2070739, game: 24.009, union: 0.218, total: 24.171 }, android: { users: 4575829, game: 42.368, union: 0.198, total: 42.514 } },
];

const ACTIVE_EXPERIMENT_DAILY = [
  { date: '2026-07-29', label: '7/29', total: 41.854 }, { date: '2026-07-30', label: '7/30', total: 41.820 }, { date: '2026-07-31', label: '7/31', total: 42.094 }, { date: '2026-08-01', label: '8/1', total: 42.362 }, { date: '2026-08-02', label: '8/2', total: 42.168 }, { date: '2026-08-03', label: '8/3', total: 42.046 }, { date: '2026-08-04', label: '8/4', total: 41.852 },
  ['2026-08-05',184423,77673,444,78001], ['2026-08-06',184409,77604,595,78033], ['2026-08-07',183060,77234,590,77674], ['2026-08-08',182584,77749,345,77981], ['2026-08-09',184082,78461,547,78865], ['2026-08-10',184537,78793,383,79078], ['2026-08-11',184620,78528,409,78830],
  ['2026-08-12',185143,78714,527,79093], ['2026-08-13',183763,78514,390,78799], ['2026-08-14',183076,77330,319,77561], ['2026-08-15',181932,76998,241,77180], ['2026-08-16',181964,77206,217,77352], ['2026-08-17',180787,75562,250,75754], ['2026-08-18',182224,77282,221,77449],
  ['2026-08-19',181574,77260,216,77476], ['2026-08-20',182056,77571,282,77853], ['2026-08-21',182314,77648,292,77940], ['2026-08-22',182142,77708,198,77906], ['2026-08-23',182833,78003,262,78265], ['2026-08-24',183198,78061,363,78424], ['2026-08-25',182227,77520,346,77846],
].map(item => Array.isArray(item) ? (() => { const [date, users, chess, union, total] = item; return { date, label: `${Number(date.slice(5, 7))}/${Number(date.slice(8))}`, users, chess: chess / users * 100, union: union / users * 100, total: total / users * 100 }; })() : item);

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
      {items.map((item, index) => (items.length <= 14 || index === 0 || index === items.length - 1 || index % 2 === 0) && <text className="axisLabel" x={x(index)} y="222" textAnchor="middle" key={item.date}>{item.label}</text>)}
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
  const all = getSummary('2026-06-20', '2026-08-25');
  const packagePeriod = getSummary('2026-07-15', '2026-08-25');
  return <div className="globalEventTable" role="table" aria-label="模块事件概览">
    <div className="globalEventHead" role="row"><span>事件</span><span>全期占比</span><span>数据说明</span></div>
    {EVENTS.map(event => { const summary = PACKAGE_EVENTS.some(item => item.id === event.id) ? packagePeriod : all; const note = PACKAGE_EVENTS.some(item => item.id === event.id) ? '7/15起' : '全期'; return <div className="globalEventRow" role="row" key={event.id}><strong role="cell" data-label="事件">{event.id === 'TOTAL_START' ? event.label : `${event.id} · ${event.label}`}</strong><span role="cell" data-label="全期占比">{summary.stats[event.id].rate.toFixed(2)}%</span><span role="cell" data-label="数据说明">{note} {summary.stats[event.id].uv.toLocaleString()} / {summary.users.toLocaleString()}</span></div>; })}
  </div>;
}

function GlobalDataPage({ embedded = false }) {
  const [range, setRange] = useState({ start: '2026-06-20', end: '2026-08-25' });
  const [appliedRange, setAppliedRange] = useState(range);
  const [eventIds, setEventIds] = useState(['TOTAL_START']);
  const selected = useMemo(() => daily.filter(item => item.date >= appliedRange.start && item.date <= appliedRange.end), [appliedRange]);
  const summary = getSummary(appliedRange.start, appliedRange.end);
  const selectedEvent = eventIds.length === 1 ? eventSeries[eventIds[0]] : null;
  const toggleEvent = id => setEventIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const period = `${formatDate(appliedRange.start)}–${formatDate(appliedRange.end)}`;
  return <>
    {!embedded && <header className="pageIntro"><div><h1>安卓新用户分发数据</h1><p>总启动与模块点击总览</p></div><span>数据更新至 2026/08/25</span></header>}
    <Card className="filterCard"><div className="filterCopy"><CalendarDays /><div><b>数据日期</b><span>模块数据有效起始 6/20；7/15 起本地包点击单列展示</span></div></div><DateRangeInput label="数据日期" isLabelHidden value={range} onChange={value => value && setRange(value)} min="2026-06-20" max="2026-08-25" numberOfMonths={1} /><Button label="应用筛选" variant="primary" onClick={() => setAppliedRange(range)} /></Card>
    <div className="globalMetrics"><Metric label="期间总启动占比" value={`${summary.stats.TOTAL_START.rate.toFixed(2)}%`} helper={`${summary.stats.TOTAL_START.uv.toLocaleString()} / ${summary.users.toLocaleString()} · ${period}`} icon={BarChart3} /><Metric label="趋势已选事件" value={eventIds.length ? `${eventIds.length} 项` : '未选择'} helper={selectedEvent ? selectedEvent.label : '支持多选或全部取消'} tone="positive" icon={TrendingUp} /><Metric label="纯新增用户数" value={summary.users.toLocaleString()} helper={`${selected.length} 天 · 模块数据起始 6/20`} icon={FileSearch} /></div>
    <section className="pageSection"><div className="sectionTitle"><div><h2>事件趋势</h2><p>{period} · 多事件共用占比纵轴</p></div><details className="eventPicker"><summary>筛选事件 <b>{eventIds.length ? `已选 ${eventIds.length} 项` : '未选择'}</b></summary><div>{EVENTS.map(event => <label key={event.id}><input type="checkbox" checked={eventIds.includes(event.id)} onChange={() => toggleEvent(event.id)} />{event.label}</label>)}</div></details></div><Card className="chartCard"><TrendChart items={selected} eventIds={eventIds} /></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>模块事件概览</h2><p>按最新完整口径汇总 · 本地包事件自 7/15 起可比</p></div></div><Card className="globalEventCard"><GlobalEventTable /></Card></section>
  </>;
}

function TargetGameTrendChart({ platform }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isPc = platform === 'pc';
  const series = [{ id: platform, label: isPc ? 'PC 新大厅老用户' : '安卓活跃用户', color: isPc ? '#2c6dbe' : '#c77d18', values: TARGET_GAME_MONTHS.map(item => item[platform].total) }];
  const values = series.flatMap(item => item.values); const low = Math.min(...values); const high = Math.max(...values);
  const span = Math.max(high - low, 5); const bounds = { min: low - span * .14, max: high + span * .14 };
  const x = index => 42 + index * (730 / Math.max(TARGET_GAME_MONTHS.length - 1, 1));
  const y = value => 190 - ((value - bounds.min) / (bounds.max - bounds.min)) * 142;
  const tooltipX = hoveredIndex === null ? 0 : Math.min(x(hoveredIndex) + 12, 570);
  return <div className="astryxTrend" role="img" aria-label={`${isPc ? 'PC 新大厅老用户' : '安卓活跃用户'}分发数据月度趋势`}>
    <div className="trendLegend">{series.map(item => <span key={item.id}><i style={{ borderColor: item.color }} />{item.label}</span>)}</div>
    <svg viewBox="0 0 800 230" onMouseLeave={() => setHoveredIndex(null)}>
      {[44, 82, 120, 158, 196].map((lineY, index) => <g key={lineY}><line x1="42" x2="772" y1={lineY} y2={lineY} /><text x="4" y={lineY + 4}>{(bounds.max - index * (bounds.max - bounds.min) / 4).toFixed(0)}%</text></g>)}
      {series.map(item => <polyline key={item.id} className="eventSeriesLine" style={{ stroke: item.color }} points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')} />)}
      {hoveredIndex !== null && series.map(item => <circle key={`${item.id}-${hoveredIndex}`} className="trendPoint" cx={x(hoveredIndex)} cy={y(item.values[hoveredIndex])} r="4" style={{ fill: item.color }} />)}
      {hoveredIndex !== null && <g className="trendTooltip" transform={`translate(${tooltipX}, 28)`}><rect width="220" height="67" rx="6" /><text x="10" y="19" className="tooltipDate">2026年{TARGET_GAME_MONTHS[hoveredIndex].label}</text>{series.map((item, index) => <g key={item.id} transform={`translate(10, ${37 + index * 18})`}><circle cx="4" cy="-4" r="3" style={{ fill: item.color }} /><text x="13" y="0">{item.label}　{item.values[hoveredIndex].toFixed(2)}%</text></g>)}</g>}
      {TARGET_GAME_MONTHS.map((item, index) => <rect className="trendHoverTarget" key={item.label} x={x(index) - 60} y="26" width="120" height="174" onMouseEnter={() => setHoveredIndex(index)} onClick={() => setHoveredIndex(index)} />)}
      {TARGET_GAME_MONTHS.map((item, index) => <text className="axisLabel" x={x(index)} y="222" textAnchor="middle" key={item.label}>{item.label}</text>)}
    </svg>
  </div>;
}

const ACTIVE_EXPERIMENTS = [
  { id: 'active-local-hot-v1', title: '第一轮 · 营收游戏前移', start: '2026-08-05', end: '2026-08-11', beforeStart: '2026-07-29', beforeEnd: '2026-08-04', baseline: '7/29–8/4', baselineRate: 42.03, baselineHelper: '541,897 / 1,289,395', resultRate: 42.59, resultHelper: '548,462 / 1,287,715', delta: 0.56, content: '营收游戏从第 4、5 位前移至第 3、4 位，第 5 位由棋牌游戏补位；即营收游戏整体前移一位，棋牌游戏向后补一位。', conclusion: '正向。进入营收游戏占比提升 0.56pp，主要来自营收棋牌游戏提升 0.53pp。', next: '保留营收游戏第 3、4 位，继续验证第 5 位替换方案。' },
  { id: 'active-local-hot-v2', title: '第二轮 · 第 5 位改联运游戏', start: '2026-08-12', end: '2026-08-18', beforeStart: '2026-08-05', beforeEnd: '2026-08-11', baseline: '8/5–8/11', baselineRate: 42.59, baselineHelper: '548,462 / 1,287,715', resultRate: 42.47, resultHelper: '543,188 / 1,278,889', delta: -0.12, content: '保持营收游戏在第 3、4 位不变，将第 5 位从棋牌游戏替换为联运游戏。', conclusion: '轻微负向。营收棋牌游戏 -0.05pp、联运创角 -0.09pp，未补足第 5 位替换带来的损失。', next: '先结合第二周观察结果复盘，暂不预设下一轮配置。' },
  { id: 'active-local-hot-v2-observation', title: '第二轮观察 · 第 5 位联运游戏保持', start: '2026-08-19', end: '2026-08-25', beforeStart: '2026-08-12', beforeEnd: '2026-08-18', baseline: '8/12–8/18', baselineRate: 42.47, baselineHelper: '543,188 / 1,278,889', resultRate: 42.71, resultHelper: '545,110 / 1,276,344', delta: 0.24, content: '未再调整本地热门，保持营收游戏第 3、4 位及第 5 位联运游戏，观察第二周稳定性。', conclusion: '整体回升，但联运位未证明有效。总变现率 +0.24pp，主要来自营收棋牌游戏回升；联运创角仍较首周 -0.02pp，未形成新增贡献。', next: '本周先确认复盘结论，后续实验配置待确认后再上线。' },
];

function ActiveExperimentTrendChart({ items, markerDate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const series = [{ label: '变现率（进入营收游戏）', color: '#c77d18', values: items.map(item => item.total) }];
  const values = series.flatMap(item => item.values); const low = Math.min(...values); const high = Math.max(...values); const span = Math.max(high - low, 1); const bounds = { min: low - span * .18, max: high + span * .18 };
  const x = index => 42 + index * (730 / Math.max(items.length - 1, 1)); const y = value => 190 - ((value - bounds.min) / (bounds.max - bounds.min)) * 142; const tooltipX = hoveredIndex === null ? 0 : Math.min(x(hoveredIndex) + 12, 570);
  const markerIndex = items.findIndex(item => item.date === markerDate); const markerX = markerIndex >= 0 ? x(markerIndex) : null;
  return <div className="astryxTrend" role="img" aria-label="安卓活跃用户本地热门实验周期趋势"><div className="trendLegend">{series.map(item => <span key={item.label}><i style={{ borderColor: item.color }} />{item.label}</span>)}</div><svg viewBox="0 0 800 230" onMouseLeave={() => setHoveredIndex(null)}>{[44,82,120,158,196].map((lineY, index) => <g key={lineY}><line x1="42" x2="772" y1={lineY} y2={lineY} /><text x="4" y={lineY + 4}>{(bounds.max - index * (bounds.max - bounds.min) / 4).toFixed(1)}%</text></g>)}{markerX !== null && <g><line className="optimiseMarker" x1={markerX} x2={markerX} y1="28" y2="198" /><text className="optimiseLabel" x={markerX + 8} y="39">{items[markerIndex].label} 实验开始</text></g>}{series.map(item => <polyline key={item.label} className="eventSeriesLine" style={{ stroke: item.color }} points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')} />)}{hoveredIndex !== null && <g className="trendTooltip" transform={`translate(${tooltipX}, 28)`}><rect width="220" height="67" rx="6" /><text x="10" y="19" className="tooltipDate">{items[hoveredIndex].date}</text>{series.map((item, index) => <g key={item.label} transform={`translate(10, ${37 + index * 18})`}><circle cx="4" cy="-4" r="3" style={{ fill: item.color }} /><text x="13" y="0">{item.label}　{item.values[hoveredIndex].toFixed(2)}%</text></g>)}</g>}{items.map((item, index) => <rect className="trendHoverTarget" key={item.date} x={x(index) - 730 / Math.max(items.length - 1, 1) / 2} y="26" width={730 / Math.max(items.length - 1, 1)} height="174" onMouseEnter={() => setHoveredIndex(index)} onClick={() => setHoveredIndex(index)} />)}{items.map((item, index) => <text className="axisLabel" x={x(index)} y="222" textAnchor="middle" key={item.date}>{item.label}</text>)}</svg></div>;
}

function TargetGameTable({ platform }) {
  const isPc = platform === 'pc';
  return <div className="targetGameTable targetGameTableSingle" role="table" aria-label={`${isPc ? 'PC' : '安卓'}活跃用户分发数据月度明细`}>
    <div className="targetGameHead" role="row"><span>月份</span><span>进入营收游戏</span><span>营收棋牌游戏</span><span>联运创角</span></div>
    {TARGET_GAME_MONTHS.map(item => <div className="targetGameRow" role="row" key={item.label}><strong>{item.label}</strong><span>{item[platform].total.toFixed(2)}%</span><span>{item[platform].game.toFixed(2)}%</span><span>{item[platform].union.toFixed(2)}%</span></div>)}
  </div>;
}

function AndroidActiveExperimentReview() {
  const [experimentId, setExperimentId] = useState('active-local-hot-v2-observation');
  const experiment = ACTIVE_EXPERIMENTS.find(item => item.id === experimentId);
  const comparisonItems = ACTIVE_EXPERIMENT_DAILY.filter(item => item.date >= experiment.beforeStart && item.date <= experiment.end);
  const tone = experiment.delta >= 0 ? 'positive' : 'negative';
  return <section className="pageSection"><div className="sectionTitle"><div><h2>本地热门实验复盘</h2><p>安卓活跃用户 · 每周三开始一个实验周期</p></div></div>
    <Card className="experimentSelector"><div><b>选择实验区间</b><span>展示实验前一周与实验后一周，虚线为周三实验开始</span></div><select value={experimentId} onChange={event => setExperimentId(event.target.value)} aria-label="选择活跃用户实验区间">{ACTIVE_EXPERIMENTS.map(item => <option value={item.id} key={item.id}>{item.title} · {formatDate(item.start)}–{formatDate(item.end)}</option>)}</select></Card>
    <section className="experimentBlock"><Card className="experimentBrief activeUserExperiment"><div><span>实验周期</span><b>{experiment.title} · {formatDate(experiment.start)}–{formatDate(experiment.end)}</b><small>实验前对比：{experiment.baseline}</small></div><div><span>实验模块</span><b>本地热门</b></div><div><span>实验内容</span><b>{experiment.content}</b></div></Card>
    <div className="reviewMetrics activeUserReviewMetrics"><Metric label="实验前基线" value={`${experiment.baselineRate.toFixed(2)}%`} helper={`${experiment.baseline} · ${experiment.baselineHelper}`} icon={BarChart3} /><Metric label="实验期结果" value={`${experiment.resultRate.toFixed(2)}%`} helper={`${formatDate(experiment.start)}–${formatDate(experiment.end)} · ${experiment.resultHelper}`} tone={tone} icon={experiment.delta >= 0 ? TrendingUp : TrendingDown} /><Metric label="实验变化" value={formatPp(experiment.delta)} helper="变现率（进入营收游戏）" tone={tone} icon={experiment.delta >= 0 ? TrendingUp : TrendingDown} /></div>
    <div className="reviewCallout activeUserCallout"><b>本轮结论：{experiment.delta >= 0 ? '正向' : '轻微负向'}</b><p>{experiment.conclusion}</p></div>
    <section className="pageSection"><div className="sectionTitle"><div><h2>实验前后趋势</h2><p>{formatDate(experiment.beforeStart)}–{formatDate(experiment.end)} · 虚线为周三实验开始</p></div></div><Card className="chartCard"><ActiveExperimentTrendChart items={comparisonItems} markerDate={experiment.start} /></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>下一步</h2><p>按周三开始，观察 7 天</p></div></div><ol className="reviewActions"><li><b>{experiment.next}</b></li></ol></section></section>
  </section>;
}

function TargetGamePage({ platform }) {
  const isPc = platform === 'pc';
  const [androidTab, setAndroidTab] = useState('overview');
  const name = isPc ? 'PC 新大厅老用户' : '安卓活跃用户';
  const first = TARGET_GAME_MONTHS[0]; const latest = TARGET_GAME_MONTHS[TARGET_GAME_MONTHS.length - 1]; const previous = TARGET_GAME_MONTHS[TARGET_GAME_MONTHS.length - 2];
  const change = latest[platform].total - first[platform].total;
  const monthChange = latest[platform].total - previous[platform].total;
  const conclusion = isPc ? '8 月为 1–25 日累计，进入营收游戏占比 24.17%，较 7 月回落 1.45pp，仍需待整月数据确认趋势。' : '8 月 1–25 日进入营收游戏占比 42.51%，较 7 月提升 1.28pp，处于年内高位；本地热门第二轮的两周观察结果见实验复盘。';
  return <>
    <header className="pageIntro"><div><h1>{name}分发数据</h1><p>活跃用户进入营收游戏的月度表现</p></div><span>数据更新至 2026/08/25</span></header>
    {!isPc && <div className="activeDistributionTabs" role="tablist" aria-label="安卓活跃用户分发页签"><button role="tab" aria-selected={androidTab === 'overview'} className={androidTab === 'overview' ? 'selected' : ''} onClick={() => setAndroidTab('overview')}>整体数据</button><button role="tab" aria-selected={androidTab === 'review'} className={androidTab === 'review' ? 'selected' : ''} onClick={() => setAndroidTab('review')}>实验复盘</button></div>}
    {(isPc || androidTab === 'overview') ? <><div className="targetMetrics"><Metric label={`${latest.label}进入营收游戏占比`} value={`${latest[platform].total.toFixed(2)}%`} helper={`较 ${previous.label} ${formatPp(monthChange)} · ${latest[platform].users.toLocaleString()} 用户池`} tone="positive" icon={TrendingUp} /><Metric label={`1月–${latest.label}变化`} value={formatPp(change)} helper={`${first[platform].total.toFixed(2)}% → ${latest[platform].total.toFixed(2)}%`} tone="positive" icon={BarChart3} /><Metric label={`${latest.label}营收棋牌游戏占比`} value={`${latest[platform].game.toFixed(2)}%`} helper={`较 ${previous.label} ${formatPp(latest[platform].game - previous[platform].game)}`} icon={TrendingUp} /><Metric label={`${latest.label}联运创角占比`} value={`${latest[platform].union.toFixed(2)}%`} helper={`较 ${previous.label} ${formatPp(latest[platform].union - previous[platform].union)}`} icon={BarChart3} /></div>
    <div className="targetConclusion"><b>月度走势结论</b><p>{conclusion}</p><p>主要变化来自<strong>营收棋牌游戏</strong>；联运创角占比低，暂不是进入营收游戏占比的主要驱动。当前数据只能说明同步走势，未包含版本、城市或游戏位明细，不能直接判定具体策略的因果效果。</p></div>
    <section className="pageSection"><div className="sectionTitle"><div><h2>进入营收游戏趋势</h2><p>按月汇总：当月进入营收游戏 UV / 当月用户池 UV</p></div></div><Card className="chartCard"><TargetGameTrendChart platform={platform} /></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>月度分发明细</h2><p>进入营收游戏占比由营收棋牌游戏与联运创角构成</p></div></div><Card className="targetGameCard"><TargetGameTable platform={platform} /></Card></section></> : <AndroidActiveExperimentReview />}
  </>;
}

const NEW_USER_EXPERIMENT_IDS = ['local-hot-v1', 'local-hot-v2', 'local-hot-observation', 'local-hot-waiting-package', 'local-package-prepublish-incident', 'local-package-official-launch', 'local-package-weekly-observation', 'local-package-config-cities'];

function LocalPackageWeeklyChanges() {
  return <section className="pageSection"><div className="sectionTitle"><div><h2>本地包上线后周度变化</h2><p>后续每周在此追加，首周仅含已收数日期</p></div></div><Card className="targetGameCard"><div className="targetGameTable targetGameTableSingle" role="table" aria-label="本地包上线后周度变化"><div className="targetGameHead" role="row"><span>观察周期</span><span>总启动</span><span>本地热门</span><span>本地包地区配置</span></div><div className="targetGameRow" role="row"><strong>第 1 周 · 8/14–8/18（5天）</strong><span>72.08%<small>较上线前 +0.78pp</small></span><span>3.28%<small>入口迁移 -10.13pp</small></span><span>15.58%<small>较上线前 +13.88pp</small></span></div><div className="targetGameRow" role="row"><strong>第 2 周 · 8/19–8/25</strong><span>70.63%<small>较第 1 周 -1.45pp</small></span><span>3.01%<small>较第 1 周 -0.27pp</small></span><span>15.23%<small>较第 1 周 -0.35pp</small></span></div></div></Card></section>;
}

function LocalPackageConfigExperiment() {
  return <section className="pageSection"><div className="sectionTitle"><div><h2>进行中实验 · 运营配置表</h2><p>今日开始配置，暂不输出实验效果结论</p></div></div><Card className="experimentBrief geoExperimentPlan"><div><span>实验地区</span><b>山东、广东、安徽</b><small>三个实验地区的本地包运营配置表已于 8/26 开始配置。</small></div><div><span>对比区间</span><b>配置前 8/19–8/25 · 配置后 8/26–9/1</b><small>下周三收齐配置后 7 天数据，再以同口径比较前后变化。</small></div><div><span>复盘指标</span><b>页面曝光→配置推荐点击</b><small>同步观察页面曝光→算法推荐点击；按实验地区与非实验地区拆分，不将两类点击相加。</small></div></Card></section>;
}

function LocalPackageGeoReview() {
  const [periodId, setPeriodId] = useState('2026-08-18_2026-08-25');
  const [province, setProvince] = useState('全部');
  const [provinceScope, setProvinceScope] = useState('全部');
  const selectedPeriod = LOCAL_PACKAGE_GEO_PERIODS?.find(item => item.id === periodId) || { id: '2026-08-17_2026-08-24', label: '8/17–8/24', data: LOCAL_PACKAGE_GEO_DATA };
  const { meta, total, provinces, cities } = selectedPeriod.data;
  const rate = (numerator, denominator) => denominator ? `${(numerator / denominator * 100).toFixed(2)}%` : '—';
  const numericRate = (numerator, denominator) => denominator ? numerator / denominator * 100 : null;
  const cityRows = province === '全部' ? cities : cities.filter(item => item.province === province);
  const classifiedUsers = total.newUsers - meta.unmappedNewUsers;
  const benchmark = { algorithm: numericRate(total.algorithmClicks, total.pageExposure), configured: numericRate(total.configuredClicks, total.pageExposure) };
  const insightFor = item => {
    if (item.status === '无数据') return { group: '无数据', issue: '本期未收数', action: '等待数据接入；不作排序或策略判断。' };
    if (item.newUsers < 30) return { group: '低样本观察', issue: `新增仅 ${item.newUsers}，波动大`, action: '先累计到至少 30 新增后再判断；当前沿用省级/全国兜底。' };
    const algorithm = numericRate(item.algorithmClicks, item.pageExposure);
    const configured = numericRate(item.configuredClicks, item.pageExposure);
    if (algorithm >= benchmark.algorithm + 3 && configured >= benchmark.configured + 3) return { group: '表现较好', issue: '算法推荐、配置推荐点击均高于全量', action: '保持当前规则；按城市提炼候选游戏和排序，作为同类城市实验样本。' };
    if (algorithm < benchmark.algorithm - 3 && configured < benchmark.configured - 3) return { group: '优先优化', issue: '算法推荐、配置推荐点击均偏低', action: '先拆城市核对候选游戏，再同步调整算法排序与配置游戏位。' };
    if (algorithm < benchmark.algorithm - 3) return { group: '待优化', issue: '页面曝光→算法推荐点击偏低', action: '优先调整算法候选池、城市权重和排序；配置推荐先保持。' };
    if (configured < benchmark.configured - 3) return { group: '待优化', issue: '页面曝光→配置推荐点击偏低', action: '优先调整配置游戏、位置与排序；算法推荐先保持。' };
    return { group: '稳定观察', issue: '两类推荐点击接近全量均值', action: '维持当前规则；优先在高新增城市做小流量对照实验。' };
  };
  const provinceRows = provinces.filter(item => provinceScope === '全部' || insightFor(item).group === provinceScope);
  const largeSample = provinces.filter(item => item.newUsers >= 100);
  const topProvinces = largeSample.filter(item => insightFor(item).group === '表现较好').map(item => item.province);
  const priorityProvinces = largeSample.filter(item => insightFor(item).group === '优先优化' || insightFor(item).group === '待优化').map(item => item.province);
  return <section className="localPackageGeoReview">
    <section className="pageSection"><div className="sectionTitle"><div><h2>本地包地区分发总览</h2><p>{formatDate(meta.start)}–{formatDate(meta.end)} · 按新增用户口径汇总</p></div></div>
      <Card className="geoToolbar"><div><span>数据时间区间</span><b>{formatDate(meta.start)}–{formatDate(meta.end)}（{meta.days} 天）</b><small>自 8/17 起按滚动 8 天观察省、市数据</small></div><label className="eventSelect">观察区间<select value={periodId} onChange={event => { setPeriodId(event.target.value); setProvince('全部'); setProvinceScope('全部'); }} aria-label="选择本地包分城市观察区间">{LOCAL_PACKAGE_GEO_PERIODS.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><label className="eventSelect">省份结论筛选<select value={provinceScope} onChange={event => setProvinceScope(event.target.value)} aria-label="选择省份结论筛选"><option value="全部">全部省份</option><option value="表现较好">表现较好</option><option value="稳定观察">稳定观察</option><option value="待优化">待优化</option><option value="优先优化">优先优化</option><option value="低样本观察">低样本观察</option><option value="无数据">无数据</option></select></label></Card>
      <div className="reviewMetrics geoMetrics"><Metric label="页面曝光UV" value={total.pageExposure.toLocaleString()} helper={`${total.newUsers.toLocaleString()} 新增用户中的本地包页面曝光`} icon={BarChart3} /><Metric label="页面曝光→算法推荐点击" value={rate(total.algorithmClicks, total.pageExposure)} helper={`${total.algorithmClicks.toLocaleString()} / ${total.pageExposure.toLocaleString()} · 本页统一分母`} tone="positive" icon={TrendingUp} /><Metric label="页面曝光→配置推荐点击" value={rate(total.configuredClicks, total.pageExposure)} helper={`${total.configuredClicks.toLocaleString()} / ${total.pageExposure.toLocaleString()} · 本页统一分母`} tone="positive" icon={TrendingUp} /><Metric label="地域可归属率" value={rate(classifiedUsers, total.newUsers)} helper={`按城市补回真实省份；${meta.unmappedNewUsers} 新增仍为未知城市`} icon={FileSearch} /></div>
      <div className="reviewCallout geoCallout"><b>地域补全说明</b><p>原始数据中“未知省份”覆盖 {meta.rawUnknownProvinceNewUsers.toLocaleString()} 名新增用户（{rate(meta.rawUnknownProvinceNewUsers, total.newUsers)}）。已按城市映射回真实省份；仅“未知城市”{meta.unmappedNewUsers} 名（{rate(meta.unmappedNewUsers, total.newUsers)}）保留为未归属，未计入任何省份，也不按 0 转化处理。台湾本期无数据。</p></div>
      <div className="reviewCallout geoConclusion"><b>省级结论</b><p>本页仅按页面曝光后的两类推荐点击判断：全量<strong>算法推荐点击率 {rate(total.algorithmClicks, total.pageExposure)}</strong>、<strong>配置推荐点击率 {rate(total.configuredClicks, total.pageExposure)}</strong>。在新增≥100的省份中，<strong>{topProvinces.join('、') || '暂无'}</strong>两类点击均较好，可保留规则并提炼城市样本。<strong>{priorityProvinces.join('、') || '暂无'}</strong>需优先优化：算法点击弱先调候选池/城市权重，配置点击弱先调配置游戏和排序。</p></div>
    </section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>省级推荐点击与建议</h2><p>仅比较页面曝光→算法推荐点击、页面曝光→配置推荐点击；低样本不参与优劣排序</p></div></div><Card className="geoTableCard"><div className="geoTable geoInsightTable" role="table" aria-label="本地包省级推荐点击与建议"><div className="geoTableHead" role="row"><span>省份</span><span>新增UV</span><span>页面曝光UV</span><span>页面曝光→算法推荐点击</span><span>页面曝光→配置推荐点击</span><span>判断 / 主要差异</span><span>建议动作</span></div>{provinceRows.map(item => { const insight = insightFor(item); return <div className="geoTableRow" role="row" key={item.province}><strong>{item.province}</strong><span data-label="新增UV">{item.newUsers ? item.newUsers.toLocaleString() : '—'}</span><span data-label="页面曝光UV">{item.pageExposure ? item.pageExposure.toLocaleString() : '—'}</span><b data-label="页面曝光→算法推荐点击">{rate(item.algorithmClicks, item.pageExposure)}</b><b data-label="页面曝光→配置推荐点击">{rate(item.configuredClicks, item.pageExposure)}</b><span data-label="判断 / 主要差异"><em className={`geoTag ${insight.group === '表现较好' ? 'good' : insight.group === '优先优化' || insight.group === '待优化' ? 'bad' : ''}`}>{insight.group}</em><small>{insight.issue}</small></span><span data-label="建议动作" className="geoAction">{insight.action}</span></div>})}</div></Card></section>
    <section className="pageSection"><div className="sectionTitle"><div><h2>城市推荐点击</h2><p>按城市汇总；两类点击均以页面曝光UV为分母，低样本只作观察</p></div><label className="eventSelect">查看省份<select value={province} onChange={event => setProvince(event.target.value)} aria-label="选择本地包城市所属省份"><option value="全部">全部城市（{cities.length}）</option>{provinces.filter(item => item.status === '有数据').map(item => <option value={item.province} key={item.province}>{item.province}</option>)}</select></label></div><Card className="geoTableCard"><div className="geoTable cityGeoTable" role="table" aria-label="本地包城市推荐点击"><div className="geoTableHead" role="row"><span>省份 / 城市</span><span>归属方式</span><span>新增UV</span><span>页面曝光UV</span><span>页面曝光→算法推荐点击</span><span>页面曝光→配置推荐点击</span></div>{cityRows.map(item => <div className="geoTableRow" role="row" key={`${item.province}-${item.city}`}><strong>{item.province === '未知' ? '待归属' : item.province} · {item.city}</strong><span className={item.mapping === '无法归属' ? 'geoMuted' : ''}>{item.mapping}</span><span data-label="新增UV">{item.newUsers.toLocaleString()}</span><span data-label="页面曝光UV">{item.pageExposure.toLocaleString()}</span><b data-label="页面曝光→算法推荐点击">{rate(item.algorithmClicks, item.pageExposure)}</b><b data-label="页面曝光→配置推荐点击">{rate(item.configuredClicks, item.pageExposure)}</b></div>)}</div></Card></section>
  </section>;
}

function LocalPackageExperimentProtocol() {
  return <section className="pageSection"><div className="sectionTitle"><div><h2>本轮实验标准</h2><p>本轮实验从周三开始；未收齐实验期数据前不输出效果结论</p></div></div><Card className="experimentBrief geoExperimentPlan"><div><span>0. 基线锁定</span><b>周三前 7 天（8/19–8/25）</b><small>按省、市、版本和地区配置状态存档；8/25 收数后不回填改口径。</small></div><div><span>1. 实验执行</span><b>周三后 7 天（8/26–9/1）</b><small>山东、广东、安徽配置运营表；非实验地区保留原规则作环境参照。</small></div><div><span>2. 主指标</span><b>页面曝光→配置推荐点击</b><small>配置推荐点击UV / 页面曝光UV；同步观察页面曝光→算法推荐点击，不将两类点击相加。</small></div></Card><ol className="reviewActions"><li><b>分组规则：实验地区单列，城市按省份归属汇总。</b><span>山东、广东、安徽为实验组；其余有数据地区为参照组。样本量过小的城市仅展示，不单独下结论。</span></li><li><b>结论规则：先比配置前后，再看实验组相对参照组的变化。</b><span>仅当实验组的配置推荐点击提升，且相对参照组也更好时，才认定运营配置为正向；算法推荐点击作为护栏指标。</span></li><li><b>环境变量单列：版本、地区配置和数据归属。</b><span>出现版本切换、城市归属缺失或口径变化时，标注异常并从主结论中剥离。</span></li><li><b>复盘节奏：9/2 出首周结论，第 14 天验证稳定性。</b><span>看板固定展示实验内容、实验地区、样本量、两类点击变化、异常城市和下一步动作。</span></li></ol></section>;
}

function ReviewPage({ experimentIds = EXPERIMENTS.map(item => item.id), title = '实验复盘', subtitle = '按实验区间切换查看 · 7/15 起本地包点击单列展示', showPackageWeeks = false, embedded = false }) {
  const scopedExperiments = EXPERIMENTS.filter(item => experimentIds.includes(item.id));
  const [experimentId, setExperimentId] = useState(scopedExperiments[scopedExperiments.length - 1].id);
  const experiment = EXPERIMENTS.find(item => item.id === experimentId);
  if (experiment.isOngoing) return <>
    {!embedded && <header className="pageIntro"><div><h1>{title}</h1><p>{subtitle}</p></div><span>数据更新至 2026/08/25</span></header>}
    <Card className="experimentSelector"><div><b>选择实验区间</b><span>本地热门与本地包按周连续展示，具体模块在下方说明</span></div><select value={experimentId} onChange={event => setExperimentId(event.target.value)} aria-label="选择实验区间">{scopedExperiments.map(item => <option value={item.id} key={item.id}>{item.title} · {formatDate(item.start)}–{formatDate(item.end)}</option>)}</select></Card>
    <LocalPackageConfigExperiment />
    <LocalPackageExperimentProtocol />
  </>;
  const before = getSummary(experiment.beforeStart, experiment.beforeEnd);
  const after = getSummary(experiment.start, experiment.end);
  const experimentMetric = eventSeries[experiment.metricId];
  const totalDelta = after.stats.TOTAL_START.rate - before.stats.TOTAL_START.rate;
  const moduleDelta = after.stats[experiment.metricId].rate - before.stats[experiment.metricId].rate;
  const bannerDelta = after.stats['60100602'].rate - before.stats['60100602'].rate;
  const driverItems = EVENTS.filter(event => event.id !== 'TOTAL_START').map(event => {
    const beforeRate = before.stats[event.id].rate; const afterRate = after.stats[event.id].rate; const delta = afterRate - beforeRate;
    let conclusion = delta >= 0 ? '正向变化，继续观察稳定性' : '负向变化，需结合承接链路观察';
    if (event.id === experiment.metricId) conclusion = Math.abs(delta) < 0.1 ? '实验模块变化很小，暂未观察到明确效果' : delta > 0 ? '实验模块点击提升，需继续验证稳定性' : '实验模块点击下降，不能仅用总启动变化证明实验有效';
    if (event.id === '60103909') conclusion = '连续两轮走低，优先检查游戏承接、排序和启动链路';
    if (event.id === '60100602') conclusion = '活动临时投放，作为环境变量单列，不与其他实验混合归因';
    return { id: event.id, label: event.shortLabel, before: beforeRate, after: afterRate, delta, conclusion };
  }).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const verdict = value => Math.abs(value) < 0.2 ? '无明显变化' : value > 0 ? '正优化' : '负优化';
  const moduleVerdict = verdict(moduleDelta);
  const startupVerdict = verdict(totalDelta);
  const candidate = driverItems.filter(item => item.id !== experiment.metricId && Math.sign(item.delta) === Math.sign(totalDelta)).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  const bannerOnRows = after.rows.filter(item => item.uv['60100602'] > 0);
  const bannerOffRows = after.rows.filter(item => item.uv['60100602'] === 0);
  const totalStartRate = rows => rows.reduce((sum, item) => sum + item.uv.TOTAL_START, 0) / rows.reduce((sum, item) => sum + item.users, 0) * 100;
  const bannerDayGap = bannerOnRows.length && bannerOffRows.length ? totalStartRate(bannerOnRows) - totalStartRate(bannerOffRows) : null;
  const trendItems = [...before.rows, ...after.rows];
  const nextSteps = experimentId === 'local-package-weekly-observation'
    ? [{ title: '继续按城市观察本地包数据。', detail: '本地热门下降主要是入口迁移信号；以山东、广东、安徽运营配置实验为下一段周度复盘，分别看页面曝光→配置推荐点击及总启动。' }]
    : experimentId === 'local-package-official-launch'
    ? [{ title: '拆分城市观察本地包数据。', detail: '按城市观察本地包各入口点击与总启动变化，定位不同城市的上线表现与后续优化方向。' }]
    : experimentId === 'local-hot-v2'
    ? [{ title: '继续按当前规则观察一周数据变化。', detail: '活动 Banner 的投放会影响本地热门点击效果，需要先排除该环境变量后再判断实验结果。' }]
    : experimentId === 'local-package-prepublish-incident'
      ? [{ title: '排除 8/8–8/10 的异常日期。', detail: '该段本地热门点击明显被转移至本地包，不作为正常本地热门规则效果判断依据。' }, { title: '继续观察 8/11 后的稳定数据。', detail: '确认本地热门恢复后的点击水平，并单列本地包四类点击，避免再与本地热门混合。' }, { title: '本地包版本稳定后再重启实验。', detail: '以稳定版本为前提，按城市和新旧规则拆分对照，再评估本地热门优化效果。' }]
      : experimentId === 'local-hot-waiting-package'
      ? [{ title: '等待本地包版本更新上线。', detail: '产品侧本地包版本预计 8 月 10 日上线，届时将以版本更新前后数据观察本地热门和总启动的变化。' }, { title: '版本上线后拆分新旧规则做实验。', detail: '明确本地包新版本与现本地热门旧规则，再按周三开始的周期观察两组表现。' }]
    : experimentId === 'local-hot-observation'
      ? [{ title: '1. 回退。', detail: '撤掉新增的棋牌游戏位，恢复被减少的营收游戏位；按市新增排序规则保持不变。' }, { title: '2. 本地包规则上线后，拆分新旧版本做实验。', detail: '新版本为本地包规则，旧版本为现本地热门规则；明确版本后再对比本地热门点击与总启动表现。' }, { title: '3. 版本区分好后，再做城市实验。', detail: '在新旧版本规则清晰的前提下，按城市分组验证不同城市的规则效果。' }]
      : experimentId === 'first-banner-material'
        ? [{ title: '每个月轮换一次首屏 Banner 素材。', detail: '素材替换已带动首屏 Banner 点击正向提升，后续按月轮换素材并持续观察点击表现。' }]
        : [{ title: '补充本地热门游戏位的明细数据。', detail: '分别看新增棋牌游戏位、减少营收游戏位的曝光、点击与启动贡献。' }, { title: '持续定位游戏模块开始玩的下降原因。', detail: '优先检查承接游戏、排序和点击后的启动链路。' }];
  return <>
    {!embedded && <header className="pageIntro"><div><h1>{title}</h1><p>{subtitle}</p></div><span>数据更新至 2026/08/25</span></header>}
    <Card className="experimentSelector"><div><b>选择实验区间</b><span>本地热门与本地包按周连续展示，具体模块在下方说明</span></div><select value={experimentId} onChange={event => setExperimentId(event.target.value)} aria-label="选择实验区间">{scopedExperiments.map(item => <option value={item.id} key={item.id}>{item.title} · {formatDate(item.start)}–{formatDate(item.end)}</option>)}</select></Card>
    <section className="experimentBlock"><div className="sectionTitle"><div><h2>{experiment.title}</h2><p>{formatDate(experiment.start)}–{formatDate(experiment.end)} · 对比 {formatDate(experiment.beforeStart)}–{formatDate(experiment.beforeEnd)}</p></div></div>
      <Card className="experimentBrief"><div><span>实验模块</span><b>{experiment.module}</b></div><div><span>实验内容</span><b>{experiment.content}</b></div></Card>
      <div className="reviewCallout"><b>实验效果结论</b>{experimentId === 'local-package-weekly-observation' ? <><p>本周总启动从 {before.stats.TOTAL_START.rate.toFixed(2)}% 降至 {after.stats.TOTAL_START.rate.toFixed(2)}%（{formatPp(totalDelta)}）。本地热门 {formatPp(after.stats['60100102'].rate - before.stats['60100102'].rate)}，是最大同步负向模块；搜索游戏点击也下降 {formatPp(after.stats['60100703'].rate - before.stats['60100703'].rate)}。</p><p>同时本地包地区配置提升 {formatPp(moduleDelta)}、本地包地区推荐提升 {formatPp(after.stats['1018904'].rate - before.stats['1018904'].rate)}，说明本地热门的下降主要是入口迁移，并非可直接归因为总启动下降原因。当前仅能定位同步变化，不能用模块点击用户精确拆分总启动。</p></> : experimentId === 'local-package-official-launch' ? <><p>本地包正式上线后，首日新用户总启动从 {before.stats.TOTAL_START.rate.toFixed(2)}% 升至 {after.stats.TOTAL_START.rate.toFixed(2)}%（{formatPp(totalDelta)}），上线初期保持稳定。</p><p>展示入口已完成迁移：本地热门从 {before.stats['60100102'].rate.toFixed(2)}% 降至 {after.stats['60100102'].rate.toFixed(2)}%，同时本地包地区配置从 {before.stats['1018905'].rate.toFixed(2)}% 升至 {after.stats['1018905'].rate.toFixed(2)}%。各本地包事件的点击用户可能重叠，不能相加为总点击率；当前仅说明点击主要转移到本地包，正式上线数据仍只有 5 天，继续观察稳定性。</p></> : experimentId === 'first-banner-material' ? <><p>素材替换对首屏 Banner 点击有<strong className="positive">正向提升</strong>（0.84% → 1.08%，{formatPp(moduleDelta)}）。</p><p>后续每个月轮换一次首屏 Banner 素材，持续带动首屏 Banner 点击。</p></> : experimentId === 'local-package-prepublish-incident' ? <><p>本地热门全周期从 {before.stats['60100102'].rate.toFixed(2)}% 降至 {after.stats['60100102'].rate.toFixed(2)}%（{formatPp(moduleDelta)}），但总启动基本持平（{before.stats.TOTAL_START.rate.toFixed(2)}% → {after.stats.TOTAL_START.rate.toFixed(2)}%，{formatPp(totalDelta)}）。</p><p><strong>8/8–8/10 为异常期：</strong>本地热门仅 4.79%，本地包广告位推荐升至 7.09%；8/11 本地热门回升至 13.27%。判断为疑似预发本地包版本影响线上、点击转移至本地包，<strong>不纳入正常本地热门实验效果</strong>。</p></> : experimentId === 'local-hot-waiting-package' ? <><p>本周未调整本地热门，因此<strong>不将变化归因于本地热门策略</strong>。本地热门点击基本持平（{formatPp(moduleDelta)}），总启动从 {before.stats.TOTAL_START.rate.toFixed(2)}% 升至 {after.stats.TOTAL_START.rate.toFixed(2)}%（{formatPp(totalDelta)}）。</p><p>最大同步正向模块是<strong>{candidate?.label || '暂无'}</strong>{candidate ? `（${formatPp(candidate.delta)}）` : ''}；同时活动 Banner 出现点击，仍仅作为环境变量。安卓正等待产品本地包版本更新，预计 8 月 10 日上线后才可能出现更明显的数据变化。</p></> : <><p>对实验模块：<strong className={moduleDelta >= 0 ? 'positive' : 'negative'}>{moduleVerdict}</strong>（{experimentMetric.shortLabel} {formatPp(moduleDelta)}）。对总启动：<strong className={totalDelta >= 0 ? 'positive' : 'negative'}>{startupVerdict}</strong>（{before.stats.TOTAL_START.rate.toFixed(2)}% → {after.stats.TOTAL_START.rate.toFixed(2)}%，{formatPp(totalDelta)}）。</p><p>若总启动变化不是由实验模块带动，当前模块粒度下的最大同步候选是<strong>{candidate?.label || '暂无'}</strong>{candidate ? `（${formatPp(candidate.delta)}）` : ''}。这只是同步信号，不代表因果；模块点击用户可重叠，现有数据无法把总启动变化精确拆到单一模块。</p></>}</div>
      <div className="reviewMetrics"><Metric label="对实验模块" value={moduleVerdict} helper={`${experimentMetric.shortLabel} ${before.stats[experiment.metricId].rate.toFixed(2)}% → ${after.stats[experiment.metricId].rate.toFixed(2)}% · ${formatPp(moduleDelta)}`} tone={moduleDelta >= 0 ? 'positive' : 'negative'} icon={moduleDelta >= 0 ? TrendingUp : TrendingDown} /><Metric label="对总启动" value={startupVerdict} helper={`${before.stats.TOTAL_START.rate.toFixed(2)}% → ${after.stats.TOTAL_START.rate.toFixed(2)}% · ${formatPp(totalDelta)}`} tone={totalDelta >= 0 ? 'positive' : 'negative'} icon={totalDelta >= 0 ? TrendingUp : TrendingDown} /><Metric label="实验期总启动占比" value={`${after.stats.TOTAL_START.rate.toFixed(2)}%`} helper={`${after.stats.TOTAL_START.uv.toLocaleString()} / ${after.users.toLocaleString()} · ${formatDate(experiment.start)}–${formatDate(experiment.end)}`} icon={BarChart3} /><Metric label="最大同步候选" value={candidate?.label || '暂无'} helper={candidate ? `${formatPp(candidate.delta)} · 仅为候选，不作因果结论` : '暂无同方向变化候选'} tone={candidate ? (candidate.delta >= 0 ? 'positive' : 'negative') : 'neutral'} icon={candidate && candidate.delta >= 0 ? TrendingUp : TrendingDown} /></div>
      <section className="pageSection"><div className="sectionTitle"><div><h2>实验前后趋势</h2><p>保留本次对比的实验前后区间 · 虚线为实验/观察开始</p></div></div><Card className="chartCard"><TrendChart items={trendItems} eventIds={['TOTAL_START', experiment.metricId]} markerDate={experiment.start} markerLabel={`${formatDate(experiment.start)} ${experimentId.includes('observation') || experimentId === 'local-hot-waiting-package' ? '观察开始' : '实验上线'}`} /></Card></section>
      <section className="pageSection"><div className="sectionTitle"><div><h2>模块归因与问题定位</h2><p>按实验前后变化幅度排序 · 单位：pp</p></div></div><Card className="attributionCard"><AttributionTable items={driverItems} beforeLabel="实验前" afterLabel="实验期" /></Card></section>
      {after.stats['60100602'].uv > 0 && <section className="pageSection bannerSection"><div className="sectionTitle"><div><h2>活动 Banner：单列环境变量</h2><p>临时按需投放，不计入其他实验模块成效</p></div></div><Card className="bannerCardV2"><div><span>实验前活动 Banner 点击</span><b>{before.stats['60100602'].rate.toFixed(2)}%</b><small>{before.stats['60100602'].uv.toLocaleString()} UV</small></div><div><span>实验期活动 Banner 点击</span><b>{after.stats['60100602'].rate.toFixed(2)}%</b><small>{after.stats['60100602'].uv.toLocaleString()} UV</small></div><aside><b>{formatPp(bannerDelta)}</b><span>{bannerDayGap === null ? '实验期无 Banner 点击日，暂无可比拆分' : `Banner 点击日总启动较无点击日高 ${formatPp(bannerDayGap)}；仅为相关性`}</span></aside></Card></section>}
      <section className="pageSection"><div className="sectionTitle"><div><h2>{experimentId === 'local-hot-observation' || experimentId === 'local-hot-waiting-package' || experimentId === 'local-package-prepublish-incident' ? '后续本地热门优化建议' : '下一步'}</h2></div></div><ol className="reviewActions">{nextSteps.map(item => <li key={item.title}><b>{item.title}</b><span>{item.detail}</span></li>)}</ol></section>
    </section>
    {showPackageWeeks && <LocalPackageWeeklyChanges />}
  </>;
}

function AndroidNewUserPage() {
  const [tab, setTab] = useState('global');
  return <><header className="pageIntro"><div><h1>安卓新用户分发数据</h1><p>纯新增用户的总启动、模块点击与实验复盘</p></div><span>全局数据至 2026/08/25 · 本地包分城市数据支持 8/17 起滚动观察</span></header>
    <div className="activeDistributionTabs" role="tablist" aria-label="安卓新用户分发页签"><button role="tab" aria-selected={tab === 'global'} className={tab === 'global' ? 'selected' : ''} onClick={() => setTab('global')}>全局数据</button><button role="tab" aria-selected={tab === 'review'} className={tab === 'review' ? 'selected' : ''} onClick={() => setTab('review')}>实验复盘</button><button role="tab" aria-selected={tab === 'local-package-geo'} className={tab === 'local-package-geo' ? 'selected' : ''} onClick={() => setTab('local-package-geo')}>本地包分城市数据</button></div>
    {tab === 'global' ? <GlobalDataPage embedded /> : tab === 'review' ? <ReviewPage key="new-user-experiment-review" embedded experimentIds={NEW_USER_EXPERIMENT_IDS} title="实验复盘" subtitle="安卓新用户 · 本地热门与本地包按周统一复盘" /> : <LocalPackageGeoReview />}
  </>;
}

function ConversionDashboard() {
  const [page, setPage] = useState('android-new-user');
  const activeGroup = page === 'android-new-user' ? 'new' : 'active';
  return <div className="astryxReport" data-astryx-theme="neutral" data-astryx-media="light"><aside className="reportNav"><div className="reportBrand"><span>平台分发效果看板</span><small>用户分发数据分析</small></div><nav aria-label="报告导航"><button className={`navGroup ${activeGroup === 'new' ? 'selected' : ''}`} onClick={() => setPage('android-new-user')}><BarChart3 />新用户分发</button>{activeGroup === 'new' && <div className="navChildren"><button className={page === 'android-new-user' ? 'selected' : ''} onClick={() => setPage('android-new-user')}>安卓新用户分发</button></div>}<button className={`navGroup ${activeGroup === 'active' ? 'selected' : ''}`} onClick={() => setPage('pc-distribution')}><TrendingUp />活跃用户分发</button>{activeGroup === 'active' && <div className="navChildren"><button className={page === 'pc-distribution' ? 'selected' : ''} onClick={() => setPage('pc-distribution')}>PC 活跃用户分发数据</button><button className={page === 'android-distribution' ? 'selected' : ''} onClick={() => setPage('android-distribution')}>安卓活跃用户分发数据</button></div>}</nav><p>数据由人工补充<br />更新后生成本地报告</p></aside><main className="reportMain"><div className="reportContent">{page === 'android-new-user' ? <AndroidNewUserPage /> : <TargetGamePage platform={page === 'pc-distribution' ? 'pc' : 'android'} />}</div></main></div>;
}

export default ConversionDashboard;
