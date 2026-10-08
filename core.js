/* Pure functions: no persistence, network, console output or DOM access. */
(function(root){
  'use strict';
  const norm=v=>String(v??'').trim().replace(/\s+/g,' ');
  const key=v=>norm(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
  const personalHeader=h=>/(nombre|apellido|correo|e.?mail|dni|documento de identidad|cuil|cuit|telefono|celular|direccion particular|identificador)/i.test(key(h));
  const sensitive=v=>/\b[^\s@]+@[^\s@]+\.[^\s@]+\b|\b\d{7,}\b/.test(norm(v));
  function organism(v,aliases={}){
    const s=norm(v);if(!s)return '';
    if(sensitive(s))return '[Organismo pendiente de revisión]';
    const alias=Object.entries(aliases).find(([a])=>key(a)===key(s));
    if(alias)return norm(alias[1])||'[Organismo pendiente de revisión]';
    const institutionalName=key(s).replace(/\.+$/,'');
    if(/\biiee\b/.test(institutionalName)||/^instituto de investigacion(?:es)? economicas? y estadisticas?$/.test(institutionalName)||institutionalName==='instituto de estadistica')return 'Instituto de Investigaciones Económicas y Estadísticas';
    if(!/(iiee|instituto|ministerio|registro|consejo|secretaria|policia|direccion|dpto|departamento|salud|estadistica|sesyop)/.test(key(s)))return '[Organismo pendiente de revisión]';
    return s;
  }
  function splitMultiple(value,c){
    const v=norm(value);if(!v)return [];
    if(!c.confirmed)return [v];
    if(c.splitMode==='separator')return [...new Set(v.split(c.separator).map(norm).filter(Boolean))];
    // Consume complete known labels. Commas inside a label are never delimiters.
    let rest=v;const found=[];const options=[...(c.options||[])].map(norm).sort((a,b)=>b.length-a.length);
    while(rest){const match=options.find(o=>rest===o||rest.startsWith(o+', '));if(!match)return null;found.push(match);rest=rest.slice(match.length).replace(/^,\s*/,'');}
    return [...new Set(found)];
  }
  function cellValues(row,c,aliases){
    const v=row[c.header];if(c.role==='excluded'||personalHeader(c.header))return [];
    if(c.role==='organism')return [organism(v,aliases)].filter(Boolean);
    if(c.kind==='multiple')return splitMultiple(v,c);
    return [norm(v)].filter(Boolean);
  }
  function aggregate(rows,c,aliases={}){
    const map=new Map();let missing=0,invalid=0,redacted=0;
    for(const row of rows){if(!norm(row[c.header])){missing++;continue;}
      if(c.kind==='text'){continue;}
      const values=cellValues(row,c,aliases);if(values===null){invalid++;continue;}
      for(const value of values){const label=sensitive(value)?'[Valor protegido]':value;if(label==='[Valor protegido]')redacted++;const k=key(label);if(!map.has(k))map.set(k,{label,count:0});map.get(k).count++;}
    }
    const valid=rows.length-missing-invalid;
    const order=(c.order||[]).map(key);
    const items=[...map.values()].sort((a,b)=>c.kind==='ordinal'?(order.includes(key(a.label))?order.indexOf(key(a.label)):999)-(order.includes(key(b.label))?order.indexOf(key(b.label)):999)||b.count-a.count:b.count-a.count||a.label.localeCompare(b.label,'es'));
    items.forEach(a=>a.percent=valid?a.count/valid*100:0);
    return {items,valid,missing,invalid,total:rows.length,redacted,multiple:c.kind==='multiple'&&c.confirmed};
  }
  function filterRows(rows,columns,filters,aliases={}){
    return rows.filter(row=>columns.every(c=>{const selected=filters[c.header]||[];if(!selected.length)return true;const values=cellValues(row,c,aliases);return (values||[]).some(v=>selected.includes(key(sensitive(v)?'[Valor protegido]':v)))||(!norm(row[c.header])&&selected.includes('__missing__'));}));
  }
  function parseDate(value,mode='auto'){
    if(value instanceof Date)return isNaN(value)?null:new Date(value.getTime());
    if(typeof value==='number'){const d=new Date(Date.UTC(1899,11,30)+value*86400000);return isNaN(d)?null:d;}
    const s=norm(value);let m;
    if((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T].*)?$/)))return strict(+m[1],+m[2],+m[3]);
    if((m=s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})(?:[ T].*)?$/))){let a=+m[1],b=+m[2];if(mode==='auto'){if(a<=12&&b<=12&&a!==b)return null;if(a>12)return strict(+m[3],b,a);if(b>12)return strict(+m[3],a,b);return strict(+m[3],b,a);}return mode==='dmy'?strict(+m[3],b,a):strict(+m[3],a,b);}
    return null;
  }
  function strict(y,m,d){const dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d?dt:null;}
  function period(rows,c,mode){if(!c)return {start:null,end:null,invalid:0,missing:0};const ds=[];let invalid=0,missing=0;for(const r of rows){if(!norm(r[c.header])){missing++;continue;}const d=parseDate(r[c.header],mode);if(d)ds.push(d);else invalid++;}ds.sort((a,b)=>a-b);return {start:ds[0]||null,end:ds.at(-1)||null,invalid,missing};}
  function duplicates(rows,columns){const seen=new Set();let n=0;for(const r of rows){const sig=JSON.stringify(columns.map(c=>r[c.header] instanceof Date?r[c.header].toISOString():norm(r[c.header])));if(seen.has(sig))n++;seen.add(sig);}return n;}
  function rule(rows,c,aliases){const a=aggregate(rows,c,aliases);const count=list=>rows.filter(r=>{const values=cellValues(r,c,aliases);return values&&values.some(v=>list.some(t=>key(t)===key(v)));}).length;return {...a,need:count(c.need||[]),strength:count(c.strength||[])};}
  function csvCell(v){let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function csv(headers,rows){return '\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');}
  root.DiagnosticCore={norm,key,personalHeader,sensitive,organism,splitMultiple,cellValues,aggregate,filterRows,parseDate,period,duplicates,rule,csv};
  if(typeof module!=='undefined')module.exports=root.DiagnosticCore;
})(typeof globalThis!=='undefined'?globalThis:this);
