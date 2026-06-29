import React,{useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Home,BarChart3,FlaskConical,Library,ShieldCheck,Settings,Save,RotateCcw,GripVertical,X,RefreshCw,Plus,Search,PanelRightOpen,Copy,Play,Pause,Trash2,Database,Download,CheckCircle2}from'lucide-react';
import'./styles.css';
import'./modules.css';
import'./layout.css';

const gameSeed=[
 {id:1,name:'斗地主',type:'扑克',tone:'#e38c28',mark:'斗',monetize:false},
 {id:2,name:'掼蛋',type:'扑克',tone:'#efb42e',mark:'掼',monetize:false},
 {id:3,name:'双扣',type:'扑克',tone:'#df6040',mark:'双',monetize:false},
 {id:4,name:'常州四副头',type:'扑克',tone:'#b75927',mark:'升',monetize:false},
 {id:5,name:'河池麻将',type:'麻将',tone:'#247a58',mark:'麻',monetize:false},
 {id:6,name:'红中麻将',type:'麻将',tone:'#c44b36',mark:'中',monetize:false},
 {id:7,name:'牛鬼',type:'扑克',tone:'#824832',mark:'牛',monetize:false},
 {id:8,name:'美女捕鱼',type:'捕鱼',tone:'#2299ce',mark:'鱼',monetize:true},
 {id:9,name:'原始传奇',type:'联运',tone:'#a84928',mark:'传',monetize:true},
 {id:10,name:'维京传奇',type:'联运',tone:'#7050b8',mark:'维',monetize:true},
 {id:11,name:'玄影',type:'联运',tone:'#394d86',mark:'玄',monetize:true},
 {id:12,name:'霸者天下',type:'联运',tone:'#874330',mark:'霸',monetize:true},
];
const zoneMeta={A:['我的应用','历史游玩召回'],B:['首屏 Banner','核心广告轮播'],C:['本地热门','IP地区候选池'],D:['固定推荐','捕鱼与联运保底'],E:['热门推荐','广告效果赛马'],F:['精品游戏','分类人工配置'],G:['分类导航','标签权重排序'],H:['页游新服','联运新服分发'],I:['次屏 Banner','联运广告位'],J:['游戏导航','游戏库分类']};
const initialZones={A:[1,5,8],B:[3,11,9,10,8],C:[4,5,2,6,7,8],D:[8,9,10],E:[1,11,12,8,9,10],F:[8,2,5,6,3,7,1,4],G:[1,5,9,8],H:[9,10,11],I:[9,10,11],J:[1,5,3,9,11]};

function GameIcon({game,size='md'}){return <div className={`gameIcon ${size}`} style={{'--tone':game.tone}}><span>{game.mark}</span>{game.monetize&&<i>变现</i>}</div>}
function Zone({id,children,selected,onClick,actions}){return <section className={`zone zone-${id} ${selected?'selected':''}`} onClick={e=>{e.stopPropagation();onClick(id)}}><header><div><b>{id}</b><strong>{zoneMeta[id][0]}</strong></div>{actions}</header>{children}</section>}
function MiniGames({ids,games,limit=6}){return <div className="miniGames">{ids.slice(0,limit).map(id=>{const g=games.find(x=>x.id===id);return <div className="miniGame" key={id}><GameIcon game={g}/><span>{g.name}</span><small>{g.type}</small></div>})}</div>}

