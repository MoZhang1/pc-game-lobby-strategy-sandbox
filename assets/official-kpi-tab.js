import {n as react,t as runtime} from './jsx-runtime-n5LQ9ujS.js';
import {dailySnapshots} from './official-kpi-data.js';
import {monthlyHistory} from './official-kpi-history.js';
import {metrics,curve,score,format,tiers,daysInMonth} from './official-kpi-model.js';
const {jsx:h,jsxs}=runtime();
const {useState,useEffect,useRef}=react();
const colors=['#9a481b','#167b70','#185eaa','#73549a'];
const palette='#1059ad';
const firstMonth='2025-12';
const snapshotMonths=Object.keys(dailySnapshots).filter(month=>daysInMonth(month)>0&&month>=firstMonth&&metrics.some(([key,,,mode])=>curve(dailySnapshots[month]?.[key],mode,month).some(row=>row.value!=null)));
const validSnapshot=month=>snapshotMonths.includes(month);
const monthsBetween=(first,last)=>{
 let year=Number(first.slice(0,4)),month=Number(first.slice(5)),out=[];
 while(year<=9999){
  const yy=year+'-'+String(month).padStart(2,'0');
  if(yy>last)break;
  out.push(yy);
  if(++month>12){month=1;year++;}
 }
 return out;
};
const lastMonth=[...Object.keys(monthlyHistory).filter(k=>daysInMonth(k)>0),...snapshotMonths].reduce((max,k)=>k>max?k:max,firstMonth);
const monthOptions=monthsBetween(firstMonth,lastMonth);
const monthLabel=m=>m.slice(0,4)+' 年 '+Number(m.slice(5))+' 月';
const shortMonth=m=>m.slice(2,4)+'/'+m.slice(5);
const niceDate=d=>d.slice(0,4)+' 年 '+Number(d.slice(5,7))+' 月 '+Number(d.slice(8,10))+' 日';
const latestPoint=points=>points.filter(p=>p.value!=null).at(-1);
const tierLabel=tier=>tier==null?'暂无已核实绩 · 不判档':tier===0?'未达 75 分':tier+' 分档';
const toDate=(month,day)=>month+'-'+String(day).padStart(2,'0');
const verifiedMonthly=(month,key,mode)=>{
 if(validSnapshot(month)){const p=latestPoint(curve(dailySnapshots[month][key],mode,month));if(p)return {value:p.value,through:toDate(month,p.day),partial:p.day<daysInMonth(month)};}
 const rec=monthlyHistory[month]?.[key];
 if(!rec||typeof rec.value!=='number'||!Number.isFinite(rec.value)||rec.value<0||typeof rec.through!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(rec.through)||!rec.through.startsWith(month+'-')||Number(rec.through.slice(8))<1||Number(rec.through.slice(8))>daysInMonth(month))return null;
 return {value:rec.value,through:rec.through,partial:rec.partial===true||Number(rec.through.slice(8))<daysInMonth(month),note:typeof rec.note==='string'?rec.note:null};
};
const monthlySeries=(keys,key,mode)=>keys.map(month=>({month,label:monthLabel(month),short:shortMonth(month),value:null,...verifiedMonthly(month,key,mode)}));
const dailySeries=(month,key,mode)=>curve(dailySnapshots[month]?.[key],mode,month).map(row=>({...row,month,through:toDate(month,row.day),label:niceDate(toDate(month,row.day)),short:row.day+'日'}));
const benchmarkTier=tier=>tier==null?tierLabel(tier):'按当前档位线：'+tierLabel(tier);
function Plot({points,limits,mode,metricKey,label,isDaily}){
 const [idx,setIdx]=useState(null),[pinned,setPinned]=useState(false),[width,setWidth]=useState(720);
 const host=useRef(null);
 useEffect(()=>{let el=host.current;if(!el)return;
  let observer=new ResizeObserver(([r])=>{if(r.contentRect.width>20)setWidth(Math.round(r.contentRect.width))});
  observer.observe(el);return()=>observer.disconnect();
 },[]);
 const chartW=Math.max(235,width), chartH=chartW<500?222:286;
 const l=chartW<500?51:71,r=chartW-19,t=19,b=chartH-29;
 const values=[...limits,...points.map(p=>p.value).filter(v=>v!=null)];
 const ext=Math.max(...values)-Math.min(...values)||1,lo=Math.max(0,Math.min(...values)-.15*ext),hi=Math.max(...values)+.14*ext;
 const x=i=>points.length===1?(l+r)/2:l+(r-l)*i/(points.length-1);
 const y=v=>t+(b-t)*(hi-v)/(hi-lo);
 let previous=false,segments='';
 const latest=points.findLastIndex(p=>p.value!=null);
 points.forEach((p,i)=>{if(p.value==null){previous=false;return;}segments+=(previous?'L':'M')+x(i)+' '+y(p.value)+' ';previous=true;});
 const axis=[lo,(2*lo+hi)/3,(lo+2*hi)/3,hi];
 const axisLabel=v=>mode==='人数'?(v/1e4).toFixed(1)+'万':v.toFixed(mode==='上限'?2:1)+'%';
 const dash=['6 5','4 4','8 4','2 4'];
 const active=idx==null?null:points[idx];
 const tier=active?.value!=null?score(active.value,limits,mode==='上限'):null;
 const labels=isDaily?[0,4,9,14,19,24,points.length-1]:points.map((_,i)=>i).filter(i=>chartW>=610||points.length<=6||(i%2===0&&i<points.length-2)||i===points.length-1);
 const fromPointer=e=>{
   const box=e.currentTarget.getBoundingClientRect();
   const ux=(e.clientX-box.left)/box.width*chartW;
   return Math.max(0,Math.min(points.length-1,Math.round((ux-l)*(points.length-1)/(r-l))));
 };
 const onKeyDown=e=>{
   const here=idx??Math.max(0,latest),steps={ArrowLeft:-1,ArrowDown:-1,ArrowUp:1,ArrowRight:1,PageDown:-5,PageUp:5};
   if(e.key==='Escape'){e.preventDefault();setIdx(null);setPinned(false);return;}
   const next=e.key==='Home'?0:e.key==='End'?points.length-1:e.key in steps?here+steps[e.key]:null;
   if(next!=null){e.preventDefault();setIdx(Math.max(0,Math.min(points.length-1,next)));setPinned(true);}
 };
 const valueText=active?active.label+'，'+(active.value==null?'暂无已核实绩':format(active.value,mode)+'，'+benchmarkTier(tier)):'用方向键查看实绩';
 return jsxs('div',{ref:host,className:'kpi-plot-control',role:'slider',tabIndex:0,'aria-label':label+'：查看'+(isDaily?'每日月累计实绩':'各月实绩'),'aria-valuemin':1,'aria-valuemax':Math.max(1,points.length),'aria-valuenow':(idx??Math.max(0,latest))+1,'aria-valuetext':valueText,'aria-describedby':'kpi-interaction-help',onKeyDown,
   onFocus:()=>setIdx(p=>p??Math.max(0,latest)),onBlur:()=>{setIdx(null);setPinned(false);},
   onPointerMove:e=>{if(e.pointerType==='mouse'&&!pinned)setIdx(fromPointer(e));},
   onPointerLeave:e=>{if(e.pointerType==='mouse'&&!pinned)setIdx(null);},
   onClick:e=>{if(e.detail===0)return;const next=fromPointer(e);if(pinned&&idx===next){setIdx(null);setPinned(false);}else{setIdx(next);setPinned(true);}},children:[
 jsxs('svg',{viewBox:'0 0 '+chartW+' '+chartH,className:'kpi-plot','aria-hidden':'true',children:[
   h('rect',{x:l,y:t,width:r-l,height:b-t,rx:4,fill:'#f6f8fa'}),
   ...points.map((p,i)=>{if(p.value!=null)return null;const left=i===0?l:(x(i-1)+x(i))/2, right=i===points.length-1?r:(x(i)+x(i+1))/2;return h('rect',{x:left,y:t,width:right-left,height:b-t,fill:'#eef1f3'},'missing'+i);}),
   ...axis.map((v,i)=>jsxs('g',{children:[h('line',{x1:l,x2:r,y1:y(v),y2:y(v),stroke:'#dce3e8'}),h('text',{x:l-7,y:y(v)+3.6,fill:'#526376',textAnchor:'end',fontSize:11,children:axisLabel(v)})]},'axis'+i)),
   ...labels.map(i=>h('text',{x:x(i),y:chartH-9,textAnchor:i===points.length-1?'end':i===0&&points.length>1?'start':'middle',fill:'#526376',fontSize:11,children:points[i].short},'label'+i)),
   ...limits.map((v,i)=>h('line',{x1:l,x2:r,y1:y(v),y2:y(v),stroke:colors[i],strokeDasharray:dash[i],strokeWidth:1.3,'data-kpi-target':tiers[i]},'threshold'+i)),
   h('path',{d:segments,fill:'none',stroke:palette,strokeWidth:2.4,strokeLinejoin:'round',strokeLinecap:'round','data-kpi-actual':isDaily?'mtd':'monthly'}),
   ...points.map((p,i)=>p.value!=null?h('circle',{cx:x(i),cy:y(p.value),r:p.partial?4.5:i===latest?4:3.2,fill:p.partial?'white':palette,stroke:p.partial?palette:'white',strokeWidth:p.partial?2:1.2,'data-kpi-point':p.month,'data-kpi-partial':p.partial?'true':undefined},'actual'+i):null),
   active?h('line',{x1:x(idx),x2:x(idx),y1:t,y2:b,stroke:palette,strokeDasharray:'3 3',className:'kpi-crosshair'}):null,
   active?.value!=null?h('circle',{cx:x(idx),cy:y(active.value),r:5,fill:palette,stroke:'#fff',strokeWidth:1.6}):null
 ]}),
 active?jsxs('div',{className:'kpi-tooltip',role:'tooltip','data-kpi-tooltip-day':isDaily?active.day:undefined,'data-kpi-tooltip-month':active.month,style:{'--point':x(idx)*100/chartW+'%'},children:[
   h('span',{children:active.label}),
   h('strong',{children:active.value==null?'暂无已核实绩':(mode==='人数'?'日均活跃':isDaily?'月累计实绩':'当月实绩')+' '+format(active.value,mode)}),
   active.value!=null&&!isDaily?h('span',{children:(active.partial?'未满月 · 截至 ':'整月 · 截至 ')+niceDate(active.through)}):null,
   h('span',{className:tier===0?'kpi-tooltip-low':'',children:benchmarkTier(tier)}),
   active.note?h('span',{children:active.note}):null
 ]}):null
 ]});
}
function Card({metric,months,isDaily}){
 const [key,label,limits,mode,method]=metric;
 const points=isDaily?dailySeries(months[0],key,mode):monthlySeries(months,key,mode),latest=latestPoint(points);
 const tier=score(latest?.value,limits,mode==='上限');
 return jsxs('article',{className:'kpi-card','data-kpi-metric':key,children:[
   jsxs('div',{className:'kpi-card-heading',children:[h('h3',{children:label})]}),
   jsxs('div',{className:'kpi-top',children:[
      h('strong',{children:format(latest?.value,mode)}),
      h('span',{className:tier===0?'kpi-low':'kpi-tier',children:tier==null?'无数据':benchmarkTier(tier)})
   ]}),
   jsxs('p',{className:'kpi-date',children:[latest?(latest.partial?'未满月 · ':'')+'实绩截至 '+niceDate(latest.through):'所选区间暂无已核实绩',mode==='上限'?h('span',{children:'越低越好'}):null]}),
   h(Plot,{points,limits,mode,metricKey:key,label,isDaily},(isDaily?"daily":"monthly")+months.join(":")),
   h('ol',{className:'kpi-targets','aria-label':'当前正式分档目标',children:limits.map((v,i)=>jsxs('li',{style:{'--kpi-tier-color':colors[i]},children:[h('span',{children:tiers[i]+' 分'}),h('strong',{children:format(v,mode)})]},tiers[i]))}),
   h('p',{className:'kpi-method',children:method})
 ]});
}
export function OfficialKpiTab(){
 const [start,setStart]=useState(firstMonth),[end,setEnd]=useState(lastMonth);
 const selected=monthsBetween(start,end);
 const isDaily=start===end&&validSnapshot(start);
 const picker=(id,value,change)=>h('select',{id,value,onChange:e=>change(e.target.value),children:monthOptions.map(m=>h('option',{value:m,children:monthLabel(m)},m))});
 return jsxs('section',{className:'official-kpi','aria-labelledby':'official-kpi-title',children:[
   h('link',{rel:'stylesheet',href:new URL('./official-kpi-tab.css',import.meta.url).href}),
   jsxs('header',{className:'pageIntro',children:[
     jsxs('div',{children:[h('h1',{id:'official-kpi-title',children:'KPI 达成趋势'}),h('p',{children:'已核实绩与当前正式四档目标对照'})]}),
     h('span',{children:isDaily?'日趋势 · 月内累计':'月趋势 · 每月独立核算'})
   ]}),
   jsxs('div',{className:'filterCard kpi-filters','aria-label':'KPI 时间筛选',children:[
     jsxs('div',{className:'filterCopy',children:[jsxs('div',{children:[h('b',{children:'时间范围'}),h('span',{children:isDaily?'单月展示每日累计；多月展示各月实绩':'默认从 2025 年 12 月起 · 可选开始与结束月份'})]})]}),
     jsxs('div',{className:'kpi-filter-fields',children:[
       jsxs('label',{htmlFor:'kpi-from',children:['开始月份',picker('kpi-from',start,m=>{setStart(m);if(m>end)setEnd(m)})]}),
       jsxs('label',{htmlFor:'kpi-to',children:['结束月份',picker('kpi-to',end,m=>{setEnd(m);if(m<start)setStart(m)})]})
     ]}),
      h('button',{type:'button',className:'kpi-reset',disabled:start===firstMonth&&end===lastMonth,onClick:()=>{setStart(firstMonth);setEnd(lastMonth);},children:'重置'})
   ]}),
   jsxs('div',{className:'kpi-key',children:[h('span',{className:'kpi-key-actual',children:isDaily?'实线：累计实绩':'实线：已核月度实绩'}),h('span',{className:'kpi-key-target',children:'虚线：当前正式 75 / 80 / 90 / 100 分目标（回看基准）'}),h('span',{id:'kpi-interaction-help',children:isDaily?'悬停、轻点或按方向键查看每天。灰区暂无数据。':'悬停、轻点或按方向键查看月份。空心点为未满月，灰区暂无已核实绩。'})]}),
   h('div',{className:'kpi-grid',children:metrics.map(metric=>h(Card,{metric,months:selected,isDaily},metric[0]))})
 ]});
}
