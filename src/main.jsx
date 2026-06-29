import React,{useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Home,Gamepad2,BarChart3,FlaskConical,Library,ShieldCheck,Settings,Save,RotateCcw,ChevronRight,GripVertical,X,RefreshCw,Plus,Search,PanelRightOpen}from'lucide-react';
import'./styles.css';

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

function App(){
 const saved=()=>{try{return JSON.parse(localStorage.getItem('pc-lobby-strategy')||'null')}catch{return null}};
 const cached=useMemo(saved,[]);
 const[persona,setPersona]=useState(cached?.persona||'new'),[selected,setSelected]=useState('E'),[zones,setZones]=useState(cached?.zones||initialZones),[settings,setSettings]=useState(cached?.settings||{mode:'dynamic',local:50,monetize:30,explore:20}),[notice,setNotice]=useState('');
 const toast=t=>{setNotice(typeof t==='string'?t:'模拟完成：结果已按当前策略更新');setTimeout(()=>setNotice(''),2200)};
 const reset=()=>{localStorage.removeItem('pc-lobby-strategy');setPersona('new');setZones(initialZones);setSettings({mode:'dynamic',local:50,monetize:30,explore:20});toast('已恢复默认策略')};
 const savePlan=()=>{localStorage.setItem('pc-lobby-strategy',JSON.stringify({persona,zones,settings,savedAt:new Date().toISOString()}));toast('方案已保存，刷新后仍会保留')};
 return <div className="app"><nav className="appNav"><div className="brand">游</div>{[[Home,'沙盘首页'],[BarChart3,'策略管理'],[FlaskConical,'实验中心'],[Library,'游戏库'],[ShieldCheck,'规则中心'],[Settings,'系统设置']].map(([I,t],i)=><button className={i===0?'active':''} key={t}><I/><span>{t}</span></button>)}</nav><div className="workspace"><header className="toolbar"><div><h1>PC游戏大厅分发策略沙盘</h1><small>按用户视角配置 A–J 分发区域</small></div><div className="persona"><button className={persona==='new'?'on':''} onClick={()=>setPersona('new')}>新用户视角</button><button className={persona==='old'?'on':''} onClick={()=>setPersona('old')}>老用户视角</button></div><div className="toolActions"><button onClick={reset}><RotateCcw size={15}/>重置</button><button className="primary" onClick={savePlan}><Save size={15}/>保存方案</button></div></header><div className="content"><div className="preview"><div className="previewTitle"><span>PC游戏大厅预览（{persona==='new'?'新用户':'老用户'}视角）</span><small>点击绿色虚线区域进行编辑</small></div><Lobby persona={persona} zones={zones} games={gameSeed} selected={selected} setSelected={setSelected}/></div><Inspector selected={selected} zones={zones} setZones={setZones} games={gameSeed} persona={persona} settings={settings} setSettings={setSettings} toast={toast}/></div></div>{notice&&<div className="toast">{notice}</div>}</div>
}
createRoot(document.getElementById('root')).render(<App/>);
