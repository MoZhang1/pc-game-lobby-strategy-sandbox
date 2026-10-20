import {metrics, values} from './androidRadarModel.js';

// Linear interpolation at (n - 1) * p; scale samples include the selected game.
export function quantile(sorted, p) {
  if (!sorted.length) return null;
  const index = (sorted.length - 1) * p;
  const lo = Math.floor(index), hi = Math.ceil(index);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
}
export function scaleFromValues(input, type, mode = 'p95') {
  const valid = input.filter(v => v != null && Number.isFinite(v)).sort((a,b) => a-b);
  const max = valid.length ? valid[valid.length-1] : null;
  const p95 = quantile(valid, .95);
  const fallback = type !== 'rate' && mode === 'p95' && p95 != null && p95 <= 0 && max > 0;
  const upper = type === 'rate' ? 1 : !valid.length ? null :
    mode === 'max' || fallback ? Math.max(0,max) : Math.max(0,p95);
  return {upper, p95, max, n:valid.length, negativeCount:valid.filter(v=>v<0).length,
    fallback, small:valid.length<20, mode:type==='rate'?'rate':fallback?'max-fallback':mode};
}
export function buildScales(games, mode = 'p95') {
  return metrics.map((m,i)=>({...m,...scaleFromValues(games.map(g=>values(g)[i]),m.type,mode)}));
}
export function projectValue(value, scale) {
  if (value == null || !Number.isFinite(value)) return {radius:null,reason:'缺失，不补0'};
  if (value < 0) return {radius:null,reason:'负值，保留原值，不绘制负半径'};
  if (scale.upper == null) return {radius:null,reason:'无有效标尺样本'};
  if (scale.upper === 0) return value === 0 ?
    {radius:0,position:0,clipped:false,reason:'有效标尺样本的非负上界为0'} :
    {radius:null,reason:'上界为0，无法映射正值'};
  const position=value/scale.upper;
  return {radius:Math.min(position,1),position,clipped:position>1,reason:null};
}
export function chartValue(row) {
  return row.key==='silver' && row.observedDays!==30 ? null : row.value;
}
