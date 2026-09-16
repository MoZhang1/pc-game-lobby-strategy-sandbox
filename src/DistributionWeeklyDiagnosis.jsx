import React, { useState } from 'react';
import { NEXT_NEW_USER_PLAN } from './distributionNextPlans';
import data from './distributionWeeklyData';
import { ANDROID_NEW_USER_EXCLUSIONS } from './androidNewUserExclusions';
import './android-channel.css';

const rate = (n, d) => d ? (100 * n / d).toFixed(2) + '%' : '—';
const pp = n => n == null ? '不可比' : (n >= 0 ? '+' : '') + n.toFixed(2) + 'pp';
const delta = (a, b, f, d) => a?.[d] && b?.[d] ? 100 * a[f] / a[d] - 100 * b[f] / b[d] : null;
const key = r => r.province + ':' + (r.city || '');
const note = (a, b) => {
  if (a.province === '未知') return '归属不完整，补齐后判断';
  if (!a.pageExposure || !b?.pageExposure) return '缺少可比曝光，不判定改善或恶化';
  const reach = delta(a,b,'pageExposure','newUsers'), config = delta(a,b,'configuredClicks','pageExposure');
  if (Math.min(a.pageExposure,b.pageExposure) < 30) return '小样本：复核展示和配置，继续累计';
  if (reach < -8 && config < -3) return '到达与配置点击均下降，分两段排查';
  if (reach < -8) return '优先查页面到达；配置点击未同步恶化';
  if (config < -3) return '优先复核配置游戏与排序' + (Math.min(a.pageExposure,b.pageExposure)<100?'；样本有限':'');
  if (config >= 3) return '配置点击改善，保留并观察稳定性';
  return '配置点击基本稳定，观察其他入口';
};

