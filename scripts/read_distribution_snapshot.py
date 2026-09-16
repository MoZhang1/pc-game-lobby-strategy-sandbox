"""Read source workbooks and emit validated counts; never modifies inputs."""
import argparse, json, subprocess
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/zhangzimo/Library/CloudStorage/OneDrive-个人/Desktop/2026下半年KPI')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--end', help='Inclusive reporting cutoff (YYYY-MM-DD).')
parser.add_argument('--output', type=Path, help='Save the snapshot instead of printing its rows.')
parser.add_argument('--dip', action='store_true', help='Legacy September 7 comparison.')
args = parser.parse_args()
coverage = {}
def read(name):
    workbook = load_workbook(SOURCE/name, data_only=True, read_only=True)
    rows = [r for r in list(workbook.active.values)[1:] if r[0]]
    dates = sorted({date(r[0]) for r in rows})
    coverage[name] = dict(sheet=workbook.active.title, rows=len(rows), start=dates[0], end=dates[-1], days=len(dates))
    workbook.close()
    return rows
def date(d):
    if isinstance(d, datetime): return d.strftime('%Y-%m-%d')
    s=str(d).replace('-', ''); return s[:4]+'-'+s[4:6]+'-'+s[6:8]
new={}
for d,e,n,u,k,*_ in read('最安卓新用户点击转化.xlsx'):
    key=date(d);e=str(e)
    new.setdefault(key,{'users':u,'uv':{}})
    assert new[key]['users']==u and e not in new[key]['uv']
    assert isinstance(u, (int, float)) and isinstance(k, (int, float)) and 0 <= k <= u
    new[key]['uv'][e]=k
active={}
for key,name in [('pc','【PC新大厅】活跃用户进入营收游戏转化率.xlsx'),('android','【安卓平台】活跃用户进入营收游戏转化率.xlsx')]:
    active[key]=[dict(date=date(r[0]),users=r[1],game=r[2],union=r[4],total=r[6]) for r in read(name)]
    assert len({r['date'] for r in active[key]})==len(active[key])
    assert all(0 <= r['game'] <= r['total'] <= r['users'] and 0 <= r['union'] <= r['total'] <= r['game']+r['union'] for r in active[key])
mapping=json.loads(subprocess.check_output(['node','--no-warnings','--input-type=module','-e',"import {LOCAL_PACKAGE_GEO_DATA as a} from './src/localPackageGeoData.js';import {LATEST_LOCAL_PACKAGE_GEO_DATA as b} from './src/localPackageLatestGeoData.js';console.log(JSON.stringify(Object.fromEntries([...a.cities,...b.cities].filter(x=>x.province!=='未知').map(x=>[x.city,x.province]))))"],cwd=ROOT))
geo=read('本地包分城市.xlsx')
assert len({(r[0], r[1], r[2]) for r in geo}) == len(geo), 'Duplicate date/province/city key'
end = args.end or min(c['end'] for c in coverage.values())
assert all(c['end'] >= end for c in coverage.values()), 'A source does not reach the reporting cutoff'
end_date = datetime.fromisoformat(end)
after_start = (end_date-timedelta(days=6)).strftime('%Y-%m-%d')
before_end = (end_date-timedelta(days=7)).strftime('%Y-%m-%d')
before_start = (end_date-timedelta(days=13)).strftime('%Y-%m-%d')
expected = {(end_date-timedelta(days=i)).strftime('%Y-%m-%d') for i in range(14)}
assert expected <= set(new), 'Missing new-user source dates'
assert expected <= {date(r[0]) for r in geo}, 'Missing geographic source dates'
assert all(expected <= {r['date'] for r in rows} for rows in active.values()), 'Missing active-user source dates'
mapping.update({'河南':'河南','甘南':'甘肃'})
for r in geo:
    if r[1] and '未知' not in r[1]:mapping.setdefault(r[2],r[1])
fields=dict(newUsers=3,pageExposure=4,totalClicks=6,bannerClicks=8,algorithmExposure=10,algorithmClicks=12,configuredClicks=14,adClicks=16)
assert all(isinstance(r[i], (int, float)) and r[i] >= 0 for r in geo for i in fields.values()), 'Missing or invalid geographic count'
def geos(lo,hi,exclude=()):
    cities={};unknown=0
    for r in geo:
        if not lo<=date(r[0])<=hi or date(r[0]) in exclude:continue
        p=r[1] if r[1] and '未知' not in r[1] else mapping.get(r[2],'未知')
        if '未知' in (r[1] or '未知'):unknown+=r[3]
        c=cities.setdefault((p,r[2]),dict(province=p,city=r[2],mapping='无法归属' if p=='未知' else '城市归属',**{k:0 for k in fields}))
        for k,i in fields.items():c[k]+=r[i] or 0
    provinces={}
    for c in cities.values():
        p=provinces.setdefault(c['province'],dict(province=c['province'],status='有数据',**{k:0 for k in fields}))
        for k in fields:p[k]+=c[k]
    total={k:sum(c[k] for c in cities.values()) for k in fields}
    return dict(meta=dict(start=lo,end=hi,days=len({date(r[0]) for r in geo if lo<=date(r[0])<=hi and date(r[0]) not in exclude}),excludedDates=list(exclude),rawUnknownProvinceNewUsers=unknown,unmappedNewUsers=provinces.get('未知',{}).get('newUsers',0)),total=total,provinces=list(provinces.values()),cities=sorted(cities.values(),key=lambda c:-c['newUsers']))
geo_dates = sorted({date(r[0]) for r in geo if date(r[0]) <= end})
out=dict(coverage=coverage,period=dict(beforeStart=before_start,beforeEnd=before_end,start=after_start,end=end),new={d:r for d,r in new.items() if d<=end},active={k:[r for r in v if r['date']<=end] for k,v in active.items()},geoBefore=geos(before_start,before_end),geoAfter=geos(after_start,end),geoDaily={d:geos(d,d)['total'] for d in geo_dates})
# Preserve recorded zeros in the official series. This separate sensitivity view
# removes the same weekdays on both sides; it is not a corrected KPI estimate.
zero_days = [d for d, r in out['geoDaily'].items() if after_start<=d<=end and r['newUsers']>0 and all(r[k]==0 for k in fields if k!='newUsers')]
prior_days = [(datetime.fromisoformat(d)-timedelta(days=7)).strftime('%Y-%m-%d') for d in zero_days]
out['sensitivity'] = dict(excludedBefore=prior_days, excludedAfter=zero_days, before=geos(before_start,before_end,prior_days), after=geos(after_start,end,zero_days))
if args.dip:
    out={'before':geos('2026-08-31','2026-09-06'),'after':geos('2026-09-07','2026-09-07')}
payload = json.dumps(out,ensure_ascii=False,separators=(',',':'))
if args.output:
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(payload)
    print(json.dumps(dict(saved=str(args.output),coverage=coverage,period=out.get('period')),ensure_ascii=False))
else:
    print(payload)
