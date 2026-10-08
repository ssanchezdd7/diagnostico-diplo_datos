/* Adapter for precomputed frequency tables. Never reconstructs survey records. */
(()=>{
  const C=DiagnosticCore,original={aggregate:C.aggregate,filterRows:C.filterRows,period:C.period,duplicates:C.duplicates,rule:C.rule};let source;
  C.setPublishedSource=s=>source=s;
  C.size=data=>data?.[0]?.__aggregate?data.reduce((n,t)=>n+(source.tables[t.group][t.mask+':'+t.required]?.count||0),0):data.length;
  function summaries(tokens){
    if(!tokens.length)return [];
    const first=tokens[0];if(tokens.length===source.groups.length&&tokens.every(t=>t.mask===first.mask&&t.required===first.required)&&new Set(tokens.map(t=>t.group)).size===source.groups.length)return [source.tables.all[first.mask+':'+first.required]];
    return tokens.map(t=>source.tables[t.group][t.mask+':'+t.required]);
  }
  C.aggregate=(data,c,aliases)=>{
    if(!data[0]?.__aggregate)return original.aggregate(data,c,aliases);
    const ss=summaries(data),total=ss.reduce((n,s)=>n+s.count,0);
    if(c.role==='organism'){const items=data.map(t=>({label:source.groups.find(g=>g.id===t.group).label,count:source.tables[t.group][t.mask+':'+t.required].count})).filter(i=>i.count);items.forEach(i=>i.percent=total?i.count/total*100:0);return {items,total,valid:total,missing:0,invalid:0,redacted:0};}
    if(ss.some(s=>s.suppressed))return {items:[],total,valid:0,missing:0,invalid:0,privacy:true};
    const map=new Map();let valid=0,missing=0,invalid=0,redacted=0;
    for(const s of ss){const a=s.answers[c.header];if(!a)continue;valid+=a.valid;missing+=a.missing;invalid+=a.invalid;redacted+=a.redacted;for(const i of a.items){const k=C.key(i.label);if(!map.has(k))map.set(k,{label:i.label,count:0});map.get(k).count+=i.count;}}
    const order=(c.order||[]).map(C.key),items=[...map.values()].sort((a,b)=>c.kind==='ordinal'?(order.indexOf(C.key(a.label))<0?999:order.indexOf(C.key(a.label)))-(order.indexOf(C.key(b.label))<0?999:order.indexOf(C.key(b.label))):b.count-a.count);items.forEach(i=>i.percent=valid?i.count/valid*100:0);
    return {items,total,valid,missing,invalid,redacted,multiple:c.kind==='multiple'};
  };
  C.filterRows=(data,cols,filters,aliases)=>{
    if(!data[0]?.__aggregate)return original.filterRows(data,cols,filters,aliases);
    let out=data.map(t=>({...t}));for(const c of cols){const f=filters[c.header]||[];if(!f.length)continue;if(c.role==='organism')out=out.filter(t=>f.includes(C.key(source.groups.find(g=>g.id===t.group).label)));else if(c.role==='profile'){const mask=source.options.reduce((n,o,i)=>n|(f.includes(C.key(o))?1<<i:0),0);out=out.map(t=>t.mask?{...t,required:source.options.findIndex(o=>f.includes(C.key(o)))}:{...t,mask});}}
    return out;
  };
  C.period=(data,c,mode)=>{if(!data[0]?.__aggregate)return original.period(data,c,mode);const ss=summaries(data);if(ss.some(s=>s.suppressed))return {start:null,end:null,invalid:0,missing:0,privacy:true};const starts=ss.map(s=>s.period.start).filter(Boolean).sort(),ends=ss.map(s=>s.period.end).filter(Boolean).sort();return {start:starts.length?new Date(starts[0]+'T00:00:00Z'):null,end:ends.length?new Date(ends.at(-1)+'T00:00:00Z'):null,missing:ss.reduce((n,s)=>n+s.period.missing,0),invalid:0};};
  C.rule=(data,c,aliases)=>{if(!data[0]?.__aggregate)return original.rule(data,c,aliases);const a=C.aggregate(data,c,aliases),count=list=>a.items.filter(i=>(list||[]).some(v=>C.key(v)===C.key(i.label))).reduce((n,i)=>n+i.count,0);return {...a,need:count(c.need),strength:count(c.strength)};};
  C.duplicates=(data,cols)=>data[0]?.__aggregate?source.duplicates:original.duplicates(data,cols);
})();
