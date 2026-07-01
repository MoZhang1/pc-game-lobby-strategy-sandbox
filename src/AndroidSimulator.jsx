import React, { useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, Clock3, Gamepad2, Gift, MessageCircle, RotateCcw, Search, Trash2, UserRound, X } from 'lucide-react';
import './android-ui.css';

const tabs = [
  ['recommend', '推荐'], ['local', '同城棋牌'], ['poker', '扑克'],
  ['mahjong', '麻将'], ['new', '新游专区'], ['web', '网游'],
];

const games = {
  poker: [
    ['双扣-经典/千变/火拼多种玩法','双','24万人','火拼争霸，下一个城主就是你！'],
    ['四人斗地主-不花钱就能玩','斗','2.4万人','刺激对局，全新体验'],
    ['原子','原','2.4万人','享受炸弹满天飞的快感'],
    ['包红五','五','3.0万人','玩法灵活多变的纸牌游戏'],
    ['斗地主-经典、癞子、比赛玩法','地','71万人','多重玩法，随时随地公平竞技'],
    ['新斗地主-福利等你拿','新','2.4万人','全新斗地主，福利等你拿'],
    ['平阳四副头-台炮麻将','升','1.5万人','温州棋牌，平阳四副头'],
    ['红十','十','3.1万人','流行于浙江嘉兴、吉林等地区'],
    ['105','105','2.3万人','嵊州特色棋牌游戏'],
  ],
  mahjong: [
    ['四川麻将-红中麻将','川','7.9万人','真人血流红中麻将'],
    ['贵阳捉鸡麻将','鸡','3.1万人','玩捉鸡麻将，品特色玩法'],
    ['嵊州麻将','嵊','2.0万人','嵊州特色玩法多样的麻将游戏'],
    ['绍兴麻将-简单刺激','绍','3.0万人','听牌可杠开，暴头可杠暴'],
    ['湖州麻将','湖','2.8万人','休闲愉快易上手'],
    ['上虞花麻将','花','1.0万人','正宗上虞规则有龙强抛头'],
    ['熟人麻将-血流红中来袭','熟','9062人','做大牌来熟人麻将'],
    ['苏州麻将-三花自摸四花冲','苏','12万人','活动超多，奖励超大'],
  ],
  web: [
    ['帝王霸业-三端互通','帝','45万人','经典传奇三职业MMORPG'],
    ['热血封神-重返玛莎','封','73万人','重回玛法世界，与兄弟们肩并肩'],
    ['原始传奇-经典复古','原','65万人','正版授权，经典复古传奇'],
    ['仙剑奇侠传：新的开始','仙','55万人','旧忆重拾，再抚仙剑'],
    ['明日大亨-全新沙盘式商战','亨','125万人','沙盘商战类游戏'],
    ['谁是首富-来当霸道总裁','富','83万人','创立属于你的商业帝国'],
    ['王者之心2-双端互通','王','2.4万人','三职业经典传奇'],
    ['超迷足球-七日登录领球星','足','51万人','七日登录领王牌球星'],
  ],
  new: [
    ['帝王霸业-三端互通','帝','45万人','抢先一步称霸全服'],
    ['仙剑奇侠传：新的开始','仙','55万人','新的开始，再续仙剑缘'],
    ['霸者天下','霸','43万人','国题材超变合击页游'],
    ['百战沙城-打怪爆现金红包','战','71万人','经典战法道三职业传奇手游'],
    ['炮炮捕鱼-超多福利','炮','16万人','一炮爆万金，满屏爆金！'],
    ['梦幻捕鱼-酷炫体验','梦','58万人','正版授权手游，经典捕鱼'],
  ],
};

const localGames = [
  ['苏州麻将','苏'],['吴江红五','五'],['中心五','中'],['昆山160分','160'],
  ['炒地皮升级','炒'],['常熟麻将','常'],['宜兴麻将','宜'],['原子打滚','原'],
  ['掼蛋','掼'],['升级四副牌','升'],['斗地主','斗'],['包红五','五'],
];