function Lobby({persona,zones,games,selected,setSelected}){
 return <div className="lobbyFrame">
  <div className="lobbyTop"><div className="profile"><span>好</span><div><b>{persona==='new'?'新玩家':'好运播报'}</b><small>Lv.{persona==='new'?1:100}</small></div></div><div className="search"><Search size={15}/>查找游戏（例如“斗地主”）</div><div className="playerHome">🎁 玩家之家</div></div>
  <div className="lobbyBody">
   <aside className="oldRail"><Zone id="A" selected={selected==='A'} onClick={setSelected}><MiniGames ids={zones.A} games={games} limit={4}/><button className="moreBtn"><Plus size={14}/>更多应用</button></Zone><Zone id="D" selected={selected==='D'} onClick={setSelected}><MiniGames ids={zones.D} games={games} limit={3}/></Zone></aside>
   <main className="feed">
    <Zone id="B" selected={selected==='B'} onClick={setSelected}><div className="heroBanner"><div><small>热门棋牌 · 限时推荐</small><h2>百变随心玩<br/>火拼超尽兴</h2><button>立即进入</button></div><div className="bannerMark">双扣</div></div><div className="bannerDots">● ○ ○ ○ ○</div></Zone>
    <Zone id="C" selected={selected==='C'} onClick={setSelected} actions={<div className="zoneActions"><RefreshCw size={12}/>换一批 <X size={12}/>关闭</div>}><div className="localHead"><b>广西柳州</b><span>阴 29℃</span></div><MiniGames ids={zones.C} games={games} limit={6}/></Zone>
    <Zone id="E" selected={selected==='E'} onClick={setSelected} actions={<div className="zoneActions"><RefreshCw size={12}/>换一批</div>}><div className="posterRow">{zones.E.slice(0,6).map((id,i)=>{const g=games.find(x=>x.id===id);return <div className="poster" key={id} style={{'--tone':g.tone}}><GameIcon game={g} size="lg"/><div className="posterArt">{g.mark}</div><span>{g.name}</span><small>{i===0?'核心棋牌':g.type+'推荐'}</small></div>})}</div></Zone>
    <Zone id="F" selected={selected==='F'} onClick={setSelected}><div className="categoryCards"><div><b>扑克游戏</b><span>扑克玩法任你选</span></div><div><b>麻将游戏</b><span>精彩麻将乐不停</span></div><div><b>网页游戏</b><span>全网页游畅快玩</span></div><div><b>休闲游戏</b><span>轻松益智随时玩</span></div></div><MiniGames ids={zones.F} games={games} limit={8}/></Zone>
    <Zone id="G" selected={selected==='G'} onClick={setSelected}><div className="tabs">{['扑克','麻将','棋类','休闲','网游','更多'].map(x=><button key={x}>{x}</button>)}</div></Zone>
    <div className="bottomGrid"><Zone id="H" selected={selected==='H'} onClick={setSelected}><div className="serverList">{zones.H.map((id,i)=>{const g=games.find(x=>x.id===id);return <div key={id}><em>{i?'新服':'火爆'}</em><span>{g.name}</span><small>今日 {10+i}:00</small><button>进入新服</button></div>})}</div></Zone><Zone id="I" selected={selected==='I'} onClick={setSelected}><div className="secondBanner"><b>兄弟集结<br/>再战沙城</b><button>开始征战</button></div></Zone></div>
    <Zone id="J" selected={selected==='J'} onClick={setSelected}><div className="navGames">{['新游预约','开服表','排行榜','礼包中心','活动中心','我的游戏'].map(x=><span key={x}>☆ {x}</span>)}</div></Zone>
   </main>
   <aside className="socialRail"><div className="userCard"><b>Lv100</b><div className="avatar">好</div><strong>好运播报</strong><small>我的保险箱</small><h3>1,090,507</h3></div><div className="rightTabs">扑克　麻将　棋牌　<b>网游</b></div>{['伏魔战歌','梦回江湖','大天神','斩魔问道','攻城掠地'].map((x,i)=><div className="rankGame" key={x}><span>{i+1}</span>{x}<small>{13-i*2}.3万人</small></div>)}</aside>
  </div>
 </div>
}

