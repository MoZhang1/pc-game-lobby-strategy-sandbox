import React, { useState } from 'react';
import { NEXT_NEW_USER_PLAN } from './distributionNextPlans';
import data from './distributionWeeklyData';
import { PREVIOUS_LOCAL_PACKAGE_GEO_DATA, LATEST_LOCAL_PACKAGE_GEO_DATA } from './localPackageLatestGeoData';
import { ANDROID_NEW_USER_EXCLUSIONS } from './androidNewUserExclusions';
import './android-channel.css';

const numericRate = (n, d) => d ? 100 * n / d : null;
const rate = (n, d) => d ? numericRate(n, d).toFixed(2) + '%' : '—';
const pp = n => n == null ? '不可比' : (n >= 0 ? '+' : '') + n.toFixed(2) + 'pp';
const delta = (a, b, f, d) => a?.[d] && b?.[d] ? numericRate(a[f], a[d]) - numericRate(b[f], b[d]) : null;
const key = r => r.province + ':' + (r.city || '');
const fields = ['newUsers', 'pageExposure', 'totalClicks', 'bannerClicks', 'algorithmExposure', 'algorithmClicks', 'configuredClicks', 'adClicks'];
const sum = rows => Object.fromEntries(fields.map(f => [f, rows.reduce((n, r) => n + (r[f] || 0), 0)]));
const oldProvinces = ['浙江', '湖北', '江苏', '山东', '广东', '安徽', '内蒙古', '江西', '辽宁', '山西'];
const plannedProvinces = ['贵州', '湖南', '河南', '广西', '四川', '河北', '陕西', '福建', '云南', '黑龙江'];
const measures = [
  ['页面到达率', 'pageExposure', 'newUsers'],
  ['配置推荐点击率', 'configuredClicks', 'pageExposure'],
  ['本地包总点击 / 新增', 'totalClicks', 'newUsers'],
  ['本地包总点击 / 页面曝光', 'totalClicks', 'pageExposure'],
  ['算法推荐点击率', 'algorithmClicks', 'algorithmExposure'],
  ['广告位推荐点击率', 'adClicks', 'pageExposure'],
];

function reviewFor(a, b) {
  const config = delta(a, b, 'configuredClicks', 'pageExposure');
  const reach = delta(a, b, 'pageExposure', 'newUsers');
  const sample = Math.min(a.pageExposure, b?.pageExposure || 0);
  if (a.province === '未知') return { rank: 7, label: '待归属', action: '补齐城市归属后再判断配置。' };
  if (config == null) return { rank: 7, label: '不可比', action: '缺少前期或本期曝光，保留缺失。' };
  if (sample < 30) return { rank: 6, label: '低样本观察', action: '先复核数据与展示，累计样本后再调整配置。' };
  if (config <= -3 && sample >= 100) return { rank: 0, label: '优先优化', action: '优先调整配置游戏组合和坑位排序；按城市定位下滑来源，单项调整后观察 7 天。' };
  if (reach <= -8 && Math.min(a.newUsers, b.newUsers) >= 100) return { rank: 1, label: '到达优先', action: '先查新用户展示条件、版本和进入页面路径，再判断是否需要调整游戏配置。' };
  if (config <= -3) return { rank: 2, label: '复核后调整', action: '配置点击下降；先核对主要城市与游戏组合，小范围调整，暂不全省回退。' };
  if (config < 0) return { rank: 3, label: '小幅下降', action: '定位下降城市，复核游戏与排序；先保留省级配置并观察稳定性。' };
  if (reach <= -8) return { rank: 4, label: '到达待复核', action: '核对页面展示条件和流量结构，样本有限，继续观察。' };
  return { rank: 5, label: '保留观察', action: '配置点击持平或改善，保留配置并跟踪后续一周。' };
}

function MetricCell({ row, numerator, denominator }) {
  return <>{rate(row?.[numerator], row?.[denominator])}<small>{row ? `${row[numerator]} / ${row[denominator]}` : '缺少记录'}</small></>;
}