function GameIcon({ mark, tone = 0 }) {
  return <span className={`realGameIcon tone${tone % 6}`}>{mark}</span>;
}

function GameList({ list, onLaunch, amber = false }) {
  return <div className="realGameList">{list.map((game, index) => <article key={`${game[0]}-${index}`}>
    <GameIcon mark={game[1]} tone={index} />
    <div><h3>{game[0]}</h3><p><b>{game[2]}</b> 在玩　<span>{(15 + index * 7).toFixed(2)}M</span></p><small>{game[3]}</small></div>
    <button className={amber ? 'amber' : ''} onClick={onLaunch}>{amber ? '开始玩' : '玩玩看'}</button>
  </article>)}</div>;
}

function Header({ page, onTab, openSearch }) {
  return <>
    <div className="androidStatus"><span>2:46</span><span>● ◢ ▮</span></div>
    <header className="realAndroidHeader"><b>同城游</b><button onClick={openSearch}><Search />掼蛋</button><i>⇩</i></header>
    <nav className="realAndroidTabs">{tabs.map(([id, label]) => <button className={page === id ? 'active' : ''} key={id} onClick={() => onTab(id)}>{label}</button>)}<strong>超级会员</strong></nav>
  </>;
}

function RecommendPage({ onLaunch }) {
  return <div className="recommendPage">
    <section className="heroReal"><div><small>伏魔</small><h2>月下霓裳<br/>步生莲华</h2></div><aside><GameIcon mark="3D" tone={4}/><b>青云诀之伏魔</b><button onClick={onLaunch}>开始玩</button></aside></section>
    <div className="sectionTitle"><b>本地热门</b><button>更多家乡棋牌 <ChevronRight/></button></div>
    <article className="featuredGame"><GameIcon mark="原"/><div><h3>原子</h3><p>🔥2.4万人在玩　73.62M</p><small>享受炸弹满天飞的快感</small></div><button onClick={onLaunch}>玩玩看</button></article>
    <div className="hotGrid">{localGames.slice(1,9).map((game,index)=><button key={game[0]} onClick={onLaunch}><GameIcon mark={game[1]} tone={index+1}/><b>{game[0]}</b><small>{2+index*7}万人 在玩</small></button>)}</div>
    <section className="wealthBanner"><small>谁是首富</small><h2>模拟商战<br/>首富人生</h2><p>成为世界传奇大亨</p></section>
    <GameList list={games.web.slice(0,4)} onLaunch={onLaunch} amber />
  </div>;
}

function LocalPage({ onLaunch }) {
  return <div className="localPage"><div className="regions"><button className="active">● 江苏-苏</button><button>安徽-皖</button><button>浙江-浙</button><button>山东-鲁</button></div><h2>家乡特色 <span>精简　<b>常规</b></span></h2><div className="localGrid">{localGames.map((game,index)=><button key={`${game[0]}-${index}`} onClick={onLaunch}><GameIcon mark={game[1]} tone={index}/><b>{game[0]}</b><small>{index<6?'苏州':'无锡'}</small></button>)}</div></div>;
}

function CategoryPage({ page, onLaunch }) {
  if (page === 'local') return <LocalPage onLaunch={onLaunch}/>;
  if (page === 'new') return <div className="categoryPage"><div className="miniGames"><h3>每天玩点不一样的小游戏</h3><div>{['灵画师','永远的蔚蓝','三国：冰河','时光杂货店'].map((x,i)=><button onClick={onLaunch} key={x}><GameIcon mark={x[0]} tone={i}/><span>{x}</span></button>)}</div></div><h2>新游上线 <small>抢先一步称霸全服</small></h2><GameList list={games.new} onLaunch={onLaunch} amber/></div>;
  return <div className="categoryPage">{page !== 'web' && <div className="subTabs"><b>本地游戏</b><span>热门玩法</span></div>}<GameList list={games[page] || games.poker} onLaunch={onLaunch} amber={page === 'web'}/></div>;
}