function Inspector({selected,zones,setZones,games,persona,settings,setSettings,toast}){
 const ids=zones[selected],meta=zoneMeta[selected];
 const move=(index,dir)=>{const arr=[...ids],to=index+dir;if(to<0||to>=arr.length)return;[arr[index],arr[to]]=[arr[to],arr[index]];setZones({...zones,[selected]:arr})};
 const remove=id=>setZones({...zones,[selected]:ids.filter(x=>x!==id)});
 const add=()=>{const id=games.find(g=>!ids.includes(g.id))?.id;if(id)setZones({...zones,[selected]:[...ids,id]})};
 const kpi=useMemo(()=>persona==='new'?Math.min(89,52+ids.length*3+settings.explore*.08):Math.min(68,18+ids.filter(id=>games.find(g=>g.id===id)?.monetize).length*6+settings.monetize*.12),[persona,ids,settings,games]);
 return <aside className="inspector"><div className="inspectHead"><div><small>当前编辑区域</small><h2><b>{selected}</b>{meta[0]}</h2><p>{meta[1]}</p></div><PanelRightOpen size={21}/></div>
  <div className="panelBlock"><label>分发模式</label><div className="segmented"><button className={settings.mode==='fixed'?'on':''} onClick={()=>setSettings({...settings,mode:'fixed'})}>固定分发</button><button className={settings.mode==='dynamic'?'on':''} onClick={()=>setSettings({...settings,mode:'dynamic'})}>动态分发</button></div></div>
  <div className="panelBlock"><div className="panelTitle"><label>游戏顺序与权重</label><span>{ids.length} 款</span></div><div className="gameRows">{ids.map((id,i)=>{const g=games.find(x=>x.id===id);return <div className="gameRow" key={id}><GripVertical size={15}/><button className="order" onClick={()=>move(i,-1)}>{i+1}</button><GameIcon game={g} size="xs"/><div><b>{g.name}</b><small>{g.type}{g.monetize?' · 变现游戏':''}</small></div><input value={100-i*10} readOnly/><button onClick={()=>remove(id)}><X size={14}/></button></div>})}</div><button className="addGame" onClick={add}><Plus size={15}/>加入候选游戏</button></div>
  {settings.mode==='dynamic'&&<div className="panelBlock"><label>动态分发权重</label><Slider label="地区热度" value={settings.local} set={v=>setSettings({...settings,local:v})}/><Slider label="变现倾向" value={settings.monetize} set={v=>setSettings({...settings,monetize:v})}/><Slider label="探索流量" value={settings.explore} set={v=>setSettings({...settings,explore:v})}/></div>}
  <div className="kpiBlock"><small>当前视角 KPI 模拟</small><h3>{persona==='new'?'新用户分发率':'老用户二次分发率'}</h3><strong>{kpi.toFixed(1)}%</strong><p>{persona==='new'?'新用户当天进入游戏人数 ÷ 新用户总数':'老用户进入变现游戏人数 ÷ 老用户数'} × 100%</p><button onClick={toast}>运行模拟</button></div>
 </aside>
}
function Slider({label,value,set}){return <div className="slider"><div><span>{label}</span><b>{value}%</b></div><input type="range" min="0" max="100" value={value} onChange={e=>set(+e.target.value)}/></div>}

const defaultPlans=[
 {id:1,name:'PC大厅默认分发方案',scope:'全部用户',status:true,updated:'今天 10:28',areas:'A–J'},
 {id:2,name:'新用户首次分发优化',scope:'新用户',status:true,updated:'昨天 18:40',areas:'B、C、E'},
 {id:3,name:'老用户变现游戏召回',scope:'老用户',status:false,updated:'6月27日',areas:'A、D、E'},
];
const initialExperiments=[
 {id:1,name:'C位本地热门动态排序',kpi:'新用户分发率',traffic:30,status:'运行中',a:'当前人工排序',b:'活跃+次留+付费率'},
 {id:2,name:'E位老用户变现游戏赛马',kpi:'老用户二次分发率',traffic:20,status:'草稿',a:'固定广告顺序',b:'按变现倾向排序'},
];

