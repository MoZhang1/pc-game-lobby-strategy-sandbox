import React, { useState } from 'react';
import data from './androidChannelData';
import './android-channel.css';

const channels = ['百度品专', '360移动', '百度_m'];
const colors = ['#2563eb', '#d08a15', '#0d9488'];
const dates = [...new Set(data.rows.map(r => r.date))].sort();
const events = ['TOTAL_START', ...Object.keys(data.events).filter(e => e !== 'TOTAL_START')];
const pct = (n, d) => d ? (100 * n / d).toFixed(2) + '%' : '—';
const num = n => n.toLocaleString('zh-CN');
function aggregate(rows, channel, event) {
  const valid = rows.filter(r => r.channel === channel && r.clicks[event] != null);
  return { users: valid.reduce((s,r) => s+r.users,0), clicks: valid.reduce((s,r) => s+r.clicks[event],0), days: valid.length };
}

export default function AndroidChannelComparison() {
  const [start, setStart] = useState(dates[0]);
  const [end, setEnd] = useState(dates.at(-1));
  const [event, setEvent] = useState('TOTAL_START');
  const [selected, setSelected] = useState(channels);
  const [hover, setHover] = useState(null);
  const rows = data.rows.filter(r => r.date >= start && r.date <= end);
  const days = dates.filter(d => d >= start && d <= end);
  const summary = channels.map(c => ({channel:c,...aggregate(rows,c,'TOTAL_START')}));
  const total = summary.reduce((s,r) => s+r.users,0);
  const x = i => 64 + i / Math.max(1,days.length-1) * 890;
  const y = value => 280 - value * 2.4;
  const point = (c,d) => rows.find(r => r.channel === c && r.date === d);
  const ranking = summary.filter(r => r.users).sort((a,b) => b.clicks/b.users-a.clicks/a.users);
  return <section className="channelCompare">
    <h2>渠道新增用户点击对比</h2>
    <p>数据区间：{dates[0]} 至 {dates.at(-1)}。占比 = 所选区间点击 UV 合计 ÷ 渠道新增用户 UV 合计。</p>
    <div className="channelPanel channelControls">
      <label>开始日期 <input aria-label="渠道开始日期" type="date" min={dates[0]} max={end} value={start} onChange={e => {setStart(e.target.value);setHover(null);}} /></label>
      <label>结束日期 <input aria-label="渠道结束日期" type="date" min={start} max={dates.at(-1)} value={end} onChange={e => {setEnd(e.target.value);setHover(null);}} /></label>
      <button onClick={() => {setStart(dates[0]);setEnd(dates.at(-1));setHover(null);}}>全部日期</button>
    </div>
    {start > end || !days.length ? <p role="alert">请选择有效日期区间。</p> : <>
    <div className="channelCards">{summary.map((r,i) => <article className="channelPanel" key={r.channel}>
      <h3 style={{color:colors[i]}}>{r.channel}</h3><p>总启动占比</p><strong>{pct(r.clicks,r.users)}</strong>
      <p>启动 {num(r.clicks)} / 新增 {num(r.users)}</p>
      <p>三渠道新增量占比 {pct(r.users,total)} · 有记录 {r.days}/{days.length} 天</p>
      {r.users < 100 && <small>样本较小，比例波动不代表稳定效果。</small>}
    </article>)}</div>
    <div className="channelPanel">
      <div className="channelControls"><h3>每日点击占比趋势</h3><label>对比事件 <select aria-label="渠道对比事件" value={event} onChange={e => {setEvent(e.target.value);setHover(null);}}>{events.map(e => <option key={e} value={e}>{data.events[e]}</option>)}</select></label></div>
      <div className="channelControls">{channels.map((c,i) => <label key={c} style={{color:colors[i]}}><input type="checkbox" checked={selected.includes(c)} onChange={() => setSelected(selected.includes(c) ? selected.filter(s=>s!==c) : [...selected,c])}/>{c}</label>)}</div>
      {!selected.length ? <p className="channelEmpty">请选择要对比的渠道。</p> : <svg viewBox="0 0 1000 330" role="img" aria-label={data.events[event]+'三渠道每日占比趋势'} onMouseLeave={() => setHover(null)}>
        {[0,25,50,75,100].map(v => <g key={v}><line x1="64" x2="954" y1={y(v)} y2={y(v)} stroke="#e5e7eb"/><text x="52" y={y(v)+5} textAnchor="end" fill="#777" fontSize="13">{v}%</text></g>)}
        {channels.filter(c=>selected.includes(c)).map(c => {let connected=false;const path=days.map((d,i)=>{const r=point(c,d);if(!r || !r.users || r.clicks[event]==null){connected=false;return '';}const p=(connected?'L':'M')+x(i)+','+y(r.clicks[event]/r.users*100);connected=true;return p;}).join(' ');return <g key={c}><path d={path} fill="none" stroke={colors[channels.indexOf(c)]} strokeWidth="2.5"/>{days.map((d,i)=>{const r=point(c,d);return r?.users && r.clicks[event]!=null ? <circle key={d} cx={x(i)} cy={y(r.clicks[event]/r.users*100)} r="3" fill={colors[channels.indexOf(c)]}/> : null;})}</g>;})}
        {days.map((d,i)=><g key={d}>{(i%Math.max(1,Math.ceil(days.length/8))===0 || i===days.length-1)&&<text x={x(i)} y="310" textAnchor="middle" fill="#777" fontSize="13">{d.slice(5)}</text>}<rect x={x(i)-445/Math.max(1,days.length-1)} y="25" width={days.length===1?890:890/(days.length-1)} height="260" fill="transparent" onMouseEnter={()=>setHover(d)} onTouchStart={()=>setHover(d)}/></g>)}
        {hover && <line x1={x(days.indexOf(hover))} x2={x(days.indexOf(hover))} y1="25" y2="280" stroke="#999" strokeDasharray="4 4" pointerEvents="none"/>}
      </svg>}
      <div className="channelHover" aria-live="polite">{hover ? <><b>{hover}</b>{selected.map(c=>{const r=point(c,hover);return <span key={c}>{c}：{r ? pct(r.clicks[event],r.users)+'（'+r.clicks[event]+'/'+r.users+'）' : '无记录'}</span>;})}</> : '鼠标移到折线图上，可查看当天比例及点击 UV / 新增 UV。'}</div>
    </div>
    <div className="channelPanel"><h3>所选区间结论</h3>
      <p>{ranking.map(r=>r.channel+' '+pct(r.clicks,r.users)).join('；')}。</p>
      <p>{summary.filter(r=>r.users>=100).sort((a,b)=>b.users-a.users).slice(0,1).map(r=>r.channel+'占三渠道新增量的 '+pct(r.users,total)+'，应优先关注该渠道总启动及模块点击变化。')}</p>
      <p>360移动样本量较小，建议结合更长周期观察。渠道间差异是用户来源与分发效果的共同结果，不能直接认定为配置带来的提升。</p>
    </div>
    <div className="channelPanel"><h3>模块点击对比</h3><p>单元格为占比及点击 UV。各模块可能重复点击，不相加替代总启动。</p>
    <div className="channelTableWrap"><table><thead><tr><th>事件</th>{channels.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{events.map(e=><tr key={e}><th>{data.events[e]}</th>{channels.map(c=>{const a=aggregate(rows,c,e);return <td key={c}>{pct(a.clicks,a.users)}<small>{num(a.clicks)} / {num(a.users)}</small></td>;})}</tr>)}</tbody></table></div></div>
    <p>来源：分渠道安卓新增点击.xlsx。仅包含表内三渠道，不代表平台全部新增用户。无记录日期保留缺失，不补为零；总启动使用源表 TOTAL_START。</p>
    </>}
  </section>;
}