function SearchPage({ query, setQuery, searches, onSearch, onLaunch, resultCard, onBack }) {
  return <div className="realSearchPage">
    <header><button onClick={onBack}><ArrowLeft/></button><div><input value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>event.key==='Enter'&&onSearch()} autoFocus placeholder="掼蛋"/><button onClick={onSearch}><Search/></button></div></header>
    <section><h3><Clock3/>历史记录 <button><Trash2/></button></h3><div className="searchTags">{['dou','wwe','1','meinv','美女捕鱼'].map(x=><button key={x} onClick={()=>setQuery(x)}>{x}</button>)}</div></section>
    <section><h3>♨ 热门搜索</h3><div className="searchTags colorful">{['掼蛋','斗地主','美女捕鱼','升级','跑得快','疯狂电玩城','打大A','五十K','四川麻将','传奇','苏州麻将','双扣','速狗腿','梦幻捕鱼','五人斗地主','熟人麻将'].map(x=><button key={x} onClick={()=>setQuery(x)}>{x}</button>)}</div></section>
    {resultCard && <article className="realResultCard"><small>没找到？你可能会喜欢</small><div><GameIcon mark="掼" tone={1}/><span><b>本地热门 · 掼蛋</b><em>同地区新用户启动率最高</em></span><button onClick={onLaunch}>试玩</button></div></article>}
    {searches > 0 && <p className="searchAttempt">已完成 {searches} 次搜索，尚未点击游戏</p>}
  </div>;
}

function GuideSheet({ onClose, onTry, onSearch }) {
  return <div className="realGuideMask"><section role="dialog" aria-label="替代游戏推荐"><button className="sheetClose" onClick={onClose}><X/></button><GameIcon mark="掼" tone={1}/><small>为你找到一款本地热门</small><h2>没有找到想玩的游戏吗？</h2><p>可以先试试这款本地热门游戏</p><article><b>掼蛋</b><span>同地区新用户启动率最高</span><em>简单易上手 · 匹配快</em></article><button className="primary" onClick={onTry}>立即试玩</button><button onClick={onSearch}>继续搜索</button></section></div>;
}