function PageHeader({title,desc,action}){return <header className="pageHeader"><div><h2>{title}</h2><p>{desc}</p></div>{action}</header>}
function StrategyPage({plans,setPlans,onEdit,toast}){
 const duplicate=id=>{const p=plans.find(x=>x.id===id);setPlans(v=>[...v,{...p,id:Date.now(),name:p.name+'（副本）',status:false,updated:'刚刚'}]);toast('已复制策略方案')};
 const toggle=id=>setPlans(v=>v.map(p=>p.id===id?{...p,status:!p.status,updated:'刚刚'}:p));
 return <div className="modulePage"><PageHeader title="策略管理" desc="管理不同用户与资源位的分发方案，进入沙盘继续编辑。" action={<button className="solidBtn" onClick={()=>{setPlans(v=>[...v,{id:Date.now(),name:'未命名分发方案',scope:'全部用户',status:false,updated:'刚刚',areas:'待配置'}]);toast('已创建新方案')}}><Plus size={15}/>新建策略</button>}/>
  <div className="summaryStrip"><div><small>策略总数</small><b>{plans.length}</b></div><div><small>运行中</small><b>{plans.filter(p=>p.status).length}</b></div><div><small>覆盖资源位</small><b>A–J</b></div><div><small>核心 KPI</small><b>2 项</b></div></div>
  <div className="dataPanel"><div className="tableHead"><b>方案名称</b><b>适用用户</b><b>资源位</b><b>最后修改</b><b>状态</b><b>操作</b></div>{plans.map(p=><div className="tableRow" key={p.id}><div><strong>{p.name}</strong><small>按当前配置实时生效</small></div><span>{p.scope}</span><span>{p.areas}</span><span>{p.updated}</span><button className={`statusBtn ${p.status?'running':''}`} onClick={()=>toggle(p.id)}>{p.status?<><Play size={12}/>运行中</>:<><Pause size={12}/>已停用</>}</button><div className="rowActions"><button onClick={onEdit}>进入编辑</button><button title="复制" onClick={()=>duplicate(p.id)}><Copy size={14}/></button>{plans.length>1&&<button title="删除" onClick={()=>setPlans(v=>v.filter(x=>x.id!==p.id))}><Trash2 size={14}/></button>}</div></div>)}</div>
 </div>
}
function ExperimentPage({experiments,setExperiments,toast}){
 const[creating,setCreating]=useState(false),[draft,setDraft]=useState({name:'',kpi:'新用户分发率',traffic:20});
 const create=()=>{if(!draft.name.trim()){toast('请先填写实验名称');return}setExperiments(v=>[...v,{id:Date.now(),...draft,status:'草稿',a:'当前线上策略',b:'待配置实验策略'}]);setCreating(false);setDraft({name:'',kpi:'新用户分发率',traffic:20});toast('实验已创建')};
 const toggle=id=>setExperiments(v=>v.map(e=>e.id===id?{...e,status:e.status==='运行中'?'已暂停':'运行中'}:e));
 return <div className="modulePage"><PageHeader title="实验中心" desc="围绕两项分发 KPI 创建实验，控制流量并比较策略效果。" action={<button className="solidBtn" onClick={()=>setCreating(true)}><Plus size={15}/>创建实验</button>}/>
  {creating&&<div className="createBar"><label>实验名称<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="例如：C位前6动态排序"/></label><label>KPI<select value={draft.kpi} onChange={e=>setDraft({...draft,kpi:e.target.value})}><option>新用户分发率</option><option>老用户二次分发率</option></select></label><label>实验流量<input type="range" min="5" max="50" value={draft.traffic} onChange={e=>setDraft({...draft,traffic:+e.target.value})}/><b>{draft.traffic}%</b></label><button className="solidBtn" onClick={create}>保存实验</button><button className="ghostBtn" onClick={()=>setCreating(false)}>取消</button></div>}
  <div className="experimentGrid">{experiments.map(e=><article className="experimentCard" key={e.id}><header><div><span className={e.status==='运行中'?'liveDot':''}>{e.status}</span><h3>{e.name}</h3></div><button onClick={()=>toggle(e.id)}>{e.status==='运行中'?<Pause/>:<Play/>}</button></header><div className="experimentMeta"><span>核心指标<b>{e.kpi}</b></span><span>实验流量<b>{e.traffic}%</b></span></div><div className="abCompare"><div><small>A 对照组</small><b>{e.a}</b><em>50%</em></div><div><small>B 实验组</small><b>{e.b}</b><em>50%</em></div></div><footer><span>{e.status==='运行中'?'累计观察 3 天':'尚未产生实验数据'}</span><button onClick={()=>toast('已打开实验详情')}>查看详情</button></footer></article>)}</div>
 </div>
}
function GameLibraryPage({games,setGames,toast}){
 const[q,setQ]=useState(''),[type,setType]=useState('全部');
 const list=games.filter(g=>(type==='全部'||g.type===type)&&g.name.includes(q));
 const patchGame=(id,patch)=>setGames(v=>v.map(g=>g.id===id?{...g,...patch}:g));
 return <div className="modulePage"><PageHeader title="游戏库" desc="统一维护大厅游戏标签、变现属性和上下架状态。" action={<button className="solidBtn" onClick={()=>toast('游戏导入模板已准备')}><Download size={15}/>导入游戏</button>}/><div className="filterBar"><div className="filterSearch"><Search size={15}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索游戏名称"/></div>{['全部','扑克','麻将','捕鱼','联运'].map(x=><button className={type===x?'on':''} key={x} onClick={()=>setType(x)}>{x}</button>)}<span>共 {list.length} 款</span></div>
  <div className="gameLibraryGrid">{list.map(g=><article className="libraryGame" key={g.id}><GameIcon game={g} size="lg"/><div><h3>{g.name}</h3><p>{g.type} · ID {1880000+g.id}</p><div><button className={g.monetize?'tagOn':''} onClick={()=>patchGame(g.id,{monetize:!g.monetize})}>{g.monetize?'变现游戏':'普通游戏'}</button><button className={g.enabled!==false?'online':''} onClick={()=>patchGame(g.id,{enabled:g.enabled===false})}>{g.enabled===false?'已下架':'已上架'}</button></div></div><button className="textBtn" onClick={()=>toast(`已打开 ${g.name} 配置`)}>编辑</button></article>)}</div>
 </div>
}
function RulesPage({rules,setRules,toast}){
 const toggle=key=>setRules({...rules,[key]:!rules[key]});
 return <div className="modulePage"><PageHeader title="规则中心" desc="规则负责候选池、排序、去重和频控；KPI 口径保持独立。" action={<button className="solidBtn" onClick={()=>toast('规则已保存并等待发布')}><Save size={15}/>保存规则</button>}/><div className="ruleColumns"><section className="rulePanel"><h3>用户分流规则</h3><RuleSwitch title="新用户进入首次分发" desc="当天新注册用户进入新用户策略" on={rules.newUser} click={()=>toggle('newUser')}/><RuleSwitch title="老用户进入二次分发" desc="非当天新增用户进入老用户策略" on={rules.oldUser} click={()=>toggle('oldUser')}/><RuleSwitch title="历史游戏优先召回" desc="A位优先展示用户最近玩过的游戏" on={rules.history} click={()=>toggle('history')}/></section><section className="rulePanel"><h3>C位本地热门排序</h3><p>地区仅筛选候选池，不进入最终得分。</p><Slider label="活跃人数" value={rules.active} set={v=>setRules({...rules,active:v})}/><Slider label="次日留存" value={rules.retention} set={v=>setRules({...rules,retention:v})}/><Slider label="付费率" value={rules.pay} set={v=>setRules({...rules,pay:v})}/><div className="formula">排序得分 = 活跃 {rules.active}% + 次留 {rules.retention}% + 付费率 {rules.pay}%</div></section><section className="rulePanel"><h3>去重与频控</h3><RuleSwitch title="同屏游戏去重" desc="B、C、D、E不重复出现同一游戏" on={rules.dedupe} click={()=>toggle('dedupe')}/><RuleSwitch title="同玩法连续限制" desc="前6位同玩法最多连续出现2款" on={rules.playtype} click={()=>toggle('playtype')}/><label className="numberField">同一广告每日最多曝光<input type="number" min="1" max="10" value={rules.cap} onChange={e=>setRules({...rules,cap:+e.target.value})}/><span>次</span></label></section></div></div>
}
function RuleSwitch({title,desc,on,click}){return <button className="ruleSwitch" onClick={click}><span><b>{title}</b><small>{desc}</small></span><i className={on?'on':''}><em/></i></button>}
function SettingsPage({prefs,setPrefs,toast}){return <div className="modulePage"><PageHeader title="系统设置" desc="管理数据口径、本地保存和沙盘显示选项。" action={<button className="solidBtn" onClick={()=>{localStorage.setItem('pc-lobby-prefs',JSON.stringify(prefs));toast('系统设置已保存')}}><Save size={15}/>保存设置</button>}/><div className="settingsLayout"><section className="settingsPanel"><h3><Database size={17}/>KPI 数据口径</h3><label>新用户分发率公式<textarea readOnly value="新用户当天进入游戏人数 ÷ 新用户总数 × 100%"/></label><label>老用户二次分发率公式<textarea readOnly value="老用户进入变现游戏人数 ÷ 老用户数 × 100%"/></label><p>点击率、次留、付费率仅用于诊断和排序，不计入 KPI。</p></section><section className="settingsPanel"><h3>沙盘偏好</h3><RuleSwitch title="自动保存草稿" desc="每次调整后保存在本机浏览器" on={prefs.autosave} click={()=>setPrefs({...prefs,autosave:!prefs.autosave})}/><RuleSwitch title="显示区域编号" desc="在预览中显示 A–J 标记" on={prefs.labels} click={()=>setPrefs({...prefs,labels:!prefs.labels})}/><RuleSwitch title="显示变现游戏标记" desc="在游戏图标上显示变现角标" on={prefs.monetizeTag} click={()=>setPrefs({...prefs,monetizeTag:!prefs.monetizeTag})}/></section><section className="settingsPanel"><h3>方案数据</h3><button className="settingAction" onClick={()=>toast('策略 JSON 已导出')}><Download/>导出当前方案</button><button className="settingAction" onClick={()=>toast('请选择此前导出的策略文件')}><Copy/>导入历史方案</button><div className="safeState"><CheckCircle2/>所有配置仅保存在本机浏览器和当前 GitHub 演示中</div></section></div></div>}