export default function DistributionWeeklyDiagnosis({ geoOnly = false }) {
  const [provinceScope, setProvinceScope] = useState('focus');
  const [province, setProvince] = useState('全部');
  const [showSmall, setShowSmall] = useState(false);
  const beforeRows = data.before;
  const afterRows = data.after;
  const before = new Map(beforeRows.map(r => [r.province, r]));
  const beforeTotal = sum(beforeRows), afterTotal = sum(afterRows);
  const newBefore = data.newBefore;
  const newAfter = data.newAfter;
  const beforeLabel = '9/2–9/8 · 7 天';
  const afterLabel = '9/9–9/15 · 7 天';
  const provinces = afterRows.map(a => ({ a, b: before.get(a.province), review: reviewFor(a, before.get(a.province)) }));
  const configDelta = r => delta(r.a, r.b, 'configuredClicks', 'pageExposure');
  const reachDelta = r => delta(r.a, r.b, 'pageExposure', 'newUsers');
  const isFocus = r => r.a.province !== '未知' && ((configDelta(r) != null && configDelta(r) < 0) || (reachDelta(r) != null && reachDelta(r) <= -8));
  const priority = provinces.filter(r => r.review.rank === 0);
  const reachPriority = provinces.filter(r => r.review.rank === 1);
  const declines = provinces.filter(r => r.a.province !== '未知' && configDelta(r) != null && configDelta(r) < 0);
  const provinceRows = provinces.filter(r => provinceScope === 'all' || (provinceScope === 'focus' && isFocus(r)) || (provinceScope === 'priority' && r.review.rank === 0) || (provinceScope === 'small' && r.review.rank === 6)).sort((a, b) => a.review.rank - b.review.rank || (configDelta(a) ?? 0) - (configDelta(b) ?? 0) || b.a.newUsers - a.a.newUsers);
  const cityBefore = new Map(data.citiesBefore.map(r => [key(r), r]));
  const cities = data.citiesAfter.filter(r => (province === '全部' || r.province === province) && (showSmall || r.pageExposure >= 15)).sort((a, b) => b.newUsers - a.newUsers);
  const groups = [
    ['原 10 省', r => oldProvinces.includes(r.province)],
    ['上周新增计划 10 省', r => plannedProvinces.includes(r.province)],
    ['其他已归属地区', r => !oldProvinces.includes(r.province) && !plannedProvinces.includes(r.province) && r.province !== '未知'],
    ['待归属地区', r => r.province === '未知'],
  ].map(([name, include]) => ({ name, before: sum(beforeRows.filter(include)), after: sum(afterRows.filter(include)) }));
  const names = rows => rows.map(r => r.a.province).join('、') || '暂无';

  return <section className="channelCompare weeklyDiagnosis">
    <div className="channelPanel">
      <h2>本地包运营配置复盘 · 9/9–9/15</h2>
      <p><b>9/12 数据已修复并纳入统计。</b>9/2–9/8 与 9/9–9/15 均为完整 7 天，按相同星期构成比较。</p>
      <p><b>配置优先：{names(priority)}；页面到达优先：{names(reachPriority)}。</b>共有 {declines.length} 个已归属省份配置点击率下降，下面按下降幅度、曝光样本和问题环节列出建议。</p>
    </div>
    <div className="channelPanel"><h3>本地包前后数据对比</h3>
      <p>运营配置主指标为配置推荐点击 UV / 页面曝光 UV；总启动为安卓新用户整体结果。</p>
      <div className="channelTableWrap"><table aria-label="本地包前后数据对比"><thead><tr><th>指标</th><th>{beforeLabel}</th><th>{afterLabel}</th><th>变化</th></tr></thead><tbody>
        <tr><th>新增 UV 合计</th><td>{newBefore.users.toLocaleString()}</td><td>{newAfter.users.toLocaleString()}</td><td>{newAfter.users - newBefore.users >= 0 ? '+' : ''}{(newAfter.users - newBefore.users).toLocaleString()}</td></tr>
        <tr><th>本地包页面曝光 UV</th><td>{beforeTotal.pageExposure.toLocaleString()}</td><td>{afterTotal.pageExposure.toLocaleString()}</td><td>{afterTotal.pageExposure - beforeTotal.pageExposure >= 0 ? '+' : ''}{afterTotal.pageExposure - beforeTotal.pageExposure}</td></tr>
        <tr><th>总启动占比</th><td><MetricCell row={{ start: newBefore.events.TOTAL_START.uv, users: newBefore.users }} numerator="start" denominator="users" /></td><td><MetricCell row={{ start: newAfter.events.TOTAL_START.uv, users: newAfter.users }} numerator="start" denominator="users" /></td><td>{pp(newAfter.events.TOTAL_START.rate - newBefore.events.TOTAL_START.rate)}</td></tr>
        {measures.map(([name, n, d]) => <tr key={n + d}><th>{name}</th><td><MetricCell row={beforeTotal} numerator={n} denominator={d} /></td><td><MetricCell row={afterTotal} numerator={n} denominator={d} /></td><td className={delta(afterTotal, beforeTotal, n, d) < 0 ? 'negative' : 'positive'}>{pp(delta(afterTotal, beforeTotal, n, d))}</td></tr>)}
      </tbody></table></div>
      <p>周合计为每日 UV 之和，非跨日去重人数；各类点击用户可重叠。9/16 底部推荐位更换为美女捕鱼、罗松、掼蛋、比鸡后，继续观察对应点击和总启动承接。</p>
    </div>
    <div className="channelPanel"><h3>配置地区分组对比</h3>
      <div className="channelTableWrap"><table aria-label="本地包配置地区分组对比"><thead><tr><th>地区组</th><th>新增 UV 前→后</th><th>页面到达 前→后</th><th>配置点击 前</th><th>配置点击 后</th><th>配置变化</th></tr></thead><tbody>{groups.map(g => <tr key={g.name}><th>{g.name}</th><td>{g.before.newUsers} → {g.after.newUsers}</td><td>{rate(g.before.pageExposure, g.before.newUsers)} → {rate(g.after.pageExposure, g.after.newUsers)}</td><td><MetricCell row={g.before} numerator="configuredClicks" denominator="pageExposure" /></td><td><MetricCell row={g.after} numerator="configuredClicks" denominator="pageExposure" /></td><td>{pp(delta(g.after, g.before, 'configuredClicks', 'pageExposure'))}</td></tr>)}</tbody></table></div>
      <p>按既有配置和上周计划分组；新增 10 省的实际生效记录未随源表提供。分组差异用于定位问题，不能视为随机实验效果。</p>
    </div>
    <div className="channelPanel"><h3>省份下降与优化建议</h3>
      <label>查看省份 <select aria-label="筛选省份优化状态" value={provinceScope} onChange={e => setProvinceScope(e.target.value)}><option value="focus">下降或需排查</option><option value="all">全部省份</option><option value="priority">优先优化配置</option><option value="small">低样本观察</option></select></label>
      <p>当前显示 {provinceRows.length} 个省份。配置点击率下降且两期曝光均 ≥100、降幅 ≥3pp 的省份优先优化；其余按样本量先复核。阈值用于安排工作优先级，不代表统计显著性。</p>
      <div className="channelTableWrap"><table aria-label="本周各省转化诊断"><thead><tr><th>省份 / 优先级</th><th>新增 UV 前→后</th><th>页面到达 前→后</th><th>配置点击 前</th><th>配置点击 后</th><th>配置变化</th><th>建议动作</th></tr></thead><tbody>{provinceRows.map(({ a, b, review }) => <tr key={a.province}><th>{a.province}<small>{review.label}</small></th><td>{b?.newUsers ?? '—'} → {a.newUsers}</td><td>{rate(b?.pageExposure, b?.newUsers)} → {rate(a.pageExposure, a.newUsers)}<small>{pp(delta(a, b, 'pageExposure', 'newUsers'))}</small></td><td><MetricCell row={b} numerator="configuredClicks" denominator="pageExposure" /></td><td><MetricCell row={a} numerator="configuredClicks" denominator="pageExposure" /></td><td className={delta(a, b, 'configuredClicks', 'pageExposure') < 0 ? 'negative' : ''}>{pp(delta(a, b, 'configuredClicks', 'pageExposure'))}</td><td>{review.action}</td></tr>)}</tbody></table></div>
      <p>浙江、江苏、广东优先按城市核对游戏组合和坑位顺序；广东先看深圳、东莞等下降城市，避免仅凭全省均值调整所有城市。湖南先排查页面到达；内蒙古、贵州等曝光较少的省份先复核再做小范围配置测试。</p>
    </div>
    <details className="channelPanel"><summary>前几周配置点击数据</summary>
      <p>三期均为完整 7 天；最新一期已恢复 9/12 数据。历史表用于观察走势，正式周环比比较 9/2–9/8 与 9/9–9/15。</p>
      <div className="channelTableWrap"><table aria-label="本地包历史周配置对比"><thead><tr><th>省份</th><th>8/26–9/1 · 7 天</th><th>9/2–9/8 · 7 天</th><th>9/9–9/15 · 7 天</th></tr></thead><tbody>{[{ province: '全量', ...afterTotal }, ...afterRows].map(a => {
        const first = a.province === '全量' ? PREVIOUS_LOCAL_PACKAGE_GEO_DATA.total : PREVIOUS_LOCAL_PACKAGE_GEO_DATA.provinces.find(r => r.province === a.province);
        const second = a.province === '全量' ? LATEST_LOCAL_PACKAGE_GEO_DATA.total : LATEST_LOCAL_PACKAGE_GEO_DATA.provinces.find(r => r.province === a.province);
        return <tr key={a.province}><th>{a.province}</th><td><MetricCell row={first} numerator="configuredClicks" denominator="pageExposure" /></td><td><MetricCell row={second} numerator="configuredClicks" denominator="pageExposure" /></td><td><MetricCell row={a} numerator="configuredClicks" denominator="pageExposure" /></td></tr>;
      })}</tbody></table></div>
    </details>
    <div className="channelPanel"><h3>城市配置前后对比</h3>
      <label>省份 <select aria-label="选择诊断省份" value={province} onChange={e => setProvince(e.target.value)}><option value="全部">全部</option>{afterRows.map(r => <option key={r.province} value={r.province}>{r.province}</option>)}</select></label>{' '}
      <label><input type="checkbox" checked={showSmall} onChange={e => setShowSmall(e.target.checked)} />显示本期曝光不足 15 的城市</label>
      <p>当前显示 {cities.length} 个城市；小样本仅作排查线索。省级合计可能包含来源直接标注的省级地区行。</p>
      <div className="channelTableWrap"><table aria-label="本周城市转化诊断"><thead><tr><th>省份 / 城市</th><th>新增 UV 前→后</th><th>页面到达 前→后</th><th>配置点击 前</th><th>配置点击 后</th><th>配置变化</th><th>建议动作</th></tr></thead><tbody>{cities.map(a => { const b = cityBefore.get(key(a)); return <tr key={key(a)}><th>{a.province} · {a.city}</th><td>{b?.newUsers ?? '—'} → {a.newUsers}</td><td>{rate(b?.pageExposure, b?.newUsers)} → {rate(a.pageExposure, a.newUsers)}</td><td><MetricCell row={b} numerator="configuredClicks" denominator="pageExposure" /></td><td><MetricCell row={a} numerator="configuredClicks" denominator="pageExposure" /></td><td>{pp(delta(a, b, 'configuredClicks', 'pageExposure'))}</td><td>{reviewFor(a, b).action}</td></tr>; })}</tbody></table></div>
    </div>
    {!geoOnly && <details className="channelPanel"><summary>逐日数据核对</summary><div className="channelTableWrap"><table aria-label="本地包逐日核对"><thead><tr><th>日期</th><th>新增 / 启动 UV</th><th>总启动占比</th><th>页面到达率</th><th>配置点击率</th><th>广告位推荐点击率</th></tr></thead><tbody>{data.daily.map(r => ANDROID_NEW_USER_EXCLUSIONS[r.date] ? <tr key={r.date}><th>{r.date.slice(5)}</th><td colSpan={5}>{ANDROID_NEW_USER_EXCLUSIONS[r.date]}</td></tr> : <tr key={r.date}><th>{r.date.slice(5)}</th><td>{r.newUsers} / {r.start}</td><td>{rate(r.start, r.newUsers)}</td><td><MetricCell row={r} numerator="pageExposure" denominator="newUsers" /></td><td><MetricCell row={r} numerator="configuredClicks" denominator="pageExposure" /></td><td><MetricCell row={r} numerator="adClicks" denominator="pageExposure" /></td></tr>)}</tbody></table></div></details>}
    <div className="channelPanel"><h3>本周动作 · 9/16–9/22</h3><p>{NEXT_NEW_USER_PLAN}</p><p>地区源表没有分城市的总启动、分游戏或坑位数据；先依据页面到达与配置点击定位省市，再核对具体游戏和位置。</p></div>
    <details className="channelPanel"><summary>数据来源与口径</summary><p>来自《本地包分城市.xlsx》和《最安卓新用户点击转化.xlsx》，均截至 2026/09/15。9/12 已补齐并纳入汇总与趋势；本期完整 7 天仍有 148 名新增（4.36%）无法归属省份，保留展示。所有占比按分子、分母合计重算。</p><p>渠道分组源表没有本次更新，仍截至 9/6，不用于解释本周渠道变化。</p></details>
  </section>;
}