export default function InteractiveAndroidSimulator(){
  const [page,setPage]=useState('recommend'),[secondaryClicks,setSecondaryClicks]=useState(0),[searches,setSearches]=useState(0),[query,setQuery]=useState('');
  const [searchGuide,setSearchGuide]=useState(false),[searchGuideShown,setSearchGuideShown]=useState(false),[secondaryGuide,setSecondaryGuide]=useState(false),[secondaryShown,setSecondaryShown]=useState(false);
  const [resultCard,setResultCard]=useState(false),[strongGuide,setStrongGuide]=useState(false),[strongShown,setStrongShown]=useState(false),[started,setStarted]=useState(false),[homeDepth,setHomeDepth]=useState(0);
  const scrollRef=useRef(null);
  const selectTab=id=>{setSecondaryGuide(false);setPage(id);if(id!=='recommend'&&!started){const next=secondaryClicks+1;setSecondaryClicks(next);if(next>=3&&!searchGuideShown){setSearchGuideShown(true);setSearchGuide(true)}}};
  const openSearch=()=>{setPage('search');setSearchGuide(false)};
  const search=()=>{if(started)return;const next=searches+1;setSearches(next);setResultCard(next<3);if(next>=3&&!strongShown){setStrongShown(true);setStrongGuide(true);setResultCard(false)}};
  const launch=()=>{setStarted(true);setSearchGuide(false);setSecondaryGuide(false);setStrongGuide(false);setResultCard(false)};
  const onScroll=event=>{if(page!=='recommend'||started||secondaryShown)return;const el=event.currentTarget;const max=el.scrollHeight-el.clientHeight;const depth=max?Math.round(el.scrollTop/max*100):0;setHomeDepth(depth);if(depth>=85){setSecondaryShown(true);setSecondaryGuide(true)}};
  const reset=()=>{setPage('recommend');setSecondaryClicks(0);setSearches(0);setQuery('');setSearchGuide(false);setSearchGuideShown(false);setSecondaryGuide(false);setSecondaryShown(false);setResultCard(false);setStrongGuide(false);setStrongShown(false);setStarted(false);setHomeDepth(0);if(scrollRef.current)scrollRef.current.scrollTop=0};
  return <div className="androidPage interactiveAndroid"><div className="androidIntro"><div><b>安卓行为引导模拟</b><span>真实页面组件 · 可滚动、切页、搜索和启动游戏</span></div><button onClick={reset}><RotateCcw/>重置行为</button></div><div className="androidWorkspace"><div className="phoneShell"><div className="phoneScreen realPhone">
    <div className="mobileApp">{page!=='search'&&<Header page={page} onTab={selectTab} openSearch={openSearch}/>}<main ref={scrollRef} className="realMobileContent" onScroll={onScroll}>{page==='search'?<SearchPage query={query} setQuery={setQuery} searches={searches} onSearch={search} onLaunch={launch} resultCard={resultCard} onBack={()=>setPage('recommend')}/>:page==='recommend'?<RecommendPage onLaunch={launch}/>:<CategoryPage page={page} onLaunch={launch}/>}</main>{page!=='search'&&<nav className="realBottomNav"><button className="active"><Gamepad2/><span>游戏</span></button><button><Gift/><span>福利</span></button><button className="center"><GameIcon mark="游" tone={2}/><span>我的游戏</span></button><button><MessageCircle/><span>消息</span></button><button><UserRound/><span>我</span></button></nav>}</div>
    {searchGuide&&<button className="searchBubble realBubble" onClick={openSearch}>找不到合适的游戏吗？<b>可以来搜索试试</b><i/></button>}{secondaryGuide&&<button className="secondaryTabBubble realTabBubble" onClick={()=>selectTab('poker')}>更多游戏可以点击这里探索<i/></button>}{started&&<div className="startedToast">已启动「掼蛋」，本会话停止触发引导</div>}{strongGuide&&<GuideSheet onClose={()=>setStrongGuide(false)} onTry={launch} onSearch={()=>{setStrongGuide(false);setPage('search')}}/>}
  </div></div><aside className="behaviorPanel"><header><span>实时行为状态</span><i className={started?'done':''}>{started?'已启动游戏':'尚未启动游戏'}</i></header><div className="behaviorCount"><span>二级页签点击</span><strong>{secondaryClicks}<small> / 3</small></strong></div><div className="behaviorCount"><span>无点击搜索</span><strong>{searches}<small> / 3</small></strong></div><div className="behaviorCount"><span>首页浏览深度</span><strong>{homeDepth}<small>%</small></strong></div><section className={secondaryShown?'triggered':''}><b>场景 0 · 二级页签引导</b><p>推荐首页真实下滑到 85%，且未启动游戏。</p><em>{secondaryShown?'已触发':'等待触发'}</em></section><section className={searchGuideShown?'triggered':''}><b>场景 1 · 搜索弱引导</b><p>二级页签累计点击达到 3 次时立即触发。</p><em>{searchGuideShown?'已触发':'等待触发'}</em></section><section className={strongShown?'triggered':''}><b>场景 2 · 替代游戏强引导</b><p>搜索 3 次，无游戏点击或启动。</p><em>{strongShown?'已触发':'等待触发'}</em></section><section className={resultCard?'triggered':''}><b>场景 3 · 结果页推荐卡</b><p>搜索发生但无游戏点击时强化推荐。</p><em>{resultCard?'展示中':'等待触发'}</em></section><footer>弱引导各最多一次；同一会话最多一个强引导；启动后停止触发。</footer></aside></div></div>;
}
