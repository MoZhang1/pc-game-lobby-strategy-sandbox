import React from 'react';
import data from './distributionWeeklyData';
import './android-channel.css';
const provinces=['浙江','湖北','江苏','山东','广东','安徽','内蒙古','江西','辽宁','山西'];
const rate=(n,d)=>d?(100*n/d).toFixed(2)+'%':'—';
const pp=n=>(n>=0?'+':'')+n.toFixed(2)+'pp';
export default function DistributionWeeklyDiagnosis({geoOnly=false}){
  return <section className="channelCompare">
    {!geoOnly && <>
      <div className="channelPanel"><h2>最新低谷诊断：9/4 与 9/7 不是同一种下跌</h2>
      <p><b>整周：总启动 70.13% → 68.34%（-1.79pp）。</b>新增 3,576 → 3,440，启动 2,508 → 2,351。启动人数减少 6.26%，快于新增人数减少 3.80%。</p>
      <p>本地包总点击占新增 24.16% → 24.19%，基本持平；按总启动减本地包总点击计算的剩余部分为 45.97% → 44.16%（-1.82pp）。这是基于两表口径衔接的差额，不是把所有非本地包模块 UV 相加，也不能证明单个模块的因果贡献。</p>
      <p><b>9/4：本地包没有走弱，游戏模块开始玩与搜索下降。</b>总启动 66.94%；较前 7 日，游戏模块开始玩 -3.41pp、搜索 -2.38pp，而本地包配置点击占新增 +2.01pp。9/3、9/4 启动人数均为 328，9/4 比9/3再降 0.41pp 是新增分母 487 → 490 所致。</p>
      <p><b>9/7：本地包与其他入口同时走弱。</b>总启动 290 / 444 = 65.32%，较 8/31–9/6 加权基线 69.79% 低 4.47pp。本地包总点击占新增 24.80% → 21.40%（-3.40pp），剩余部分 44.99% → 43.92%（-1.07pp）。本地包配置点击占新增 15.79% → 12.16%（-3.63pp），算法推荐 8.66% → 6.31%（-2.36pp）；游戏模块开始玩 -1.55pp，搜索反而 +2.13pp。各点击人群重叠，以上模块变化不可相加。</p>
      <p><b>9/8：有所恢复，仍未回到基线。</b>总启动 67.20%，本地包配置点击 / 页面曝光恢复至 23.25%，高于 9/7 的 19.71%。目前更像分日波动叠加非本地包转化走低，不能归为持续的本地包配置失效。</p>
      <p>需要优先核对 9/7 广东等地区实际展示的配置游戏与坑位、页面到配置点击链路，以及游戏模块开始玩的曝光和启动承接。源表不含配置变更日志、失败日志或用户交集，暂不能确认具体技术/游戏原因。渠道表仍截至 9/6，不能用于解释 9/7–9/8 渠道变化。</p></div>
      <div className="channelPanel"><h3>低谷前后逐日数据</h3><div className="channelTableWrap"><table><thead><tr><th>日期</th><th>新增 / 启动UV</th><th>总启动</th><th>本地包总点击 / 新增</th><th>配置点击 / 页面曝光</th><th>游戏模块开始玩 / 新增</th></tr></thead><tbody>{data.daily.filter(r=>r.date>='2026-09-01').map(r=><tr key={r.date}><th>{r.date.slice(5)}</th><td>{r.newUsers} / {r.start}</td><td>{rate(r.start,r.newUsers)}</td><td>{rate(r.totalClicks,r.newUsers)}<small>{r.totalClicks} / {r.newUsers}</small></td><td>{rate(r.configuredClicks,r.pageExposure)}<small>{r.configuredClicks} / {r.pageExposure}</small></td><td>{rate(r.game,r.newUsers)}</td></tr>)}</tbody></table></div></div>
    </>}
    <div className="channelPanel"><h3>10 省配置实验：8/26–9/1 对比 9/2–9/8</h3>
    <p>配置省份：页面曝光→配置推荐点击 22.29%（288/1,292）→24.30%（294/1,210），+2.01pp。其余已归属地区 26.81%→24.25%，-2.56pp。两组变化差约 +4.57pp，但并非随机实验，仍可能受地区样本与用户构成影响。</p>
    <p>新增配置的 7 省合计 22.15%→22.93%（+0.79pp）；原有山东、广东、安徽 22.59%→27.07%（+4.48pp）。因此不能把 10 省全部提升都算成新增 7 省配置的效果。</p>
    <div className="channelTableWrap"><table><thead><tr><th>省份</th><th>配置前点击 / 曝光</th><th>配置后点击 / 曝光</th><th>变化</th><th>复盘结论</th></tr></thead><tbody>{provinces.map(p=>{const b=data.before.find(r=>r.province===p),a=data.after.find(r=>r.province===p);const delta=100*a.configuredClicks/a.pageExposure-100*b.configuredClicks/b.pageExposure;return <tr key={p}><th>{p}</th><td>{rate(b.configuredClicks,b.pageExposure)}<small>{b.configuredClicks}/{b.pageExposure}</small></td><td>{rate(a.configuredClicks,a.pageExposure)}<small>{a.configuredClicks}/{a.pageExposure}</small></td><td style={{color:delta>=0?'#07866e':'#ca4d55'}}>{pp(delta)}</td><td>{delta>=0?'点击率提升，观察稳定性':'点击率下降，优先复核配置与城市分布'}{a.pageExposure<100?'；曝光不足100，样本有限':''}</td></tr>})}</tbody></table></div>
    <p><b>9/7 地区排查：</b>配置点击 / 页面曝光较前 7 日从25.14%降至19.71%。广东为2/29（6.90%），低于基线26.63%，是按当前曝光估算的最大配置点击缺口地区（约5.7次）；山东、辽宁、内蒙古也下降。广州1/13，样本有限，需核对实际展示，不能单凭一天判定规则失败。</p>
    <p>省份结构标准化显示，下降主要来自省内点击率变弱，而不是单纯更多用户流入低转化省份。算法推荐只作为环境指标，不用于评价运营配置。</p>
    <p><b>下一步：</b>本轮分析供运营确认，暂不自动安排回退、扩量或新实验。</p></div>
  </section>;
}
