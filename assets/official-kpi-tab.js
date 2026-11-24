import {n as react,t as runtime} from './jsx-runtime-n5LQ9ujS.js';
import {daily} from './official-kpi-data.js';
import {metrics,curve,score,format,tiers} from './official-kpi-model.js';
const {jsx:h,jsxs}=runtime();
const {useState}=react();
const colors=['#9a481b','#167b70','#185eaa','#73549a'];
const positions=[1,5,10,15,20,25,30];
const palette='#1059ad';
const tierLabel=tier=>tier==null?'暂未发布 · 不判档':tier===0?'未达 75 分':tier+' 分档';
const dateLabel=day=>'2026 年 11 月 '+day+' 日';
function Plot({points,limits,mode,metricKey,label}){
 const [day,setDay]=useState(null);
 const [pinned,setPinned]=useState(false);
 const values=[...limits,...points.map(p=>p.value).filter(v=>v!=null)];
 const ext=Math.max(...values)-Math.min(...values)||1,lo=Math.max(0,Math.min(...values)-.15*ext),hi=Math.max(...values)+.14*ext;
 const x=d=>42+282*(d-1)/29,y=v=>12+92*(hi-v)/(hi-lo);
 let previous=false,segments='';
 const available=points.filter(p=>p.value!=null),latest=available.at(-1);
 for(const row of points){if(row.value==null){previous=false;continue;}segments+=(previous?'L':'M')+x(row.day)+' '+y(row.value)+' ';previous=true;}
 const axis=[lo, (hi+lo)/2,hi];
 const axisLabel=v=>mode==='人数'?(v/1e4).toFixed(1)+'万':v.toFixed(mode==='上限'?2:1)+'%';
 const dash=['6 5','4 4','8 4','2 4'];
 const active=day==null?null:points[day-1];
 const activeTier=active?.value!=null?score(active.value,limits,mode==='上限'):null;
 const tooltipId='kpi-detail-'+metricKey;
 const fromPointer=e=>{
   const r=e.currentTarget.getBoundingClientRect();
   const vx=(e.clientX-r.left)/r.width*340;
   return Math.max(1,Math.min(30,Math.round((vx-42)*29/282)+1));
 };
 const onKeyDown=e=>{
   const here=day??latest?.day??1, steps={ArrowLeft:-1,ArrowDown:-1,ArrowUp:1,ArrowRight:1,PageDown:-5,PageUp:5};
   if(e.key==='Escape'){e.preventDefault();setDay(null);setPinned(false);return;}
   const next=e.key==='Home'?1:e.key==='End'?30:e.key in steps?here+steps[e.key]:null;
   if(next!=null){e.preventDefault();setDay(Math.max(1,Math.min(30,next)));}
 };
 const valueText=active?dateLabel(day)+'，'+(active.value==null?'未发布实绩':format(active.value,mode)+'，'+tierLabel(activeTier)):'用方向键查看每日累计值';
 return jsxs('div',{className:'kpi-plot-control',role:'slider',tabIndex:0,'aria-label':label+'：查看每日月累计实绩','aria-valuemin':1,'aria-valuemax':30,'aria-valuenow':day??latest?.day??1,'aria-valuetext':valueText,'aria-describedby':'kpi-interaction-help',onKeyDown,
   onFocus:()=>setDay(d=>d??latest?.day??1),onBlur:()=>{setDay(null);setPinned(false);},
   onPointerMove:e=>{if(e.pointerType==='mouse'&&!pinned)setDay(fromPointer(e));},
   onPointerLeave:e=>{if(e.pointerType==='mouse'&&!pinned)setDay(null);},
   onClick:e=>{if(e.detail===0)return;const n=fromPointer(e);if(pinned&&day===n){setDay(null);setPinned(false);}else{setDay(n);setPinned(true);}},children:[
 jsxs('svg',{viewBox:'0 0 340 132',className:'kpi-plot','aria-hidden':'true',children:[
   h('rect',{x:42,y:12,width:282,height:92,rx:4,fill:'#f6f8fa'}),
   latest&&latest.day<30?h('rect',{x:x(latest.day),y:12,width:324-x(latest.day),height:92,fill:'#eef1f3'}):null,
   ...axis.map((v,i)=>jsxs('g',{children:[h('line',{x1:42,x2:324,y1:y(v),y2:y(v),stroke:'#dce3e8'}),h('text',{x:36,y:y(v)+3,fill:'#526376',textAnchor:'end',fontSize:9.25,children:axisLabel(v)})]},i)),
   ...positions.map(d=>h('text',{x:x(d),y:123,textAnchor:'middle',fill:'#526376',fontSize:9.25,children:d+'日'},d)),
   ...limits.map((v,i)=>h('line',{x1:42,x2:324,y1:y(v),y2:y(v),stroke:colors[i],strokeDasharray:dash[i],strokeWidth:1.3,'data-kpi-target':tiers[i],children:h('title',{children:tiers[i]+'分：'+format(v,mode)})},i)),
   h('path',{d:segments,fill:'none',stroke:palette,strokeWidth:2.25,strokeLinejoin:'round',strokeLinecap:'round','data-kpi-actual':'mtd'}),
   ...available.map(p=>h('circle',{cx:x(p.day),cy:y(p.value),r:p===latest?3.7:2.1,fill:palette,stroke:p===latest?'white':undefined,strokeWidth:p===latest?1.2:undefined},p.day)),
   active?h('line',{x1:x(day),x2:x(day),y1:12,y2:104,stroke:palette,strokeDasharray:'3 3',className:'kpi-crosshair'}):null,
   active?.value!=null?h('circle',{cx:x(day),cy:y(active.value),r:4.5,fill:palette,stroke:'#fff',strokeWidth:1.5}):null
 ]}),
 active?jsxs('div',{className:'kpi-tooltip',role:'tooltip',id:tooltipId,'data-kpi-tooltip-day':day,style:{'--point':x(day)/3.4+'%'},children:[
   h('span',{children:dateLabel(day)}),
   h('strong',{children:active.value==null?'未发布实绩':(mode==='人数'?'月内累计日均':'月累计实绩')+' '+format(active.value,mode)}),
   h('span',{className:activeTier===0?'kpi-tooltip-low':'',children:tierLabel(activeTier)})
 ]}):null
 ]});
}
function Card({metric}){
 const [key,label,limits,mode,method]=metric;
 const points=curve(daily[key],mode),latest=points.filter(p=>p.value!=null).at(-1);
 const tier=score(latest?.value,limits,mode==='上限');
 return jsxs('article',{className:'kpi-card','data-kpi-metric':key,children:[
   jsxs('div',{className:'kpi-card-heading',children:[h('h3',{children:label})]}),
   jsxs('div',{className:'kpi-top',children:[
      h('strong',{children:format(latest?.value,mode)}),
      h('span',{className:tier===0?'kpi-low':'kpi-tier',children:tier==null?'无数据':tier===0?'未达 75 分':tier+' 分档'})
   ]}),
   jsxs('p',{className:'kpi-date',children:[latest?'实绩截至 11 月 '+latest.day+' 日':'暂未取得正式实绩',mode==='上限'?h('span',{children:'越低越好'}):null]}),
   h(Plot,{points,limits,mode,metricKey:key,label}),
   h('ol',{className:'kpi-targets','aria-label':'正式分档目标',children:limits.map((v,i)=>jsxs('li',{style:{'--kpi-tier-color':colors[i]},children:[h('span',{children:tiers[i]+' 分'}),h('strong',{children:format(v,mode)})]},tiers[i]))}),
   h('p',{className:'kpi-method',children:method})
 ]});
}
export function OfficialKpiTab({standalone=false}={}){
 const dates=metrics.map(([k])=>[...Object.keys(daily[k]??{}).map(Number)].sort((a,b)=>a-b));
 const cutoff=Math.max(0,...dates[0].filter(d=>dates.every(list=>list.includes(d))));
 const attained=cutoff?metrics.filter(([k,,limits,mode])=>score(curve(daily[k],mode)[cutoff-1].value,limits,mode==='上限')>=75).length:null;
 return jsxs('section',{className:'official-kpi','aria-labelledby':'official-kpi-title',children:[
   standalone?null:h('link',{rel:'stylesheet',href:new URL('./official-kpi-tab.css',import.meta.url).href}),
   jsxs('header',{className:'pageIntro',children:[
     jsxs('div',{children:[h('h1',{id:'official-kpi-title',children:'KPI 达成趋势'}),h('p',{children:'2026 年 11 月正式考核 · 月累计实绩与四档目标'})]}),
     cutoff?h('span',{children:'截至 11 月 '+cutoff+' 日（六项可比） · '+attained+' / 6 项达 75 分线'}):null
   ]}),
   jsxs('div',{className:'kpi-key',children:[h('span',{className:'kpi-key-actual',children:'实线：累计实绩'}),h('span',{className:'kpi-key-target',children:'虚线：75 / 80 / 90 / 100 分目标'}),h('span',{id:'kpi-interaction-help',children:'悬停、轻点或用方向键查看每天的数据。灰区未发布；按未舍入值判档。'})]}),
   h('div',{className:'kpi-grid',children:metrics.map(metric=>h(Card,{metric},metric[0]))})
 ]});
}
