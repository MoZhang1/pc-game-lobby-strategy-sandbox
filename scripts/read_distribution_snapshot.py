"""Read source workbooks and emit validated counts; never modifies inputs."""
import json, subprocess
from pathlib import Path
from collections import defaultdict
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/zhangzimo/Library/CloudStorage/OneDrive-个人/Desktop/2026下半年KPI')
def read(name):
    return [r for r in list(load_workbook(SOURCE/name, data_only=True, read_only=True).active.values)[1:] if r[0]]
def date(d):
    s=str(d); return s[:4]+'-'+s[4:6]+'-'+s[6:8]
new={}
for d,e,n,u,k,*_ in read('最安卓新用户点击转化.xlsx'):
    key=date(d);e=str(e)
    new.setdefault(key,{'users':u,'uv':{}})
    assert new[key]['users']==u and e not in new[key]['uv']
    new[key]['uv'][e]=k
active={}
for key,name in [('pc','【PC新大厅】活跃用户进入营收游戏转化率.xlsx'),('android','【安卓平台】活跃用户进入营收游戏转化率.xlsx')]:
    active[key]=[dict(date=date(r[0]),users=r[1],game=r[2],union=r[4],total=r[6]) for r in read(name)]
    assert len({r['date'] for r in active[key]})==len(active[key])
mapping=json.loads(subprocess.check_output(['node','--no-warnings','--input-type=module','-e',"import {LOCAL_PACKAGE_GEO_DATA as a} from './src/localPackageGeoData.js';import {LATEST_LOCAL_PACKAGE_GEO_DATA as b} from './src/localPackageLatestGeoData.js';console.log(JSON.stringify(Object.fromEntries([...a.cities,...b.cities].filter(x=>x.province!=='未知').map(x=>[x.city,x.province]))))"],cwd=ROOT))
geo=read('本地包分城市.xlsx')
mapping.update({'河南':'河南','甘南':'甘肃'})
for r in geo:
    if r[1] and '未知' not in r[1]:mapping.setdefault(r[2],r[1])
fields=dict(newUsers=3,pageExposure=4,totalClicks=6,bannerClicks=8,algorithmExposure=10,algorithmClicks=12,configuredClicks=14,adClicks=16)
def geos(lo,hi):
    cities={};unknown=0
    for r in geo:
        if not lo<=date(r[0])<=hi:continue
        p=r[1] if r[1] and '未知' not in r[1] else mapping.get(r[2],'未知')
        if '未知' in (r[1] or '未知'):unknown+=r[3]
        c=cities.setdefault((p,r[2]),dict(province=p,city=r[2],mapping='无法归属' if p=='未知' else '城市归属',**{k:0 for k in fields}))
        for k,i in fields.items():c[k]+=r[i] or 0
    provinces={}
    for c in cities.values():
        p=provinces.setdefault(c['province'],dict(province=c['province'],status='有数据',**{k:0 for k in fields}))
        for k in fields:p[k]+=c[k]
    total={k:sum(c[k] for c in cities.values()) for k in fields}
    return dict(meta=dict(start=lo,end=hi,days=len({date(r[0]) for r in geo if lo<=date(r[0])<=hi}),rawUnknownProvinceNewUsers=unknown,unmappedNewUsers=provinces.get('未知',{}).get('newUsers',0)),total=total,provinces=list(provinces.values()),cities=sorted(cities.values(),key=lambda c:-c['newUsers']))
out=dict(new=new,active=active,geoBefore=geos('2026-08-26','2026-09-01'),geoAfter=geos('2026-09-02','2026-09-08'),geoDaily={d:geos(d,d)['total'] for d in sorted(new) if d>='2026-08-26'})
import sys
if '--dip' in sys.argv:
    out={'before':geos('2026-08-31','2026-09-06'),'after':geos('2026-09-07','2026-09-07')}
print(json.dumps(out,ensure_ascii=False,separators=(',',':')))
