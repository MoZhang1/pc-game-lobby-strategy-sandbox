export const tiers=[75,80,90,100];
export const metrics=[
 ['active','自有日均活跃',[550000,570000,600000,650000],'人数','官方渠道轻游戏日报 · 登录人数的日均；不加总各端。'],
 ['pcNew','PC 新客首日对局率',[58.6,59.9,61.3,69.3],'加权','Q02 · PC 新大厅新客首日对局人数 ÷ 新客人数。'],
 ['mobileNew','移动新客首日对局率',[58.8,60.2,61.5,69.5],'加权','Q02 · 移动新客首日对局人数 ÷ 新客人数。'],
 ['pcOld','PC 老客总登入率',[30,34,38,40],'加权','Q08 · 正式 58 版，老客棋牌、捕鱼及联运进入量 ÷ 老客基数，分子跨游戏不去重。'],
 ['mobileOld','移动老客总登入率',[45,51,57,60],'加权','Q08 · 移动老客棋牌、捕鱼及联运进入量 ÷ 老客基数，分子跨游戏不去重。'],
 ['crash','PC 新大厅崩溃率',[1.5,1,.75,.5],'上限','Q03 · 正式匹配口径；先每天算崩溃率，再对日率取算术平均。'],
];
// Snapshot metadata is a calendar month, not the viewer's wall-clock month.
export function daysInMonth(ym){
 const found=typeof ym==='string'?/^(\d{4})-(0[1-9]|1[0-2])$/.exec(ym):null;
 if(!found||Number(found[1])===0)return 0;
 const year=Number(found[1]),month=Number(found[2]);
 const leap=year%4===0&&(year%100!==0||year%400===0);
 return [31,leap?29:28,31,30,31,30,31,31,30,31,30,31][month-1];
}
export function curve(rows={}, mode='加权', snapshotMonth){
 let n=0,d=0,r=0,count=0;
 return Array.from({length:daysInMonth(snapshotMonth)},(_,i)=>{
   const day=i+1, x=rows[day];
   if(!x || !Number.isFinite(x[0]) || x[0]<0 || !Number.isFinite(x[1]) || x[1]<=0) return {day,value:null};
   n+=x[0]; d+=x[1]; r+=x[0]/x[1]; count++;
   return {day,value:mode==='上限'?100*r/count:mode==='人数'?n/count:100*n/d};
 });
}
export function score(actual,limits,lower=false){
 if(actual==null) return null;
 return [...tiers].reverse().find((tier,i)=>lower?actual<=limits[3-i]:actual>=limits[3-i])??0;
}
export const format=(n,mode)=>n==null?'—':mode==='人数'?new Intl.NumberFormat('zh-CN',{maximumFractionDigits:0}).format(n)+' 人':n.toFixed(2)+'%';
