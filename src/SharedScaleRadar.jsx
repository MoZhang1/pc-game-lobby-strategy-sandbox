import React from 'react';
import {Info} from 'lucide-react';
import {metrics,number,format} from './androidRadarModel';
import {projectValue,chartValue} from './androidRadarScale';

const point=(i,r)=>[360+Math.sin(i*Math.PI/3)*r,265-Math.cos(i*Math.PI/3)*r];
const points=arr=>arr.map(p=>p.join(',')).join(' ');
const units={dau:'人/日',new:'人/日',d1:'%',recharge:'元/日',silver:'原始单位/日',conversion:'%'};
function short(v,type){
  if(v!=null&&type!=='rate'&&Math.abs(v)>=1e8)return number(v/1e8)+'亿';
  if(v!=null&&type!=='rate'&&Math.abs(v)>=1e4)return number(v/1e4)+'万';
  return format(v,type,true);
}
function Series({coords,color,area}) {
  const complete=coords.every(Boolean);
  return complete?<polygon className={area?'ar-current-area':'ar-baseline'} points={points(coords)}/>:
    coords.map((p,i)=>p&&coords[(i+1)%6]&&<line key={i} x1={p[0]} y1={p[1]} x2={coords[(i+1)%6][0]} y2={coords[(i+1)%6][1]} stroke={color} strokeWidth="2" strokeDasharray={area?undefined:'5 4'}/>);
}
export default function SharedScaleRadar({rows,scales,scale,game,lower,focus,setFocus}){
  const blue=rows.map((r,i)=>projectValue(chartValue(r),scales[i]));
  const red=rows.map((r,i)=>projectValue(r.mean,scales[i]));
  const coords=blue.map((v,i)=>v.radius==null?null:point(i,v.radius*145));
  const baseline=red.map((v,i)=>v.radius==null?null:point(i,v.radius*145));
  const count=coords.filter(Boolean).length,selected=rows[focus],s=scales[focus];
  const clipped=rows.filter((r,i)=>blue[i].clipped||red[i].clipped);
  return <>
    <div className="ar-chart-toolbar"><div className="ar-legend"><span><i/>{game.name}</span><span><i className="ar-red"/>其他游戏均值</span></div><span className="ar-scale-label">共用标尺 · 各轴单位独立</span></div>
    {rows.every(r=>r.mean==null)&&<p className="ar-overflow-note">当前范围没有其他有效游戏可作基准，红线不绘制；平台标尺保持不变。</p>}
    {count<3?<div className="ar-insufficient"><Info size={28}/><h3>可绘制指标不足</h3><p>仅{count}个有效轴。缺失与负值不补0，请查看真实值表。</p></div>:
    <svg className="ar-radar ar-shared-radar" viewBox="0 0 720 550" role="img" aria-label={`${game.name}共享刻度雷达图；蓝色当前游戏，红色其他游戏真实均值。每轴共用固定标尺，红线不固定100。`}>
      {[.25,.5,.75,1].map(f=><g key={f}><polygon points={points(metrics.map((_,i)=>point(i,145*f)))} fill="none" stroke="#e4e8ef"/><text x="366" y={265-145*f+13} className="ar-grid-label">{f*100}%尺</text></g>)}
      {metrics.map((_,i)=><line key={i} x1="360" y1="265" x2={point(i,145)[0]} y2={point(i,145)[1]} stroke="#e4e8ef"/>)}
      <Series coords={baseline} color="#ce6273"/><Series coords={coords} color="#2874ec" area/>
      {rows.map((r,i)=>{
        const p=point(i,207),anchor=i===0||i===3?'middle':i<3?'start':'end';
        const plot=blue[i],meanPlot=red[i];
        return <g key={r.key} data-axis={r.key} data-upper={scales[i].upper} data-blue-position={plot.position??''} data-red-position={meanPlot.position??''}>
          <g className="ar-axis" tabIndex="0" role="button" aria-label={`${r.label}，当前${format(r.value,r.type)}，均值${format(r.mean,r.type)}，外圈${format(scales[i].upper,r.type)}${units[r.key]}。${plot.clipped||meanPlot.clipped?'存在超界值。':''}`} onFocus={()=>setFocus(i)} onMouseEnter={()=>setFocus(i)} onClick={()=>setFocus(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setFocus(i)}}}>
            <text x={p[0]} y={p[1]-17} textAnchor={anchor} className="ar-axis-label">{r.label} <tspan className="ar-unit">{units[r.key]}</tspan></text>
            <text x={p[0]} y={p[1]+5} textAnchor={anchor} className="ar-axis-value">当前 {r.key==='conversion'&&lower?'≥ ':''}{short(r.value,r.type)}{plot.clipped?' ↑':''}</text>
            <text x={p[0]} y={p[1]+25} textAnchor={anchor} className="ar-axis-mean">均值 {short(r.mean,r.type)}{meanPlot.clipped?' ↑':''}</text>
            <text x={p[0]} y={p[1]+43} textAnchor={anchor} className="ar-axis-index">外圈 {short(scales[i].upper,r.type)}{plot.radius==null?' · 当前未绘制':''}</text>
          </g>
          {[[coords[i],plot,'#2874ec'],[baseline[i],meanPlot,'#ce6273']].map(([c,projection,color],k)=>c&&<g key={k}><circle cx={c[0]} cy={c[1]} r={focus===i?5:3.5} fill={color} stroke="white" strokeWidth="1.5"/>{projection.clipped&&<text x={c[0]+(k?9:-9)} y={c[1]-10} fill={color} fontSize="18" textAnchor="middle">↑</text>}</g>)}
        </g>;
      })}
    </svg>}
    <div className="ar-mobile-values" aria-label="六轴蓝红真实值">{rows.map((r,i)=><div key={r.key}><b>{r.label}</b><small>{units[r.key]}</small><span className="ar-blue-text">当前 {r.key==='conversion'&&lower?'≥ ':''}{short(r.value,r.type)}{blue[i].clipped?' ↑':''}</span><span className="ar-red-text">均值 {short(r.mean,r.type)}{red[i].clipped?' ↑':''}</span></div>)}</div>
    <div className="ar-point-detail" aria-live="polite"><b>{selected.label}</b><span className="ar-blue-text">当前 {format(selected.value,selected.type)}{selected.key==='conversion'&&lower?'（下界）':''}</span><span className="ar-red-text">均值 {format(selected.mean,selected.type)} · n={selected.n}{selected.n<5?' · 样本偏少':''}</span><span>外圈 {format(s.upper,s.type)} {s.type==='rate'?'':units[s.key]}</span></div>
    {clipped.length>0&&<p className="ar-overflow-note">↑ 超出外圈：{clipped.map(r=>{const i=rows.indexOf(r);return `${r.label} ${blue[i].clipped?`当前为外圈的${number(blue[i].position*100,1)}%`:''}${red[i].clipped?` 均值为外圈的${number(red[i].position*100,1)}%`:''}`}).join('；')}。图点停在外圈，真实数值未截断；切换“完整范围”查看全貌。</p>}
    <p className="ar-chart-note">{scale==='p95'?'人数、金额与净消耗外圈取固定样本P95；比例外圈100%。':'人数、金额与净消耗外圈取固定样本最大值；比例外圈100%。'} 标尺始终基于140款平台样本，切换游戏与分类不变尺。缺失/负值断轴，不填满面积；净消耗大小不代表健康优劣。</p>
    <details className="ar-scale-details"><summary>查看每轴标尺与样本</summary><div className="ar-scale-table">{scales.map(s=><p key={s.key}><b>{s.label}</b><span>0—{format(s.upper,s.type)} {s.type==='rate'?'':units[s.key]} · n={s.n}</span><small>{s.mode==='rate'?'比例自然范围0–100%':s.fallback?'P95非正，退回同一固定样本最大值':s.mode==='max'?'固定样本最大值':'P95：排序后在(n−1)×0.95处线性插值'}{s.small?'；标尺样本不足20，分位数不稳定':''}{s.negativeCount?`；包含${s.negativeCount}款负值`:''}</small></p>)}</div><p>标尺样本含所选游戏；比较均值仍排除所选游戏，并随比较范围变化。各轴仅使用有效数据；净消耗仅用完整30日。均值未截尾、未改成P95或百分位，零均值可画在中心。不同指标的半径不代表同一种业务单位，不作综合评分。</p></details>
  </>;
}