function App(){
 const saved=()=>{try{return JSON.parse(localStorage.getItem('pc-lobby-strategy')||'null')}catch{return null}};
 const cached=useMemo(saved,[]);
 const[view,setView]=useState('home'),[persona,setPersona]=useState(cached?.persona||'new'),[selected,setSelected]=useState('E'),[zones,setZones]=useState(cached?.zones||initialZones),[settings,setSettings]=useState(cached?.settings||{mode:'dynamic',local:50,monetize:30,explore:20}),[notice,setNotice]=useState(''),[plans,setPlans]=useState(defaultPlans),[experiments,setExperiments]=useState(initialExperiments),[games,setGames]=useState(gameSeed.map(g=>({...g,enabled:true}))),[rules,setRules]=useState({newUser:true,oldUser:true,history:true,active:45,retention:30,pay:25,dedupe:true,playtype:true,cap:2}),[prefs,setPrefs]=useState({autosave:true,labels:true,monetizeTag:true});
 const toast=t=>{setNotice(typeof t==='string'?t:'模拟完成：结果已按当前策略更新');setTimeout(()=>setNotice(''),2200)};
 const reset=()=>{localStorage.removeItem('pc-lobby-strategy');setPersona('new');setZones(initialZones);setSettings({mode:'dynamic',local:50,monetize:30,explore:20});toast('已恢复默认策略')};
 const savePlan=()=>{localStorage.setItem('pc-lobby-strategy',JSON.stringify({persona,zones,settings,savedAt:new Date().toISOString()}));toast('方案已保存，刷新后仍会保留')};
 const nav=[[Home,'沙盘首页','home'],[BarChart3,'策略管理','strategies'],[FlaskConical,'实验中心','experiments'],[Library,'游戏库','library'],[ShieldCheck,'规则中心','rules'],[Settings,'系统设置','settings']];
 const pages={strategies:<StrategyPage plans={plans} setPlans={setPlans} onEdit={()=>setView('home')} toast={toast}/>,experiments:<ExperimentPage experiments={experiments} setExperiments={setExperiments} toast={toast}/>,library:<GameLibraryPage games={games} setGames={setGames} toast={toast}/>,rules:<RulesPage rules={rules} setRules={setRules} toast={toast}/>,settings:<SettingsPage prefs={prefs} setPrefs={setPrefs} toast={toast}/>};
 return <div className="app"><nav className="appNav"><div className="brand">游</div>{nav.map(([I,t,key])=><button className={view===key?'active':''} onClick={()=>setView(key)} key={key}><I/><span>{t}</span></button>)}</nav><div className="workspace"><header className="toolbar"><div><h1>PC游戏大厅分发策略沙盘</h1><small>{nav.find(x=>x[2]===view)?.[1]} · 分发策略工作台</small></div>{view==='home'?<><div className="persona"><button className={persona==='new'?'on':''} onClick={()=>setPersona('new')}>新用户视角</button><button className={persona==='old'?'on':''} onClick={()=>setPersona('old')}>老用户视角</button></div><div className="toolActions"><button onClick={reset}><RotateCcw size={15}/>重置</button><button className="primary" onClick={savePlan}><Save size={15}/>保存方案</button></div></>:<button className="backSandbox" onClick={()=>setView('home')}>返回沙盘编辑</button>}</header>{view==='home'?<div className="content"><div className="preview"><div className="previewTitle"><span>PC游戏大厅预览（{persona==='new'?'新用户':'老用户'}视角）</span><small>点击绿色虚线区域进行编辑</small></div><Lobby persona={persona} zones={zones} games={games} selected={selected} setSelected={setSelected}/></div><Inspector selected={selected} zones={zones} setZones={setZones} games={games} persona={persona} settings={settings} setSettings={setSettings} toast={toast}/></div>:pages[view]}</div>{notice&&<div className="toast">{notice}</div>}</div>
}
createRoot(document.getElementById('root')).render(<App/>);