export default function DistributionWeeklyDiagnosis({geoOnly=false}) {
  const [scope,setScope]=useState('comparable');
  const [province,setProvince]=useState('全部');
  const [showSmall,setShowSmall]=useState(false);
  const source=scope==='comparable'?data.sensitivity:{...data,after:data.sensitivity.after,citiesAfter:data.sensitivity.citiesAfter};
  const before=new Map(source.before.map(r=>[r.province,r]));
  const cityBefore=new Map(source.citiesBefore.map(r=>[key(r),r]));
  const provinces=[...source.after].sort((a,b)=>b.newUsers-a.newUsers);
  const cities=source.citiesAfter.filter(r=>(province==='全部'||r.province===province)&&(showSmall||r.pageExposure>=15)).sort((a,b)=>b.newUsers-a.newUsers);
  const metric=(r,f,d)=><>{rate(r?.[f],r?.[d])}<small>{r?r[f]+' / '+r[d]:'缺少记录'}</small></>;
  return <section className="channelCompare">
    <div className="channelPanel">
      <h2>{geoOnly?'本地包地区诊断 · 9/9–9/15':'本周诊断：9/12 已排除，原因待排查'}</h2>
      <p><b>排除 9/12 后，本期有效 6 天：总启动 2,014 / 2,922 = 68.93%。</b>9/12 全部安卓新用户数据已从汇总、模块分析和趋势中排除，原因待排查。</p>
      <p>原始记录保留供排查；看板不把异常日当作 0，也不插值补造。原因确认前，该日持续保持排除状态。</p>
      <p>同时剔除本周 9/12 和上周同为周六的 9/5 后，六天总启动 <b>68.29% → 68.93%（+0.63pp）</b>；本地包到达率 <b>61.93% → 62.11%</b>，配置点击 / 页面曝光 <b>23.88% → 23.64%</b>。本周有效数据与上周对照均为 6 天；9/5 只为保证星期构成一致而从本次环比剔除，其他历史统计仍保留该正常日期。</p>
      <p>仍需关注页面内点击：本地包总点击 / 页面曝光 <b>38.76% → 36.47%</b>，广告位点击 / 页面曝光 <b>8.44% → 6.56%</b>，算法点击 / 算法曝光 <b>14.36% → 12.93%</b>。配置点击整体只降 0.24pp，需分别定位各地区问题。模块用户重叠，变化不能相加。</p>
    </div>
    {!geoOnly&&<div className="channelPanel"><h3>逐日核对</h3><div className="channelTableWrap"><table>
      <thead><tr><th>日期</th><th>新增 / 启动 UV</th><th>总启动占比</th><th>页面曝光 / 新增</th><th>配置点击 / 页面曝光</th><th>广告位点击 / 页面曝光</th></tr></thead>
      <tbody>{data.daily.map(r=>ANDROID_NEW_USER_EXCLUSIONS[r.date]?<tr key={r.date}><th>{r.date.slice(5)}</th><td colSpan={5}>{ANDROID_NEW_USER_EXCLUSIONS[r.date]}</td></tr>:<tr key={r.date}><th>{r.date.slice(5)}</th><td>{r.newUsers} / {r.start}</td><td>{rate(r.start,r.newUsers)}</td><td>{metric(r,'pageExposure','newUsers')}</td><td>{metric(r,'configuredClicks','pageExposure')}</td><td>{metric(r,'adClicks','pageExposure')}</td></tr>)}</tbody>
    </table></div></div>}
    <div className="channelPanel"><h3>地区优先级：两周均剔除周六，按 6 天对照</h3>
      <p><b>配置优先：浙江、江苏。</b>浙江 48/186 → 32/166，25.81% → 19.28%（-6.53pp）；江苏 34/129 → 19/108，26.36% → 17.59%（-8.76pp）。两省按本期曝光恢复至前期点击率的差额约 20 次，只用于排查排序，不等于新增启动或收入增量。</p>
      <p><b>到达优先：湖南，城市先看杭州、苏州。</b>湖南页面到达 77/133 → 59/135，57.89% → 43.70%，配置点击率基本稳定。杭州到达 71.91% → 60.00%，苏州到达 63.64% → 52.27%，应先核对新用户展示条件和进入页面路径。</p>
      <p><b>小样本复核：内蒙古、贵州；城市看绍兴、深圳。</b>内蒙古配置点击 21.52% → 15.48%（13/84），贵州 20.59% → 6.12%（3/49）；绍兴 9/19 → 4/18，深圳 8/16 → 1/18。信号值得核对实际游戏和顺序，但这些样本不足以直接全省或全市回退。</p>
      <p><b>保留观察：山东、山西、安徽、福建、四川、广西。</b>配置点击率均改善。广东省下降较小，广州 17.19% → 24.29%，因此应优先查深圳、东莞等具体城市，避免把广东整体配置推翻。</p>
      <p>按上周计划分组：原 10 省配置点击率 24.12% → 23.06%；新增计划 10 省 23.21% → 25.35%；其他已归属地区 24.55% → 23.11%。这是地区分组对照，配置实际生效时间未随表提供，不能当作随机实验效果。</p>
    </div>
    {geoOnly&&<>
      <div className="channelPanel"><h3>各省与城市明细</h3>
        <label>比较口径 <select aria-label="选择地区比较口径" value={scope} onChange={e=>setScope(e.target.value)}><option value="comparable">两周均为 6 天：分别剔除 9/5、9/12</option><option value="reported">上周 7 天对比本周 6 天（本周排除 9/12）</option></select></label>
        <p>{scope==='comparable'?'两周均剔除周六，按相同星期构成对照。':'本周已排除 9/12；上周保留完整 7 天，星期构成不同，变化仅作参考。'} 配置点击的分母是页面曝光。周合计为每日 UV 之和，不是跨日去重人数。</p>
        <div className="channelTableWrap"><table aria-label="本周各省转化诊断"><thead><tr><th>省份</th><th>新增 UV 合计</th><th>到达率 前→后</th><th>配置点击 前</th><th>配置点击 后</th><th>配置变化</th><th>排查方向</th></tr></thead><tbody>{provinces.map(r=>{const b=before.get(r.province);return <tr key={r.province}><th>{r.province}</th><td>{r.newUsers}</td><td>{rate(b?.pageExposure,b?.newUsers)} → {rate(r.pageExposure,r.newUsers)}</td><td>{metric(b,'configuredClicks','pageExposure')}</td><td>{metric(r,'configuredClicks','pageExposure')}</td><td>{pp(delta(r,b,'configuredClicks','pageExposure'))}</td><td>{note(r,b)}</td></tr>;})}</tbody></table></div>
      </div>
      <div className="channelPanel"><h3>城市定位</h3>
        <label>省份 <select aria-label="选择诊断省份" value={province} onChange={e=>setProvince(e.target.value)}><option value="全部">全部</option>{provinces.map(r=><option key={r.province} value={r.province}>{r.province}</option>)}</select></label>{' '}
        <label><input type="checkbox" checked={showSmall} onChange={e=>setShowSmall(e.target.checked)}/>显示本期曝光不足 15 的城市</label>
        <p>当前显示 {cities.length} 个城市；小样本只作排查线索。省级合计可能包含来源直接标注的省级地区行。</p>
        <div className="channelTableWrap"><table aria-label="本周城市转化诊断"><thead><tr><th>省份 / 城市</th><th>新增 UV 合计</th><th>页面到达 前→后</th><th>配置点击 前</th><th>配置点击 后</th><th>配置变化</th><th>排查方向</th></tr></thead><tbody>{cities.map(r=>{const b=cityBefore.get(key(r));return <tr key={key(r)}><th>{r.province} · {r.city}</th><td>{r.newUsers}</td><td>{rate(b?.pageExposure,b?.newUsers)} → {rate(r.pageExposure,r.newUsers)}</td><td>{metric(b,'configuredClicks','pageExposure')}</td><td>{metric(r,'configuredClicks','pageExposure')}</td><td>{pp(delta(r,b,'configuredClicks','pageExposure'))}</td><td>{note(r,b)}</td></tr>;})}</tbody></table></div>
      </div>
    </>}
    <div className="channelPanel"><h3>本周动作 · 9/16–9/22</h3><p>{NEXT_NEW_USER_PLAN}</p><p>优先顺序：核实 9/12 → 浙江/江苏配置与湖南到达 → 城市小样本复核。地区源表没有分城市的总启动、分游戏或坑位数据，所以地区结论止于本地包页面和点击，暂不能直接指定各市该替换哪一款游戏。</p></div>
    <details className="channelPanel"><summary>数据来源与口径</summary><p>四份本期 Excel 均截至 2026/09/15。安卓新用户以源表 TOTAL_START / 新增用户 UV 为 KPI；活跃用户以变现 UV / 老用户池 UV 衡量进入营收游戏，不代表实际付费率。周、月占比均由每日分子分母加总后计算。</p><p>本期已排除 9/12，当前有效 6 天仍有 132 名新增（4.52%）无法归属省份，保留展示。渠道分组源表没有本次更新，仍截至 9/6，不用于解释本周渠道变化。</p></details>
  </section>;
}
