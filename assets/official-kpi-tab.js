import {t as runtime} from './jsx-runtime-n5LQ9ujS.js';
import {daily} from './official-kpi-data.js';
import {metrics,curve,score,format,tiers} from './official-kpi-model.js';
const {jsx:h,jsxs}=runtime();
const colors=['#a34d28','#18736e','#476aa7','#73549a'];
const positions=[1,5,10,15,20,25,30];
const palette='#154446';
function Plot({points,limits,mode}){
 const values=[...limits,...points.map(p=>p.value).filter(v=>v!=null)];
 const ext=Math.max(...values)-Math.min(...values)||1,lo=Math.max(0,Math.min(...values)-.15*ext),hi=Math.max(...values)+.14*ext;
 const x=d=>42+282*(d-1)/29,y=v=>12+92*(hi-v)/(hi-lo);
 let previous=false,segments='';
 const available=points.filter(p=>p.value!=null),latest=available.at(-1);
 for(const row of points){if(row.value==null){previous=false;continue;}segments+=(previous?'L':'M')+x(row.day)+' '+y(row.value)+' ';previous=true;}
 const axis=[lo, (hi+lo)/2,hi];
 const axisLabel=v=>mode==='人数'?(v/1e4).toFixed(1)+'万':v.toFixed(mode==='上限'?2:1)+'%';
 const dash=['6 5','4 4','8 4','2 4'];
 return jsxs('svg',{viewBox:'0 0 340 132',className:'kpi-plot',role:'img','aria-label':'月累计实绩与四档目标线（数值见下方图例）',children:[
   h('rect',{x:42,y:12,width:282,height:92,rx:4,fill:'#f6f8fa'}),
   latest&&latest.day<30?h('rect',{x:x(latest.day),y:12,width:324-x(latest.day),height:92,fill:'#eef1f3'}):null,
   ...axis.map((v,i)=>jsxs('g',{children:[h('line',{x1:42,x2:324,y1:y(v),y2:y(v),stroke:'#dce3e8'}),h('text',{x:36,y:y(v)+3,fill:'#526376',textAnchor:'end',fontSize:9.25,children:axisLabel(v)})]},i)),
   ...positions.map(d=>h('text',{x:x(d),y:123,textAnchor:'middle',fill:'#526376',fontSize:9.25,children:d+'日'},d)),
   ...limits.map((v,i)=>h('line',{x1:42,x2:324,y1:y(v),y2:y(v),stroke:colors[i],strokeDasharray:dash[i],strokeWidth:1.3,'data-kpi-target':tiers[i],children:h('title',{children:tiers[i]+'分：'+format(v,mode)})},i)),
   h('path',{d:segments,fill:'none',stroke:palette,strokeWidth:2.25,strokeLinejoin:'round',strokeLinecap:'round','data-kpi-actual':'mtd'}),
   ...available.map(p=>h('circle',{cx:x(p.day),cy:y(p.value),r:p===latest?3.7:2.1,fill:palette,stroke:p===latest?'white':undefined,strokeWidth:p===latest?1.2:undefined,children:h('title',{children:'11/'+p.day+'：'+format(p.value,mode)})},p.day))
 ]});
}
function Card({metric,index}){
 const [key,label,limits,mode,method]=metric;
 const points=curve(daily[key],mode),latest=points.filter(p=>p.value!=null).at(-1);
 const tier=score(latest?.value,limits,mode==='上限');
 return jsxs('article',{className:'kpi-card','data-kpi-metric':key,children:[
   jsxs('div',{className:'kpi-card-heading',children:[h('span',{className:'kpi-index','aria-hidden':'true',children:String(index+1).padStart(2,'0')}),h('h3',{children:label})]}),
   jsxs('div',{className:'kpi-top',children:[
      h('strong',{children:format(latest?.value,mode)}),
      h('span',{className:tier===0?'kpi-low':'kpi-tier',children:tier==null?'无数据':tier===0?'未达 75 分':tier+' 分档'})
   ]}),
   jsxs('p',{className:'kpi-date',children:[latest?'实绩截至 11 月 '+latest.day+' 日':'暂未取得正式实绩',mode==='上限'?h('span',{children:'越低越好'}):null]}),
   h(Plot,{points,limits,mode}),
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
   jsxs('header',{className:'kpi-hero',children:[
     jsxs('div',{children:[h('p',{className:'kpi-kicker',children:'2026 年 11 月 / 正式月报考核'}),h('h2',{id:'official-kpi-title',children:'KPI 达成趋势'}),h('p',{className:'kpi-intro',children:'看月累计实绩与四档目标的距离。按各项最近完整数据更新，灰色区间未出数。'})]}),
     cutoff?jsxs('div',{className:'kpi-overview',children:[h('span',{children:'达到 75 分线'}),jsxs('strong',{children:[attained,h('small',{children:' / 6 项'})]}),h('span',{children:'按同一截止日：11 月 '+cutoff+' 日'})]}):null
   ]}),
   jsxs('div',{className:'kpi-key',children:[h('span',{className:'kpi-key-actual',children:'实线 · 月累计实绩'}),h('span',{className:'kpi-key-target',children:'虚线 · 75 / 80 / 90 / 100 分目标'}),h('span',{children:'以未舍入实绩判档，不做档间插值'})]}),
   h('div',{className:'kpi-grid',children:metrics.map((metric,index)=>h(Card,{metric,index},metric[0]))})
 ]});
}
