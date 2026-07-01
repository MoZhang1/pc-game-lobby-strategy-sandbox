import React, { useState } from 'react';
import { ChevronDown, Gamepad2, Gift, Home, Mail, Menu, RefreshCw, Search, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import './pc-ui.css';

const icons = [
  ['常州四副头','升'],['河池麻将','麻'],['南宁升级','南'],['掼蛋','掼'],['红中麻将','中'],['牛鬼','牛'],['美女捕鱼','鱼'],['帝王霸业','帝'],['斗地主','斗'],['玄影','玄'],['霸者天下','霸'],['攻城掠地','攻'],['原始传奇','原'],['维京传奇','维'],['伏魔战歌','伏'],['梦回江湖','梦'],['大天神','天'],['斩魔问道','斩'],
];

function PcGameIcon({game,index=0,large=false}){return <span className={`pcGameIcon c${index%8} ${large?'large':''}`}>{game[1]}</span>}
function Zone({id,name,onSelect,children,className=''}){return <section className={`pcZone pcZone${id} ${className}`} role="button" tabIndex="0" aria-label={`查看${id}${name}优化策略`} onClick={()=>onSelect(id)} onKeyDown={e=>e.key==='Enter'&&onSelect(id)}><span className="pcZoneBadge">{id}</span>{children}</section>}
function CompactGame({game,index}){return <div className="compactGame"><PcGameIcon game={game} index={index}/><span>{game[0]}</span></div>}

export default function InteractivePcLobby({onSelect}){
  const [batch,setBatch]=useState(0),[banner,setBanner]=useState(0),[category,setCategory]=useState('扑克');
  const local=icons.slice(batch%3,batch%3+9);
  const stop=fn=>e=>{e.stopPropagation();fn()};
  return <div className="pcInteractivePage"><div className="pageIntro"><div><b>PC新大厅</b><span>真实页面组件 · 点击 A–J 模块查看优化策略</span></div><span>可交互位置 <strong>A–J</strong></span></div>
    <div className="pcWindow">
      <header className="pcTopbar"><div className="pcUser"><span>好</span><div><b>好运播报</b><small>新手4</small></div></div><div className="pcMiniLinks">充值　物品　签到　保险箱　邮件</div><button className="pcSearch" onClick={()=>onSelect('SEARCH')}><Search/>查找游戏（例如“斗地主”）</button><div className="pcHome"><Gift/>玩家之家</div><Menu/><b>—</b><b>□</b><b>×</b></header>
      <div className="pcLayout"><nav className="pcRail"><button className="active"><Home/>主页</button><button><Gamepad2/>游戏库</button><button><ShoppingBag/>商城</button><button><ShieldCheck/>会员</button><button><RefreshCw/>服务</button><button className="boss">☝<span>老板键</span></button></nav>
        <aside className="pcLeft">
          <Zone id="A" name="我的应用" onSelect={onSelect}><header><b>我的应用(1)</b><span>默认<ChevronDown/></span></header><CompactGame game={['五十K','K']} index={4}/><div className="leftEmpty"/></Zone>
          <Zone id="D" name="固定推荐" onSelect={onSelect}><h3>推荐游戏</h3>{icons.slice(6,9).map((g,i)=><CompactGame key={g[0]} game={g} index={i+3}/>)}</Zone>
        </aside>
        <main className="pcFeed">
          <Zone id="B" name="首屏 Banner" onSelect={onSelect} className={`bannerTheme${banner}`}><div className="pcHero"><div><small>{banner?'热血新服':'双扣'}</small><h1>{banner?'兄弟集结 再战沙城':'百变随心玩 火拼超尽兴'}</h1><p>{banner?'装备全爆 · 激情攻城':'8线连炸 · 好友约局'}</p><button onClick={stop(()=>{})}>立即进入</button></div><aside>{['双扣','玄影','美女捕鱼','霸者天下','原始传奇'].map((x,i)=><button className={i===banner?'active':''} key={x} onClick={stop(()=>setBanner(i))}>{x}</button>)}</aside></div></Zone>
          <Zone id="C" name="本地热门" onSelect={onSelect}><header className="localTitle"><h2>广西柳州 <small>[切换]</small></h2><div><span>☁ 阴 29℃</span><button onClick={stop(()=>setBatch(v=>v+1))}><RefreshCw/>换一批</button><button onClick={stop(()=>{})}><X/>关闭</button></div></header><div className="pcIconRow">{local.map((g,i)=><CompactGame game={g} index={i+batch} key={`${g[0]}-${i}`}/>)}</div></Zone>
          <Zone id="E" name="热门推荐" onSelect={onSelect}><header><h2>热门推荐</h2><button onClick={stop(()=>setBatch(v=>v+1))}><RefreshCw/>换一批</button></header><div className="pcPosterRow">{icons.slice(8,15).map((g,i)=><article className={`posterTone${i}`} key={g[0]}><PcGameIcon game={g} index={i} large/><strong>{g[1]}</strong><span>{g[0]}</span><small>{i===0?'核心棋牌':i===3?'捕鱼游戏':'联运推荐'}</small></article>)}</div></Zone>
          <Zone id="F" name="精品游戏" onSelect={onSelect}><div className="pcCategoryCards"><article>扑克游戏<small>扑克玩法任你选</small></article><article>麻将游戏<small>精彩麻将乐不停</small></article><article>网页游戏<small>全网页游畅快玩</small></article><article>益智游戏<small>手游也能随意玩</small></article></div><div className="pcDenseGames">{icons.slice(0,12).map((g,i)=><CompactGame key={g[0]} game={g} index={i}/>)}</div></Zone>
          <Zone id="I" name="次屏 Banner" onSelect={onSelect}><button className="closeSecond" onClick={stop(()=>{})}><X/></button><div className="secondRealBanner"><small>霸者天下</small><h1>散人激情打宝<br/>热血新区</h1><button onClick={stop(()=>{})}>立即开始</button></div></Zone>
          <Zone id="J" name="游戏导航" onSelect={onSelect}><h2>游戏导航</h2><div className="navColumns">{[['扑克游戏',icons.slice(8,18)],['麻将游戏',icons.slice(1,11)],['棋类游戏',icons.slice(3,13)],['网页游戏',icons.slice(10,18)],['最近上新',icons.slice(9,17)]].map(([title,list])=><article key={title}><h3>{title}</h3>{list.slice(0,8).map((g,i)=><div key={`${g[0]}-${i}`}><PcGameIcon game={g} index={i}/><span>{g[0]}</span></div>)}</article>)}</div></Zone>
        </main>
        <aside className="pcRight">
          <button className="guideHotspot" onClick={()=>onSelect('GUIDE')} aria-label="查看新手引导与流失拦截优化策略"><div className="level">Lv100 <span>同城游生涯</span></div><b>好运播报</b><div className="pcAvatar">好</div><p>我的保险箱　◉</p><h2>1090507</h2><div className="rightActions"><span>物品</span><span>邮件</span><span>充值</span></div></button>
          <Zone id="G" name="导航 Tab" onSelect={onSelect}><nav className="rightGameTabs">{['扑克','麻将','棋类','休闲','网游'].map(x=><button className={category===x?'active':''} key={x} onClick={stop(()=>setCategory(x))}>{x}</button>)}</nav>{icons.slice(14,18).map((g,i)=><div className="rankRow" key={g[0]}><PcGameIcon game={g} index={i}/><span>{g[0]}</span><small>{13-i*2}.3万人添加</small></div>)}</Zone>
          <Zone id="H" name="页游新服" onSelect={onSelect}><header><b>新服页游</b><span>近期开放</span></header>{icons.slice(12,18).map((g,i)=><div className="serverRow" key={g[0]}><time>昨日 {10+i}:00</time><PcGameIcon game={g} index={i}/><span>{g[0]}<small>【新服{i+53}服】</small></span></div>)}</Zone>
        </aside>
      </div>
    </div>
  </div>;
}
