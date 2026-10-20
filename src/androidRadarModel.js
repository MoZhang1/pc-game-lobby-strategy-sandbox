export const ratio = (a,b) => b > 0 && a != null ? a/b : null;
export const metrics = [
 {key:'dau',label:'日均活跃',unit:'人 / 日',type:'number'},
 {key:'new',label:'日均游戏首登',unit:'人 / 日',type:'number'},
 {key:'d1',label:'次日留存率',unit:'同游戏 +1日 · 成熟队列',type:'rate'},
 {key:'recharge',label:'日均充值',unit:'元 / 日',type:'money'},
 {key:'silver',label:'日均银两净消耗',unit:'表原始单位 / 日',type:'silver'},
 {key:'conversion',label:'首日完成对局率',unit:'游戏首登当日',type:'rate'},
];
export function values(g,mode='valid') {return [g.activeDays/30,g.newRaw/30,ratio(g.d1RawReturn,g.d1RawBase),g.recharge/30,ratio(g.silverNet30dRaw,30),g.conversionStatus==='observed_game_first_cohort'?ratio(g.completedRaw,g.newRaw):null];}
export function compare(g,pool,mode) {
 const current=values(g,mode), others=pool.filter(x=>x.id!==g.id);
 return metrics.map((m,i)=>{
  const v=others.map(x=>values(x,mode)[i]).filter(x=>x!=null&&Number.isFinite(x));
  const mean=v.length?v.reduce((a,b)=>a+b,0)/v.length:null;
  const silver=m.key==='silver';
  const unavailableReason=silver?(g.silverNetObservedRaw==null?'无源记录，未补0':g.silverNet30dRaw==null?`仅覆盖${g.silverNetObservedDays}/30日，仅为有记录日均，不作完整30日日均比较`:g.silverNet30dRaw<0?'原值为负，非负雷达刻度不可绘制':mean!=null&&mean<=0?'基准均值非正，不适用均值100刻度':mean==null?'无完整30日基准样本':null):null;
  return {...m,pending:false,value:silver?ratio(g.silverNetObservedRaw,g.silverNetObservedDays):current[i],mean,n:v.length,lowerCount:m.key==='conversion'?others.filter(x=>values(x,mode)[i]!=null&&x[mode==='valid'?'unknownValid':'unknownRaw']>0).length:0,index:current[i]!=null&&mean>0&&(!silver||current[i]>=0)?current[i]/mean*100:null,...(silver?{unavailableReason,observedDays:g.silverNetObservedDays,negativeCount:v.filter(x=>x<0).length}:{} )};
 });
}
export const number=(v,d=2)=>v==null?'NA':new Intl.NumberFormat('zh-CN',{maximumFractionDigits:d,minimumFractionDigits:d}).format(v);
export function format(v,type,compact=false){if(v==null)return 'NA';if(type==='rate')return number(v*100)+'%';if(type==='silver')return number(v,Number.isInteger(v)?0:2);if(compact&&Math.abs(v)>=1e8)return number(v/1e8)+'亿';if(compact&&Math.abs(v)>=1e4)return number(v/1e4)+'万';return number(v,type==='silver'?0:2);}
