import React from 'react';

// Report aggregates only; no user-level records or formal KPI exclusions.
export const CHANNEL_DIFFERENCE_STUDY = [
  { channel: '百度品专', users: 503, starts: 327, clusteredUsers: 74, clusteredStarts: 0 },
  { channel: '百度_m', users: 4533, starts: 3413, clusteredUsers: 6, clusteredStarts: 4 },
];
const rate = (n, d) => `${(100 * n / d).toFixed(2)}%`;
const count = n => n.toLocaleString('zh-CN');
const [brand, mobile] = CHANNEL_DIFFERENCE_STUDY;
const originalGap = 100 * (brand.starts / brand.users - mobile.starts / mobile.users);
const comparisonGap = 100 * ((brand.starts - brand.clusteredStarts) / (brand.users - brand.clusteredUsers) - (mobile.starts - mobile.clusteredStarts) / (mobile.users - mobile.clusteredUsers));

export default function ChannelDifferenceStudy() {
  return <section id="channel-difference-study" className="channelPanel channelDifferenceStudy" aria-labelledby="channel-difference-title">
    <h2 id="channel-difference-title">渠道差异对比专项</h2>
    <p className="studyScope">2026/10/1–10/14 · 全14天 · 全版本 · 注册当日总启动</p>
    <div className="studyConclusion"><h3>集中注册组是两渠道整体差距的主要解释线索</h3>
      <p>集中注册组拉低了百度品专的整体转化。临时移出该组后，两渠道汇总转化接近，描述性分解足以解释整体差距。按用户确认的业务判断，暂按<strong>疑似刷量影响</strong>处理；尚未逐号验证，不认定每位用户恶意。</p>
    </div>
    <div className="studyGapCards">
      <article><span>全量差距 · 品专减百度_m</span><strong>{originalGap.toFixed(2)} 个百分点</strong><small>品专 {rate(brand.starts, brand.users)}，百度_m {rate(mobile.starts, mobile.users)}</small></article>
      <article><span>临时剔除对照 · 品专减百度_m</span><strong>+{comparisonGap.toFixed(2)} 个百分点</strong><small>统计敏感性对照，不作为清洗后的正式 KPI</small></article>
    </div>
    <div className="channelTableWrap"><table aria-label="百度品专与百度_m集中注册分组对照">
      <thead><tr><th scope="col">口径与指标</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <th scope="col" key={r.channel}>{r.channel}</th>)}</tr></thead>
      <tbody>
        <tr><th scope="row">全量新增 / 总启动</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <td key={r.channel}>{count(r.users)} / {count(r.starts)}</td>)}</tr>
        <tr><th scope="row">全量总启动率</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <td key={r.channel}>{rate(r.starts, r.users)}</td>)}</tr>
        <tr><th scope="row">集中注册组人数 / 占新增</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <td key={r.channel}>{r.clusteredUsers} 人 / {rate(r.clusteredUsers, r.users)}</td>)}</tr>
        <tr><th scope="row">集中注册组总启动</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <td key={r.channel}>{r.clusteredStarts} 人</td>)}</tr>
        <tr><th scope="row">临时剔除后总启动 / 新增</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <td key={r.channel}>{count(r.starts - r.clusteredStarts)} / {count(r.users - r.clusteredUsers)}</td>)}</tr>
        <tr><th scope="row">临时剔除对照率</th>{CHANNEL_DIFFERENCE_STUDY.map(r => <td key={r.channel}>{rate(r.starts - r.clusteredStarts, r.users - r.clusteredUsers)}</td>)}</tr>
      </tbody>
    </table></div>
    <p><strong>本专项独立口径：</strong>保留10/9、10/13、10/14全部日期，不受上方日期、事件或渠道选择影响。与日常面板的异常日排除口径不同；原渠道数据、趋势与正式 KPI 分母均保持原状。</p>
    <div className="studyNotes">
      <section><h3>集中注册的判定方法</h3><p>同日、同渠道类型，按 dt / uid / channel_type 保留最早注册记录，再按注册时间排序。相邻注册时间间隔 ≤2 秒的记录连续连接，连续人数 ≥3 人即标记整组；不要求整组总时长 ≤2 秒。品专共8组，每组6–10人。</p><p>分组独立于是否启动，不以“无启动”反向筛选。自然高流量也可能满足该规则，百度_m包含56个渠道ID。</p></section>
      <section><h3>证据边界与待核实方向</h3><p>这是描述性分解，不证明个体恶意，也不证明算法、版本或具体运营配置的因果效果。临时剔除只是对照，不能直接作为正式清洗依据；其余组仍有7/14天品专较低。</p><p>后续需核实批次注册来源与渠道归因、注册时间含义、设备/IP及账号关联、测试账号或批量导入记录。这些仅为验证方向，本专项未开展新调查。</p></section>
    </div>
    <p className="studySource">来源：2026/10/15《百度品专与百度_m转化差异排查完整追溯报告》“结论与渠道对比”及完整SQL；业务暂判依据用户后续确认。总启动为客户端启动与本地包四类Web点击的用户并集，不等同于成功进入游戏或收入。汇总率以总启动人数合计÷新增人数合计计算，不平均每日比例。仅展示汇总，不提供UID明细或内部资料下载。</p>
  </section>;
}
